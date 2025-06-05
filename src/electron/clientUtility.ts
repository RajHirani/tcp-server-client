import { BrowserWindow } from "electron";

export function publishClientInfo(clients: ClientConfig[], server: CustomServer) {
  const win = BrowserWindow.getAllWindows()[0]; // Or keep a reference to your main window
  win.webContents.send(`tcpServerClientConnection-${server.id}`, clients);
}