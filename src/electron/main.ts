import { app, BrowserWindow } from "electron";
import path from "path";
import { isDev } from "./util.js";

app.on("ready", () => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false, // Note: This is not recommended for production apps
        },
    });
    if(isDev()){
        mainWindow.loadURL("http://localhost:5123");
    }else{
        mainWindow.loadFile(path.join(app.getAppPath() + "/dist-ui/index.html"));
    }
    
});