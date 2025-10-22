export type DeviceType = "router" | "switch" | "server";
export type DeviceStatus = "online" | "offline" | "unknown";

export interface Device {
  id: string;
  name: string;
  ip_address: string;
  type: DeviceType;
  location: string;
  status?: DeviceStatus;
  last_ping_time?: string; // ISO datetime
}

export interface DeviceInput {
  name: string;
  ip_address: string;
  type: DeviceType;
  location: string;
}

export interface DeviceListResponse {
  devices: Device[];
  total: number;
  page: number;
  page_size: number;
}

export interface PingResult {
  device_id: string;
  status: DeviceStatus;
  response_time_ms?: number;
  timestamp: string;
}

export interface ApiError {
  error_code: string;
  message: string;
  details?: string | Record<string, unknown>;
  status?: number;
}
