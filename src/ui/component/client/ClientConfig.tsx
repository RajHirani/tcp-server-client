import { useDispatch } from "react-redux";
import { updateClient } from "../../store/slices/ClientSlice";
import { addNotification } from "../../store/slices/NotificationSlice";
import CommunicationLog from "../communicationlog/CommunicationLog";
import { useEffect } from "react";
import ClientMessagePanel from "../massagepanel/ClientMessagePanel";

interface ClientConfigProps {
    client: ClientConfig;
    isActive: boolean;
}

function ClientConfig({ client, isActive }: ClientConfigProps) {

    const dispatch = useDispatch();

    const updateServerIp = (event: React.ChangeEvent<HTMLInputElement>) => {
        const ip = event.target.value;
        //validate the ip address
        //update the client
        dispatch(updateClient({
            ...client,
            server: {
                ...client.server,
                id: client.id,
                name: client.name,
                host: ip
            }
        }))
    }

    const updatePort = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        // If empty, clear the port
        if (value === "") {
            dispatch(updateClient({
                ...client,
                server: {
                    ...client.server,
                    id: client.id,
                    name: client.name,
                    port: undefined
                }
            }))
            return;
        }
        // Only allow whole numbers (no decimals, no negatives, no letters)
        if (!/^\d+$/.test(value)) {
            return;
        }
        // Only allow whole numbers (no decimals)
        const intValue = Number(value);
        dispatch(updateClient({
            ...client,
            server: {
                ...client.server,
                id: client.id,
                name: client.name,
                port: intValue
            }
        }))
    }

    const connetToServer = async () => {
        try{
            //
            // TODO add validation to have host and port define
            const host = client.server?.host;
            const port = client.server?.port;
            if (!host || typeof host !== "string" || host.trim() === "") {
                dispatch(addNotification("Please enter a valid server IP address.", "danger"));
                return;
            }
            if (!port || typeof port !== "number" || port <= 0 || port > 65535) {
                dispatch(addNotification("Please enter a valid server port (1-65535).", "danger"));
                return;
            }
            const updatedClient: ClientConfig = await window.electron.connectTcpClient(client);
            dispatch(updateClient(updatedClient));
        }catch(e){
            console.log(e);
            dispatch(addNotification(`Failed to connect to server at ${client.server?.host}:${client.server?.port}`, "danger"));
        }
    }

    const disconnectServer = async () => {
        try{
            const updatedClient: ClientConfig = await window.electron.disconnectTcpClient(client);
            dispatch(updateClient(updatedClient));
        }catch(e){
            dispatch(addNotification(`Failed to disconnect from server at ${client.server?.host}:${client.server?.port}`, "danger"));
        }
    }

     useEffect(() => {
        const unsubscribe = window.electron.subscribeToTcpClientConnection(client.id, (client: ClientConfig) => {
            dispatch(updateClient(client));
        });
        return () => {
            unsubscribe();
        };
    }, []);


    return (
        <div className={`tab-pane fade${isActive ? " show active" : ""}`} id={`client${client.id}`} role="tabpanel">
            <div className="row g-4">
                {/* <!-- Client Controls --> */}
                <div className="col-lg-6">
                    {/* <!-- Client Configuration --> */}
                    <div className="card custom-card mb-4">
                        <div className="card-header">
                            <h5 className="card-title mb-0">
                                {client.status ? <span className="status-indicator bg-success"></span> : <span className="status-indicator bg-danger"></span>}
                                Client Configuration
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="mb-3">
                                <label className="form-label">Server IP</label>
                                <input type="text" className="form-control" id="clientServerIp" value={client.server?.host || ''} onChange={updateServerIp} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Server Port</label>
                                <input type="number" className="form-control" id="clientServerPort" value={client.server?.port || ''}  onChange={updatePort}/>
                            </div>
                            <div className="mb-3">
                                {client.status ? <span className="badge bg-success me-2">Connected</span> : <span className="badge bg-danger">Disconnected</span>}
                            </div>
                            <div className="d-grid gap-2">
                                {client.status && (
                                    <button className="btn btn-danger" id="disconnectBtn" onClick={disconnectServer}>
                                        <i className="bi bi-plug"></i> Disconnect
                                    </button>
                                )}
                                {!client.status && (
                                    <button className="btn btn-success" id="connectBtn" onClick={connetToServer}>
                                        <i className="bi bi-link"></i> Connect
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* <!-- Client Message Panel --> */}
                    <ClientMessagePanel client={client}/>
                </div>
                {/* <!-- Client Logs --> */}
                <div className="col-lg-6">
                    <CommunicationLog client={client}/>
                </div>
            </div>
        </div>
    );
}
export default ClientConfig;