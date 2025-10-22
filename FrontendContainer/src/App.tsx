import React from "react";
import "./styles/global.css";
import DeviceTable from "./components/DeviceTable.tsx";
import DeviceForm from "./components/DeviceForm.tsx";
import DeviceDetails from "./components/DeviceDetails.tsx";
import { ToastContainer } from "./components/Toast.tsx";
import { useToast } from "./hooks/useToast.ts";
import { useHashRouter } from "./routes.tsx";

/**
 * PUBLIC_INTERFACE
 * App
 * Main application component with navigation and routing.
 */
export default function App() {
  const { addToast, removeToast, toasts } = useToast();
  const router = useHashRouter();

  // state for modal form
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState(null);

  function goHome() { router.navigate("/"); }

  function openAdd() { setEditing(null); setFormOpen(true); }
  function openEdit(device) { setEditing(device); setFormOpen(true); }
  function onFormSuccess() { setFormOpen(false); /* table will refetch by props change trigger if needed */ }

  const isDetails = router.segments[0] === "devices" && router.segments[1];
  const detailsId = isDetails ? router.segments[1] : null;

  return (
    <>
      <nav className="navbar" role="navigation" aria-label="Main">
        <h1>Network Devices</h1>
        <div>
          <a href="#/" className="btn">Home</a>
        </div>
      </nav>

      <main className="container">
        {!isDetails && (
          <DeviceTable
            onAdd={openAdd}
            onEdit={openEdit}
            onView={(d) => router.navigate(`/devices/${encodeURIComponent(d.id)}`)}
            addToast={addToast}
          />
        )}

        {isDetails && (
          <DeviceDetails
            deviceId={detailsId}
            onBack={goHome}
            addToast={addToast}
          />
        )}

        {formOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="device-form-modal-title"
            className="panel"
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "grid", placeItems: "center", zIndex: 999 }}
          >
            <div role="document" className="panel" style={{ width: "min(600px, 94vw)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 id="device-form-modal-title" style={{ margin: 0 }}>{editing ? "Edit Device" : "Add Device"}</h2>
                <button className="btn" aria-label="Close form" onClick={() => setFormOpen(false)}>×</button>
              </div>
              <DeviceForm
                initialValues={editing}
                onSuccess={() => { onFormSuccess(); addToast("Saved.", "success"); }}
                onCancel={() => setFormOpen(false)}
                addToast={addToast}
              />
            </div>
          </div>
        )}
      </main>

      <ToastContainer toasts={toasts} remove={removeToast} />
    </>
  );
}
