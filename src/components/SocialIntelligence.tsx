import React, { useState } from "react";
import { Search, Loader2, MessageSquare, Instagram, ExternalLink, ShieldAlert, AtSign } from "lucide-react";
import { motion } from "motion/react";

const SocialIntelligence: React.FC = () => {
  const [target, setTarget] = useState("");
  const [loading, setLoading] = useState(false);

  const getCommentDorks = (username: string) => {
    const cleanUsername = username.replace("@", "");
    return [
      {
        platform: "Instagram",
        icon: Instagram,
        dorks: [
          { label: "Comment Mentions", query: `site:instagram.com "${cleanUsername}" "comment"` },
          { label: "Profile Discussions", query: `site:instagram.com "at ${cleanUsername}"` },
          { label: "Public Mentions", query: `"${cleanUsername}" site:instagram.com` }
        ]
      },
      {
        platform: "TikTok",
        icon: MessageSquare,
        dorks: [
          { label: "Comment Search", query: `site:tiktok.com "@${cleanUsername}" "comment"` },
          { label: "Video Tags", query: `site:tiktok.com "@${cleanUsername}"` },
          { label: "User Interactions", query: `site:tiktok.com intext:"${cleanUsername}"` }
        ]
      }
    ];
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!target) return;
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  const executeDork = (query: string) => {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, "_blank");
  };

  return (
    <div className="space-y-8 sm:space-y-12">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Social Discovery</p>
          <h2>Intel Sosmed</h2>
        </div>
        <div className="hidden sm:flex status-pill">Indexed traces</div>
      </div>

      <form onSubmit={handleSearch} className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-0 group">
        <div className="relative flex-1">
          <input
            type="text"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="USERNAME (TANPA @)..."
            className="tactical-input sm:border-r-0"
          />
          <AtSign className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-cyber-red/20 group-focus-within:text-cyber-red/50 transition-colors" />
        </div>
        <button type="submit" disabled={loading || !target} className="tactical-btn sm:w-48 whitespace-nowrap">
          {loading ? <Loader2 className="animate-spin size-5" /> : <Search className="size-5" />}
          IDENTIFIKASI
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {target && getCommentDorks(target).map((section, idx) => (
          <div key={idx} className="space-y-4">
            <h3 className="text-lg font-sans font-bold text-cyber-red flex items-center gap-2 uppercase tracking-widest leading-none">
              <section.icon className="size-5" /> {section.platform}_Discovery
            </h3>
            <div className="space-y-3">
              {section.dorks.map((d, i) => (
                <div key={i} className="tactical-card p-4 flex flex-col gap-3 group hover:border-cyber-red/50 transition-all bg-black/40">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">{d.label}</span>
                    <button 
                      onClick={() => executeDork(d.query)}
                      className="text-cyber-red hover:text-white flex items-center gap-1 text-[10px] font-bold transition-colors"
                    >
                      <ExternalLink className="size-3" /> JELAJAHI
                    </button>
                  </div>
                  <code className="text-[10px] font-mono text-white/60 break-all border-l-2 border-cyber-red pl-3 py-1">
                    {d.query}
                  </code>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {!target && (
        <div className="max-w-xl mx-auto py-20 text-center opacity-30">
          <ShieldAlert className="size-16 mx-auto mb-4 text-cyber-border" />
          <p className="font-mono text-xs uppercase tracking-[0.3em]">Menunggu target intelijen...</p>
        </div>
      )}

      <div className="max-w-4xl mx-auto tactical-card p-4 bg-cyber-red/5 border-cyber-red/20">
         <div className="flex gap-4 items-start">
            <ShieldAlert className="size-5 text-cyber-red shrink-0 mt-1" />
            <div className="space-y-2">
              <p className="text-[10px] text-white font-mono uppercase font-bold leading-tight">
                Mekanisme Pelacakan History:
              </p>
              <p className="text-[9px] text-gray-500 font-mono uppercase leading-relaxed">
                Karena batasan privasi platform (API Private), sistem menggunakan "Google Index Scouring". 
                Teknik ini mencari jejak cache komentar yang telah diindeks oleh mesin pencari. 
                Hasil terbaik biasanya ditemukan pada akun publik atau diskusi populer.
              </p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default SocialIntelligence;
