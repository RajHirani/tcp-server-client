import type { TClient } from "../../model/Types";

interface ClientConfigProps {
    client: TClient;
    isActive: boolean;
}

function ClientConfig({ client, isActive }: ClientConfigProps) {
    return (
        <div className={`tab-pane fade${isActive ? " show active" : ""}`} id={`client${client.id}`} role="tabpanel">
            <div className="row g-4">
                {/* <!-- Client Controls --> */}
                <div className="col-lg-6">
                    {/* <!-- Client Configuration --> */}
                    <div className="card custom-card mb-4">
                        <div className="card-header">
                            <h5 className="card-title mb-0">
                                { client.status ? <span className="status-indicator bg-success"></span> : <span className="status-indicator bg-danger"></span> }
                                Client Configuration
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="mb-3">
                                <label className="form-label">Server IP</label>
                                <input type="text" className="form-control" id="clientServerIp" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Server Port</label>
                                <input type="text" className="form-control" id="clientServerPort" />
                            </div>
                            <div className="mb-3">
                                { client.status ? <span className="badge bg-success me-2">Connected</span> : <span className="badge bg-danger">Disconnected</span> }
                            </div>
                            {/* <div className="mb-3">
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" id="autoReconnect" />
                                    <label className="form-check-label" htmlFor="autoReconnect">
                                        Auto-reconnect on disconnection
                                    </label>
                                </div>
                            </div> */}
                            <div className="d-grid gap-2">
                                {client.status && (
                                    <button className="btn btn-danger" id="disconnectBtn" disabled>
                                        <i className="bi bi-plug"></i> Disconnect
                                    </button>
                                )}
                                {!client.status && (
                                    <button className="btn btn-success" id="connectBtn">
                                        <i className="bi bi-link"></i> Connect
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* <!-- Client Message Panel --> */}
                    <div className="card custom-card">
                        <div className="card-header">
                            <h5 className="card-title mb-0">
                                <i className="bi bi-send me-2"></i>Send Message
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="mb-3">
                                <label className="form-label">Format</label>
                                <select className="form-select" id="clientFormat">
                                    <option value="text">Plain Text</option>
                                    <option value="hex">HEX</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <textarea className="form-control font-mono" id="clientMessage" rows={4} placeholder="Enter your message..."></textarea>
                            </div>
                            <button className="btn btn-primary w-100" id="sendClientMessageBtn" disabled>
                                <i className="bi bi-send"></i> Send Message
                            </button>
                        </div>
                    </div>
                </div>
                {/* <!-- Client Logs --> */}
                <div className="col-lg-6">
                    <div className="card custom-card">
                        <div className="card-header">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="card-title mb-0">
                                    <i className="bi bi-list-ul me-2"></i>Communication Logs
                                </h5>
                                <div className="btn-group btn-group-sm">
                                    <select className="form-select form-select-sm" id="clientLogFilter">
                                        <option value="all">All</option>
                                        <option value="sent">Sent</option>
                                        <option value="received">Received</option>
                                        <option value="system">System</option>
                                    </select>
                                    <button className="btn btn-outline-secondary" id="exportClientLogsBtn">
                                        <i className="bi bi-download"></i>
                                    </button>
                                    <button className="btn btn-outline-secondary" id="clearClientLogsBtn">
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="card-body p-0">
                            <div className="log-container" id="clientLogs">
                                <div className="log-entry log-system">[14:32:15] ⚠ Demo client ready for connection</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ClientConfig;