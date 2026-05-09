import React from "react";
import { Terminal, Shield, Users, Globe, Code, Heart } from "lucide-react";
import { motion } from "motion/react";

export default function About() {
  const teamInfo = {
    founder: "WhyLaugh404",
    team: "JakartaSecTeam",
    alliance: "All Alliance",
  };

  return (
    <div className="max-w-4xl mx-auto space-y-24 py-16 px-6">
      <section className="space-y-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="inline-block p-6 border border-cyber-blue shadow-[0_0_30px_rgba(14,165,233,0.1)] rounded-full bg-cyber-card mb-4"
        >
          <Shield className="size-16 text-cyber-blue" />
        </motion.div>
        <h1 className="text-6xl font-bold tracking-tighter text-white uppercase">
          JS<span className="text-cyber-blue">TEAM</span> CORE
        </h1>
        <div className="max-w-2xl mx-auto space-y-4">
          <p className="text-xl font-mono text-cyber-blue italic leading-relaxed">
            "Bersenang senanglah didunia Nyata dan dunia Maya, Incarlah sesuatu yang mustahil, dan selalu ingat kata ini. &lt;No System Is Safe&gt;"
          </p>
          <div className="h-0.5 w-12 bg-cyber-blue/30 mx-auto" />
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <motion.div
           initial={{ opacity: 0, x: -30 }}
           whileInView={{ opacity: 1, x: 0 }}
           className="tactical-card space-y-6 flex flex-col md:flex-row gap-8 items-center"
        >
          <div className="shrink-0 w-32 h-44 bg-black border border-cyber-blue/30 overflow-hidden relative group">
            <img 
              src="https://i1.sndcdn.com/avatars-000157159107-80sner-t240x240.jpg" 
              alt="Operator" 
              className="w-full h-full object-cover opacity-60 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cyber-bg to-transparent opacity-60" />
            <div className="absolute bottom-2 left-2 font-mono text-[8px] text-cyber-blue">ID: WHYLAUGH_404</div>
          </div>
          <div className="space-y-4 flex-1">
            <h2 className="text-3xl flex items-center gap-3 font-bold text-white tracking-tight">
              <Terminal className="size-8 text-cyber-blue" /> OPERATOR_404
            </h2>
            <div className="space-y-6 font-mono text-sm leading-relaxed text-cyber-muted">
              <p>
                Dikembangkan dan dikelola oleh <span className="text-white font-bold tracking-widest text-lg">{teamInfo.founder}</span>. 
                Pengelola Website JSTeam untuk jaringan {teamInfo.team}.
              </p>
              <p>
                Berkomitmen pada filosofi transparansi digital total dan desentralisasi informasi radikal. 
                Kode kami adalah suara kami. Alat kami adalah warisan kami.
              </p>
              <div className="pt-6 border-t border-cyber-border flex flex-wrap gap-4 text-[10px] uppercase tracking-[0.2em]">
                 <span className="flex items-center gap-2 text-cyber-blue"><span className="w-1.5 h-1.5 bg-current rounded-full" /> KEAMANAN_SIBER</span>
                 <span className="flex items-center gap-2 text-cyber-blue"><span className="w-1.5 h-1.5 bg-current rounded-full" /> ARSITEK_OSINT</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, x: 30 }}
           whileInView={{ opacity: 1, x: 0 }}
           className="tactical-card space-y-6"
        >
          <h2 className="text-3xl flex items-center gap-3 font-bold text-white tracking-tight">
            <Users className="size-8 text-cyber-blue" /> SEMUA_ALIANSI
          </h2>
          <div className="space-y-6 font-mono text-sm leading-relaxed text-cyber-muted">
            <p>
              <span className="text-white font-bold">{teamInfo.team}</span> (Jakarta Security Team) adalah kolektif 
              elit hantu yang bekerja di dalam mesin untuk memastikan kelangsungan informasi bebas.
            </p>
            <p>
              Melalui <span className="text-white font-bold">{teamInfo.alliance}</span>, kami menyatukan ribuan 
              node independen menjadi satu kekuatan tunggal. Kami tidak memiliki pusat. Kami tidak memiliki pemimpin. 
              Kami ada di mana-mana.
            </p>
            <div className="pt-6 border-t border-cyber-border flex gap-4 text-[10px] uppercase tracking-[0.2em] font-bold text-white">
               <span className="flex items-center gap-2"><Heart className="size-3 text-rose-500 fill-rose-500" /> UNTUK_RAKYAT</span>
            </div>
          </div>
        </motion.div>
      </div>

      <section className="tactical-card bg-slate-900/30 flex flex-col items-center text-center p-16 space-y-10 border-dashed border-2">
        <h3 className="text-4xl font-bold text-white tracking-tighter">BERDIRI_2026</h3>
        <p className="font-mono text-base text-cyber-muted max-w-2xl leading-loose">
          JSTeam OSINT tetap menjadi node utama untuk pengambilan informasi. 
          Alat yang dibangun oleh rakyat, untuk rakyat. 
          Kebenaran tidak ada di luar sana. Kebenaran ada di sini, tersembunyi di dalam bit.
        </p>
        <div className="flex gap-12 font-mono text-[9px] text-cyber-blue/40 uppercase tracking-[1em]">
          <span>INTEL_SYSTEM</span>
          <span>PROTOCOL_ALPHA</span>
        </div>
      </section>
    </div>
  );
}
