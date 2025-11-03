const DEFAULT_BASE = "https://kavia-alb-465de3b7-2042056739.backend.kavia.app/";

/**
 * Read environment variable with a fallback.
 * CRA exposes variables prefixed with REACT_APP_. We standardize on REACT_APP_API_BASE_URL.
 */
function getEnv(name, fallback) {
  if (typeof process !== "undefined" && process.env && process.env[name]) {
    return process.env[name];
  }
  return fallback;
}

/**
 * PUBLIC_INTERFACE
 * API_BASE_URL
 * Single source of truth for backend base URL.
 * Reads from REACT_APP_API_BASE_URL with a fallback to the provided default.
 */
export const API_BASE_URL = getEnv("REACT_APP_API_BASE_URL", DEFAULT_BASE);

/**
 * PUBLIC_INTERFACE
 * STATUS_MONITORING_ENABLED
 * Feature flag to toggle status monitoring UI elements.
 */
export const STATUS_MONITORING_ENABLED =
  String(getEnv("REACT_APP_STATUS_MONITORING_ENABLED", "true")).toLowerCase() !== "false";

/**
 * PUBLIC_INTERFACE
 * apiFetch
 * Wrapper around fetch with JSON parsing, error mapping, and base URL.
 */
export async function apiFetch(path, options = {}) {
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  let response;
  try {
    response = await fetch(url, { ...options, headers });
  } catch (networkError) {
    const err = {
      error_code: "NETWORK_ERROR",
      message: "Network error occurred while contacting the server.",
      details: String(networkError),
      status: 0,
    };
    throw err;
  }

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await response.json().catch(() => ({})) : await response.text();

  if (!response.ok) {
    // Try to align with OpenAPI Error schema
    const error = {
      error_code: (data && data.error_code) || `HTTP_${response.status}`,
      message: (data && data.message) || response.statusText || "Request failed",
      details: (data && data.details) || undefined,
      status: response.status,
    };
    throw error;
  }

  return data;
}
