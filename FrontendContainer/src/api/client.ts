const DEFAULT_BASE = "https://kavia-alb-839dd777-683819550.backend.kavia.app:3001";

function getEnv(name, fallback) {
  // CRA exposes variables prefixed with REACT_APP_
  if (typeof process !== "undefined" && process.env && process.env[name]) {
    return process.env[name];
  }
  return fallback;
}

export const API_BASE_URL = getEnv("REACT_APP_API_BASE_URL", DEFAULT_BASE);
export const STATUS_MONITORING_ENABLED = String(getEnv("REACT_APP_STATUS_MONITORING_ENABLED", "true")).toLowerCase() !== "false";

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
