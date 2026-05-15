/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, 
  Search, 
  MapPin, 
  Globe, 
  Image as ImageIcon, 
  Info, 
  Shield, 
  Menu, 
  X,
  Cpu,
  Fingerprint,
  SearchCode,
  MessageSquare,
  Car,
  Mail
} from 'lucide-react';
import UsernameSearch from './components/UsernameSearch';
import IPSearch from './components/IPSearch';
import NetworkTools from './components/NetworkTools';
import MetadataSearch from './components/MetadataSearch';
import GoogleDorker from './components/GoogleDorker';
import VehicleSearch from './components/VehicleSearch';
import NikSearch from './components/NikSearch';
import SocialIntelligence from './components/SocialIntelligence';
import EmailSearch from './components/EmailSearch';
import About from './components/About';
import { cn } from './lib/utils';

type Tab = 'username' | 'email' | 'ip' | 'network' | 'metadata' | 'dorker' | 'vehicle' | 'nik' | 'social' | 'about';
const TAB_IDS: Tab[] = ['username', 'email', 'ip', 'network', 'metadata', 'dorker', 'vehicle', 'nik', 'social', 'about'];

const getTabFromHash = (): Tab => {
  if (typeof window === "undefined") return "username";
  const hashTab = window.location.hash.replace("#", "") as Tab;
  return TAB_IDS.includes(hashTab) ? hashTab : "username";
};

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>(() => getTabFromHash());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [booting, setBooting] = useState(true);
  const trackId = useMemo(() => Math.random().toString(36).substring(7).toUpperCase(), []);

  useEffect(() => {
    const timer = setTimeout(() => setBooting(false), 2000);
    const syncTabFromHash = () => {
      setActiveTab(getTabFromHash());
    };
    
    const handleBeforeUnload = () => {
      localStorage.clear();
      sessionStorage.clear();
    };

    syncTabFromHash();
    const hashPoller = window.setInterval(syncTabFromHash, 250);
    window.addEventListener('hashchange', syncTabFromHash);
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      clearTimeout(timer);
      window.clearInterval(hashPoller);
      window.removeEventListener('hashchange', syncTabFromHash);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  if (booting) {
    return (
      <div className="fixed inset-0 bg-cyber-bg flex flex-col items-center justify-center space-y-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-cyber-red"
        >
          <Cpu className="size-16 animate-pulse" />
        </motion.div>
        <div className="font-mono text-cyber-red text-sm flex flex-col items-center">
          <p className="animate-pulse tracking-[0.4em]">INISIASI_PROTOKOL_GARUDA...</p>
          <div className="w-64 h-[2px] bg-cyber-border mt-6 overflow-hidden">
            <motion.div 
              className="h-full bg-cyber-red"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.8, ease: "easeInOut" }}
            />
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'username', label: 'Username', icon: Search },
    { id: 'social', label: 'Sosmed', icon: MessageSquare },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'ip', label: 'IP', icon: MapPin },
    { id: 'network', label: 'Domain', icon: Globe },
    { id: 'metadata', label: 'Metadata', icon: ImageIcon },
    { id: 'dorker', label: 'Dork', icon: SearchCode },
    { id: 'vehicle', label: 'Plat', icon: Car },
    { id: 'nik', label: 'NIK', icon: Fingerprint },
    { id: 'about', label: 'JSTeam', icon: Info },
  ] as const;

  return (
      <div className="min-h-screen bg-cyber-bg flex flex-col selection:bg-cyber-red selection:text-white">
      {/* Header */}
      <header className="border-b border-cyber-border bg-black/90 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[72px] sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative group">
              <div className="absolute -inset-2 bg-cyber-red/15 rounded-full blur-xl group-hover:bg-cyber-red/30 transition-all duration-700" />
              <div className="size-11 sm:size-12 bg-black border border-cyber-red/30 rounded-full overflow-hidden flex items-center justify-center relative">
                <img 
                  src="https://i.pinimg.com/736x/3e/e8/65/3ee8658d8afa81d9048a46e2771fb9fc.jpg" 
                  alt="Garuda" 
                  className="size-14 object-cover scale-150 hover:scale-[1.7] transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/identicon/svg?seed=Garuda&backgroundColor=000000&fontColor=ef4444';
                  }}
                />
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-sans font-bold uppercase text-white">
              JS<span className="text-cyber-red">TEAM</span>
            </h1>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 bg-black/50 border border-cyber-border rounded-md p-1 relative overflow-x-auto no-scrollbar max-w-[calc(100vw-230px)] 2xl:max-w-none">
            {tabs.map((tab) => (
              <a
                href={`#${tab.id}`}
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={cn(
                  "px-3 xl:px-4 py-2 rounded text-[9px] xl:text-[10px] font-mono tracking-[0.1em] uppercase transition-all flex items-center gap-2 relative z-10 shrink-0",
                  activeTab === tab.id 
                    ? "text-black font-bold" 
                    : "text-gray-500 hover:text-white"
                )}
              >
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute inset-0 bg-cyber-red pointer-events-none"
                    transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                  />
                )}
                <tab.icon className={cn("size-3 relative z-10", activeTab === tab.id ? "text-black" : "text-cyber-red/50")} />
                <span className="relative z-10 whitespace-nowrap">{tab.label}</span>
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-6">
            <div className="hidden 2xl:flex flex-col items-end font-mono text-[8px] text-gray-700 leading-none gap-1.5">
              <span className="flex items-center gap-1.5"><span className="w-1 h-1 bg-cyber-red rounded-full" /> SISTEM: AKTIF</span>
              <span>NODE: JAKARTA_SEC_TEAM</span>
            </div>
            <button 
              className="lg:hidden text-cyber-red p-2 border border-cyber-border rounded-md hover:bg-cyber-red/10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>
      </header>


      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="lg:hidden fixed inset-0 top-20 bg-black z-30 p-6 space-y-4 flex flex-col overflow-y-auto"
          >
            {tabs.map((tab) => (
              <a
                href={`#${tab.id}`}
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as Tab);
                  setIsMenuOpen(false);
                }}
                className={cn(
                  "w-full p-4 font-mono text-xs tracking-[0.15em] uppercase flex items-center gap-5 border transition-all shrink-0",
                  activeTab === tab.id 
                    ? "bg-cyber-red text-black border-cyber-red shadow-[0_0_20px_rgba(239,68,68,0.2)]" 
                    : "border-cyber-border text-gray-500"
                )}
              >
                <tab.icon className="size-6" />
                {tab.label}
              </a>
            ))}
            <div className="mt-auto p-12 text-center opacity-10 blur-sm grayscale">
                 <Shield className="size-32 mx-auto text-cyber-red" />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <section className="border-b border-cyber-border/60 bg-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-[1.4fr_0.6fr] gap-5">
          <div className="space-y-3">
            <p className="eyebrow">GARUDA_OSINT_NETWORK_NODE</p>
            <h2 className="text-3xl sm:text-5xl font-bold uppercase leading-tight">
              JST-OSINT <span className="text-cyber-red">V.1</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3 font-mono text-[10px] uppercase">
            <div className="rounded-md border border-cyber-border bg-black/50 p-4">
              <div className="text-gray-600 mb-2">Module</div>
              <div className="text-white">{tabs.length} Active</div>
            </div>
            <div className="rounded-md border border-cyber-border bg-black/50 p-4">
              <div className="text-gray-600 mb-2">Mode</div>
              <div className="text-cyber-red">Public OSINT</div>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'username' && <UsernameSearch />}
            {activeTab === 'email' && <EmailSearch />}
            {activeTab === 'ip' && <IPSearch />}
            {activeTab === 'network' && <NetworkTools />}
            {activeTab === 'metadata' && <MetadataSearch />}
            {activeTab === 'dorker' && <GoogleDorker />}
            {activeTab === 'vehicle' && <VehicleSearch />}
            {activeTab === 'nik' && <NikSearch />}
            {activeTab === 'social' && <SocialIntelligence />}
            {activeTab === 'about' && <About />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-cyber-border py-8 px-6 bg-black/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6 font-mono text-[10px] text-gray-700">
            <span className="flex items-center gap-2"><Fingerprint className="size-3 text-cyber-red" /> TRACK_ID: {trackId}</span>
            <span className="hidden sm:inline border-l border-cyber-border pl-6">NODE_ADDR: 127.0.0.1</span>
          </div>
          <p className="font-mono text-[9px] text-gray-500 uppercase tracking-[0.5em] text-center">
            GARUDA_OSINT_NETWORK_NODE
          </p>
        </div>
      </footer>
    </div>
  );
}
