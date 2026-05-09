/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
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
  Fingerprint
} from 'lucide-react';
import UsernameSearch from './components/UsernameSearch';
import IPSearch from './components/IPSearch';
import NetworkTools from './components/NetworkTools';
import MetadataSearch from './components/MetadataSearch';
import About from './components/About';
import { cn } from './lib/utils';

type Tab = 'username' | 'ip' | 'network' | 'metadata' | 'about';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('username');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setBooting(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (booting) {
    return (
      <div className="fixed inset-0 bg-cyber-bg flex flex-col items-center justify-center space-y-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-cyber-blue"
        >
          <Cpu className="size-16 animate-pulse" />
        </motion.div>
        <div className="font-mono text-cyber-blue text-sm flex flex-col items-center">
          <p className="animate-pulse tracking-[0.4em]">INISIASI_PROTOKOL_JSTEAM...</p>
          <div className="w-64 h-[2px] bg-cyber-border mt-6 overflow-hidden">
            <motion.div 
              className="h-full bg-cyber-blue"
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
    { id: 'username', label: 'Cek Username', icon: Search },
    { id: 'ip', label: 'Lacak IP', icon: MapPin },
    { id: 'network', label: 'Info Domain', icon: Globe },
    { id: 'metadata', label: 'Cek Metadata', icon: ImageIcon },
    { id: 'about', label: 'Tentang JSTeam', icon: Info },
  ] as const;

  return (
    <div className="min-h-screen bg-cyber-bg flex flex-col selection:bg-cyber-blue selection:text-white">
      {/* Header */}
      <header className="border-b border-cyber-border bg-black/90 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-cyber-blue px-2 py-1 transition-colors duration-500">
              <Shield className="size-6 text-black" />
            </div>
            <h1 className="text-2xl font-sans font-bold uppercase tracking-[0.25em] text-white">
              JS<span className="text-cyber-blue">TEAM</span>
            </h1>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 bg-black/50 border border-cyber-border p-1 relative overflow-hidden">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={cn(
                  "px-6 py-2 text-[10px] font-mono tracking-[0.15em] uppercase transition-all flex items-center gap-3 relative z-10",
                  activeTab === tab.id 
                    ? "text-black font-bold" 
                    : "text-gray-500 hover:text-white"
                )}
              >
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute inset-0 bg-cyber-blue"
                    transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                  />
                )}
                <tab.icon className={cn("size-3 relative z-10", activeTab === tab.id ? "text-black" : "text-cyber-blue/50")} />
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-6">
            <div className="hidden xl:flex flex-col items-end font-mono text-[8px] text-gray-700 leading-none gap-1.5">
              <span className="flex items-center gap-1.5"><span className="w-1 h-1 bg-cyber-blue rounded-full" /> SISTEM: NOMINAL</span>
              <span>NODE: JAKARTA_SEC_TEAM</span>
            </div>
            <button 
              className="lg:hidden text-cyber-blue p-2 border border-cyber-border hover:bg-cyber-blue/10"
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
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="lg:hidden fixed inset-0 top-20 bg-black z-30 p-6 space-y-6 flex flex-col"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as Tab);
                  setIsMenuOpen(false);
                }}
                className={cn(
                  "w-full p-6 font-mono text-sm tracking-[0.2em] uppercase flex items-center gap-6 border transition-all",
                  activeTab === tab.id 
                    ? "bg-cyber-blue text-black border-cyber-blue shadow-[0_0_20px_rgba(14,165,233,0.2)]" 
                    : "border-cyber-border text-gray-500"
                )}
              >
                <tab.icon className="size-6" />
                {tab.label}
              </button>
            ))}
            <div className="mt-auto p-12 text-center opacity-10 grayscale">
                 <Shield className="size-32 mx-auto" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'username' && <UsernameSearch />}
            {activeTab === 'ip' && <IPSearch />}
            {activeTab === 'network' && <NetworkTools />}
            {activeTab === 'metadata' && <MetadataSearch />}
            {activeTab === 'about' && <About />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-cyber-border py-8 px-6 bg-black/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6 font-mono text-[10px] text-gray-700">
            <span className="flex items-center gap-2"><Fingerprint className="size-3" /> TRACK_ID: {Math.random().toString(36).substring(7).toUpperCase()}</span>
            <span className="hidden sm:inline border-l border-cyber-border pl-6">NODE_ADDR: 127.0.0.1</span>
          </div>
          <p className="font-mono text-[9px] text-gray-500 uppercase tracking-[0.4em] text-center">
            JSTEAM_OSINT_NETWORK_NODE
          </p>
        </div>
      </footer>
    </div>
  );
}
