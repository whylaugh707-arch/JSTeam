import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ExternalLink, ShieldAlert, FileCode, Database, Key, HardDrive, Terminal as TerminalIcon, Copy, Check } from 'lucide-react';
import { cn } from '../lib/utils';

interface DorkCategory {
  id: string;
  name: string;
  icon: any;
  queries: {
    label: string;
    query: (target: string) => string;
  }[];
}

const dorkCategories: DorkCategory[] = [
  {
    id: 'files',
    name: 'Exposed Files',
    icon: FileCode,
    queries: [
      { label: 'PDF Documents', query: (t) => `site:${t} filetype:pdf` },
      { label: 'Excel Spreadsheets', query: (t) => `site:${t} filetype:xls OR filetype:xlsx` },
      { label: 'Word Documents', query: (t) => `site:${t} filetype:doc OR filetype:docx` },
      { label: 'Backup Files', query: (t) => `site:${t} filetype:bak OR filetype:old OR filetype:zip` },
    ]
  },
  {
    id: 'config',
    name: 'Configurations',
    icon: HardDrive,
    queries: [
      { label: 'Environment Files', query: (t) => `site:${t} ".env" OR ".git" OR ".svn"` },
      { label: 'PHP Configs', query: (t) => `site:${t} "config.php" OR "wp-config.php"` },
      { label: 'Web Configs', query: (t) => `site:${t} filetype:config "connectionString"` },
      { label: 'PHP Info', query: (t) => `site:${t} "phpinfo()"` },
    ]
  },
  {
    id: 'database',
    name: 'Database & Logs',
    icon: Database,
    queries: [
      { label: 'SQL Dumps', query: (t) => `site:${t} filetype:sql OR intext:"sql dump"` },
      { label: 'Access Logs', query: (t) => `site:${t} filetype:log "access" OR "error"` },
      { label: 'MongoDB/NoSQL', query: (t) => `site:${t} intext:"MONGODB_URI" OR intext:"db_password"` },
      { label: 'Firebase Config', query: (t) => `site:${t} intext:"firebaseConfig"` },
    ]
  },
  {
    id: 'vuln',
    name: 'Vulnerabilities',
    icon: ShieldAlert,
    queries: [
      { label: 'SQL Syntax Errors', query: (t) => `site:${t} intext:"sql syntax error" OR intext:"mysql_fetch_array"` },
      { label: 'Open Redirects', query: (t) => `site:${t} inurl:redir OR inurl:url=http` },
      { label: 'Login Pages', query: (t) => `site:${t} inurl:admin OR inurl:login OR inurl:signin` },
      { label: 'Directory Listing', query: (t) => `site:${t} intitle:"index of"` },
    ]
  },
  {
    id: 'auth',
    name: 'Credentials',
    icon: Key,
    queries: [
      { label: 'Public Passwords', query: (t) => `site:${t} intext:"password" OR intext:"passphrase"` },
      { label: 'API Keys', query: (t) => `site:${t} intext:"API_KEY" OR intext:"SECRET_KEY"` },
      { label: 'SSH Private Keys', query: (t) => `site:${t} "-----BEGIN RSA PRIVATE KEY-----"` },
    ]
  }
];

const GoogleDorker: React.FC = () => {
  const [target, setTarget] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<{cat: string, idx: number} | null>(null);

  const handleCopy = (text: string, cat: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex({ cat, idx });
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleOpen = (query: string) => {
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h2 className="text-4xl font-sans uppercase tracking-[0.3em] text-white">Google Dorking</h2>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="relative group">
          <input
            type="text"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="DOMAIN_ATAU_KATA_KUNCI_TARGET (e.g., target.com)..."
            className="tactical-input !pr-12"
          />
          <TerminalIcon className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-cyber-red/30 group-focus-within:text-cyber-red transition-colors" />
        </div>
        <p className="mt-3 font-mono text-[9px] text-gray-600 uppercase tracking-widest text-center">
          MASUKKAN_DOMAIN_UNTUK_GENERASI_OTOMATIS_QUERY_DORKING
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {dorkCategories.map((category) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="tactical-card space-y-6"
          >
            <div className="flex items-center gap-4 border-b border-cyber-border pb-4">
              <div className="p-2 bg-cyber-red/5 border border-cyber-red/20">
                <category.icon className="size-5 text-cyber-red" />
              </div>
              <h3 className="text-xl font-sans font-bold uppercase tracking-widest text-white">
                {category.name}
              </h3>
            </div>

            <div className="space-y-3">
              {category.queries.map((q, idx) => {
                const queryText = q.query(target || "example.com");
                const isCopied = copiedIndex?.cat === category.id && copiedIndex?.idx === idx;
                
                return (
                  <div key={idx} className="group relative">
                    <div className="flex flex-col gap-2 p-4 bg-black/40 border border-cyber-border transition-all group-hover:border-cyber-red/30 group-hover:bg-black/60">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-[10px] text-cyber-red uppercase tracking-widest">{q.label}</span>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleCopy(queryText, category.id, idx)}
                            className="p-1.5 hover:bg-cyber-red/10 border border-transparent hover:border-cyber-red/20 text-cyber-red"
                          >
                            {isCopied ? <Check className="size-3" /> : <Copy className="size-3" />}
                          </button>
                          <button
                            onClick={() => handleOpen(queryText)}
                            className="p-1.5 hover:bg-white/10 border border-transparent hover:border-white/20 text-white"
                          >
                            <ExternalLink className="size-3" />
                          </button>
                        </div>
                      </div>
                      <code className="font-mono text-xs text-gray-500 break-all select-all selection:bg-cyber-red selection:text-white">
                        {queryText}
                      </code>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-cyber-red/5 border border-cyber-red/20 p-6 rounded-sm">
        <div className="flex gap-4 items-start">
          <ShieldAlert className="size-6 text-cyber-red shrink-0 mt-1" />
          <div className="space-y-2">
            <h4 className="font-sans font-bold text-white uppercase tracking-widest text-xs">Peringatan_Protokol</h4>
            <p className="font-mono text-[10px] text-gray-500 leading-relaxed uppercase">
              DORKING_DAPAT_DIANGGAP_SEBAGAI_AKTIVITAS_INTELIJEN_PASIF. PASTIKAN_ANDA_MEMILIKI_OTORISASI_SEBELUM_MENGEKSPLORASI_HASIL_DARI_TARGET_YANG_TIDAK_DIMILIKI_PRIBADI.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleDorker;
