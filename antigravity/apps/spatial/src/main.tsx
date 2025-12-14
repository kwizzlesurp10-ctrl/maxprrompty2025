import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { AntiGravity } from "@google/antigravity/core";
import { AgentSwarm } from "@antigravity/ai-agents";
import { realtimeUpdateSchema } from "@antigravity/shared";
import { SpatialStoreProvider, useSpatialStore } from "./store/antigravity";

const ag = new AntiGravity({
  projectId: "antigravity-2025-keith",
  authDomain: "keith-antigravity.supabase.co",
  spatialEngine: "rapier-wasm",
  replication: "yjs-crdt",
  aiBackend: "together.ai"
});

ag.joinWorld("earth-001", {
  spawn: [44.9778, -93.2650, 500]
});

const swarm = new AgentSwarm({
  count: 10_000,
  roles: ["tour-guide", "builder", "guardian", "dancer"],
  model: "meta-llama/Meta-Llama-3.1-405B-Instruct",
  memory: "vector-pg"
});

swarm.deploy();

function Scene() {
  const objects = useSpatialStore((state) => state.objects);
  const upsert = useSpatialStore((state) => state.upsert);

  useEffect(() => {
    const subscription = ag.realtime?.subscribe?.("objects", (updates: unknown[]) => {
      for (const update of updates) {
        const parsed = realtimeUpdateSchema.parse(update);
        upsert({
          id: parsed.objectId,
          position: parsed.position,
          scale: parsed.scale,
          color: "#17e0ff"
        });
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [upsert]);

  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
      <color attach="background" args={["#04050a"]} />
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} />
      <Physics>
        {objects.map((object) => (
          <mesh key={object.id} position={object.position}>
            <boxGeometry args={[object.scale, object.scale, object.scale]} />
            <meshStandardMaterial color={object.color} />
          </mesh>
        ))}
      </Physics>
    </Canvas>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SpatialStoreProvider>
      <Scene />
    </SpatialStoreProvider>
  </StrictMode>
);
