"use client";

import { AntiGravity } from "@google/antigravity/core";

export const ag = new AntiGravity({
  projectId: "antigravity-2025-keith",
  authDomain: "keith-antigravity.supabase.co",
  spatialEngine: "rapier-wasm",
  replication: "yjs-crdt",
  aiBackend: "together.ai"
});

ag.joinWorld("earth-001", {
  spawn: [44.9778, -93.265, 500]
});
