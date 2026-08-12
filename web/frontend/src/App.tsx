import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProblemSection } from './components/ProblemSection';
import { PipelineDiagram } from './components/PipelineDiagram';
import { MetricExplainer } from './components/MetricExplainer';
import { WorkCompletedSection } from './components/WorkCompletedSection';
import { LimitationsSection } from './components/LimitationsSection';
import { BenchmarkDashboard } from './components/BenchmarkDashboard';
import { DatasetExplorer } from './components/DatasetExplorer';
import { CaseInspectorDrawer } from './components/CaseInspectorDrawer';
import { FailureAnalysisTimeline } from './components/FailureAnalysisTimeline';
import { GuidedDemoPanel } from './components/GuidedDemoPanel';
import { LiveChatPanel } from './components/LiveChatPanel';
import { Footer } from './components/Footer';

import { Play, MessageSquare } from 'lucide-react';
import { api } from './services/api';
import { SummaryData, CaseItem } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [chatMode, setChatMode] = useState<'guided' | 'live'>('guided');
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [liveChatAvailable, setLiveChatAvailable] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function initData() {
      try {
        const health = await api.checkHealth();
        setLiveChatAvailable(health.live_chat_available);

        const summaryData = await api.getSummary();
        setSummary(summaryData);

        const casesData = await api.getCases();
        setCases(casesData);
      } catch (err) {
        console.warn('Backend API connection warning:', err);
        // Fallback default summary if API is temporarily unavailable
        setSummary({
          total: 20,
          passed: 12,
          pass_rate: 0.6,
          avg_faithfulness: 0.555,
          avg_relevance: 0.664,
          avg_completeness: 0.769,
          avg_context_recall: 0.944,
          avg_context_precision: 0.955,
          failure_types: { off_topic: 3, hallucination: 5 },
        });
      } finally {
        setLoading(false);
      }
    }
    initData();
  }, []);

  const handleExplore = () => {
    setActiveTab('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTryChat = () => {
    setActiveTab('chat');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCase = (caseId: string) => {
    setSelectedCaseId(caseId);
  };

  return (
    <div className="min-h-screen bg-bg text-slate-100 flex flex-col font-sans selection:bg-brand-primary selection:text-bg">
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        liveChatAvailable={liveChatAvailable}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'overview' && (
          <>
            <HeroSection
              summary={summary}
              onExplore={handleExplore}
              onTryChat={handleTryChat}
            />
            <ProblemSection />
            <PipelineDiagram />
            <MetricExplainer summary={summary} />
            <WorkCompletedSection />
            <LimitationsSection />
          </>
        )}

        {activeTab === 'dashboard' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-brand-primary mb-2">
                <span>Phase 3</span>
                <span>•</span>
                <span>Interactive Analytics</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
                Benchmark Dashboard & Dataset Inspector
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Phân tích chi tiết 20 test cases, 5 RAGAS metrics và mổ xẻ nguyên nhân thất bại 5-Whys.
              </p>
            </div>

            {/* Section A: Benchmark Dashboard Charts */}
            <BenchmarkDashboard
              summary={summary}
              cases={cases}
              onSelectCase={handleSelectCase}
            />

            {/* Section B: Dataset Explorer Grid */}
            <DatasetExplorer
              cases={cases}
              onSelectCase={handleSelectCase}
            />

            {/* Section C: Failure Analysis Timeline */}
            <FailureAnalysisTimeline />
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-brand-primary mb-2">
                <span>Phase 4 & 5</span>
                <span>•</span>
                <span>Interactive Chatbot</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
                Trải Nghiệm Chatbot & AI Evaluation Live
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Thử nghiệm hai chế độ: Guided Demo (0% API cost từ Artifacts) hoặc Live Chat thời gian thực.
              </p>
            </div>

            {/* Sub-nav Mode Toggle */}
            <div className="flex items-center space-x-2 bg-surface-light p-1.5 rounded-2xl border border-slate-800 max-w-md">
              <button
                onClick={() => setChatMode('guided')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                  chatMode === 'guided'
                    ? 'bg-brand-primary text-bg shadow-md shadow-brand-primary/20'
                    : 'text-slate-300 hover:text-slate-100'
                }`}
              >
                <Play className="w-3.5 h-3.5" />
                <span>Guided Demo (0% Cost)</span>
              </button>

              <button
                onClick={() => setChatMode('live')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                  chatMode === 'live'
                    ? 'bg-brand-secondary text-slate-100 shadow-md shadow-brand-secondary/20'
                    : 'text-slate-300 hover:text-slate-100'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Live Chat (Real-Time)</span>
              </button>
            </div>

            {/* Render selected chat mode panel */}
            {chatMode === 'guided' ? (
              <GuidedDemoPanel
                cases={cases}
                onSelectCaseForInspector={handleSelectCase}
              />
            ) : (
              <LiveChatPanel />
            )}
          </div>
        )}
      </main>

      {/* Case Inspector Drawer/Modal */}
      <CaseInspectorDrawer
        caseId={selectedCaseId}
        onClose={() => setSelectedCaseId(null)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
