import EventEmitter from "eventemitter3";
import { agentRolesSchema } from "@antigravity/shared";

export type AgentSwarmConfig = {
  count: number;
  roles: string[];
  model: string;
  memory: string;
};

export type SwarmEventPayload = {
  message: string;
  timestamp: number;
};

type SwarmEvents = {
  activity: (payload: SwarmEventPayload) => void;
};

export class AgentSwarm extends EventEmitter<SwarmEvents> {
  public readonly count: number;
  public readonly roles: string[];
  private readonly config: AgentSwarmConfig;

  constructor(config: AgentSwarmConfig) {
    super();
    this.config = {
      ...config,
      roles: agentRolesSchema.parse(config.roles)
    };
    this.count = config.count;
    this.roles = config.roles;
  }

  deploy() {
    const payload = this.buildPayload("Swarm deployed");
    this.emit("activity", payload);
    (this as any)._deployed = true;
    
    // Simulate periodic agent activity
    const activityMessages = [
      "Agent swarm initialized",
      "10,000 agents deployed across earth-001",
      "Tour guides mapping spatial coordinates",
      "Builders constructing persistent structures",
      "Guardians patrolling world boundaries",
      "Dancers performing synchronized routines",
    ];
    
    let messageIndex = 0;
    const interval = setInterval(() => {
      const message = activityMessages[messageIndex % activityMessages.length];
      const payload = this.buildPayload(message);
      this.emit("activity", payload);
      messageIndex++;
    }, 5000); // Emit activity every 5 seconds
    
    // Store interval ID for cleanup
    (this as any)._activityInterval = interval;
    
    return payload;
  }

  onActivity(listener: (payload: SwarmEventPayload) => void): () => void {
    this.on("activity", listener);
    // Emit current state immediately if swarm is already deployed
    // Use setTimeout to ensure React state updates work correctly
    if ((this as any)._deployed) {
      setTimeout(() => {
        const payload = this.buildPayload("Swarm active");
        this.emit("activity", payload);
      }, 0);
    }
    return () => {
      this.off("activity", listener);
    };
  }

  destroy() {
    if ((this as any)._activityInterval) {
      clearInterval((this as any)._activityInterval);
    }
    this.removeAllListeners();
  }

  private buildPayload(message: string): SwarmEventPayload {
    return {
      message,
      timestamp: Date.now()
    };
  }
}
