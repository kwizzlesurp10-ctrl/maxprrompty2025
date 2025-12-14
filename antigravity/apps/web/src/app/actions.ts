'use server';

import { revalidatePath } from "next/cache";
import { AntiGravity } from "@google/antigravity/core";

export async function createObject(formData: FormData) {
  // TODO: Re-implement auth with @supabase/ssr
  // const client = await auth();
  // const session = await client.getSession();

  // if (!session?.data.session) {
  //   throw new Error("Must be authenticated to mint objects");
  // }
  
  // Temporary: use a placeholder owner ID
  const ownerId = "00000000-0000-0000-0000-000000000000";

  const glb = formData.get("glb");

  if (typeof glb !== "string") {
    throw new Error("GLB must be a string");
  }

  // Create a server-side instance for this action
  // This will use isomorphic-ws for WebSocket connections in Node.js
  const ag = new AntiGravity({
    projectId: "antigravity-2025-keith",
    authDomain: "keith-antigravity.supabase.co",
    spatialEngine: "rapier-wasm",
    replication: "yjs-crdt",
    aiBackend: "together.ai",
  });

  // Join world (this will connect via WebSocket using isomorphic-ws)
  ag.joinWorld("earth-001");

  // Create the object
  await ag.create({
    type: "persistent",
    geometry: glb,
    physics: "dynamic",
    owner: ownerId,
  });

  // Cleanup
  ag.destroy();

  revalidatePath("/world");
}
