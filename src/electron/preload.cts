import electron from 'electron';

electron.contextBridge.exposeInMainWorld('electron', {
  startTcpServer(server) {
    return electron.ipcRenderer.invoke('createTcpServer', server);
  },
  stopTcpServer(server) {
    return electron.ipcRenderer.invoke('stopTcpServer', server);
  },
  subscribeToTcpServerLogs(serverId, cb) {
    const callback = (_: Electron.IpcRendererEvent, log : Log) => cb(log);
    electron.ipcRenderer.on(`tcpServerLogs-${serverId}`, callback);
    return () => electron.ipcRenderer.off(`tcpServerLogs-${serverId}`, callback);
  },
  subscribeToClientConnections(serverId, cb) {
    const callback = (_: Electron.IpcRendererEvent, clients: ClientConfig[]) => cb(clients);
    electron.ipcRenderer.on(`tcpServerClientConnection-${serverId}`, callback);
    return () => electron.ipcRenderer.off(`tcpServerClientConnection-${serverId}`, callback);
  },
  sendServerMessage(serverId, serverMessage) {
    return electron.ipcRenderer.invoke('sendServerMessage', serverId, serverMessage);
  },
  disconnectClient(serverId, clientConfig) {
    return electron.ipcRenderer.invoke("disconnectClient", serverId, clientConfig);
  },
} satisfies Window['electron']);