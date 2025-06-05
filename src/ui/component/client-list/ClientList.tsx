function ClientList() {
    return (
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
    );
}
export default ClientList;