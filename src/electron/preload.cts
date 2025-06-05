import electron from 'electron';

electron.contextBridge.exposeInMainWorld('electron', {
  startTcpServer(server) {
    return electron.ipcRenderer.invoke('createTcpServer', server);
  },
  stopTcpServer(server) {
    return electron.ipcRenderer.invoke('stopTcpServer', server);
  }
} satisfies Window['electron']);