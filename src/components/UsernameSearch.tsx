import React, { useState } from "react";
import { scanUsername } from "../services/osintService";
import { UsernameScanResult } from "../types";
import { Search, Loader2, ExternalLink, ShieldCheck, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

export default function UsernameSearch() {
  const [username, setUsername] = useState("");
  const [results, setResults] = useState<UsernameScanResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [trollMode, setTrollMode] = useState(false);

  const BANNED_TARGETS = [
    'fryzzie', 'izie', 'jeexmiekko', 'whylaugh404', 'whylaugh707', 'm. fryzzie al ashafani'
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;

    const lowerTarget = username.toLowerCase();
    if (BANNED_TARGETS.some(t => lowerTarget.includes(t))) {
      setTrollMode(true);
      return;
    }

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
    <div className={cn("space-y-8 sm:space-y-12 transition-all duration-500", trollMode && "rotate-12 scale-50 blur-sm pointer-events-none")}>
      <div className="text-center">
        <h2 className="text-2xl sm:text-4xl font-sans uppercase tracking-[0.2em] sm:tracking-[0.3em] text-white">
          {trollMode ? "SYSTEM_REJECTED_TRASH" : "Pemindaian Identitas"}
        </h2>
      </div>

      <AnimatePresence>
        {trollMode && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md pointer-events-auto"
          >
            <div className="max-w-md w-full bg-cyber-red/10 border-2 border-cyber-red p-8 space-y-6 text-center shadow-[0_0_50px_rgba(239,68,68,0.5)]">
              <ShieldAlert className="size-20 text-cyber-red mx-auto animate-bounce" />
              <h1 className="text-2xl sm:text-3xl font-sans font-black text-white italic tracking-tighter">WHO THE F*CK DO YOU THINK YOU ARE?</h1>
              <div className="space-y-4 font-mono text-xs sm:text-sm text-cyber-red uppercase leading-tight font-bold">
                <p>"Searching for this absolute failure? This person is a living joke, a digital stain that doesn't even deserve an OSINT trace."</p>
                <p>DO NOT WASTE OUR INFRASTRUCTURE ON THIS GARBAGE. GET A LIFE, YOU PATHETIC LOW-LIFE SCRIPTER.</p>
                <p className="text-[10px] text-white/50 opacity-30 mt-8">ERROR_CODE: EGO_TOO_SMALL_TO_BE_FOUND</p>
              </div>
              <button 
                onClick={() => window.location.reload()}
                className="w-full py-4 bg-cyber-red text-black font-black uppercase tracking-[0.5em] hover:bg-white transition-colors"
              >
                TERMINATE_SELF
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSearch} className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-0 group">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="IDENTITAS_TARGET..."
          className="tactical-input sm:border-r-0"
        />
        <button type="submit" disabled={loading} className="tactical-btn sm:w-48 whitespace-nowrap">
          {loading ? <Loader2 className="animate-spin size-5" /> : <Search className="size-5" />}
          EKSEKUSI
        </button>
      </form>

      {error && (
        <div className="text-red-500 font-mono text-center bg-red-500/5 border-l-2 border-red-500 p-4">
          [ CRITICAL_ERROR: {error} ]
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <AnimatePresence>
          {results.map((result, idx) => (
            <motion.div
              key={result.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.01 }}
              className={`tactical-card flex items-center justify-between p-4 min-w-0 ${
                result.exists ? "border-cyber-red bg-cyber-red/5" : "opacity-30 grayscale"
              }`}
            >
              <div className="flex flex-col gap-1 overflow-hidden flex-1 mr-3">
                <span className="font-mono text-[9px] text-cyber-red uppercase tracking-tighter truncate block">
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
                    className="text-cyber-red hover:text-white transition-colors"
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
        <div className="bg-black/80 border border-cyber-border p-4 font-mono text-[9px] text-gray-600 uppercase tracking-widest flex flex-col sm:flex-row justify-between items-center gap-4">
          <span>RINGKASAN_HASIL: {results.filter(r => r.exists).length} AKTIF // {results.length} DIPERIKSA</span>
          <span className="text-cyber-red/40">JAKARTA_SEC_TEAM // UNIT_INTEL</span>
        </div>
      )}
    </div>
  );
}
