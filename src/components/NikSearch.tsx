import React, { useState } from "react";
import { Search, Loader2, Fingerprint, ShieldAlert, MapPin, Calendar, User, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface NikData {
  province: string;
  city: string;
  district: string;
  dob: string;
  gender: string;
  age: number;
  isValid: boolean;
}

const PROVINCES: { [key: string]: string } = {
  "11": "ACEH", "12": "SUMATERA UTARA", "13": "SUMATERA BARAT", "14": "RIAU", "15": "JAMBI",
  "16": "SUMATERA SELATAN", "17": "BENGKULU", "18": "LAMPUNG", "19": "KEPULAUAN BANGKA BELITUNG",
  "21": "KEPULAUAN RIAU", "31": "DKI JAKARTA", "32": "JAWA BARAT", "33": "JAWA TENGAH",
  "34": "DI YOGYAKARTA", "35": "JAWA TIMUR", "36": "BANTEN", "51": "BALI", "52": "NUSA TENGGARA BARAT",
  "53": "NUSA TENGGARA TIMUR", "61": "KALIMANTAN BARAT", "62": "KALIMANTAN TENGAH",
  "63": "KALIMANTAN SELATAN", "64": "KALIMANTAN TIMUR", "65": "KALIMANTAN UTARA",
  "71": "SULAWESI UTARA", "72": "SULAWESI TENGAH", "73": "SULAWESI SELATAN", "74": "SULAWESI TENGGARA",
  "75": "GORONTALO", "76": "SULAWESI BARAT", "81": "MALUKU", "82": "MALUKU UTARA",
  "91": "PAPUA BARAT", "94": "PAPUA"
};

const NikSearch: React.FC = () => {
  const [nik, setNik] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NikData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchRegionNames = async (provCode: string, cityCodeStr: string, distCodeStr: string) => {
    try {
      const fullCityCode = provCode + cityCodeStr;
      const fullDistCode = provCode + cityCodeStr + distCodeStr;

      // Fetch Regencies for the Province
      const regResponse = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provCode}.json`);
      const regencies = await regResponse.json();
      const city = regencies.find((r: any) => r.id === fullCityCode);

      // Fetch Districts for the Regency
      const distResponse = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${fullCityCode}.json`);
      const districts = await distResponse.json();
      const district = districts.find((d: any) => d.id === fullDistCode);

      return {
        cityName: city ? city.name : `KAB/KOTA [${cityCodeStr}]`,
        distName: district ? district.name : `KECAMATAN [${distCodeStr}]`
      };
    } catch (e) {
      console.error("Failed to fetch region names:", e);
      return {
        cityName: `KAB/KOTA [${cityCodeStr}]`,
        distName: `KECAMATAN [${distCodeStr}]`
      };
    }
  };

  const analyzeNik = async (input: string) => {
    setError(null);
    if (input.length !== 16) {
      setError("NIK HARUS 16 DIGIT");
      setLoading(false);
      return;
    }

    try {
      const provCode = input.substring(0, 2);
      const cityCodeStr = input.substring(2, 4);
      const distCodeStr = input.substring(4, 6);
      let day = parseInt(input.substring(6, 8));
      const month = input.substring(8, 10);
      let year = parseInt(input.substring(10, 12));
      
      const gender = day > 40 ? "PEREMPUAN" : "LAKI-LAKI";
      if (day > 40) day -= 40;

      const currentYear = new Date().getFullYear() % 100;
      const fullYear = year <= currentYear ? 2000 + year : 1900 + year;
      
      const birthDate = new Date(`${fullYear}-${month}-${day}`);
      const age = new Date().getFullYear() - fullYear;

      const regionNames = await fetchRegionNames(provCode, cityCodeStr, distCodeStr);

      setResult({
        province: PROVINCES[provCode] || "TIDAK DIKENAL",
        city: regionNames.cityName,
        district: regionNames.distName,
        dob: birthDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        gender,
        age,
        isValid: true
      });
    } catch (e) {
      setError("FORMAT NIK TIDAK VALID");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    analyzeNik(nik);
  };

  return (
    <div className="space-y-6 sm:space-y-12">
      <div className="text-center">
        <h2 className="text-2xl sm:text-4xl font-sans uppercase tracking-[0.2em] sm:tracking-[0.3em] text-white">NIK Analyzer</h2>
        <p className="text-[10px] text-gray-500 mt-2 font-mono uppercase tracking-widest">Digital Identity Extraction Engine</p>
      </div>

      <form onSubmit={handleSearch} className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-0 group px-4 sm:px-0">
        <div className="relative flex-1">
          <input
            type="text"
            maxLength={16}
            value={nik}
            onChange={(e) => setNik(e.target.value.replace(/\D/g, ""))}
            placeholder="MASUKKAN 16 DIGIT NIK..."
            className="tactical-input sm:border-r-0"
          />
          <Fingerprint className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-cyber-red/20 group-focus-within:text-cyber-red/50 transition-colors" />
        </div>
        <button type="submit" disabled={loading || nik.length !== 16} className="tactical-btn sm:w-48 whitespace-nowrap">
          {loading ? <Loader2 className="animate-spin size-5" /> : <Search className="size-5" />}
          EKSTRAKSI
        </button>
      </form>

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto p-4 bg-cyber-red/10 border border-cyber-red text-cyber-red text-center font-mono text-xs uppercase">
            {error}
          </motion.div>
        )}

        {result && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
          >
            {/* Identity Card */}
            <div className="tactical-card p-6 space-y-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-2 opacity-10">
                  <Fingerprint className="size-24 text-cyber-red" />
               </div>
               
               <div className="flex items-center gap-4 border-b border-cyber-border pb-4">
                  <div className={`p-3 rounded-full ${result.gender === 'LAKI-LAKI' ? 'bg-blue-500/20 text-blue-500' : 'bg-pink-500/20 text-pink-500'}`}>
                    <User className="size-6" />
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 font-mono uppercase">Jenis_Kelamin</div>
                    <div className="text-white font-bold tracking-widest">{result.gender}</div>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono uppercase">
                      <Calendar className="size-3" /> Tgl_Lahir
                    </div>
                    <div className="text-white text-sm font-bold uppercase">{result.dob}</div>
                  </div>
                  <div className="space-y-1 text-right">
                    <div className="text-[10px] text-gray-500 font-mono uppercase">Estimasi_Usia</div>
                    <div className="text-white text-sm font-bold uppercase">{result.age} TAHUN</div>
                  </div>
               </div>
            </div>

            {/* Region Card */}
            <div className="tactical-card p-6 space-y-4">
               <h3 className="text-xs font-bold text-cyber-red flex items-center gap-2 uppercase tracking-widest">
                 <MapPin className="size-4" /> Yurisdiksi_Wilayah
               </h3>
               
               <div className="space-y-4 font-mono">
                  <div className="bg-black/30 p-3 border border-cyber-border/50">
                    <div className="text-[8px] text-gray-600 uppercase">Provinsi</div>
                    <div className="text-xs text-white uppercase">{result.province}</div>
                  </div>
                  <div className="bg-black/30 p-3 border border-cyber-border/50">
                    <div className="text-[8px] text-gray-600 uppercase">Kabupaten / Kota</div>
                    <div className="text-xs text-white uppercase">{result.city}</div>
                  </div>
                  <div className="bg-black/30 p-3 border border-cyber-border/50">
                    <div className="text-[8px] text-gray-600 uppercase">Kecamatan</div>
                    <div className="text-xs text-white uppercase">{result.district}</div>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto tactical-card p-4 bg-yellow-500/5 border-yellow-500/30 flex gap-4 items-start sm:translate-y-8">
        <Info className="size-5 text-yellow-500 shrink-0 mt-1" />
        <div className="space-y-1">
          <p className="text-[10px] text-yellow-500/80 font-mono uppercase font-bold leading-tight">
            DISCLAIMER: ANALISIS INI HANYA BERDASARKAN DEKODE FORMULA MATEMATIS NIK. SISTEM TIDAK MENGAKSES DATABASE DUKCAPIL ATAU MENYIMPAN DATA PRIBADI. 
            HASIL MUNGKIN BERBEDA JIKA KODE WILAYAH TELAH BERUBAH.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NikSearch;
