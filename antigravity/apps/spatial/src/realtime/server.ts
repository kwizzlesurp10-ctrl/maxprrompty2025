import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import { setupWSConnection } from "y-websocket/bin/utils";
import type { IncomingMessage } from "http";

const PORT = Number(process.env.ANTIGRAVITY_REALTIME_PORT ?? 8787);

const server = http.createServer();
const wss = new WebSocketServer({ server });

wss.on("connection", (connection: WebSocket, request: IncomingMessage) => {
  const room = request.url?.slice(1).split("?")[0] || "earth-001";
  console.log(`[RealtimeServer] Client connected to room ${room}`);
  setupWSConnection(connection, request, { docName: room });
});

server.listen(PORT, () => {
  console.log(`[RealtimeServer] Listening on ws://localhost:${PORT}`);
});

process.on("SIGTERM", () => {
  console.log("[RealtimeServer] Shutting down…");
  wss.close();
  server.close();
});

