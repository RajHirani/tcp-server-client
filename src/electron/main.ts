import { app, BrowserWindow, Menu } from "electron";
import path from "path";
import { isDev } from "./util.js";
import { getPreloadPath } from "./pathResolver.js";
import { registerTcpServerHandlers, stopAllRunningTCPServer } from "./tcpserver/TcpServerIPCHandlers.js";
import { disconnectAllRunningTCPClients, registerTcpClientHandlers } from "./tcpclient/TcpClientIPCHandlers.js";

app.on("ready", () => {
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: getPreloadPath(),
        },
    });
    if(isDev()){
        mainWindow.loadURL("http://localhost:5123");
    }else{
        // Remove all menu items
        Menu.setApplicationMenu(null);
        mainWindow.maximize();
        mainWindow.loadFile(path.join(app.getAppPath() + "/dist-ui/index.html"));
    }
    registerTcpServerHandlers();
    registerTcpClientHandlers();
});

// Stop all running TCP servers when the app is about to quit
app.on("before-quit", () => {
    stopAllRunningTCPServer();
    disconnectAllRunningTCPClients();
});