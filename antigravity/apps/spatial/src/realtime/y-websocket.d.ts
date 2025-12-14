declare module "y-websocket/bin/utils" {
  import type { WebSocket } from "ws";
  import type { IncomingMessage } from "http";
  
  export function setupWSConnection(
    connection: WebSocket,
    request: IncomingMessage,
    options?: { docName?: string; gc?: boolean }
  ): void;
}

