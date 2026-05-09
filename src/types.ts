export interface UsernameScanResult {
  name: string;
  url: string;
  exists: boolean;
}

export interface IPInfo {
  ip: string;
  city: string;
  region: string;
  country_name: string;
  latitude: number;
  longitude: number;
  org: string;
  timezone: string;
  [key: string]: any;
}

export interface DNSRecord {
  type: string;
  value?: string;
  address?: string;
  exchange?: string;
  priority?: number;
  [key: string]: any;
}

export interface WhoisResult {
  [key: string]: any;
}
