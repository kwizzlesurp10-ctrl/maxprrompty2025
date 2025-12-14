import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { z } from "zod";

const configSchema = z.object({
  projectId: z.string(),
  authDomain: z.string().optional(),
  spatialEngine: z.string().optional(),
  replication: z.string().optional(),
  aiBackend: z.string().optional(),
});

export type AntiGravityConfig = z.infer<typeof configSchema>;

export type WorldSpawn = {
  spawn: [number, number, number];
};

export type ObjectPayload = {
  id: string;
  world: string;
  geometry: string;
  physics: "dynamic" | "static";
  owner: string;
  type?: string;
};

export type RealtimeUpdate = {
  objectId: string;
  position: [number, number, number];
  scale: number;
};

type RealtimeSubscription = {
  unsubscribe: () => void;
};

export class AntiGravity {
  private config: AntiGravityConfig;
  private doc: Y.Doc | null = null;
  private provider: WebsocketProvider | null = null;
  private objectsMap: Y.Map<ObjectPayload> | null = null;
  private currentWorld: string | null = null;
  private observers: Map<string, () => void> = new Map();

  constructor(config: AntiGravityConfig) {
    this.config = configSchema.parse(config);
  }

  joinWorld(worldId: string, options?: WorldSpawn): void {
    if (this.currentWorld === worldId && this.doc) {
      return; // Already joined
    }

    // Cleanup previous world
    this.destroy();

    // Create new Y.Doc for this world
    this.doc = new Y.Doc();
    this.objectsMap = this.doc.getMap<ObjectPayload>("objects");
    this.currentWorld = worldId;

    // Connect to WebSocket server
    // In browser, use window.location or env var; in Node, use env var
    const wsUrl = typeof window !== "undefined" 
      ? (process.env.NEXT_PUBLIC_ANTIGRAVITY_WS_URL || "ws://localhost:8787")
      : (process.env.ANTIGRAVITY_WS_URL || "ws://localhost:8787");
    
    // WebsocketProvider expects the room name as the second param
    // The URL should be the base WebSocket server URL
    this.provider = new WebsocketProvider(wsUrl, worldId, this.doc, {
      connect: true,
    });

    // Log spawn position if provided
    if (options?.spawn) {
      console.log(`[AntiGravity] Joined world ${worldId} at spawn`, options.spawn);
    }
  }

  realtime = {
    subscribe: (
      channel: "objects",
      callback: (updates: RealtimeUpdate[]) => void
    ): RealtimeSubscription => {
      if (!this.objectsMap) {
        throw new Error("Must call joinWorld() before subscribing");
      }

      // Send initial state
      const initialUpdates: RealtimeUpdate[] = [];
      this.objectsMap.forEach((obj, objectId) => {
        initialUpdates.push({
          objectId,
          position: [0, 0, 0], // Default position
          scale: 1.0, // Default scale
        });
      });
      if (initialUpdates.length > 0) {
        callback(initialUpdates);
      }

      const observer = (event: Y.YMapEvent<ObjectPayload>) => {
        const updates: RealtimeUpdate[] = [];
        
        event.changes.keys.forEach((change, objectId) => {
          if (change.action === "add" || change.action === "update") {
            const obj = this.objectsMap!.get(objectId);
            if (obj) {
              updates.push({
                objectId,
                position: [0, 0, 0], // Default position
                scale: 1.0, // Default scale
              });
            }
          } else if (change.action === "delete") {
            // For MVP, we'll still send an update (client can handle deletion)
            updates.push({
              objectId,
              position: [0, 0, 0],
              scale: 0, // Scale 0 indicates deletion
            });
          }
        });

        if (updates.length > 0) {
          callback(updates);
        }
      };

      this.objectsMap.observe(observer);
      const subscriptionId = `sub_${Date.now()}_${Math.random()}`;
      
      const unsubscribe = () => {
        this.objectsMap?.unobserve(observer);
        this.observers.delete(subscriptionId);
      };

      this.observers.set(subscriptionId, unsubscribe);

      return { unsubscribe };
    },
  };

  async create(input: ObjectPayload | { type: string; geometry: string; physics: string; owner: string }): Promise<ObjectPayload> {
    if (!this.objectsMap) {
      throw new Error("Must call joinWorld() before creating objects");
    }

    let payload: ObjectPayload;

    if ("id" in input && "world" in input) {
      // Already a full ObjectPayload
      payload = input;
    } else {
      // Partial input, construct full payload
      payload = {
        id: crypto.randomUUID(),
        world: this.currentWorld || "earth-001",
        geometry: input.geometry,
        physics: input.physics as "dynamic" | "static",
        owner: input.owner,
        type: input.type || "persistent",
      };
    }

    // Write to CRDT
    this.objectsMap.set(payload.id, payload);

    return payload;
  }

  destroy(): void {
    // Unsubscribe all observers
    this.observers.forEach((unsubscribe) => unsubscribe());
    this.observers.clear();

    // Disconnect provider
    if (this.provider) {
      this.provider.destroy();
      this.provider = null;
    }

    // Clear doc
    if (this.doc) {
      this.doc.destroy();
      this.doc = null;
      this.objectsMap = null;
    }

    this.currentWorld = null;
  }
}

