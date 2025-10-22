import React from "react";

let counter = 0;

/**
 * PUBLIC_INTERFACE
 * useToast
 * Hook to manage toast notifications across the app.
 */
export function useToast() {
  const [toasts, setToasts] = React.useState([]);

  // PUBLIC_INTERFACE
  const addToast = React.useCallback((message, type = "info", autoHide = 3500) => {
    const id = `t_${Date.now()}_${counter++}`;
    setToasts((prev) => [...prev, { id, message, type, autoHide }]);
    return id;
  }, []);

  // PUBLIC_INTERFACE
  const removeToast = React.useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // PUBLIC_INTERFACE
  const api = React.useMemo(() => ({ addToast, removeToast, toasts }), [addToast, removeToast, toasts]);

  return api;
}
