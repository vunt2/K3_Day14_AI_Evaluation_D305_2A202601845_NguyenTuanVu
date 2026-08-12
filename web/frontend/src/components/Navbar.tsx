import React from 'react';
import { ShieldCheck, Cpu, BarChart3, Database, MessageSquare, Terminal } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  liveChatAvailable: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, liveChatAvailable }) => {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('overview')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary via-brand-secondary to-brand-accent p-0.5 shadow-lg shadow-brand-primary/20">
            <div className="w-full h-full bg-bg rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-brand-primary" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-slate-100 tracking-tight text-lg">AI Evaluation</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary font-mono border border-brand-primary/20">Lab Portfolio</span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono hidden sm:block">Northstar Student Services RAG</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1 bg-surface-light/50 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'overview'
                ? 'bg-brand-primary text-bg font-semibold shadow-md shadow-brand-primary/20'
                : 'text-slate-300 hover:text-slate-100 hover:bg-surface-lighter/50'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Tổng Quan Story</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'dashboard'
                ? 'bg-brand-primary text-bg font-semibold shadow-md shadow-brand-primary/20'
                : 'text-slate-300 hover:text-slate-100 hover:bg-surface-lighter/50'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Dashboard & 20 Cases</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'chat'
                ? 'bg-brand-primary text-bg font-semibold shadow-md shadow-brand-primary/20'
                : 'text-slate-300 hover:text-slate-100 hover:bg-surface-lighter/50'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chatbot & Guided Demo</span>
            {liveChatAvailable && (
              <span className="w-2 h-2 rounded-full bg-status-success animate-pulse"></span>
            )}
          </button>
        </nav>

        {/* Action Button */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              const el = document.getElementById('work-completed');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              else setActiveTab('overview');
            }}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-surface-light hover:bg-surface-lighter border border-slate-700 text-slate-200 text-xs font-mono transition-all"
          >
            <Terminal className="w-3.5 h-3.5 text-brand-secondary" />
            <span>Vũ's Deliverables</span>
          </button>
        </div>
      </div>
    </header>
  );
};
