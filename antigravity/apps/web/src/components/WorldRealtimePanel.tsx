"use client";

import { useEffect, useState } from "react";
import { AntiGravity } from "@google/antigravity/core";

export function WorldRealtimePanel() {
  const [ag, setAg] = useState<AntiGravity | null>(null);
  const [objectCount, setObjectCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [objectIds, setObjectIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const client = new AntiGravity({
      projectId: "antigravity-2025-keith",
      authDomain: "keith-antigravity.supabase.co",
      spatialEngine: "rapier-wasm",
      replication: "yjs-crdt",
      aiBackend: "together.ai",
    });

    try {
      client.joinWorld("earth-001", {
        spawn: [44.9778, -93.265, 500],
      });

      const unsubscribe = client.realtime.subscribe("objects", (updates) => {
        setObjectIds((prev) => {
          const next = new Set(prev);
          updates.forEach((update) => {
            if (update.scale > 0) {
              next.add(update.objectId);
            } else {
              next.delete(update.objectId);
            }
          });
          setObjectCount(next.size);
          return next;
        });
        setIsConnected(true);
      });

      setAg(client);
      setIsConnected(true);

      return () => {
        unsubscribe.unsubscribe();
        client.destroy();
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect");
      setIsConnected(false);
    }
  }, []);

  const handleSpawnCube = async () => {
    if (!ag) return;

    try {
      await ag.create({
        type: "persistent",
        geometry: "https://assets.keith.sh/cube.glb",
        physics: "dynamic",
        owner: `user_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to spawn cube");
    }
  };

  return (
    <article className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">World: earth-001</p>
          <p className="text-2xl font-medium">
            {objectCount} object{objectCount !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`h-3 w-3 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-sm text-slate-400">
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>
      </header>

      {error && (
        <div className="mb-4 rounded-xl bg-red-500/20 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <button
        onClick={handleSpawnCube}
        disabled={!ag || !isConnected}
        className="w-full rounded-full bg-antigravity-accent px-6 py-3 text-black disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Spawn Cube
      </button>
    </article>
  );
}

