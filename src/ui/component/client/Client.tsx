
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { addClient, setActiveTab } from "../../store/slices/ClientSlice";
import ClientConfig from "./ClientConfig";

function Client(){

    const clients = useSelector((state: RootState) => state.client.clients);
    const activeTab = useSelector((state: RootState) => state.client.activeTab);
    const dispatch = useDispatch();

    const addNewClient = () => {
        const newId = clients.length ? Math.max(...clients.map(s => s.id)) + 1 : 1;
        dispatch(addClient({ id: newId, name: `Client ${newId}`, server: { id: newId, name: `Server ${newId}` } }));
    };

    return (
        <div className="card custom-card shadow">
                {/* <!-- Client Tabs --> */}
                <div className="card-header">
                    <div className="d-flex justify-content-between align-items-center">
                        <ul className="nav nav-pills" id="clientTabs" role="tablist">
                            {clients.map(client => (
                                <li className="nav-item" role="presentation" key={client.id}>
                                    <button
                                        className={`nav-link${activeTab === client.id ? " active" : ""}`}
                                        id={`server${client.id}-tab`}
                                        type="button"
                                        role="tab"
                                        onClick={() => dispatch(setActiveTab(client.id))}
                                    >
                                        {client.name}
                                        {client.status ? <span className="badge bg-success ms-2">ON</span> : <span className="badge bg-danger ms-2">OFF</span>}                                        
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <button className="btn btn-sm btn-outline-secondary" id="addClientBtn" onClick={addNewClient}>
                            <i className="bi bi-plus"></i> New Client
                        </button>
                    </div>
                </div>
                {/* <!-- Client Content --> */}
                <div className="card-body">
                    <div className="tab-content" id="clientTabContent">
                        {clients.map(client => (
                            <ClientConfig key={client.id} client={client} isActive={activeTab === client.id} />
                        ))}
                    </div>
                </div>
        </div>
    )
}

export default Client;