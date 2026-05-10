import React, { useState } from "react";
import { getIPInfo } from "../services/osintService";
import { IPInfo } from "../types";
import { Globe, MapPin, Server, Search, Loader2 } from "lucide-react";
import { motion } from "motion/react";

export default function IPSearch() {
  const [ip, setIp] = useState("");
  const [results, setResults] = useState<IPInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ip) return;

    setLoading(true);
    setError("");
    setResults(null);

    try {
      const data = await getIPInfo(ip);
      setResults(data);
    } catch (err: any) {
      setError(err.response?.data?.error || "NODE_RESOLUTION_FAILED: TARGET_IP_OUT_OF_SCOPE_OR_INVALID");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-sans uppercase tracking-[0.3em] text-white">Intel Geografis</h2>
        <p className="text-cyber-blue font-mono text-[10px] tracking-[0.5em]">[ PELACAKAN_GEOLOKASI_JARINGAN ]</p>
      </div>

      <form onSubmit={handleSearch} className="max-w-3xl mx-auto flex gap-0">
        <input
          type="text"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          placeholder="ALAMAT_IP_TARGET..."
          className="tactical-input"
        />
        <button type="submit" disabled={loading} className="tactical-btn">
          {loading ? <Loader2 className="animate-spin size-5" /> : <Search className="size-5" />}
          RESOLUSI
        </button>
      </form>

      {error && (
        <div className="text-red-500 font-mono text-center bg-red-500/5 border-l-2 border-red-500 p-4">
          [ {error} ]
        </div>
      )}

      {results && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto"
        >
          <div className="tactical-card space-y-6">
            <h3 className="flex items-center gap-3 text-white font-sans text-xl tracking-wider">
              <Globe className="size-5 text-cyber-blue" /> LOG_LOKASI
            </h3>
            <div className="space-y-4 font-mono text-xs text-gray-400">
              <div className="flex justify-between border-b border-cyber-border pb-2 gap-4">
                <span className="shrink-0">KOTA:</span>
                <span className="text-white uppercase tracking-widest text-right break-words">{results.city || "TIDAK_DIKETAHUI"}</span>
              </div>
              <div className="flex justify-between border-b border-cyber-border pb-2 gap-4">
                <span className="shrink-0">WILAYAH:</span>
                <span className="text-white uppercase tracking-widest text-right break-words">{results.region || "TIDAK_DIKETAHUI"}</span>
              </div>
              <div className="flex justify-between border-b border-cyber-border pb-2 gap-4">
                <span className="shrink-0">NEGARA:</span>
                <span className="text-white uppercase tracking-widest text-right break-words">{results.country_name || "TIDAK_DIKETAHUI"}</span>
              </div>
              <div className="flex justify-between border-b border-cyber-border pb-2 gap-4">
                <span className="shrink-0">ZONA_WAKTU:</span>
                <span className="text-white text-right break-all">{results.timezone || "TIDAK_DIKETAHUI"}</span>
              </div>
            </div>
          </div>

          <div className="tactical-card space-y-6">
            <h3 className="flex items-center gap-3 text-white font-sans text-xl tracking-wider">
              <Server className="size-5 text-cyber-blue" /> LOG_INFRASTRUKTUR
            </h3>
            <div className="space-y-4 font-mono text-xs text-gray-400">
              <div className="flex justify-between border-b border-cyber-border pb-2 gap-4">
                <span className="shrink-0">ISP:</span>
                <span className="text-white break-all text-right uppercase font-bold">{results.org || "____"}</span>
              </div>
              <div className="flex justify-between border-b border-cyber-border pb-2 gap-4">
                <span className="shrink-0">LINTANG:</span>
                <span className="text-white tabular-nums">{results.latitude || "____"}</span>
              </div>
              <div className="flex justify-between border-b border-cyber-border pb-2 gap-4">
                <span className="shrink-0">BUJUR:</span>
                <span className="text-white tabular-nums">{results.longitude || "____"}</span>
              </div>
              <div className="flex justify-between border-b border-cyber-border pb-2 gap-4">
                <span className="shrink-0">KODE_POS:</span>
                <span className="text-white tabular-nums">{results.postal || "____"}</span>
              </div>
            </div>
          </div>

          {results.latitude && results.longitude && (
            <div className="md:col-span-2 tactical-card bg-slate-950 h-48 flex items-center justify-center border-dashed group">
               <div className="text-center space-y-4 relative z-10 transition-transform group-hover:scale-105">
                  <MapPin className="size-10 mx-auto text-cyber-blue animate-pulse" />
                  <a 
                      href={`https://www.google.com/maps?q=${results.latitude},${results.longitude}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="tactical-btn py-2 text-[9px]"
                    >
                      TAUTAN_KOORDINAT_SATELIT [EKSTERNAL]
                  </a>
               </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
