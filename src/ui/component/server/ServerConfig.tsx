import { useDispatch } from "react-redux";
import { updateServer } from "../../store/slices/ServerSlice";
import { addNotification } from "../../store/slices/NotificationSlice";

interface ServerConfigProps {
    server: CustomServer;
    isActive: boolean;
}

function ServerConfig({ server, isActive }: ServerConfigProps) {
    const dispatch = useDispatch();

    const startServer = async () => {
        try{
            if(!server.port || server.port < 1025 || server.port > 65535) {
                dispatch(addNotification("Invalid port number. Please enter a port between 1025 and 65535.", "danger"));
            }
            const updatedServer = await window.electron.startTcpServer(server);
            console.log("Server started successfully:", updatedServer);
            dispatch(updateServer(updatedServer));
        }catch (error) {
            console.error("Error starting server:", error);
        }   
    }

    const stopServer = async () => {
        try{
            const updatedServer = await window.electron.stopTcpServer(server);
            console.log("Server stopped successfully:", updatedServer);
            dispatch(updateServer(updatedServer));
        }catch(err){
            console.error("Error stopping server:", err);
        }
    }

    const portChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const port = Number(event.target.value);
        dispatch(updateServer({...server, port: port}));
    }

    return (
        <div className={`tab-pane fade${isActive ? " show active" : ""}`} id={`server${server.id}`} role="tabpanel">
            <div className="row g-4">
                {/* <!-- Server Controls --> */}
                <div className="col-lg-4">
                    {/* <!-- Server Configuration --> */}
                    <div className="card custom-card mb-4">
                        <div className="card-header">
                            <h5 className="card-title mb-0">
                                { server.status ? <span className="status-indicator bg-success"></span> : <span className="status-indicator bg-danger"></span> }
                                Server Configuration
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="mb-3">
                                <label className="form-label">Port</label>
                                <input type="number" className="form-control" id="serverPort" min={1025} value={server.port} onChange={portChange} placeholder="Port range from 1025 to 65535"/>
                            </div>
                            <div className="mb-3">
                                { server.status ? <span className="badge bg-success me-2">Running</span> : <span className="badge bg-danger me-2">Stopped</span> }
                                { server.status && (<small className="text-muted">0.0.0.0:8080</small>) }
                            </div>
                            <div className="d-grid gap-2">
                                { !server.status ? (
                                    <button className="btn btn-success" id="startServerBtn" onClick={startServer}>
                                        <i className="bi bi-play-fill"></i> Start Server
                                    </button>
                                ) : (
                                    <button className="btn btn-danger" id="stopServerBtn" onClick={stopServer}>
                                        <i className="bi bi-stop-fill"></i> Stop Server
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* <!-- Message Panel --> */}
                    <div className="card custom-card">
                        <div className="card-header">
                            <h5 className="card-title mb-0">
                                <i className="bi bi-send me-2"></i>Send Message
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="mb-3">
                                <label className="form-label">Target</label>
                                <select className="form-select" id="serverTarget">
                                    <option value="broadcast">Broadcast to All</option>
                                    <option value="192.168.1.101">Demo Client (192.168.1.101:12345)</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Format</label>
                                <select className="form-select" id="serverFormat">
                                    <option value="text">Plain Text</option>
                                    <option value="hex">HEX</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <textarea className="form-control font-mono" id="serverMessage" rows={3} placeholder="Enter your message..."></textarea>
                            </div>
                            <button className="btn btn-primary w-100" id="sendServerMessageBtn">
                                <i className="bi bi-send"></i> Send Message
                            </button>
                        </div>
                    </div>
                </div>
                {/* <!-- Connected Clients --> */}
                <div className="col-lg-4">
                    <div className="card custom-card">
                        <div className="card-header">
                            <h5 className="card-title mb-0">
                                <i className="bi bi-people me-2"></i>Connected Clients (<span id="clientCount">1</span>)
                            </h5>
                        </div>
                        <div className="card-body" id="serverClients">
                            <div className="card mb-3 client-item">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <h6 className="font-mono">192.168.1.101:12345</h6>
                                            <small className="text-muted">Connected: 14:32:15</small>
                                            <br />
                                            <span className="badge bg-info mt-1">Demo Client</span>
                                        </div>
                                        <button className="btn btn-sm btn-outline-danger">
                                            <i className="bi bi-x"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- Server Logs --> */}
                <div className="col-lg-4">
                    <div className="card custom-card">
                        <div className="card-header">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="card-title mb-0">
                                    <i className="bi bi-list-ul me-2"></i>Activity Logs
                                </h5>
                                <div className="btn-group btn-group-sm">
                                    <select className="form-select form-select-sm" id="serverLogFilter">
                                        <option value="all">All</option>
                                        <option value="sent">Sent</option>
                                        <option value="received">Received</option>
                                        <option value="system">System</option>
                                    </select>
                                    <button className="btn btn-outline-secondary" id="exportServerLogsBtn">
                                        <i className="bi bi-download"></i>
                                    </button>
                                    <button className="btn btn-outline-secondary" id="clearServerLogsBtn">
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="card-body p-0">
                            <div className="log-container" id="serverLogs">
                                <div className="log-entry log-system">[14:32:15] ⚠ Demo client connected for preview</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ServerConfig;