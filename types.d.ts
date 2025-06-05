
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
  port?: number | undefined;
  status?: boolean
}

type EventPayloadMapping = {
  startTcpServer: Server
};