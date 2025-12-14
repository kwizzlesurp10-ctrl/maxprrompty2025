export type ObjectPayload = {
  id: string;
  world: string;
  geometry: string;
  physics: "dynamic" | "static";
  owner: string;
};

export type RealtimeUpdate = {
  objectId: string;
  position: [number, number, number];
  scale: number;
};
