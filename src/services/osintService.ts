import axios from "axios";
import { UsernameScanResult, IPInfo, DNSRecord, WhoisResult } from "../types";

const PRODUCTION_API_URL = "https://ais-pre-faum33tc7svfhqeq3algvf-125749415297.asia-southeast1.run.app";

export const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // If it's a web browser (not capacitor localhost), use the current origin
    if (window.location.origin.startsWith('http')) {
      return window.location.origin;
    }
  }
  // Otherwise, use production URL
  return PRODUCTION_API_URL;
};

export const scanUsername = async (username: string): Promise<UsernameScanResult[]> => {
  const baseUrl = getApiBaseUrl();
  try {
    const response = await axios.post(`${baseUrl}/api/osint/username`, { username });
    return response.data;
  } catch (error: any) {
    console.error("DEBUG: Request failed:", error.message, error.config?.url);
    throw error;
  }
};

export const getIPInfo = async (ip: string): Promise<IPInfo> => {
  const response = await axios.get(`${getApiBaseUrl()}/api/osint/ip/${ip}`);
  return response.data;
};

export const getDNSRecords = async (domain: string): Promise<DNSRecord[]> => {
  const response = await axios.get(`${getApiBaseUrl()}/api/osint/dns/${domain}`);
  return response.data;
};

export const getWhoisInfo = async (domain: string): Promise<WhoisResult> => {
  const response = await axios.get(`${getApiBaseUrl()}/api/osint/whois/${domain}`);
  return response.data;
};
