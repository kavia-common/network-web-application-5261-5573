import { apiFetch } from "./client.ts";

/**
 * PUBLIC_INTERFACE
 * listDevices
 * Fetch devices with optional filter, sort, page, page_size.
 * Note: Backend may return either an array of devices or an object with pagination fields.
 */
export function listDevices({ filter = "", sort = "", page = 1, page_size = 10 } = {}) {
  const params = new URLSearchParams();
  if (filter) params.set("filter", filter);
  if (sort) params.set("sort", sort);
  if (page) params.set("page", String(page));
  if (page_size) params.set("page_size", String(page_size));
  const qs = params.toString() ? `?${params.toString()}` : "";
  return apiFetch(`/devices${qs}`, { method: "GET" });
}

/**
 * PUBLIC_INTERFACE
 * createDevice
 * POST /devices with DeviceInput
 */
export function createDevice(payload) {
  return apiFetch(`/devices`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * PUBLIC_INTERFACE
 * getDeviceByName
 * GET /devices/{name}
 */
export function getDeviceByName(name) {
  return apiFetch(`/devices/${encodeURIComponent(name)}`, { method: "GET" });
}

/**
 * PUBLIC_INTERFACE
 * updateDeviceByName
 * PUT /devices/{name}
 * Ensures updates use PUT as required by the API spec.
 */
export function updateDeviceByName(name, payload) {
  return apiFetch(`/devices/${encodeURIComponent(name)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/**
 * PUBLIC_INTERFACE
 * deleteDeviceByName
 * DELETE /devices/{name}
 */
export function deleteDeviceByName(name) {
  return apiFetch(`/devices/${encodeURIComponent(name)}`, { method: "DELETE" });
}

/**
 * PUBLIC_INTERFACE
 * getStatuses
 * GET /status to retrieve status list for devices
 */
export function getStatuses() {
  return apiFetch(`/status`, { method: "GET" });
}

/**
 * PUBLIC_INTERFACE
 * pingDevice
 * POST /ping
 * Note: Ping remains using device_id unless the backend changes to name.
 */
export function pingDevice(device_id) {
  return apiFetch(`/ping`, {
    method: "POST",
    body: JSON.stringify({ device_id }),
  });
}
