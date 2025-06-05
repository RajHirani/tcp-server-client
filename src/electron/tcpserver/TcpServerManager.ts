import { TcpServer, TcpServerEvents } from "./TcpServer.js";

export class TcpServerManager {
  private servers: Map<number, TcpServer> = new Map();

  createServer(customServer: CustomServer, events: TcpServerEvents = {}) {
    if (this.servers.has(customServer.id)) {
      throw new Error(`Server with id ${customServer.id} already exists`);
    }
    const server = new TcpServer(customServer, events);
    this.servers.set(customServer.id, server);
    return customServer;
  }

  async startServer(server: CustomServer, events: TcpServerEvents = {}) {
    const tcpServer = new TcpServer(server, events);
    this.servers.set(server.id, tcpServer);
    return await tcpServer.start();
  }

  getServer(serverId: number) {
    return this.servers.get(serverId) || null;
  }

  stopServer(serverId: number) {
    const server = this.servers.get(serverId);
    if (server) {
      const updatedServer = server.stop();
      this.servers.delete(serverId);
      return updatedServer;
    }
  }

  stopAll() {
    for (const [id, server] of this.servers) {
      server.stop();
    }
    this.servers.clear();
  }

  listServers() {
    return Array.from(this.servers.keys());
  }
}