'use server';

import { revalidatePath } from "next/cache";
import { auth } from "@supabase/auth-helpers-nextjs";
import { ag } from "@/lib/antigravity";

export async function createObject(formData: FormData) {
  const client = await auth();
  const session = await client.getSession();

  if (!session?.data.session) {
    throw new Error("Must be authenticated to mint objects");
  }

  const glb = formData.get("glb");

  if (typeof glb !== "string") {
    throw new Error("GLB must be a string");
  }

  const object = await ag.create({
    type: "persistent",
    geometry: glb,
    physics: "dynamic",
    owner: session.data.session.user.id
  });

  revalidatePath("/world");
  return object;
}
