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
}