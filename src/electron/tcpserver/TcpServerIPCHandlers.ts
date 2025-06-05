import { ipcMain } from "electron";
import { TcpServerManager } from "./TcpServerManager.js";

const serverManager = new TcpServerManager();

export function registerTcpServerHandlers () {
  ipcMain.handle("createTcpServer", async (event, server: CustomServer) => {
    try {
      return await serverManager.startServer(server)
    } catch (error) {
      console.error("Error creating TCP server:", error);
      throw error; // Re-throw the error to be handled by the renderer process
    }
  });

  ipcMain.handle("stopTcpServer", async (event, server: CustomServer) => {
    try {
      return serverManager.stopServer(server.id)
    } catch (error) {
      console.error("Error creating TCP server:", error);
      throw error; // Re-throw the error to be handled by the renderer process
    }
  });

  ipcMain.handle("sendServerMessage", async (event, serverId: number, serverMessage: ServerMessage) => {
    try {
      return serverManager.sendMessage(serverId, serverMessage);
    } catch (error) {
      console.error("Error creating TCP server:", error);
      throw error; // Re-throw the error to be handled by the renderer process
    }
  });

  ipcMain.handle("disconnectClient", async (event, serverId: number, clientConfig: ClientConfig) => {
    try {
      return serverManager.disconnectClient(serverId, clientConfig);
    } catch (error) {
      console.error("Error creating TCP server:", error);
      throw error; // Re-throw the error to be handled by the renderer process
    }
  });
}

export function stopAllRunningTCPServer() {
  serverManager.stopAll();
}