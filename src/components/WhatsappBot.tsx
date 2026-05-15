import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Bot, RefreshCw, QrCode, Server, ShieldCheck, Power } from 'lucide-react';
import axios from 'axios';

interface BotStatus {
  status: string;
  qr: string | null;
}

export default function WhatsappBot() {
  const [botStatus, setBotStatus] = useState<BotStatus>({ status: 'DISCONNECTED', qr: null });
  const [loading, setLoading] = useState(false);

  const checkStatus = async () => {
    try {
      const response = await axios.get('/api/whatsapp/status');
      setBotStatus(response.data);
    } catch (error) {
      console.error("Failed to fetch bot status", error);
    }
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleStartBot = async () => {
    setLoading(true);
    try {
      await axios.post('/api/whatsapp/start');
      await checkStatus();
    } catch (error) {
      console.error("Failed to start bot", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetBot = async () => {
    setLoading(true);
    try {
      await axios.post('/api/whatsapp/reset');
      await checkStatus();
    } catch (error) {
      console.error("Failed to reset bot", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="border border-cyber-border bg-black/40 p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Bot className="w-32 h-32" />
        </div>
        
        <div className="relative z-10 flex items-center gap-4 mb-6">
          <div className="p-3 bg-cyber-red/10 border border-cyber-red/30">
            <Bot className="w-6 h-6 text-cyber-red" />
          </div>
          <div>
            <h2 className="text-xl font-mono uppercase tracking-[0.2em] text-white">WHATSAPP OSINT BOT</h2>
            <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mt-1">Integrasi JSTeam OSINT Bot via WhatsApp Web JS</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
             <div className="flex flex-col space-y-4 font-mono text-sm border-l-2 border-cyber-border pl-4 py-2">
               <div className="flex justify-between text-gray-400">
                  <span>STATUS KONEKSI:</span>
                  <span className={`font-bold ${botStatus.status === 'READY' || botStatus.status === 'AUTHENTICATED' ? 'text-green-500' : 'text-yellow-500'}`}>
                    {botStatus.status}
                  </span>
               </div>
               <div className="text-xs text-gray-600 block mt-2">
                 *Gunakan tab ini untuk menyiapkan bot OSINT JSTeam pada nomor kosong/virtual.
               </div>
             </div>

             <div className="flex gap-4">
               {botStatus.status === 'DISCONNECTED' && (
                 <button 
                  onClick={handleStartBot} 
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-cyber-red text-black font-mono font-bold text-xs tracking-widest uppercase hover:bg-cyber-red/90 transition-colors disabled:opacity-50"
                 >
                   {loading ? <RefreshCw className="size-4 animate-spin" /> : <Power className="size-4" />}
                   MULAI INISIASI
                 </button>
               )}
               {botStatus.status !== 'DISCONNECTED' && (
                 <button 
                  onClick={handleResetBot} 
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-black text-cyber-red font-mono font-bold text-xs tracking-widest uppercase hover:bg-cyber-red/10 border border-cyber-red transition-colors disabled:opacity-50"
                 >
                   <Power className="size-4" />
                   HENTIKAN / RESET
                 </button>
               )}
             </div>

             <div className="p-4 border border-cyber-border bg-black text-xs font-mono text-gray-400 space-y-4">
                <div className="flex items-center gap-2 text-cyber-red">
                  <ShieldCheck className="size-4" />
                  <span className="uppercase tracking-widest font-bold">MODE ANTI-BAN AKTIF</span>
                </div>
                <ul className="list-disc list-inside space-y-2 opacity-80">
                  <li>Menggunakan Chrome Standalone.</li>
                  <li>Jeda acak saat membaca dan mulai mengetik (Read Delay & Typing Delay).</li>
                  <li>Delay acak sebelum pengiriman hasil pelacakan.</li>
                  <li>Hanya merespon pada perintah khusus (!osint).</li>
                  <li>Penggunaan LocalAuth untuk resiliensi sesi.</li>
                </ul>
             </div>
          </div>

          <div className="flex flex-col items-center justify-center bg-black border border-cyber-border p-8 min-h-[300px]">
            {botStatus.status === 'QR_READY' && botStatus.qr ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                 <img src={botStatus.qr} alt="WhatsApp QR Code" className="w-56 h-56 bg-white p-2" />
                 <p className="mt-6 text-xs font-mono text-cyber-red uppercase tracking-[0.2em] animate-pulse">Scan dengan WhatsApp Virtual</p>
              </motion.div>
            ) : botStatus.status === 'INITIALIZING' ? (
               <div className="flex flex-col items-center text-cyber-red">
                  <RefreshCw className="size-10 animate-spin mb-4" />
                  <p className="font-mono text-xs uppercase tracking-[0.2em] animate-pulse">Menyiapkan Engine...</p>
               </div>
            ) : botStatus.status === 'READY' || botStatus.status === 'AUTHENTICATED' ? (
               <div className="flex flex-col items-center text-green-500">
                  <Server className="size-16 mb-4" />
                  <p className="font-mono text-xs uppercase tracking-[0.2em]">Sistem Online & Siap</p>
               </div>
            ) : (
               <div className="flex flex-col items-center text-gray-700">
                  <QrCode className="size-16 mb-4" />
                  <p className="font-mono text-xs uppercase tracking-[0.2em]">Offline</p>
               </div>
            )}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-cyber-border/50">
           <h3 className="font-mono text-cyber-red text-sm uppercase tracking-widest mb-4">Cara Penggunaan Command Bot</h3>
           <div className="bg-black border border-cyber-border p-4 font-mono text-xs text-gray-400 space-y-2">
             <p className="text-white">Kirim pesan ke nomor WhatsApp bot dengan format:</p>
             <p className="text-cyber-green bg-green-900/20 px-3 py-2 border border-green-500/20">!osint &lt;username target&gt;</p>
             <p className="mt-4 italic">Contoh:</p>
             <p className="text-gray-300">!osint anonym_jkt48</p>
           </div>
        </div>

      </div>
    </div>
  );
}
