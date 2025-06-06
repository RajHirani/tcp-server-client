import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { addNotification } from "../../store/slices/NotificationSlice";

interface ClientMessagePanelProps {
    client: ClientConfig
}
function ClientMessagePanel({client}: ClientMessagePanelProps) {
    const [format] = useState<'text' | 'hex'>("text");
    const [message, setMessage] = useState<string>("");
    const messageRef = useRef<HTMLTextAreaElement>(null);
    const dispatch = useDispatch();

    const sendMessage = async () => {
        if (!message.trim()) return;
        try {
            // find the target client or send null in case of broadcast
            await window.electron.sendClientMessage(client.id,{
                serverId: client.id,
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
                {/* <div className="mb-3">
                    <label className="form-label">Format</label>
                    <select className="form-select" id="clientFormat" value={format}
                        onChange={e => setFormat(e.target.value)}>
                        <option value="text">Plain Text</option>
                        <option value="hex">HEX</option>
                    </select>
                </div> */}
                <div className="mb-3">
                    <textarea 
                        className="form-control font-mono" 
                        id="clientMessage" 
                        rows={4} 
                        placeholder="Enter your message..."
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        ref={messageRef}
                        ></textarea>
                </div>
                <button className="btn btn-primary w-100" id="sendClientMessageBtn" onClick={sendMessage}
                    disabled={!message.trim()}>
                    <i className="bi bi-send"></i> Send Message
                </button>
            </div>
        </div>
    )
}

export default ClientMessagePanel;