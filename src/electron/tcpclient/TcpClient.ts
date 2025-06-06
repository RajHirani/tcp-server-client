import net, { Socket } from "net";
import { publishClientLog } from "../logUtility.js";
import { publishTcpClientConnection } from "../clientUtility.js";

export type TcpClientEvents = {
  onConnected?: (client: Socket) => void;
  onDisconnected?: (client: Socket) => void;
  onData?: (data: Buffer, client: Socket) => void;
  onError?: (err: Error) => void;
};

export class TcpClient {
  private client: Socket | null = null;
  private readonly host: string;
  private readonly port: number;
  private readonly events: TcpClientEvents;
  private isConnected: boolean = false;
  private clientConfig: ClientConfig;

  constructor(clientConfig: ClientConfig, events: TcpClientEvents = {}) {
    this.clientConfig = clientConfig;
    this.host = this.clientConfig.server?.host || '';
    this.port = this.clientConfig.server?.port || 0;   
    this.events = events;
  }

  connect(): Promise<ClientConfig> {
    return new Promise((resolve, reject) => {
      if (this.client && this.isConnected) {
        reject(new Error("Client is already connected"));
        return;
      }

      this.client = new net.Socket();

      this.client.connect(this.port, this.host, () => {
        this.isConnected = true;
        this.events.onConnected?.(this.client!);
        publishClientLog(`Connected to ${this.host}:${this.port}`, this.clientConfig, 'system');
        this.clientConfig.status = true;
        resolve(this.clientConfig);
      });

      this.client.on("data", (data) => {
        publishClientLog(`Data received :: ${data.toString()}`, this.clientConfig, 'received');
        this.events.onData?.(data, this.client!);
      });

      this.client.on("close", () => {
        this.isConnected = false;
        publishClientLog(`disconnected from ${this.host}:${this.port}`, this.clientConfig, 'system');
        this.clientConfig.status = false;
        publishTcpClientConnection(this.clientConfig);
        this.events.onDisconnected?.(this.client!);
      });

      this.client.on("error", (err) => {
        this.events.onError?.(err);
        reject(err);
      });
    });
  }

  send(message: Buffer | string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.client || !this.isConnected) {
        reject(new Error("Client is not connected"));
        return;
      }
      this.client.write(message, (err) => {
        if (err) {
          reject(err);
        } else {
          publishClientLog(`Message sent to ${this.host}:${this.port} :: ${message}`, this.clientConfig, 'sent');
          resolve(true);
        }
      });
    });
  }

  disconnect() {
    if (this.client && this.isConnected) {
      this.client.end();
      this.client.destroy();
      this.isConnected = false;
      this.clientConfig.status = false;
    }
    return this.clientConfig;
  }
}