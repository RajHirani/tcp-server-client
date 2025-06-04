import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store/store";
import { removeNotification } from "../../store/slices/NotificationSlice";

function Notification() {
  const notifications = useSelector((state: RootState) => state.notification.notifications);
  const dispatch = useDispatch();

  const typeClasses = {
    success: "alert-success",
    danger: "alert-danger",
    warning: "alert-warning",
    info: "alert-info",
  };

  const icons = {
    success: "bi-check-circle-fill",
    danger: "bi-exclamation-triangle-fill",
    warning: "bi-exclamation-triangle-fill",
    info: "bi-info-circle-fill",
  };

  useEffect(() => {
    if (notifications.length === 0) return;
    const timers = notifications.map((n) =>
      setTimeout(() => dispatch(removeNotification(n.id)), n.duration)
    );
    return () => timers.forEach(clearTimeout);
  }, [notifications, dispatch]);

  return (
    <div id="notificationContainer" className="notification-container">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`alert ${typeClasses[n.type]} notification d-flex align-items-center`}
        >
          <i className={`bi ${icons[n.type]} me-2`}></i>
          <div className="flex-grow-1">{n.message}</div>
          <button
            type="button"
            className="btn-close"
            onClick={() => dispatch(removeNotification(n.id))}
            aria-label="Close"
          ></button>
        </div>
      ))}
    </div>
  );
}

export default Notification;