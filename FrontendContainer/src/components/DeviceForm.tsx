import React from "react";
import { createDevice, updateDevice } from "../api/devices.ts";
import { STATUS_MONITORING_ENABLED } from "../api/client.ts";

const IPV4_REGEX = /^(?:(25[0-5]|2[0-4]\d|[01]?\d?\d)(\.|$)){4}$/;

/**
 * PUBLIC_INTERFACE
 * DeviceForm
 * Form for creating or editing devices with client-side validation.
 */
export default function DeviceForm({ initialValues, onSuccess, onCancel, addToast }) {
  const isEdit = !!(initialValues && initialValues.id);
  const [values, setValues] = React.useState(() => ({
    name: initialValues?.name || "",
    ip_address: initialValues?.ip_address || "",
    type: initialValues?.type || "router",
    location: initialValues?.location || "",
    status: initialValues?.status || "online"
  }));
  const [errors, setErrors] = React.useState({});
  const [submitting, setSubmitting] = React.useState(false);

  function setField(field, value) {
    setValues((v) => ({ ...v, [field]: value }));
  }

  function validate() {
    const e = {};
    if (!values.name.trim()) e.name = "Name is required.";
    if (!values.ip_address.trim()) e.ip_address = "IP address is required.";
    else if (!IPV4_REGEX.test(values.ip_address.trim())) e.ip_address = "Must be a valid IPv4 address.";
    if (!values.type) e.type = "Type is required.";
    if (!values.location.trim()) e.location = "Location is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      if (isEdit) {
        const updated = await updateDevice(initialValues.id, values);
        addToast?.("Device updated.", "success");
        onSuccess?.(updated);
      } else {
        const created = await createDevice(values);
        addToast?.("Device created.", "success");
        onSuccess?.(created);
      }
    } catch (err) {
      // Handle duplicate or validation errors from backend (400)
      const msg = err?.message || "Failed to submit device.";
      addToast?.(msg, "error");
      // Map server validation messages if available
      if (err?.status === 400 && err?.details) {
        try {
          const det = typeof err.details === "string" ? JSON.parse(err.details) : err.details;
          if (det && typeof det === "object") {
            setErrors((prev) => ({ ...prev, ...det }));
          }
        } catch {
          // ignore parsing errors
        }
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate aria-labelledby="device-form-title">
      <h2 id="device-form-title" style={{ marginTop: 0 }}>{isEdit ? "Edit Device" : "Add Device"}</h2>

      <div className="form-field">
        <label htmlFor="f-name">Name <span className="sr-only">(required)</span></label>
        <input
          id="f-name"
          className="input"
          type="text"
          value={values.name}
          onChange={(e) => setField("name", e.target.value)}
          required
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "e-name" : undefined}
        />
        {errors.name && <div id="e-name" className="form-error" role="alert">{errors.name}</div>}
      </div>

      <div className="form-field">
        <label htmlFor="f-ip">IP Address <span className="sr-only">(required)</span></label>
        <input
          id="f-ip"
          className="input"
          type="text"
          value={values.ip_address}
          onChange={(e) => setField("ip_address", e.target.value)}
          required
          placeholder="e.g., 192.168.1.10"
          aria-invalid={!!errors.ip_address}
          aria-describedby={errors.ip_address ? "e-ip" : undefined}
        />
        {errors.ip_address && <div id="e-ip" className="form-error" role="alert">{errors.ip_address}</div>}
      </div>

      <div className="form-field">
        <label htmlFor="f-type">Type <span className="sr-only">(required)</span></label>
        <select
          id="f-type"
          className="select"
          value={values.type}
          onChange={(e) => setField("type", e.target.value)}
          required
          aria-invalid={!!errors.type}
          aria-describedby={errors.type ? "e-type" : undefined}
        >
          <option value="router">Router</option>
          <option value="switch">Switch</option>
          <option value="server">Server</option>
        </select>
        {errors.type && <div id="e-type" className="form-error" role="alert">{errors.type}</div>}
      </div>

      <div className="form-field">
        <label htmlFor="f-location">Location <span className="sr-only">(required)</span></label>
        <input
          id="f-location"
          className="input"
          type="text"
          value={values.location}
          onChange={(e) => setField("location", e.target.value)}
          required
          aria-invalid={!!errors.location}
          aria-describedby={errors.location ? "e-location" : undefined}
        />
        {errors.location && <div id="e-location" className="form-error" role="alert">{errors.location}</div>}
      </div>

        <div className="form-field">
        <label htmlFor="f-type">Status <span className="sr-only">(required)</span></label>
        <select
          id="f-type"
          className="select"
          value={values.status}
          onChange={(e) => setField("type", e.target.value)}
          required
          aria-invalid={!!errors.status}
          aria-describedby={errors.status ? "e-type" : undefined}
        >
          <option value="online">Online</option>
          <option value="offline">Offline</option>
        </select>
        {errors.status && <div id="e-type" className="form-error" role="alert">{errors.status}</div>}
      </div>
      

      {!STATUS_MONITORING_ENABLED && (
        <div className="alert" role="status">
          Status monitoring is disabled by configuration. Status badges and ping are unavailable.
        </div>
      )}

      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
        <button type="button" className="btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn primary" disabled={submitting}>
          {submitting ? "Saving..." : isEdit ? "Save Changes" : "Add Device"}
        </button>
      </div>
    </form>
  );
}
