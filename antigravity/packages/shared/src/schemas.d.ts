import { z } from "zod";
export declare const objectSchema: z.ZodObject<{
    id: z.ZodString;
    world: z.ZodString;
    geometry: z.ZodString;
    physics: z.ZodEnum<["dynamic", "static"]>;
    owner: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    world: string;
    geometry: string;
    physics: "dynamic" | "static";
    owner: string;
}, {
    id: string;
    world: string;
    geometry: string;
    physics: "dynamic" | "static";
    owner: string;
}>;
export declare const agentRolesSchema: z.ZodArray<z.ZodString, "many">;
export declare const realtimeUpdateSchema: z.ZodObject<{
    objectId: z.ZodString;
    position: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
    scale: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    objectId: string;
    position: [number, number, number];
    scale: number;
}, {
    objectId: string;
    position: [number, number, number];
    scale: number;
}>;
