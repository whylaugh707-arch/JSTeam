import React, { useState } from "react";
import { Search, Loader2, Link as LinkIcon, Car, ShieldAlert, ExternalLink } from "lucide-react";
import { motion } from "motion/react";

interface RegionalSamsat {
  name: string;
  url: string;
  desc: string;
}

const REGIONAL_SAMSAT: RegionalSamsat[] = [
  { name: "Samsat Jakarta", url: "https://samsat-pkb.jakarta.go.id/INFO_PKB", desc: "Cek Pajak Kendaraan Bermotor Jakarta" },
  { name: "Samsat Jawa Barat", url: "https://bapenda.jabarprov.go.id/infopkb/", desc: "Cek Pajak Kendaraan Bermotor Jawa Barat" },
  { name: "Samsat Jawa Tengah", url: "https://bapenda.jatengprov.go.id/info-pajak-kendaraan-bermotor/", desc: "Cek Pajak Kendaraan Bermotor Jawa Tengah" },
  { name: "Samsat Jawa Timur", url: "https://info.dipendajatim.go.id/index.php?page=info_pkb", desc: "Cek Pajak Kendaraan Bermotor Jawa Timur" },
  { name: "Samsat Banten", url: "https://infopkb.bantenprov.go.id/", desc: "Cek Pajak Kendaraan Bermotor Banten" },
  { name: "Samsat DI Yogyakarta", url: "https://infonjkp.jogjaprov.go.id/", desc: "Cek Pajak Kendaraan Bermotor Yogyakarta" },
  { name: "Samsat Aceh", url: "https://esamsat.acehprov.go.id/", desc: "Cek Pajak Kendaraan Bermotor Aceh" },
  { name: "Samsat Bali", url: "https://portal.bpdbali.id/infosamsat/", desc: "Cek Pajak Kendaraan Bermotor Bali" }
];

const VehicleSearch: React.FC = () => {
  const [plate, setPlate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plate) return;
    setLoading(true);
    // Emulate a scan process
    setTimeout(() => setLoading(false), 800);
  };

  const getDorkQueries = (p: string) => [
    { label: "Google Public Mention", query: `"${p}" OR "${p.replace(/\s/g, "")}"` },
    { label: "Social Media Search", query: `"${p}" site:facebook.com OR site:instagram.com OR site:twitter.com` },
    { label: "Marketplace Check", query: `"${p}" site:olx.co.id OR site:facebook.com/marketplace` },
    { label: "News/Archive Check", query: `"${p}" site:detik.com OR site:kompas.com OR site:tribunnews.com` }
  ];

  const handleOpenQuery = (query: string) => {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, "_blank");
  };

  return (
    <div className="space-y-8 sm:space-y-12">
      <div className="text-center">
        <h2 className="text-2xl sm:text-4xl font-sans uppercase tracking-[0.2em] sm:tracking-[0.3em] text-white">Pelacakan Plat</h2>
      </div>

      <form onSubmit={handleSearch} className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-0 group">
        <div className="relative flex-1">
          <input
            type="text"
            value={plate}
            onChange={(e) => setPlate(e.target.value.toUpperCase())}
            placeholder="CONTOH: B 1234 ABC..."
            className="tactical-input sm:border-r-0 uppercase"
          />
          <Car className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-cyber-red/20 group-focus-within:text-cyber-red/50 transition-colors" />
        </div>
        <button type="submit" disabled={loading} className="tactical-btn sm:w-48 whitespace-nowrap">
          {loading ? <Loader2 className="animate-spin size-5" /> : <Search className="size-5" />}
          IDENTIFIKASI
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Dorking Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-sans font-bold text-cyber-red flex items-center gap-2 uppercase tracking-widest">
            <ShieldAlert className="size-5" /> Dorking_Engine
          </h3>
          <div className="space-y-2">
            {plate ? (
              getDorkQueries(plate).map((q, i) => (
                <div key={i} className="tactical-card p-4 flex flex-col gap-3 group hover:border-cyber-red/50 transition-all">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-gray-500 uppercase">{q.label}</span>
                    <button 
                      onClick={() => handleOpenQuery(q.query)}
                      className="text-cyber-red hover:text-white flex items-center gap-1 text-[10px] font-bold"
                    >
                      <ExternalLink className="size-3" /> EKSEKUSI
                    </button>
                  </div>
                  <code className="text-xs font-mono text-white/80 break-all bg-black/40 p-2 border border-cyber-border/50">
                    {q.query}
                  </code>
                </div>
              ))
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-cyber-border/30 rounded-lg">
                <p className="text-gray-600 font-mono text-xs uppercase tracking-widest">MASUKKAN_NOMOR_PLAT_UNTUK_GENERASI_OTOMATIS</p>
              </div>
            )}
          </div>
        </div>

        {/* Regional Resources */}
        <div className="space-y-4">
          <h3 className="text-lg font-sans font-bold text-cyber-red flex items-center gap-2 uppercase tracking-widest">
            <LinkIcon className="size-5" /> Sumber_Nasional
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {REGIONAL_SAMSAT.map((s, i) => (
              <a
                key={i}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="tactical-card p-4 flex justify-between items-center hover:bg-cyber-red/5 hover:border-cyber-red transition-all group"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">{s.name}</span>
                  <span className="text-[9px] text-gray-500 uppercase">{s.desc}</span>
                </div>
                <ExternalLink className="size-4 text-cyber-red group-hover:scale-110 transition-transform" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-black/80 border border-cyber-border p-4 font-mono text-[9px] text-gray-600 uppercase tracking-widest flex justify-between items-center">
        <span>CATATAN: BEBERAPA_LAYANAN_MEMERLUKAN_NIK_ATAU_NOMOR_RANGKA</span>
        <span className="text-cyber-red/40">TRAFFIC_INTELLIGENCE // NODE_SEC</span>
      </div>
    </div>
  );
};

export default VehicleSearch;
