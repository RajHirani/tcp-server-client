import { useEffect, useState } from "react";

interface CommunicationLogProp {
    client: ClientConfig
}


function getLogIcon(type: Log['type']) {
    switch (type) {
        case 'sent': return '→';
        case 'received': return '←';
        case 'system': return '⚠';
        default: return '';
    }
}

function CommunicationLog({ client }: CommunicationLogProp) {

    const [logs, setLogs] = useState<Log[]>([]);
    const [filter, setFilter] = useState<string>("all");

    useEffect(() => {
        const unsubscribeLogs = window.electron.subscribeToTcpClientLogs(client.id, (log: Log) => {
            setLogs(prev => [...prev, log]);
        });
        return () => {
            unsubscribeLogs();
        };
    }, []);

    const clearLogs = () => {
        setLogs([]);
    }

    const exportLogs = () => {
        const logData = logs.map(log => ({
            timestamp: new Date(log.timestamp).toLocaleString(),
            type: log.type,
            message: log.message
        }));
        const blob = new Blob([JSON.stringify(logData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `client_logs_${client.id}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    const clientLogFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFilter(event.target.value);
    }

    // Filter logs based on selected filter
    const filteredLogs = filter === "all"
        ? logs
        : logs.filter(log => log.type === filter);

    return (
        <div className="card custom-card">
            <div className="card-header">
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="card-title mb-0">
                        <i className="bi bi-list-ul me-2"></i>Activity Logs
                    </h5>
                    <div className="btn-group btn-group-sm">
                        <select className="form-select form-select-sm" value={filter} onChange={clientLogFilter}>
                            <option value="all">All</option>
                            <option value="sent">Sent</option>
                            <option value="received">Received</option>
                            <option value="system">System</option>
                        </select>
                        <button className="btn btn-outline-secondary" onClick={exportLogs}>
                            <i className="bi bi-download"></i>
                        </button>
                        <button className="btn btn-outline-secondary" onClick={clearLogs}>
                            <i className="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div className="card-body p-0">
                <div className="log-container" id="serverLogs">
                    {filteredLogs.length === 0 ? (
                        <div className="log-entry log-system">No logs yet.</div>
                    ) : (
                        filteredLogs.map((log, idx) => (
                            <div
                                key={idx}
                                className={`log-entry log-${log.type}`}
                            >
                                [{new Date(log.timestamp).toLocaleTimeString()}] {getLogIcon(log.type)} {log.message}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )

}

export default CommunicationLog;