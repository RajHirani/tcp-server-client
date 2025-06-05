import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { addNotification } from "../../store/slices/NotificationSlice";

interface ServerMessagePanelProps {
    server: CustomServer;
}
function ServerMessagePanel({ server }: ServerMessagePanelProps) {
    const [clients, setClients] = useState<ClientConfig[]>([]);
    const [target, setTarget] = useState<string>("broadcast");
    const [format] = useState<'text' | 'hex'>("text");
    const [message, setMessage] = useState<string>("");
    const messageRef = useRef<HTMLTextAreaElement>(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribeClients = window.electron.subscribeToClientConnections(server.id, (newClients: ClientConfig[]) => {
            setClients(newClients);
        });
        return () => {
            unsubscribeClients();
        };
    }, [server.id]);

    const liveClients = clients.filter(client => client.status);

    const sendMessage = async () => {
        if (!message.trim()) return;
        try {
            // find the target client or send null in case of broadcast
            const targetClient = liveClients.find(client => client.id === Number(target));
            await window.electron.sendServerMessage(server.id,{
                serverId: server.id,
                targetClient,
                format,
                message
            });
            setMessage("");
            if (messageRef.current) messageRef.current.focus();
        } catch (err) {
            // Optionally handle error (e.g., show notification)
            console.error("Failed to send message:", err);
            dispatch(addNotification("Failed to send message. Please try again.", "danger"));
        }
    };

    return (
        <div className="card custom-card">
            <div className="card-header">
                <h5 className="card-title mb-0">
                    <i className="bi bi-send me-2"></i>Send Message
                </h5>
            </div>
            <div className="card-body">
                <div className="mb-3">
                    <label className="form-label">Target</label>
                    <select
                        className="form-select"
                        id="serverTarget"
                        value={target}
                        onChange={e => setTarget(e.target.value)}
                    >
                        <option value="broadcast">Broadcast to All</option>
                        {liveClients.map(client => (
                            <option
                                key={client.id}
                                value={client.id}
                            >
                                {client.name} ({client.host}:{client.port})
                            </option>
                        ))}
                    </select>
                </div>
                {/* <div className="mb-3">
                    <label className="form-label">Format</label>
                    <select
                        className="form-select"
                        id="serverFormat"
                        value={format}
                        onChange={e => setFormat(e.target.value)}
                    >
                        <option value="text">Plain Text</option>
                        <option value="hex">HEX</option>
                    </select>
                </div> */}
                <div className="mb-3">
                    <textarea
                        className="form-control font-mono"
                        id="serverMessage"
                        rows={3}
                        placeholder="Enter your message..."
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        ref={messageRef}
                    ></textarea>
                </div>
                <button
                    className="btn btn-primary w-100"
                    id="sendServerMessageBtn"
                    onClick={sendMessage}
                    disabled={!message.trim()}
                >
                    <i className="bi bi-send"></i> Send Message
                </button>
            </div>
        </div>
    );
}
export default ServerMessagePanel;