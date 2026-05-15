import axios from "axios";
import { Capacitor } from '@capacitor/core';
import { UsernameScanResult, IPInfo, DNSRecord, WhoisResult } from "../types";

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

export const getApiBaseUrl = () => {
  if (configuredApiUrl) {
    return configuredApiUrl.replace(/\/$/, "");
  }

  // Native shells cannot reach the bundled Node backend. Set VITE_API_URL in release builds.
  if (Capacitor.isNativePlatform()) {
    return "https://jsteam-production-8f09.up.railway.app";
  }

  return ""; 
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
  const response = await axios.get(`${getApiBaseUrl()}/api/osint/ip/${encodeURIComponent(ip)}`);
  return response.data;
};

export const getDNSRecords = async (domain: string): Promise<DNSRecord[]> => {
  const response = await axios.get(`${getApiBaseUrl()}/api/osint/dns/${encodeURIComponent(domain)}`);
  return response.data;
};

export const getWhoisInfo = async (domain: string): Promise<WhoisResult> => {
  const response = await axios.get(`${getApiBaseUrl()}/api/osint/whois/${encodeURIComponent(domain)}`);
  return response.data;
};
