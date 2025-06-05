import net, { Server, Socket } from "net";

export type TcpServerEvents = {
  onClientConnected?: (client: Socket, serverId: number) => void;
  onClientDisconnected?: (client: Socket, serverId: number) => void;
  onData?: (data: Buffer, client: Socket, serverId: number) => void;
  onError?: (err: Error, serverId: number) => void;
  onStarted?: (serverId: number, address: string, port: number) => void;
  onStopped?: (serverId: number) => void;
};

export class TcpServer {
  private server: Server | null = null;
  private clients: Set<Socket> = new Set();
  private readonly serverId: number;
  private readonly events: TcpServerEvents;
  private address: string = "";
  private port: number = 0;
  private customServer: CustomServer;

  constructor(customServer: CustomServer, events: TcpServerEvents = {}) {
    this.serverId = customServer.id;
    this.customServer = customServer;
    this.events = events;
  }

  start(): Promise<CustomServer> {
    return new Promise((resolve, reject) => {
      if (!this.customServer) reject("Custom server is not defined");
      if (this.server) reject("Server is already running");
      this.address = this.customServer?.host || "localhost";
      this.port = this.customServer?.port || 8080;

      this.server = net.createServer((socket) => {
        this.clients.add(socket);
        this.events.onClientConnected?.(socket, this.serverId);

        socket.on("data", (data) => {
          this.events.onData?.(data, socket, this.serverId);
        });

        socket.on("close", () => {
          this.clients.delete(socket);
          this.events.onClientDisconnected?.(socket, this.serverId);
        });

        socket.on("error", (err) => {
          this.events.onError?.(err, this.serverId);
        });
      });


      this.server.on("error", (err) => {
        this.events.onError?.(err, this.serverId);
        reject(err);
      });

      this.server.on("close", () => {
        this.events.onStopped?.(this.serverId);
      });

      this.server.listen(this.port, this.address, () => {
        this.customServer.status = true; // Update the custom server status
        console.log(`Server started on ${this.address}:${this.port}`);
        this.events.onStarted?.(this.serverId, this.address, this.port);
        resolve(this.customServer)
      });
    })
  }

  sendToAll(message: Buffer | string) {
    for (const client of this.clients) {
      client.write(message);
    }
  }

  stop() {
    if (this.server) {
      for (const client of this.clients) {
        client.destroy();
      }
      this.clients.clear();
      this.server.close();
      this.server = null;
    }
    this.customServer.status = false; // Update the custom server status
    return this.customServer;
  }

  getId() {
    return this.serverId;
  }

  getAddress() {
    return this.address;
  }

  getPort() {
    return this.port;
  }
}