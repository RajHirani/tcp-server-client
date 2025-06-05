
interface Window{
    electron: {
        startTcpServer(server: CustomServer): Promise<CustomServer>;
        stopTcpServer(server: CustomServer): Promise<CustomServer>;
        subscribeToTcpServerLogs(serverId: number, cb: (log: Log) => void): () => void;
        subscribeToClientConnections(serverId: number, cb: (clients: ClientConfig[]) => void): () => void;
        sendServerMessage(serverId: unmber,message: ServerMessage): Promise<boolean>;
        disconnectClient(serverId: number, clientConfig: ClientConfig): Promise<void>;
    }
}

type CustomServer = {
  id: number;
  name: string;
  host?: string;
  port?: number | undefined;
  status?: boolean
}

type ClientConfig = {
  id: number;
  name: string;
  server?: CustomServer;
  status?: boolean;
  host?: string;
  port?: number | undefined;
  connectedTime?: Date;
  disconnectedTime?: Date;
}

type ServerMessage = {
  serverId: number;
  targetClient?: ClientConfig | null; // null for broadcast
  format: 'text' | 'hex';
  message: string | Buffer;
}

type EventPayloadMapping = {
  startTcpServer: Server
};

type Log = {
  timestamp: Date;
  serverId: number;
  message: string;
  mode: 'server' | 'client';
  type: 'sent' | 'received' | 'system';
}

type SERVER_LOG_CHANNEL = "tcpServerLogs";