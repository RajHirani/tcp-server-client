import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store/store";
import { hideConfirmationModal } from "../../store/slices/ConfirmationModalSlice";

function ConfirmationModal() {
  const { visible, title, message, onConfirm } = useSelector(
    (state: RootState) => state.confirmationModal
  );
  const dispatch = useDispatch();

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    dispatch(hideConfirmationModal());
  };

  return (
    <>
      {/* Modal Backdrop */}
      {visible && <div className="modal-backdrop fade show"></div>}

      <div
        className={`modal fade${visible ? " show" : ""}`}
        id="confirmationModal"
        tabIndex={-1}
        aria-labelledby="confirmationModalLabel"
        aria-hidden={!visible}
        style={{ display: visible ? "block" : "none" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="confirmationModalLabel">
                Confirmation
              </h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => dispatch(hideConfirmationModal())}
              ></button>
            </div>
            <div className="modal-body">
              <div className="d-flex align-items-start">
                <i className="bi bi-question-circle-fill text-warning me-3 fs-3"></i>
                <div>
                  <h6 id="confirmationTitle">{title}</h6>
                  <p id="confirmationMessage" className="mb-0">
                    {message}
                  </p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => dispatch(hideConfirmationModal())}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                id="confirmationOkBtn"
                onClick={handleConfirm}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ConfirmationModal;