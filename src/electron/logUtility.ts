import { BrowserWindow } from "electron";

export function publishLog(log: string, server: CustomServer, type: 'sent' | 'received' | 'system') {
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