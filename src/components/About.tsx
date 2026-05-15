import React from "react";
import { Terminal, Shield, Users, Info, BookOpen, Handshake, Crosshair } from "lucide-react";
import { motion } from "motion/react";

export default function About() {
  return (
    <div className="max-w-5xl mx-auto space-y-12 py-4 px-4 md:px-6">
      <section className="space-y-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="inline-flex p-5 border border-cyber-red/50 shadow-[0_0_30px_rgba(239,68,68,0.1)] rounded-full bg-cyber-card"
        >
          <Shield className="size-14 text-cyber-red" />
        </motion.div>
        <div>
          <p className="eyebrow">Community Node</p>
          <h1 className="text-4xl md:text-6xl font-bold text-white uppercase">
            JAKARTASEC<span className="text-cyber-red">TEAM</span>
          </h1>
        </div>
        <div className="max-w-4xl mx-auto bg-black/40 border border-cyber-border rounded-md p-6 relative text-left">
          <div className="absolute top-0 left-0 w-1 h-full bg-cyber-red/60" />
          <p className="text-sm md:text-base font-mono text-gray-300 leading-relaxed pl-3">
            <span className="text-cyber-red font-bold">TENTANG JAKARTASECTEAM:</span> JakartaSecTeam adalah komunitas cyber untuk pemula sampai expert. Di sini kita saling sharing ilmu, belajar bersama, bertanya, berdiskusi, komunikasi, edukasi, dan lainnya. Jika ingin belajar dari 0 atau masih awam, jangan ragu untuk bertanya. Kita sama-sama belajar di sini.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="tactical-card space-y-6"
        >
          <h2 className="text-xl md:text-2xl flex items-center gap-3 font-bold text-white border-b border-cyber-border pb-4">
            <BookOpen className="size-6 text-cyber-red" /> ATURAN ANGGOTA - J.S.T
          </h2>
          <ul className="space-y-4 font-mono text-sm md:text-[15px] text-gray-400 list-none pl-0 leading-relaxed">
            <li className="flex gap-3"><span className="text-cyber-red font-bold">1.</span> Saling menghargai, menghormati, memanusiakan.</li>
            <li className="flex gap-3"><span className="text-cyber-red font-bold">2.</span> Bebas komunikasi, edukasi, bertanya, berdiskusi, maupun belajar.</li>
            <li className="flex gap-3"><span className="text-cyber-red font-bold">3.</span> Bebas berekspresi, berkarya, berpendapat, memberi kritik, dan berbagi saran.</li>
            <li className="flex gap-3"><span className="text-cyber-red font-bold">4.</span> Bebas share hasil riset, informasi asli, materi, dan pembelajaran.</li>
            <li className="flex gap-3"><span className="text-cyber-red font-bold">5.</span> Tidak ada perbedaan, semua sama rata.</li>
            <li className="flex gap-3"><span className="text-cyber-red font-bold">6.</span> Tidak ada penghinaan. Jika melakukan kesalahan, perbaiki.</li>
            <li className="flex gap-3"><span className="text-cyber-red font-bold">7.</span> Tetap rendah hati, sopan, tanpa sombong.</li>
            <li className="flex gap-3"><span className="text-cyber-red font-bold">8.</span> Silakan bercerita jika ada keluh kesah.</li>
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
            <h2 className="text-xl flex items-center gap-3 font-bold text-white relative z-10">
              <Info className="size-5 text-cyber-red" /> NOTE J.S.T
            </h2>
            <div className="font-mono text-[15px] leading-relaxed text-gray-300 italic border-l-4 border-cyber-red pl-4 py-2 relative z-10 bg-black/50 rounded-r-md">
              "Setiap manusia berbeda-beda, mulai dari sifat, watak, niat, perspektif, keaslian mereka akan terlihat jika merasa mendominasi."
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="tactical-card space-y-6 border-t-4 border-t-cyber-red"
          >
            <h2 className="text-xl font-bold text-white tracking-widest uppercase">TEXT J.S.T</h2>
            <ul className="space-y-3 font-mono text-base text-gray-300 list-none pl-0">
              <li className="flex items-center gap-3"><span className="w-2 h-2 bg-cyber-red rotate-45 shrink-0" /> Kami JakartaSecTeam</li>
              <li className="flex items-center gap-3"><span className="w-2 h-2 bg-cyber-red rotate-45 shrink-0" /> Kami semua sama rata</li>
              <li className="flex items-center gap-3"><span className="w-2 h-2 bg-cyber-red rotate-45 shrink-0" /> Kami tidak butuh validasi</li>
              <li className="flex items-center gap-3"><span className="w-2 h-2 bg-cyber-red rotate-45 shrink-0" /> Kami ada untuk keadilan, kemanusiaan, kebebasan.</li>
            </ul>
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="tactical-card space-y-6 border border-gray-800 bg-gray-900/20"
        >
          <h2 className="text-xl flex items-center gap-3 font-bold text-gray-400 border-b border-gray-800 pb-4">
            <Handshake className="size-5" /> ALIANSI LAMA
          </h2>
          <ul className="space-y-3 font-mono text-sm text-gray-500">
            <li>- TEGAL CYBER TEAM</li>
            <li>- Legion7 Hacker's Team</li>
            <li>- clan_JiNxX*Pro</li>
            <li>- Vozaik Team</li>
            <li>- DSS FOUNDER BARZ</li>
          </ul>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="tactical-card space-y-6 border border-cyber-red/30 bg-cyber-red/5"
        >
          <h2 className="text-xl flex items-center gap-3 font-bold text-white border-b border-cyber-red/30 pb-4">
            <Crosshair className="size-5 text-cyber-red" /> ALIANSI TERBARU
          </h2>
          <ul className="space-y-3 font-mono text-sm text-white">
            <li><span className="text-cyber-red/50">/</span> TEAM CYBERCRIME INDONESIA</li>
            <li><span className="text-cyber-red/50">/</span> SYNTAX SOCIETY</li>
            <li><span className="text-cyber-red/50">/</span> COMMUNITY CYBER SELATAN (CTS)</li>
            <li><span className="text-cyber-red/50">/</span> BLACK HOLE 1139</li>
            <li><span className="text-cyber-red/50">/</span> ETERNAL VOID GEN #5/99</li>
            <li><span className="text-cyber-red/50">/</span> TRASER SEC TEAM</li>
            <li><span className="text-cyber-red/50">/</span> DYL {"{ Destroy Your Limitless }"}</li>
            <li><span className="text-cyber-red/50">/</span> KILLER SECTEAM</li>
            <li><span className="text-cyber-red/50">/</span> CYBER COUNTER ATTACKER || CCA404</li>
          </ul>
        </motion.div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
        <motion.a
          href="https://f-droid.org/repo/com.termux_1021.apk"
          target="_blank"
          rel="noreferrer"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-between p-6 bg-black/60 border border-cyber-border rounded-md hover:border-cyber-red hover:bg-cyber-red/5 transition-all group relative overflow-hidden"
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
          className="flex items-center justify-between p-6 bg-black/60 border border-cyber-border rounded-md hover:border-cyber-red hover:bg-cyber-red/5 transition-all group relative overflow-hidden"
        >
          <div className="absolute left-0 top-0 w-1 h-full bg-green-500/50 group-hover:bg-green-500 transition-colors" />
          <div className="pl-4">
            <h3 className="font-bold text-white uppercase font-mono mb-2 group-hover:text-green-400 transition-colors">LINK GRUP JAKARTASECTEAM</h3>
            <p className="text-xs font-mono text-gray-500">Join via WhatsApp</p>
          </div>
          <Users className="size-6 text-gray-600 group-hover:text-green-400 transition-colors" />
        </motion.a>
      </section>

      <div className="text-center pb-12 pt-8 border-t border-cyber-border">
        <p className="text-lg md:text-xl font-mono text-cyber-red italic leading-relaxed max-w-3xl mx-auto mb-6">
          "Bersenang senanglah di dunia nyata dan dunia maya, incarlah sesuatu yang mustahil, dan selalu ingat kata ini. &lt;No System Is Safe&gt;"
        </p>
        <p className="font-mono text-xs text-gray-500 uppercase tracking-widest bg-black px-4 py-2 inline-block border border-gray-800 rounded-md">
          OPERATOR: JST_CORE_NODE
        </p>
      </div>
    </div>
  );
}
