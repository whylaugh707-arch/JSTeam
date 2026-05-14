import axios from "axios";
import { UsernameScanResult, IPInfo, DNSRecord, WhoisResult } from "../types";

const PRODUCTION_API_URL = "https://ais-dev-faum33tc7svfhqeq3algvf-125749415297.asia-southeast1.run.app";

export const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // If running in a browser, use the current origin
    if (window.location.protocol.startsWith('http')) {
      return window.location.origin;
    }
  }
  // Fallback to production URL if not available in window
  return PRODUCTION_API_URL;
};

export const scanUsername = async (username: string): Promise<UsernameScanResult[]> => {
  const baseUrl = getApiBaseUrl();
  try {
    const response = await axios.post(`${baseUrl}/api/osint/username`, { username });
    return response.data;
  } catch (error: any) {
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
