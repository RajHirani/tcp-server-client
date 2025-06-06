import { ipcMain } from "electron";
import { TcpClientManager } from "./TcpClientManager.js";

const tcpClientManager = new TcpClientManager();

export function registerTcpClientHandlers () {

    ipcMain.handle("connectTcpClient", async (event, clientConfig: ClientConfig) => {
        try {
          return await tcpClientManager.connectClient(clientConfig);
        } catch (error) {
          console.error("Error connecting TCP client:", error);
          throw error; // Re-throw the error to be handled by the renderer process
        }
    });

    ipcMain.handle("disconnectTcpClient", async (event, clientConfig: ClientConfig) => {
        try {
          return await tcpClientManager.disconnectClient(clientConfig);
        } catch (error) {
          console.error("Error disconneting TCP client:", error);
          throw error; // Re-throw the error to be handled by the renderer process
        }
    });

     ipcMain.handle("sendClientMessage", async (event, clientId: number, message: ServerMessage) => {
        try {
          return tcpClientManager.sendMessage(clientId, message)
        } catch (error) {
          console.error("Error creating TCP server:", error);
          throw error; // Re-throw the error to be handled by the renderer process
        }
      });

}

export function disconnectAllRunningTCPClients() {
  tcpClientManager.disconnectAllClients();
}