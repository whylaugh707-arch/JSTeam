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
  },
  {
    id: 'individual',
    name: 'Individual OSINT',
    icon: Search,
    queries: [
      { label: 'Social Media Profiles', query: (t) => `"${t}" site:linkedin.com OR site:facebook.com OR site:instagram.com OR site:twitter.com` },
      { label: 'Public Mentions', query: (t) => `"${t}" -site:linkedin.com -site:facebook.com` },
      { label: 'Resume / CV', query: (t) => `"${t}" filetype:pdf OR filetype:doc OR filetype:docx "resume" OR "cv" OR "curriculum vitae"` },
      { label: 'Email Patterns', query: (t) => `"${t}" "@gmail.com" OR "@yahoo.com" OR "@outlook.com"` },
      { label: 'Directory Search', query: (t) => `intitle:"index of" "${t}"` },
    ]
  }
];

const GoogleDorker: React.FC = () => {
  const [target, setTarget] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<{cat: string, idx: number} | null>(null);
  const [trollMode, setTrollMode] = useState(false);

  const BANNED_TARGETS = [
    'fryzzie', 'izie', 'jeexmiekko', 'whylaugh404', 'whylaugh707', 'm. fryzzie al ashafani'
  ];

  const handleCopy = (text: string, cat: string, idx: number) => {
    if (BANNED_TARGETS.some(t => target.toLowerCase().includes(t))) {
      setTrollMode(true);
      return;
    }
    navigator.clipboard.writeText(text);
    setCopiedIndex({ cat, idx });
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleOpen = (query: string) => {
    if (BANNED_TARGETS.some(t => target.toLowerCase().includes(t))) {
      setTrollMode(true);
      return;
    }
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    window.open(url, '_blank');
  };

  return (
    <div className={cn("space-y-8 sm:space-y-12 transition-all duration-1000", trollMode && "blur-lg fixed inset-0 opacity-20 pointer-events-none overflow-hidden")}>
      <AnimatePresence>
        {trollMode && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-4 bg-black/95 select-none pointer-events-auto"
          >
            <div className="relative group overflow-hidden border-[6px] border-cyber-red p-8 sm:p-12 bg-white flex flex-col items-center gap-6 sm:gap-8 max-w-lg w-full">
              <div className="absolute top-0 left-0 w-full h-1 bg-cyber-red animate-pulse" />
              <div className="text-[80px] sm:text-[120px] leading-none animate-bounce">🤡</div>
              <h1 className="text-3xl sm:text-5xl font-black text-black text-center uppercase tracking-tighter mix-blend-difference">
                STOP SEARCHING FOR <span className="text-cyber-red">LOSERS</span>
              </h1>
              <div className="text-center space-y-4">
                <p className="text-sm sm:text-xl font-mono font-black text-black leading-tight">
                  "WE FOUND NOTHING BUT A SMELLY PILE OF TRASH. THIS PERSON HAS THE CHARISMA OF A ROTTEN POTATO AND THE INTELLIGENCE OF A BROKEN TOASTER."
                </p>
                <div className="p-3 bg-cyber-red text-white font-mono text-[10px] font-bold">
                  DORK_STATUS: F*CK_OFF_AND_DIE
                </div>
              </div>
              <button 
                onClick={() => window.location.reload()}
                className="w-full py-4 sm:py-6 bg-black text-white text-xl sm:text-2xl font-black italic hover:bg-neutral-800 transition-colors"
              >
                I AM A CLOWN
              </button>
            </div>
            <div className="mt-12 grid grid-cols-4 gap-4 opacity-50">
               {[...Array(16)].map((_, i) => (
                 <div key={i} className="size-4 bg-cyber-red animate-ping" />
               ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center">
        <h2 className="text-2xl sm:text-4xl font-sans uppercase tracking-[0.2em] sm:tracking-[0.3em] text-white">
          {trollMode ? "TOTAL_SYSTEM_DISASTER" : "Google Dorking"}
        </h2>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="relative group">
          <input
            type="text"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="DOMAIN_ATAU_NAMA_TARGET (e.g., target.com atau Nama Seseorang)..."
            className="tactical-input !pr-12"
          />
          <TerminalIcon className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-cyber-red/30 group-focus-within:text-cyber-red transition-colors" />
        </div>
        <p className="mt-3 font-mono text-[9px] text-gray-600 uppercase tracking-widest text-center">
          MASUKKAN_TARGET_UNTUK_GENERASI_OTOMATIS_QUERY_DORKING
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
                      <code className="font-mono text-[10px] sm:text-xs text-gray-500 break-all whitespace-pre-wrap select-all selection:bg-cyber-red selection:text-white">
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

    </div>
  );
};

export default GoogleDorker;
