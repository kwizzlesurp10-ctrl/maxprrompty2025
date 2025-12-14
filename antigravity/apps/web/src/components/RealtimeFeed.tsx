"use client";

import { useEffect, useState } from "react";
import { agentRolesSchema } from "@antigravity/shared";
import { useAgentSwarm } from "@antigravity/ai-agents";

export function RealtimeFeed() {
  const swarm = useAgentSwarm();
  const [events, setEvents] = useState<Array<{ id: string; message: string; timestamp: number }>>([]);

  useEffect(() => {
    const unsubscribe = swarm.onActivity((payload) => {
      setEvents((prev) => [{ id: `${payload.timestamp}-${Math.random()}`, message: payload.message, timestamp: payload.timestamp }, ...prev].slice(0, 5));
    });

    return unsubscribe;
  }, [swarm]);

  const roles = agentRolesSchema.parse(swarm.roles);

  return (
    <article className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">Live agent swarm</p>
          <p className="text-2xl font-medium">{swarm.count.toLocaleString()} entities</p>
        </div>
        <p className="text-sm text-slate-400">Roles: {roles.join(", ")}</p>
      </header>
      <ul className="space-y-2 text-sm text-slate-300">
        {events.length === 0 && <li>No activity yet. Agents syncing…</li>}
        {events.map((event) => (
          <li key={event.id} className="rounded-xl bg-black/40 px-4 py-2">
            {event.message}
          </li>
        ))}
      </ul>
    </article>
  );
}
