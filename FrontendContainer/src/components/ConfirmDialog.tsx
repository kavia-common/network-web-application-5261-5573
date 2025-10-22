import React from "react";

/**
 * PUBLIC_INTERFACE
 * ConfirmDialog
 * Accessible confirmation dialog rendered inline (non-modal).
 */
export default function ConfirmDialog({ open, title = "Confirm", description, confirmText = "Confirm", cancelText = "Cancel", onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-desc"
      className="panel"
      style={{ position: "fixed", inset: "0", background: "rgba(0,0,0,0.6)", display: "grid", placeItems: "center", zIndex: 999 }}
    >
      <div role="document" className="panel" style={{ maxWidth: 420, width: "90%" }}>
        <h2 id="confirm-title" style={{ marginTop: 0 }}>{title}</h2>
        {description && <p id="confirm-desc" style={{ color: "#cbd5e1" }}>{description}</p>}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button className="btn" onClick={onCancel} autoFocus>{cancelText}</button>
          <button className="btn danger" onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
}
