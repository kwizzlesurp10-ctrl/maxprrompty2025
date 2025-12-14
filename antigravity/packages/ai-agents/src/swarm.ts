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
    return payload;
  }

  onActivity(listener: (payload: SwarmEventPayload) => void) {
    this.on("activity", listener);
    return () => this.off("activity", listener);
  }

  private buildPayload(message: string): SwarmEventPayload {
    return {
      message,
      timestamp: Date.now()
    };
  }
}
