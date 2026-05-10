import React, { useState } from "react";
import { scanUsername } from "../services/osintService";
import { UsernameScanResult } from "../types";
import { Search, Loader2, ExternalLink, ShieldCheck, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function UsernameSearch() {
  const [username, setUsername] = useState("");
  const [results, setResults] = useState<UsernameScanResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const data = await scanUsername(username);
      setResults(data);
    } catch (err: any) {
      setError(err.response?.data?.error || "COMMUNICATION_LINK_FAILURE: ATTEMPTING_RECONNECT");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-sans uppercase tracking-[0.3em] text-white">Pemindaian Identitas</h2>
        <p className="text-cyber-blue font-mono text-[10px] tracking-[0.5em]">[ OSINT_MULTI_PLATFORM_V3 ]</p>
      </div>

      <form onSubmit={handleSearch} className="max-w-3xl mx-auto flex gap-0">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="IDENTITAS_TARGET..."
          className="tactical-input"
        />
        <button type="submit" disabled={loading} className="tactical-btn shrink-0">
          {loading ? <Loader2 className="animate-spin size-5" /> : <Search className="size-5" />}
          EKSEKUSI
        </button>
      </form>

      {error && (
        <div className="text-red-500 font-mono text-center bg-red-500/5 border-l-2 border-red-500 p-4">
          [ CRITICAL_ERROR: {error} ]
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        <AnimatePresence>
          {results.map((result, idx) => (
            <motion.div
              key={result.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.01 }}
              className={`tactical-card flex items-center justify-between p-4 min-w-0 ${
                result.exists ? "border-cyber-blue bg-cyber-blue/5" : "opacity-30 grayscale"
              }`}
            >
              <div className="flex flex-col gap-1 overflow-hidden flex-1 mr-3">
                <span className="font-mono text-[9px] text-cyber-blue uppercase tracking-tighter truncate block">
                  {result.name}
                </span>
                <span className="text-xs font-bold truncate text-white uppercase tracking-widest block">
                  {result.exists ? username : "____"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {result.exists ? (
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyber-blue hover:text-white transition-colors"
                  >
                    <ExternalLink className="size-4" />
                  </a>
                ) : (
                  <ShieldAlert className="size-4 text-slate-800" />
                )}
                {result.exists && <ShieldCheck className="size-4 text-cyber-blue" />}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {results.length > 0 && (
        <div className="bg-black/80 border border-cyber-border p-4 font-mono text-[9px] text-gray-600 uppercase tracking-widest flex justify-between items-center">
          <span>RINGKASAN_HASIL: {results.filter(r => r.exists).length} AKTIF // {results.length} DIPERIKSA</span>
          <span className="text-cyber-blue/40">JAKARTA_SEC_TEAM // UNIT_INTEL</span>
        </div>
      )}
    </div>
  );
}
