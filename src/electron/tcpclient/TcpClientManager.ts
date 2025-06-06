import { TcpClient, TcpClientEvents } from "./TcpClient.js";

export class TcpClientManager {
    private clients: Map<number, TcpClient> = new Map();

    async connectClient(clientConfig: ClientConfig, events: TcpClientEvents = {}) {
        const tcpClient = new TcpClient(clientConfig, events);
        this.clients.set(clientConfig.id, tcpClient);
        return await tcpClient.connect();
    }

    async disconnectClient(clientConfig: ClientConfig){
        const tcpClient = this.clients.get(clientConfig.id);
        if(tcpClient){
            return tcpClient.disconnect();
        }
    }

    async sendMessage(clientId: number, message: ServerMessage) {
        const client = this.clients.get(clientId);
        if (client) {
            return client.send(message.message);
        }
        return Promise.reject(false);
    }

    disconnectAllClients(){
        for (const [id, client] of this.clients) {
            client.disconnect();
        }
        this.clients.clear();
    }
}