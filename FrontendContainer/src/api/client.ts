const DEFAULT_BASE = "https://kavia-alb-699c693e-2016998426.backend.kavia.app/";

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
 * Normalize a base URL by removing any trailing slash.
 */
function normalizeBase(base) {
  if (!base) return "";
  return String(base).replace(/\/+$/, "");
}

/**
 * Ensure path starts with a single leading slash.
 */
function normalizePath(path) {
  if (!path) return "/";
  return `/${String(path).replace(/^\/+/, "")}`;
}

/**
 * PUBLIC_INTERFACE
 * joinUrl
 * Robustly join base URL and path using the URL constructor,
 * ensuring there is exactly one slash between them.
 */
export function joinUrl(base, path) {
  const b = normalizeBase(base);
  const p = normalizePath(path);
  try {
    // URL handles edge cases like query strings and absolute paths
    return new URL(p, b).toString();
  } catch {
    // Fallback join if URL constructor fails for some reason
    return `${b}${p}`;
  }
}

/**
 * PUBLIC_INTERFACE
 * API_BASE_URL
 * Single source of truth for backend base URL.
 * Reads from REACT_APP_API_BASE_URL with a fallback to the provided default.
 * Any trailing slash is trimmed to avoid double slashes on joins.
 */
export const API_BASE_URL = normalizeBase(getEnv("REACT_APP_API_BASE_URL", DEFAULT_BASE));

/**
 * Export a convenience BASE object when using the native URL API.
 */
export const BASE = API_BASE_URL;

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
 * Always uses joinUrl to avoid double slashes and malformed URLs.
 */
export async function apiFetch(path, options = {}) {
  const url = (() => {
    const str = String(path || "");
    if (str.startsWith("http://") || str.startsWith("https://")) return str;
    return joinUrl(API_BASE_URL, str);
  })();

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
