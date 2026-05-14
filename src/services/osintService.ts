import axios from "axios";
import { UsernameScanResult, IPInfo, DNSRecord, WhoisResult } from "../types";

export const getApiBaseUrl = () => {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  console.log("DEBUG: API Origin:", origin);
  return origin;
};

export const scanUsername = async (username: string): Promise<UsernameScanResult[]> => {
  const baseUrl = getApiBaseUrl();
  console.log("DEBUG: Calling:", `${baseUrl}/api/osint/username`);
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
