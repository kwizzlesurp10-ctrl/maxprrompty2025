import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_ANTIGRAVITY_WS_URL: z.string().url().optional(),
  ANTIGRAVITY_PROJECT: z.string().default("antigravity-2025-keith")
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const processEnv = (typeof process !== "undefined" ? process.env : {}) as any;

export const env = envSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: processEnv.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: processEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_ANTIGRAVITY_WS_URL: processEnv.NEXT_PUBLIC_ANTIGRAVITY_WS_URL,
  ANTIGRAVITY_PROJECT: processEnv.ANTIGRAVITY_PROJECT
});
