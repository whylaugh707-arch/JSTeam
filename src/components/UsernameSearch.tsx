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
    const target = username.trim();
    if (!target) return;

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const data = await scanUsername(target);
      setResults(data);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "COMMUNICATION_LINK_FAILURE");
    } finally {
      setLoading(false);
    }
  };

  const hitCount = results.filter((result) => result.exists).length;

  return (
    <div className="space-y-8 sm:space-y-10">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Identity Recon</p>
          <h2>Pemindaian Identitas</h2>
        </div>
        <div className="hidden sm:flex status-pill">
          <ShieldCheck className="size-4" />
          {results.length > 0 ? `${hitCount}/${results.length} hits` : "Ready"}
        </div>
      </div>

      <form onSubmit={handleSearch} className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-0 group">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="IDENTITAS_TARGET..."
          className="tactical-input sm:border-r-0"
        />
        <button type="submit" disabled={loading || !username.trim()} className="tactical-btn sm:w-48 whitespace-nowrap">
          {loading ? <Loader2 className="animate-spin size-5" /> : <Search className="size-5" />}
          EKSEKUSI
        </button>
      </form>

      {error && (
        <div className="alert-panel border-red-500/50 text-red-300">
          <ShieldAlert className="size-5" />
          <span>[ CRITICAL_ERROR: {error} ]</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <AnimatePresence>
          {results.map((result, idx) => (
            <motion.div
              key={result.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.01 }}
              className={`tactical-card compact-card flex items-center justify-between min-w-0 ${
                result.exists ? "border-cyber-red bg-cyber-red/5" : "opacity-45 grayscale"
              }`}
            >
              <div className="flex flex-col gap-1 overflow-hidden flex-1 mr-3">
                <span className="font-mono text-[9px] text-cyber-red uppercase tracking-tighter truncate block">
                  {result.name}
                </span>
                <span className="text-xs font-bold truncate text-white uppercase tracking-widest block">
                  {result.exists ? username.trim() : "____"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {result.exists ? (
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyber-red hover:text-white transition-colors"
                    aria-label={`Open ${result.name}`}
                  >
                    <ExternalLink className="size-4" />
                  </a>
                ) : (
                  <ShieldAlert className="size-4 text-neutral-800" />
                )}
                {result.exists && <ShieldCheck className="size-4 text-cyber-red" />}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {results.length > 0 && (
        <div className="summary-strip">
          <span>RINGKASAN_HASIL: {hitCount} AKTIF // {results.length} DIPERIKSA</span>
          <span className="text-cyber-red/60">JAKARTA_SEC_TEAM // UNIT_INTEL</span>
        </div>
      )}
    </div>
  );
}
