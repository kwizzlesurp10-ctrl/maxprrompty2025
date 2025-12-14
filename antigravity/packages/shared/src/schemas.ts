import { z } from "zod";

export const objectSchema = z.object({
  id: z.string().uuid(),
  world: z.string(),
  geometry: z.string(),
  physics: z.enum(["dynamic", "static"]),
  owner: z.string()
});

export const agentRolesSchema = z.array(z.string());

export const realtimeUpdateSchema = z.object({
  objectId: z.string(),
  position: z.tuple([z.number(), z.number(), z.number()]),
  scale: z.number().positive()
});
