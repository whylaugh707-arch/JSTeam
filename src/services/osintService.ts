import axios from "axios";
import { UsernameScanResult, IPInfo, DNSRecord, WhoisResult } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

export const scanUsername = async (username: string): Promise<UsernameScanResult[]> => {
  const response = await axios.post(`${API_BASE_URL}/api/osint/username`, { username });
  return response.data;
};

export const getIPInfo = async (ip: string): Promise<IPInfo> => {
  const response = await axios.get(`${API_BASE_URL}/api/osint/ip/${ip}`);
  return response.data;
};

export const getDNSRecords = async (domain: string): Promise<DNSRecord[]> => {
  const response = await axios.get(`${API_BASE_URL}/api/osint/dns/${domain}`);
  return response.data;
};

export const getWhoisInfo = async (domain: string): Promise<WhoisResult> => {
  const response = await axios.get(`${API_BASE_URL}/api/osint/whois/${domain}`);
  return response.data;
};
