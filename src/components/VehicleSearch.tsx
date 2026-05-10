import React, { useState } from "react";
import { Search, Loader2, Link as LinkIcon, Car, ShieldAlert, ExternalLink } from "lucide-react";
import { motion } from "motion/react";

interface RegionalSamsat {
  name: string;
  url: string;
  desc: string;
}

const REGIONAL_SAMSAT: RegionalSamsat[] = [
  { name: "Samsat Jakarta", url: "https://samsat-pkb.jakarta.go.id/INFO_PKB", desc: "Digital Korlantas / Info PKB DKI Jakarta" },
  { name: "Samsat Jawa Barat", url: "https://bapenda.jabarprov.go.id/infopkb/", desc: "Sambara - Samsat Mobile Jawa Barat" },
  { name: "Samsat Jawa Tengah", url: "https://bapenda.jatengprov.go.id/info-pajak-kendaraan-bermotor/", desc: "New Sakpole - Samsat Jawa Tengah" },
  { name: "Samsat Jawa Timur", url: "https://info.dipendajatim.go.id/index.php?page=info_pkb", desc: "E-Samsat Jatim - Jawa Timur" },
  { name: "Samsat Banten", url: "https://infopkb.bantenprov.go.id/", desc: "Sambat - Samsat Banten" },
  { name: "Samsat DI Yogyakarta", url: "https://infonjkp.jogjaprov.go.id/", desc: "Infopkb DIY" },
  { name: "Samsat Aceh", url: "https://esamsat.acehprov.go.id/", desc: "E-Samsat Aceh" },
  { name: "Samsat Bali", url: "https://portal.bpdbali.id/infosamsat/", desc: "Samsat Bali Mobile" }
];

const PLATE_PREFIXES: { [key: string]: string } = {
  "B": "DKI Jakarta, Tangerang, Bekasi, Depok",
  "A": "Banten (Serang, Pandeglang, Lebak)",
  "D": "Jawa Barat (Bandung, Cimahi)",
  "F": "Jawa Barat (Bogor, Sukabumi, Cianjur)",
  "E": "Jawa Barat (Cirebon, Indramayu, Majalengka, Kuningan)",
  "Z": "Jawa Barat (Sumedang, Garut, Tasikmalaya, Ciamis, Banjar)",
  "T": "Jawa Barat (Purwakarta, Karawang, Subang)",
  "H": "Jawa Tengah (Semarang, Salatiga, Kendal, Demak)",
  "K": "Jawa Tengah (Pati, Kudus, Jepara, Rembang, Blora)",
  "AA": "Jawa Tengah (Magelang, Purworejo, Temanggung, Kebumen, Wonosobo)",
  "AD": "Jawa Tengah (Surakarta (Solo), Sukoharjo, Boyolali, Karanganyar, Sragen, Wonogiri, Klaten)",
  "AB": "DI Yogyakarta",
  "L": "Jawa Timur (Surabaya)",
  "W": "Jawa Timur (Sidoarjo, Gresik)",
  "N": "Jawa Timur (Malang, Probolinggo, Pasuruan, Lumajang, Batu)",
  "P": "Jawa Timur (Besuki, Bondowoso, Situbondo, Jember, Banyuwangi)",
  "AG": "Jawa Timur (Kediri, Blitar, Tulungagung, Nganjuk, Trenggalek)",
  "AE": "Jawa Timur (Madiun, Ngawi, Magetan, Ponorogo, Pacitan)",
  "S": "Jawa Timur (Bojonegoro, Tuban, Lamongan, Jombang, Mojokerto)",
  "M": "Jawa Timur (Madura)",
  "DK": "Bali",
  "DR": "Nusa Tenggara Barat (Lombok)",
  "EA": "Nusa Tenggara Barat (Sumbawa)",
  "DH": "Nusa Tenggara Timur (Timor)",
  "EB": "Nusa Tenggara Timur (Flores)",
  "KB": "Kalimantan Barat",
  "DA": "Kalimantan Selatan",
  "KH": "Kalimantan Tengah",
  "KT": "Kalimantan Timur",
  "KU": "Kalimantan Utara",
  "BL": "Aceh",
  "BB": "Sumatera Utara (Pantai Barat)",
  "BK": "Sumatera Utara (Pantai Timur)",
  "BA": "Sumatera Barat",
  "BM": "Riau",
  "BH": "Jambi",
  "BD": "Bengkulu",
  "BP": "Kepulauan Riau",
  "BG": "Sumatera Selatan",
  "BE": "Lampung",
  "BN": "Bangka Belitung"
};

const VehicleSearch: React.FC = () => {
  const [plate, setPlate] = useState("");
  const [loading, setLoading] = useState(false);
  const [identifiedRegion, setIdentifiedRegion] = useState<string | null>(null);

  const analyzePrefix = (input: string) => {
    const parts = input.trim().split(/\s+/);
    if (!parts[0]) {
      setIdentifiedRegion(null);
      return;
    }
    const prefix = parts[0].toUpperCase();
    setIdentifiedRegion(PLATE_PREFIXES[prefix] || "Wilayah tidak dikenali");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plate) return;
    setLoading(true);
    analyzePrefix(plate);
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
            onChange={(e) => {
              setPlate(e.target.value.toUpperCase());
              analyzePrefix(e.target.value);
            }}
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

      {identifiedRegion && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto p-4 bg-cyber-red/5 border-l-4 border-cyber-red flex items-center gap-4"
        >
          <div className="size-10 bg-cyber-red/10 flex items-center justify-center text-cyber-red font-black text-xl">
            {plate.split(/\s+/)[0]}
          </div>
          <div>
            <div className="text-[10px] text-cyber-red font-mono uppercase tracking-[0.2em]">Wilayah_Terdeteksi</div>
            <div className="text-white font-bold uppercase tracking-wider">{identifiedRegion}</div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Dorking Section */}
        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-sans font-bold text-cyber-red flex items-center gap-2 uppercase tracking-widest leading-none">
              <ShieldAlert className="size-5" /> Digital_Footprint
            </h3>
            <p className="text-[9px] text-gray-500 uppercase font-mono tracking-tighter">Mencari jejak plat di ruang publik (Berita, Marketplace, Sosmed)</p>
          </div>
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
