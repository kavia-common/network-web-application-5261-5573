import React from "react";
import { getDevice, pingDevice } from "../api/devices.ts";
import { STATUS_MONITORING_ENABLED } from "../api/client.ts";

/**
 * PUBLIC_INTERFACE
 * DeviceDetails
 * Displays details for a device id.
 */
export default function DeviceDetails({ deviceId, onBack, addToast }) {
  const [device, setDevice] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState(null);
  const [pinging, setPinging] = React.useState(false);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const data = await getDevice(deviceId);
      setDevice(data);
    } catch (e) {
      setErr(e?.message || "Failed to load device.");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => { load(); /* eslint-disable-next-line */ }, [deviceId]);

  async function doPing() {
    if (!STATUS_MONITORING_ENABLED) return;
    setPinging(true);
    try {
      const res = await pingDevice(deviceId);
      addToast?.(`Ping ${res?.status || "unknown"}${res?.response_time_ms ? ` in ${res.response_time_ms}ms` : ""}`, "info");
      await load();
    } catch (e) {
      addToast?.(e?.message || "Ping failed", "error");
    } finally {
      setPinging(false);
    }
  }

  if (loading) return <div className="panel">Loading…</div>;
  if (err) return (
    <div className="panel">
      <div className="alert" role="alert">{err}</div>
      <div style={{ display: "flex", gap: 8 }}>
        <button className="btn" onClick={load}>Retry</button>
        <button className="btn" onClick={onBack}>Back</button>
      </div>
    </div>
  );

  if (!device) return null;

  return (
    <div className="panel">
      <button className="btn" onClick={onBack} aria-label="Back to list">← Back</button>
      <h2 style={{ marginTop: 8 }}>{device.name}</h2>
      <div style={{ display: "grid", gap: 8 }}>
        <div><strong>IP:</strong> {device.ip_address}</div>
        <div><strong>Type:</strong> {device.type}</div>
        <div><strong>Location:</strong> {device.location}</div>
        <div>
          <strong>Status:</strong>{" "}
          {STATUS_MONITORING_ENABLED ? (
            <span className={`badge ${device.status || "unknown"}`}>{device.status || "unknown"}</span>
          ) : (
            <span className="badge unknown">hidden</span>
          )}
        </div>
        {device.last_ping_time && (
          <div><strong>Last Ping Time:</strong> {new Date(device.last_ping_time).toLocaleString()}</div>
        )}
      </div>
      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <button className="btn" onClick={load}>Refresh</button>
        <button className="btn" onClick={doPing} disabled={!STATUS_MONITORING_ENABLED || pinging}>
          {pinging ? "Pinging…" : "Ping Now"}
        </button>
      </div>
    </div>
  );
}
