import axios from "axios";
import { Capacitor } from '@capacitor/core';
import { UsernameScanResult, IPInfo, DNSRecord, WhoisResult } from "../types";

const PRODUCTION_API_URL = "https://ais-pre-faum33tc7svfhqeq3algvf-125749415297.asia-southeast1.run.app";

export const getApiBaseUrl = () => {
  // If running embedded within an iOS/Android physical app, use the fixed production URL
  if (Capacitor.isNativePlatform()) {
    return PRODUCTION_API_URL;
  }
  
  // If running in development or shared workspace on browser, use relative paths
  // to reach the backend that served the site (this natively works for both ais-dev and ais-pre).
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
