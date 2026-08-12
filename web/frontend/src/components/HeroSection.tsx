import React from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, FileText, Activity, ArrowRight, Play, Database } from 'lucide-react';
import { SummaryData } from '../types';

interface HeroSectionProps {
  summary: SummaryData | null;
  onExplore: () => void;
  onTryChat: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ summary, onExplore, onTryChat }) => {
  const passRate = summary ? (summary.pass_rate * 100).toFixed(1) : '60.0';
  const total = summary ? summary.total : 20;
  const passed = summary ? summary.passed : 12;
  const failed = summary ? summary.total - summary.passed : 8;

  return (
    <section className="relative overflow-hidden pt-12 pb-20 border-b border-slate-800/60">
      {/* Glow background effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-brand-secondary/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Top Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-surface-light/80 border border-brand-primary/30 text-xs text-brand-primary font-mono mb-6 shadow-lg">
          <ShieldCheck className="w-4 h-4 text-brand-primary animate-pulse" />
          <span>Interactive Data Storytelling Portfolio · Day 14 AI Evaluation</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-100 tracking-tight max-w-4xl mx-auto leading-tight mb-6">
          Can We Trust This <span className="bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent bg-clip-text text-transparent">AI Assistant?</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
          Một câu trả lời nghe trôi chảy chưa chắc đã đúng. Website này minh họa cách xây dựng, kiểm thử, đo lường 5 metrics và cải thiện độ tin cậy của trợ lý AI dành cho <strong className="text-slate-100 font-semibold">Dịch vụ Sinh viên Northstar University</strong>.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
          <button
            onClick={onExplore}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary text-bg font-bold text-sm shadow-xl shadow-brand-primary/25 hover:shadow-brand-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center space-x-2"
          >
            <span>Khám phá 20 Test Cases</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onTryChat}
            className="px-6 py-3.5 rounded-xl bg-surface-light hover:bg-surface-lighter border border-slate-700 hover:border-slate-500 text-slate-100 font-semibold text-sm transition-all flex items-center space-x-2 shadow-lg"
          >
            <Play className="w-4 h-4 text-status-success fill-status-success" />
            <span>Thử Chatbot & Guided Demo</span>
          </button>
        </div>

        {/* 6 KPI Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 max-w-6xl mx-auto">
          <div className="glass-panel p-4 rounded-2xl text-left border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Test Cases</span>
              <Database className="w-4 h-4 text-brand-primary" />
            </div>
            <div className="text-2xl font-extrabold font-mono text-slate-100">{total}</div>
            <div className="text-[11px] text-slate-400 mt-1">Golden Dataset QA</div>
          </div>

          <div className="glass-panel p-4 rounded-2xl text-left border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Corpus Docs</span>
              <FileText className="w-4 h-4 text-brand-secondary" />
            </div>
            <div className="text-2xl font-extrabold font-mono text-slate-100">10/10</div>
            <div className="text-[11px] text-slate-400 mt-1">100% Policy Coverage</div>
          </div>

          <div className="glass-panel p-4 rounded-2xl text-left border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Evaluation</span>
              <Activity className="w-4 h-4 text-brand-accent" />
            </div>
            <div className="text-2xl font-extrabold font-mono text-slate-100">5</div>
            <div className="text-[11px] text-slate-400 mt-1">RAGAS Metrics</div>
          </div>

          <div className="glass-panel p-4 rounded-2xl text-left border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Unit Tests</span>
              <CheckCircle2 className="w-4 h-4 text-status-success" />
            </div>
            <div className="text-2xl font-extrabold font-mono text-status-success">42/42</div>
            <div className="text-[11px] text-slate-400 mt-1">100% Pytest Passed</div>
          </div>

          <div className="glass-panel p-4 rounded-2xl text-left border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Pass Rate</span>
              <CheckCircle2 className="w-4 h-4 text-status-warning" />
            </div>
            <div className="text-2xl font-extrabold font-mono text-status-warning">{passRate}%</div>
            <div className="text-[11px] text-slate-400 mt-1">{passed}/{total} Passed</div>
          </div>

          <div className="glass-panel p-4 rounded-2xl text-left border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Failures</span>
              <AlertTriangle className="w-4 h-4 text-status-danger" />
            </div>
            <div className="text-2xl font-extrabold font-mono text-status-danger">{failed}</div>
            <div className="text-[11px] text-slate-400 mt-1">5-Whys Analyzed</div>
          </div>
        </div>
      </div>
    </section>
  );
};
