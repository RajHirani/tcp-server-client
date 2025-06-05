import { useEffect, useState } from "react";

interface ClientListProps {
    server: CustomServer;
}

function ClientList({ server }: ClientListProps) {
    const [clients, setClients] = useState<ClientConfig[]>([]);

    useEffect(() => {
        const unsubscribeClients = window.electron.subscribeToClientConnections(server.id, (newClients: ClientConfig[]) => {
            console.log("Received client updates:", newClients);
            setClients(newClients);
        });
        return () => {
            unsubscribeClients();
        };
    }, []);

    const disconnectClient = async (client: ClientConfig) => {
        try{
            await window.electron.disconnectClient(server.id, client);
        }catch(err){
            console.log("Not able to disconnect");
        }
    }

    return (
        <div className="card custom-card">
            <div className="card-header">
                <h5 className="card-title mb-0">
                    <i className="bi bi-people me-2"></i>Connected Clients (<span id="clientCount">{clients.length}</span>)
                </h5>
            </div>
            <div className="card-body" id="serverClients">
                {clients.length === 0 ? (
                    <div className="text-muted">No clients connected.</div>
                ) : (
                    clients.map((client) => (
                        <div className="card mb-3 client-item" key={client.id}>
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <h6 className="font-mono">
                                            {client.host}:{client.port}
                                        </h6>
                                        <small className="text-muted">
                                            {
                                                client.status === false
                                                    ? `Disconnected at ${client.disconnectedTime ? new Date(client.disconnectedTime).toLocaleTimeString() : "Unknown"}`
                                                    : `Connected at ${client.connectedTime ? new Date(client.connectedTime).toLocaleTimeString() : "Unknown"}`
                                            }
                                        </small>
                                        <br />
                                        <span className={`badge mt-1 ${client.status === false ? "bg-secondary" : "bg-info"}`}>
                                            {client.name}
                                        </span>
                                    </div>
                                    {client.status !== false && (
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            title="Disconnect"
                                            onClick={()=> disconnectClient(client)}
                                        >
                                            <i className="bi bi-x"></i>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
export default ClientList;