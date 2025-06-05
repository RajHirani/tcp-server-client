
interface Window{
    electron: {
        startTcpServer(server: CustomServer): Promise<CustomServer>;
        stopTcpServer(server: CustomServer): Promise<CustomServer>;
    }
}

type CustomServer = {
  id: number;
  name: string;
  host?: string;
  port?: number | null;
  status?: boolean
}

type EventPayloadMapping = {
  startTcpServer: Server
};