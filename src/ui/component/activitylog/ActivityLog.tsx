function ActivityLog() {
    return (
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
    );
}
export default ActivityLog;