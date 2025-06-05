import { TcpServer, TcpServerEvents } from "./TcpServer.js";

export class TcpServerManager {
  private servers: Map<number, TcpServer> = new Map();

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

  sendMessage(serverId: number, message: ServerMessage) {
    console.log("Sending message to server:", serverId, message);
    const server = this.servers.get(serverId);
    if (server) {
      if( !message.targetClient || message.targetClient === null) {
        // Broadcast message to all clients
        return server.sendToAllWithAck(message.message);  
      }else{
        return server.sendToClient(message.targetClient, message.message);  
      }
    }
    return Promise.reject(false);
  }

  disconnectClient(serverId: number, clientConfig: ClientConfig){
     const server = this.servers.get(serverId);
    if (server) {
      server.disconnectClient(clientConfig);
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