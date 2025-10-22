import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./styles/global.css";
import App from "./App.tsx";

/**
 * PUBLIC_INTERFACE
 * Application entry point
 * Renders the root React component.
 */
const rootEl = document.getElementById("root");
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
