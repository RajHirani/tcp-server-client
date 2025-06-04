import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

function OverlayLoader() {
    const { visible, message } = useSelector((state: RootState) => state.overlayLoader);

    if (!visible) return null;

    return (
        <div id="overlayLoader" className="overlay-loader">
            <div className="d-flex flex-column align-items-center">
                <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Loading...</span>
                </div>
                <h5 className="text-white">Processing...</h5>
                <p className="text-white-50" id="loaderMessage">{message || "Please wait while we process your request"}</p>
            </div>
        </div>
    );
}

export default OverlayLoader;