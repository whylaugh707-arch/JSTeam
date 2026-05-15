import React, { useState } from 'react';
import { Mail, Search, AlertTriangle, Fingerprint, RefreshCw, Key, Shield, Link as LinkIcon, Download } from 'lucide-react';
import { motion } from 'motion/react';
import axios from 'axios';
import { getApiBaseUrl } from '../services/osintService';

interface BreachData {
  Name: string;
  Title: string;
  Domain: string;
  BreachDate: string;
  PwnCount: number;
  Description: string;
  DataClasses: string[];
  IsVerified: boolean;
}

export default function EmailSearch() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [breaches, setBreaches] = useState<string[]>([]);
  const [gravatar, setGravatar] = useState<any>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');
    setBreaches([]);
    setGravatar(null);
    setHasSearched(false);

    try {
      const response = await axios.get(`${getApiBaseUrl()}/api/osint/email/${encodeURIComponent(email.trim())}`);
      
      if (response.data) {
        if (response.data.breaches) {
          // Flatten the breaches array from the API format
          const flatBreaches = Array.isArray(response.data.breaches) ? response.data.breaches.flat() : [];
          setBreaches(flatBreaches);
        }
        if (response.data.gravatar) {
          setGravatar(response.data.gravatar);
        }
      }
      setHasSearched(true);
    } catch (err: any) {
      if (err.response?.status === 404) {
         setBreaches([]);
         setHasSearched(true);
      } else {
         setError(err.response?.data?.error || 'Gagal terhubung ke database. Silakan coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Breach + Identity Signals</p>
          <h2 className="flex items-center gap-3">
            <Mail className="size-6 text-cyber-red" />
            Pelacakan Email
          </h2>
        </div>
        <div className="hidden sm:flex status-pill">XposedOrNot + Gravatar</div>
      </div>

      <div className="bg-black/50 border border-cyber-border p-6 mt-8">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-cyber-red/50" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukan Email Target (contoh: user@gmail.com)"
              className="w-full bg-black/50 border-cyber-border border pl-12 pr-4 py-4 font-mono text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyber-red transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !email}
            className="flex items-center justify-center gap-3 bg-cyber-red/10 border border-cyber-red/50 text-cyber-red px-8 py-4 font-mono text-sm uppercase tracking-widest hover:bg-cyber-red hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed group w-full sm:w-auto shrink-0"
          >
            {loading ? (
              <RefreshCw className="size-5 animate-spin" />
            ) : (
              <Search className="size-5 group-hover:scale-110 transition-transform" />
            )}
            {loading ? 'MEMPROSES...' : 'LACAK EMAIL'}
          </button>
        </form>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/50 p-4 text-red-500 font-mono text-sm flex items-center gap-3"
        >
          <AlertTriangle className="size-5" />
          {error}
        </motion.div>
      )}

      {hasSearched && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {gravatar && (
            <div className="mb-8">
              <div className="flex items-center gap-3 border-b border-cyber-border pb-4 mb-4">
                <Search className="size-5 text-cyber-red" />
                <h3 className="font-mono text-lg text-white uppercase tracking-wider">Gravatar Profile Ditemukan</h3>
              </div>
              <div className="bg-black/50 border border-cyber-border p-6 flex flex-col md:flex-row gap-6 items-start">
                 {gravatar.thumbnailUrl && (
                   <img src={gravatar.thumbnailUrl} alt="Gravatar" className="w-24 h-24 rounded border border-cyber-red/50" />
                 )}
                 <div className="space-y-2 font-mono text-sm max-w-full overflow-hidden">
                   {gravatar.preferredUsername && (
                     <div className="flex gap-2">
                       <span className="text-gray-500 w-24">Username:</span>
                       <span className="text-white">{gravatar.preferredUsername}</span>
                     </div>
                   )}
                   {gravatar.displayName && (
                     <div className="flex gap-2">
                       <span className="text-gray-500 w-24">Nama:</span>
                       <span className="text-white">{gravatar.displayName}</span>
                     </div>
                   )}
                   {gravatar.profileUrl && (
                     <div className="flex gap-2">
                       <span className="text-gray-500 w-24">Link:</span>
                       <a href={gravatar.profileUrl} target="_blank" rel="noreferrer" className="text-cyber-red hover:underline truncate">{gravatar.profileUrl}</a>
                     </div>
                   )}
                 </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 border-b border-cyber-border pb-4">
            <Key className="size-5 text-cyber-red" />
            <h3 className="font-mono text-lg text-white uppercase tracking-wider">Hasil Pelacakan Registrasi</h3>
          </div>

          <div className="bg-black/30 border border-cyber-border p-4 font-mono text-xs text-gray-400 mb-6 flex gap-3">
             <Shield className="size-4 text-cyber-red shrink-0" />
             <p>Data dibawah merupakan hasil dari deteksi riwayat pendaftaran berdasarkan Data Breach XposedOrNot. Jika layanan pihak ketiga muncul dibawah, artinya email ini pernah terdaftar di platform tersebut.</p>
          </div>

          {breaches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {breaches.map((site, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-black/50 border border-cyber-border p-4 flex flex-col gap-3 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-cyber-red/[0.02] group-hover:bg-cyber-red/[0.05] transition-colors" />
                  <div className="flex items-center justify-between z-10 relative">
                     <span className="font-mono text-cyber-red font-bold uppercase">{site}</span>
                     <LinkIcon className="size-4 text-gray-600 group-hover:text-cyber-red transition-colors" />
                  </div>
                  <div className="z-10 relative">
                      <a href={`https://www.google.com/search?q=${site}`} target="_blank" rel="noreferrer" className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-2">
                        Pencarian Lanjut <Search className="size-3" />
                      </a>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 bg-black/50 border border-cyber-border border-dashed font-mono">
              <Shield className="size-12 text-cyber-red/50 mx-auto mb-4" />
              <p className="text-gray-500 mb-2 uppercase tracking-widest">TIDAK ADA DATA DITEMUKAN</p>
              <p className="text-xs text-cyber-red">Email kemungkinan tidak banyak terdaftar pada platform publik yang berisiko.</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
