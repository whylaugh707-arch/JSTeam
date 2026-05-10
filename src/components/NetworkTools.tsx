import React, { useState } from "react";
import { getDNSRecords, getWhoisInfo } from "../services/osintService";
import { DNSRecord, WhoisResult } from "../types";
import { Database, Loader2, Search, Zap } from "lucide-react";
import { motion } from "motion/react";

export default function NetworkTools() {
  const [domain, setDomain] = useState("");
  const [dnsResults, setDnsResults] = useState<DNSRecord[]>([]);
  const [whoisResults, setWhoisResults] = useState<WhoisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain) return;

    setLoading(true);
    setError("");
    setDnsResults([]);
    setWhoisResults(null);

    try {
      // Split calls to avoid one failure blocking the other
      const [dnsData, whoisData] = await Promise.allSettled([
        getDNSRecords(domain),
        getWhoisInfo(domain)
      ]);

      if (dnsData.status === 'fulfilled') {
        setDnsResults(dnsData.value);
      } else {
        console.error("DNS Error:", dnsData.reason);
      }

      if (whoisData.status === 'fulfilled') {
        setWhoisResults(whoisData.value);
      } else {
        console.error("Whois Error:", whoisData.reason);
      }

      if (dnsData.status === 'rejected' && whoisData.status === 'rejected') {
        setError("CORE_INFRA_UNREACHABLE: PROBE_TIMEOUT_OR_DNS_SEC_VIOLATION");
      }
    } catch (err) {
      setError("CORE_INFRA_UNREACHABLE: PROBE_TIMEOUT_OR_DNS_SEC_VIOLATION");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h2 className="text-4xl font-sans uppercase tracking-[0.3em] text-white">Arsitektur Root</h2>
      </div>

      <form onSubmit={handleSearch} className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-0">
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="DOMAIN_TARGET..."
          className="tactical-input sm:border-r-0"
        />
        <button type="submit" disabled={loading} className="tactical-btn sm:w-48">
          {loading ? <Loader2 className="animate-spin size-5" /> : <Search className="size-5" />}
          PROBE
        </button>
      </form>

      {error && (
        <div className="text-red-500 font-mono text-center bg-red-500/5 border-l-2 border-red-500 p-4">
          [ {error} ]
        </div>
      )}

      {(dnsResults.length > 0 || whoisResults) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* DNS SECTION */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="tactical-card space-y-6"
          >
            <h3 className="flex items-center gap-3 text-white font-sans text-xl uppercase tracking-widest">
              <Zap className="size-5 text-cyber-red" /> DNS_STACK
            </h3>
            <div className="space-y-3 font-mono text-[10px]">
              {dnsResults.map((record, i) => (
                <div key={i} className="bg-black/50 p-3 border border-cyber-border flex gap-4 transition-colors hover:border-cyber-red/40">
                  <span className="text-cyber-red font-bold w-12 shrink-0">{record.type}</span>
                  <span className="text-gray-400 break-all">{record.value || record.address || record.exchange || "NULL"}</span>
                </div>
              ))}
              {dnsResults.length === 0 && <p className="text-gray-700 italic">Tidak ada rekaman yang ditetapkan.</p>}
            </div>
          </motion.div>

          {/* WHOIS SECTION */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="tactical-card space-y-6"
          >
            <h3 className="flex items-center gap-3 text-white font-sans text-xl uppercase tracking-widest">
              <Database className="size-5 text-cyber-red" /> DATA_PENDAFTAR
            </h3>
            <div className="max-h-[500px] overflow-y-auto pr-2 space-y-2 font-mono text-[10px]">
              {whoisResults ? (
                Object.entries(whoisResults).map(([key, value]) => {
                  if (typeof value === 'object' || Array.isArray(value)) return null;
                  return (
                    <div key={key} className="flex flex-col border-b border-cyber-border pb-2 bg-black/20 p-2 gap-1 overflow-hidden">
                      <span className="text-cyber-red/40 uppercase text-[8px] tracking-[0.2em]">{key}</span>
                      <span className="text-white break-all leading-tight">{String(value)}</span>
                    </div>
                  )
                })
              ) : (
                <p className="text-gray-700 italic font-mono uppercase text-[9px]">Menganalisis log RDAP pendaftar...</p>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
