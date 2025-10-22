import React from "react";

/**
 * Toast component to display transient messages.
 * Accessible with role="status" and aria-live="polite".
 */
export function Toast({ id, type = "info", message, onClose, autoHide = 3500 }) {
  React.useEffect(() => {
    if (!autoHide) return;
    const t = setTimeout(() => onClose?.(id), autoHide);
    return () => clearTimeout(t);
  }, [id, autoHide, onClose]);

  return (
    <div
      className={`toast ${type}`}
      role={type === "error" ? "alert" : "status"}
      aria-live={type === "error" ? "assertive" : "polite"}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
        <div>{message}</div>
        <button
          className="btn"
          aria-label="Dismiss notification"
          onClick={() => onClose?.(id)}
        >
          ×
        </button>
      </div>
    </div>
  );
}

/**
 * ToastContainer renders a stack of toasts.
 */
export function ToastContainer({ toasts, remove }) {
  return (
    <div className="toast-root" aria-live="polite" aria-atomic="true">
      {toasts.map((t) => (
        <Toast key={t.id} {...t} onClose={remove} />
      ))}
    </div>
  );
}
