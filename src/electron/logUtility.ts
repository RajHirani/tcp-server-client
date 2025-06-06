import { BrowserWindow } from "electron";

export function publishLog(log: string, server: CustomServer, type: 'sent' | 'received' | 'system') {
  if (BrowserWindow.getAllWindows().length) {
    const win = BrowserWindow.getAllWindows()[0];
    if (win && !win.isDestroyed()) {
      const win = BrowserWindow.getAllWindows()[0]; // Or keep a reference to your main window
      const logEntry: Log = {
        timestamp: new Date(),
        serverId: server.id,
        message: log,
        mode: 'server',
        type
      }
      win.webContents.send(`tcpServerLogs-${server.id}`, logEntry);
    }
  }
}

export function publishClientLog(log: string, clientConfig: ClientConfig, type: 'sent' | 'received' | 'system') {
  if (BrowserWindow.getAllWindows().length) {
    const win = BrowserWindow.getAllWindows()[0];
    if (win && !win.isDestroyed()) {
      const win = BrowserWindow.getAllWindows()[0]; // Or keep a reference to your main window
      const logEntry: Log = {
        timestamp: new Date(),
        serverId: clientConfig.id,
        message: log,
        mode: 'client',
        type
      }
      win.webContents.send(`tcpClientLogs-${clientConfig.id}`, logEntry);
    }
  }
}