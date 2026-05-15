import React from "react";
import { Terminal, Shield, Users, Globe, Code, Heart, Info, BookOpen, Handshake, Link as LinkIcon, Crosshair } from "lucide-react";
import { motion } from "motion/react";

export default function About() {
  return (
    <div className="max-w-5xl mx-auto space-y-16 py-8 px-4 md:px-6">
      {/* Header */}
      <section className="space-y-8 text-center pt-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="inline-block p-6 border border-cyber-red shadow-[0_0_30px_rgba(239,68,68,0.1)] rounded-full bg-cyber-card mb-2"
        >
          <Shield className="size-16 text-cyber-red" />
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white uppercase">
          JAKARTASEC<span className="text-cyber-red">TEAM</span> (J.S.T)
        </h1>
        <div className="max-w-4xl mx-auto space-y-6 bg-black/40 border border-cyber-border p-6 mt-8 relative">
          <div className="absolute top-0 left-0 w-2 h-full bg-cyber-red/50" />
          <p className="text-sm md:text-base font-mono text-gray-300 leading-relaxed text-justify">
            <span className="text-cyber-red font-bold">TENTANG JAKARTASECTEAM:</span> JakartaSecTeam adalah komunitas cyber untuk pemula-expert, di sini kita saling sharing ilmu, belajar bersama, bertanya, berdiskusi, komunikasi, edukasi, dan lainnya, jadi jika ingin belajar tapi mulai dari 0 atau masih awam, jangan ragu untuk bertanya, kita sama² belajar di sini.
          </p>
        </div>
      </section>

      {/* Rules & Note */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           className="tactical-card space-y-6"
        >
          <h2 className="text-xl md:text-2xl flex items-center gap-3 font-bold text-white tracking-tight border-b border-cyber-border pb-4">
            <BookOpen className="size-6 text-cyber-red" /> ATURAN ANGGOTA - (J.S.T)
          </h2>
          <ul className="space-y-4 font-mono text-sm md:text-[15px] text-gray-400 list-none pl-0 leading-relaxed">
             <li className="flex gap-3"><span className="text-cyber-red font-bold">1.</span> Saling menghargai, menghormati, memanusiakan.</li>
             <li className="flex gap-3"><span className="text-cyber-red font-bold">2.</span> Bebas komunikasi, edukasi, bertanya, berdiskusi, maupun belajar.</li>
             <li className="flex gap-3"><span className="text-cyber-red font-bold">3.</span> Bebas berekspresi, berkarya, jadi jika ada pendapat, kritik, saran, atau karya, jangan ragu sharing.</li>
             <li className="flex gap-3"><span className="text-cyber-red font-bold">4.</span> Bebas share hasil hacking/show off, informasi (asli bukan hoax), materi, dan lainnya.</li>
             <li className="flex gap-3"><span className="text-cyber-red font-bold">5.</span> Tidak ada perbedaan, semua sama rata.</li>
             <li className="flex gap-3"><span className="text-cyber-red font-bold">6.</span> Tidak ada penghinaan, jika melakukan kesalahan, perbaiki.</li>
             <li className="flex gap-3"><span className="text-cyber-red font-bold">7.</span> Tetap rendah hati, sopan, tanpa sombong.</li>
             <li className="flex gap-3"><span className="text-cyber-red font-bold">8.</span> Silahkan bercerita jika ada keluh kesah.</li>
             <li className="flex gap-3"><span className="text-cyber-red font-bold">9.</span> Semua orang mempunyai hak untuk memilih, hormati yang memilih keluar.</li>
          </ul>
        </motion.div>

        <div className="space-y-8">
            <motion.div
               initial={{ opacity: 0, x: 20 }}
               whileInView={{ opacity: 1, x: 0 }}
               className="tactical-card space-y-4 border-cyber-red/50 bg-cyber-red/5 relative overflow-hidden"
            >
              <div className="absolute -right-4 -top-4 opacity-10">
                <Shield className="size-32 text-cyber-red" />
              </div>
              <h2 className="text-xl flex items-center gap-3 font-bold text-white tracking-tight relative z-10">
                <Info className="size-5 text-cyber-red" /> NOTE J.S.T (JAKARTASECTEAM)
              </h2>
              <div className="font-mono text-[15px] leading-relaxed text-gray-300 italic border-l-4 border-cyber-red pl-4 py-2 relative z-10 bg-black/50">
                "Setiap manusia berbeda-beda, mulai dari sifat, watak, niat, perspektif, keaslian mereka akan terlihat jika merasa mendominasi."
              </div>
            </motion.div>

            <motion.div
               initial={{ opacity: 0, x: 20 }}
               whileInView={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.1 }}
               className="tactical-card space-y-6 border-t-4 border-t-cyber-red"
            >
              <h2 className="text-xl font-bold text-white tracking-widest uppercase">
                TEXT J.S.T
              </h2>
              <ul className="space-y-3 font-mono text-base text-gray-300 list-none pl-0">
                 <li className="flex items-center gap-3"><span className="w-2 h-2 bg-cyber-red rotate-45 shrink-0"></span> Kami JakartaSecTeam</li>
                 <li className="flex items-center gap-3"><span className="w-2 h-2 bg-cyber-red rotate-45 shrink-0"></span> Kami semua sama rata</li>
                 <li className="flex items-center gap-3"><span className="w-2 h-2 bg-cyber-red rotate-45 shrink-0"></span> Kami tidak butuh validasi</li>
                 <li className="flex items-center gap-3"><span className="w-2 h-2 bg-cyber-red rotate-45 shrink-0"></span> Kami ada untuk keadilan, kemanusiaan, kebebasan.</li>
              </ul>
            </motion.div>
        </div>
      </div>

      {/* Alliances */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           className="tactical-card space-y-6 border border-gray-800 bg-gray-900/20"
        >
          <h2 className="text-xl flex items-center gap-3 font-bold text-gray-400 tracking-tight border-b border-gray-800 pb-4">
            <Handshake className="size-5" /> ALIANSI LAMA
          </h2>
          <ul className="space-y-3 font-mono text-sm text-gray-500">
             <li className="flex items-center gap-3">- TEGAL CYBER TEAM</li>
             <li className="flex items-center gap-3">- Legion7_Hacker's Team</li>
             <li className="flex items-center gap-3">- clan_JiNxX*Prö</li>
             <li className="flex items-center gap-3">- Vozaik Team</li>
             <li className="flex items-center gap-3">- DSS FOUNDER BARZ</li>
          </ul>
        </motion.div>
        
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
           className="tactical-card space-y-6 border border-cyber-red/30 bg-cyber-red/5"
        >
          <h2 className="text-xl flex items-center gap-3 font-bold text-white tracking-tight border-b border-cyber-red/30 pb-4">
            <Crosshair className="size-5 text-cyber-red" /> ALIANSI TERBARU
          </h2>
          <ul className="space-y-3 font-mono text-sm text-white">
             <li className="flex items-center gap-3"><span className="text-cyber-red/50">/</span> TEAM CYBERCRIME INDONESIA</li>
             <li className="flex items-center gap-3"><span className="text-cyber-red/50">/</span> 𝐒𝐘𝐍𝐓𝐀𝐗 𝐒𝐎𝐂𝐈𝐄𝐓𝐘 💮</li>
             <li className="flex items-center gap-3"><span className="text-cyber-red/50">/</span> 𝗰𝗼𝗺𝘂𝗻𝗶𝘁𝘆 𝗰𝘆𝗯𝗲𝗿 𝘀𝗲𝗹𝗮𝘁𝗮𝗻( c t s)</li>
             <li className="flex items-center gap-3"><span className="text-cyber-red/50">/</span> 𝐁𝐋𝐀𝐂𝐊 𝐇𝐎𝐋𝐄 𝟏𝟏𝟑𝟗</li>
             <li className="flex items-center gap-3"><span className="text-cyber-red/50">/</span> 𝐄𝐓𝐄𝐑𝐍𝐀𝐋 𝐕𝐎𝐈𝐃 𝐆𝐄𝐍 #𝟓/𝟗𝟗</li>
             <li className="flex items-center gap-3"><span className="text-cyber-red/50">/</span> TRASER SEC TEAM</li>
             <li className="flex items-center gap-3"><span className="text-cyber-red/50">/</span> DYL {"{ Destroy Your Limitless }"}</li>
             <li className="flex items-center gap-3"><span className="text-cyber-red/50">/</span> KILLER SECTEAM</li>
             <li className="flex items-center gap-3"><span className="text-cyber-red/50">/</span> •CYBER COUNTER ATTACKER || CCA404</li>
          </ul>
        </motion.div>
      </div>

      {/* Links */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
          <motion.a
            href="https://f-droid.org/repo/com.termux_1021.apk"
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-between p-6 bg-black/60 border border-cyber-border hover:border-cyber-red hover:bg-cyber-red/5 transition-all group relative overflow-hidden"
          >
             <div className="absolute left-0 top-0 w-1 h-full bg-blue-500/50 group-hover:bg-blue-500 transition-colors" />
             <div className="pl-4">
               <h3 className="font-bold text-white uppercase font-mono mb-2 group-hover:text-blue-400 transition-colors">LINK TERMUX ORIGINAL</h3>
               <p className="text-xs font-mono text-gray-500">Versi 0.119.0-beta.2 (1021)</p>
             </div>
             <Terminal className="size-6 text-gray-600 group-hover:text-blue-400 transition-colors" />
          </motion.a>

          <motion.a
            href="https://chat.whatsapp.com/GiK5hGnRznhCdxG8pYclTl"
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-between p-6 bg-black/60 border border-cyber-border hover:border-cyber-red hover:bg-cyber-red/5 transition-all group relative overflow-hidden"
          >
             <div className="absolute left-0 top-0 w-1 h-full bg-green-500/50 group-hover:bg-green-500 transition-colors" />
             <div className="pl-4">
               <h3 className="font-bold text-white uppercase font-mono mb-2 group-hover:text-green-400 transition-colors">LINK GRUP JAKARTASECTEAM</h3>
               <p className="text-xs font-mono text-gray-500">Join via WhatsApp</p>
             </div>
             <Users className="size-6 text-gray-600 group-hover:text-green-400 transition-colors" />
          </motion.a>
      </section>

      {/* Footer message */}
      <div className="text-center pb-12 pt-8 border-t border-cyber-border">
        <p className="text-lg md:text-xl font-mono text-cyber-red italic leading-relaxed max-w-3xl mx-auto mb-6">
          "Bersenang senanglah didunia Nyata dan dunia Maya, Incarlah sesuatu yang mustahil, dan selalu ingat kata ini. &lt;No System Is Safe&gt;"
        </p>
        <p className="font-mono text-xs text-gray-500 uppercase tracking-widest bg-black px-4 py-2 inline-block border border-gray-800">
          OPERATOR: WHYLAUGH_404
        </p>
      </div>

    </div>
  );
}
