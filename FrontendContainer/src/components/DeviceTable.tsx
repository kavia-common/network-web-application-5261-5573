import React from "react";
import { listDevices, deleteDeviceApi, pingDevice } from "../api/devices.ts";
import { STATUS_MONITORING_ENABLED } from "../api/client.ts";
import ConfirmDialog from "./ConfirmDialog.tsx";

/**
 * PUBLIC_INTERFACE
 * DeviceTable
 * Displays devices with search, filter, sort, pagination and actions.
 */
export default function DeviceTable({ onAdd, onEdit, onView, addToast }) {
  const [devices, setDevices] = React.useState([]);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  // controls
  const [search, setSearch] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");
  const [sort, setSort] = React.useState("name");
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const [confirmDelete, setConfirmDelete] = React.useState({ open: false, device: null });
  const [pingingId, setPingingId] = React.useState(null);

  const combinedFilter = React.useMemo(() => {
    const chunks = [];
    if (typeFilter) chunks.push(`type:${typeFilter}`);
    if (statusFilter) chunks.push(`status:${statusFilter}`);
    if (search.trim()) chunks.push(`q:${search.trim()}`); // backend may parse "q" for free text (or ignore)
    return chunks.join(" ");
  }, [typeFilter, statusFilter, search]);

  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      const resp = await listDevices({ filter: combinedFilter, sort, page, page_size: pageSize });
      console.log(resp)
      setDevices(resp.devices || []);
      setTotal(resp.total || 0);
    } catch (err) {
      setError(err?.message || "Failed to load devices.");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [combinedFilter, sort, page, pageSize]);

  function onSortClick(field) {
    setSort((prev) => {
      // toggle asc/desc with - prefix convention (simple client-side toggle presented to server)
      if (prev === field) return `-${field}`;
      return field;
    });
  }

  function onDelete(device) {
    setConfirmDelete({ open: true, device });
  }

  async function confirmDeleteAction() {
    const dev = confirmDelete.device;
    if (!dev) return;
    try {
      await deleteDeviceApi(dev.id);
      addToast?.("Device deleted.", "success");
      // refresh current page
      fetchData();
    } catch (err) {
      addToast?.(err?.message || "Failed to delete device.", "error");
    } finally {
      setConfirmDelete({ open: false, device: null });
    }
  }

  async function onPing(device) {
    if (!STATUS_MONITORING_ENABLED) return;
    setPingingId(device.id);
    try {
      const res = await pingDevice(device.id);
      const msg = `Ping ${res?.status || "unknown"}${res?.response_time_ms ? ` in ${res.response_time_ms}ms` : ""}`;
      addToast?.(msg, "info");
      // Optionally, refresh to reflect new status
      fetchData();
    } catch (err) {
      addToast?.(err?.message || "Failed to ping device.", "error");
    } finally {
      setPingingId(null);
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="panel" aria-busy={loading}>
      <div className="controls" role="group" aria-label="Device filters and actions">
        <input
          className="input"
          type="search"
          placeholder="Search name or location…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          aria-label="Search devices"
        />
        <select
          className="select"
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
          aria-label="Filter by type"
        >
          <option value="">All Types</option>
          <option value="router">Router</option>
          <option value="switch">Switch</option>
          <option value="server">Server</option>
        </select>
        <select
          className="select"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          aria-label="Filter by status"
          disabled={!STATUS_MONITORING_ENABLED}
        >
          <option value="">All Statuses</option>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
        </select>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn primary" onClick={onAdd}>Add Device</button>
        </div>
      </div>

      {error && <div className="alert" role="alert">{error}</div>}

      <div style={{ overflowX: "auto" }}>
        <table className="table" role="table" aria-label="Devices">
          <thead>
            <tr>
              <th><button onClick={() => onSortClick("name")} aria-label="Sort by name">Name</button></th>
              <th><button onClick={() => onSortClick("ip_address")} aria-label="Sort by IP">IP</button></th>
              <th><button onClick={() => onSortClick("type")} aria-label="Sort by type">Type</button></th>
              <th><button onClick={() => onSortClick("location")} aria-label="Sort by location">Location</button></th>
              <th>
                {STATUS_MONITORING_ENABLED ? (
                  <button onClick={() => onSortClick("status")} aria-label="Sort by status">Status</button>
                ) : (
                  <span>Status</span>
                )}
              </th>
              <th aria-label="Actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={6}>Loading…</td></tr>
            )}
            {!loading && devices.length === 0 && (
              <tr><td colSpan={6}>No devices found.</td></tr>
            )}
            {!loading && devices.map((d) => (
              <tr key={d.id}>
                <td><button className="btn" onClick={() => onView?.(d)} aria-label={`View ${d.name}`}>{d.name}</button></td>
                <td>{d.ip_address}</td>
                <td style={{ textTransform: "capitalize" }}>{d.type}</td>
                <td>{d.location}</td>
                <td>
                  {STATUS_MONITORING_ENABLED ? (
                    <span className={`badge ${d.status || "unknown"}`}>{d.status || "unknown"}</span>
                  ) : (
                    <span className="badge unknown">hidden</span>
                  )}
                </td>
                <td className="row-actions">
                  <button className="btn" onClick={() => onEdit?.(d)}>Edit</button>
                  <button className="btn danger" onClick={() => onDelete(d)}>Delete</button>
                  <button
                    className="btn"
                    onClick={() => onPing(d)}
                    disabled={!STATUS_MONITORING_ENABLED || pingingId === d.id}
                    aria-disabled={!STATUS_MONITORING_ENABLED || pingingId === d.id}
                    aria-label={`Ping ${d.name}`}
                  >
                    {pingingId === d.id ? "Pinging…" : "Ping"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination" role="navigation" aria-label="Pagination">
        <span>Page {page} of {totalPages}</span>
        <button className="btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} aria-label="Previous page">Prev</button>
        <button className="btn" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} aria-label="Next page">Next</button>
        <select
          className="select"
          aria-label="Page size"
          value={pageSize}
          onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
          style={{ maxWidth: 120 }}
        >
          {[5,10,20,50].map((n) => <option key={n} value={n}>{n}/page</option>)}
        </select>
      </div>

      <ConfirmDialog
        open={confirmDelete.open}
        title="Delete Device"
        description={`Are you sure you want to delete "${confirmDelete.device?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDeleteAction}
        onCancel={() => setConfirmDelete({ open: false, device: null })}
      />
    </div>
  );
}
