import { useEffect, useState } from "react";
import { AgentSwarm, AgentSwarmConfig } from "./swarm";

const defaultConfig: AgentSwarmConfig = {
  count: 10_000,
  roles: ["tour-guide", "builder", "guardian", "dancer"],
  model: "meta-llama/Meta-Llama-3.1-405B-Instruct",
  memory: "vector-pg"
};

let singleton: AgentSwarm | null = null;

function ensureSwarm(config?: Partial<AgentSwarmConfig>) {
  if (!singleton) {
    singleton = new AgentSwarm({ ...defaultConfig, ...config });
    singleton.deploy();
  }
  return singleton;
}

export function useAgentSwarm(config?: Partial<AgentSwarmConfig>) {
  const [swarm] = useState(() => ensureSwarm(config));
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const unsubscribe = swarm.onActivity(() => setTick((t) => t + 1));
    return () => unsubscribe();
  }, [swarm]);

  return { ...swarm, tick } as AgentSwarm & { tick: number };
}

export { AgentSwarm } from "./swarm";
