import { BrowserWindow } from "electron";

export function publishClientInfo(clients: ClientConfig[], server: CustomServer) {
  if(BrowserWindow.getAllWindows().length){
    const win = BrowserWindow.getAllWindows()[0];
    if (win && !win.isDestroyed()) {
      win.webContents.send(`tcpServerClientConnection-${server.id}`, clients);
    }
  }
}