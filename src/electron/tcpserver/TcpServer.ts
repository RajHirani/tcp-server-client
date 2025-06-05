import net, { Server, Socket } from "net";
import { publishLog } from "../logUtility.js";
import { publishClientInfo } from "../clientUtility.js";

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
  private clientsConfig: Set<ClientConfig> = new Set();
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
        // print client ip and port assign some random name
        const client = this.addClientConfig(socket);
        publishLog(`${client.name} connected from ${socket.remoteAddress}:${socket.remotePort}`, this.customServer, 'system');
        this.clients.add(socket);
        this.events.onClientConnected?.(socket, this.serverId);

        socket.on("data", (data) => {
          const client = this.getClientConfig(socket); // Ensure client config is updated
          publishLog(`Data received from ${client?.name} :: ${data.toString()}`, this.customServer, 'received');
          this.events.onData?.(data, socket, this.serverId);
        });

        socket.on("close", () => {
          this.clients.delete(socket);
          const client = this.getClientConfig(socket); // Ensure client config is updated
          this.removeClientConfig(client);
          publishLog(`${client?.name + ' ' || ''}disconnected from ${socket.remoteAddress}:${socket.remotePort}`, this.customServer, 'system');
          this.events.onClientDisconnected?.(socket, this.serverId);
        });

        socket.on("error", (err) => {
          this.events.onError?.(err, this.serverId);
        });
      });


      this.server.on("error", (err) => {
        publishLog(`Server stopped due to some error`, this.customServer, 'system');
        this.events.onError?.(err, this.serverId);
        reject(err);
      });

      this.server.on("close", () => {
        publishLog(`Server stopped on ${this.address}:${this.port}`, this.customServer, 'system');
        this.events.onStopped?.(this.serverId);
      });

      this.server.listen(this.port, this.address, () => {
        this.customServer.status = true; // Update the custom server status
        publishLog(`Server started on ${this.address}:${this.port}`, this.customServer, 'system');
        this.events.onStarted?.(this.serverId, this.address, this.port);
        resolve(this.customServer)
      });
    })
  }

  sendToAll(message: Buffer | string): Promise<boolean> {
    return new Promise((resolve) => {
      for (const client of this.clients) {
        client.write(message);
      }
      publishLog(`Broadcast message sent: ${message}`, this.customServer, 'sent');
      resolve(true);
    });
  }
  
  async sendToAllWithAck(message: Buffer | string): Promise<boolean> {
    const writePromises: Promise<boolean>[] = [];
    for (const client of this.clients) {
      writePromises.push(
        new Promise((resolve) => {
          client.write(message, (err) => {
            resolve(!err);
          });
        })
      );
    }
    const results = await Promise.all(writePromises);
    const allSuccess = results.every((success) => success);
    publishLog(`Broadcast message sent with ack: ${message}`, this.customServer, 'sent');
    return allSuccess;
  }

  sendToClient(clientConfig: ClientConfig, message: Buffer | string): Promise<boolean> {
    return new Promise((resolve) => {
      for (const client of this.clients) {
        if (client.remoteAddress === clientConfig.host && client.remotePort === clientConfig.port) {
          client.write(message, (err) => {
            if (!err) {
              publishLog(`Message sent to ${clientConfig.name}: ${message}`, this.customServer, 'sent');
              resolve(true);
            } else {
              resolve(false);
            }
          });
          return;
        }
      }
      resolve(false);
    });
  }

  disconnectClient(clientConfig: ClientConfig){
    for (const client of this.clients) {
      if (client.remoteAddress === clientConfig.host && client.remotePort === clientConfig.port) {
        client.destroy(); // This will trigger the 'close' event and cleanup
        break;
      }
    }
  }

  stop() {
    if (this.server) {
      for (const client of this.clients) {
        client.destroy();
      }
      this.clientsConfig.clear(); // Clear client configurations
      publishClientInfo(this.getClientsConfig(), this.customServer);
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

  addClientConfig(socket: Socket) {
    const clientConfig: ClientConfig = {
      id: this.clientsConfig.size + 1,
      name: `Client ${this.clientsConfig.size + 1}`,
      server: this.customServer,
      status: true,
      host: socket.remoteAddress || "unknown",
      port: socket.remotePort,
      connectedTime: new Date(),
    };
    this.clientsConfig.add(clientConfig);
    publishClientInfo(this.getClientsConfig(), this.customServer);
    return clientConfig;
  }

  getClientConfig(socket: Socket) {
    for (const clientConfig of this.clientsConfig) {
      if (clientConfig.host === socket.remoteAddress && clientConfig.port === socket.remotePort && clientConfig.status) {
        return clientConfig;
      }
    }
    return null; // Return null if no matching client config is found
  }

  removeClientConfig(clientConfig: ClientConfig | null) {
    if (!clientConfig) return;
    for (const config of this.clientsConfig) {
      if (config.id === clientConfig.id && config.status) {
        // update the the client config status to false
        config.status = false;
        config.disconnectedTime = new Date();
        break;
      }
    }
    publishClientInfo(this.getClientsConfig(), this.customServer);
  }


  getClientsConfig() {
    return Array.from(this.clientsConfig);
  }
}