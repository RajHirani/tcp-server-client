import ServerConfig from "./ServerConfig";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { addServer, setActiveTab } from "../../store/slices/ServerSlice";

function Server(){

    const servers = useSelector((state: RootState) => state.server.servers);
    const activeTab = useSelector((state: RootState) => state.server.activeTab);
    const dispatch = useDispatch();

    const addNewServer = () => {
        const newId = servers.length ? Math.max(...servers.map(s => s.id)) + 1 : 1;
        dispatch(addServer({ id: newId, name: `Server ${newId}`, host: '0.0.0.0' }));
    };

    return (
        <div id="serverSection" className="tab-content-section">
            <div className="card custom-card shadow p-0">
                {/* <!-- Server Tabs --> */}
                <div className="card-header">
                    <div className="d-flex justify-content-between align-items-center">
                        <ul className="nav nav-pills" id="serverTabs" role="tablist">
                            {servers.map(server => (
                                <li className="nav-item" role="presentation" key={server.id}>
                                    <button
                                        className={`nav-link${activeTab === server.id ? " active" : ""}`}
                                        id={`server${server.id}-tab`}
                                        type="button"
                                        role="tab"
                                        onClick={() => dispatch(setActiveTab(server.id))}
                                    >
                                        {server.name}
                                        {server.status ? <span className="badge bg-success ms-2">ON</span> : <span className="badge bg-danger ms-2">OFF</span>}                                        
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <button className="btn btn-sm btn-outline-secondary" id="addServerBtn" onClick={addNewServer}>
                            <i className="bi bi-plus"></i> New Server
                        </button>
                    </div>
                </div>
                {/* <!-- Server Content --> */}
                <div className="card-body">
                    <div className="tab-content" id="serverTabContent">
                        {servers.map(server => (
                            <ServerConfig key={server.id} server={server} isActive={activeTab === server.id} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Server;