import React, { useState } from 'react';
import { Play, CheckCircle2, XCircle, FileText, Layers, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { CaseItem, CaseDetail } from '../types';
import { api } from '../services/api';

interface GuidedDemoPanelProps {
  cases: CaseItem[];
  onSelectCaseForInspector: (caseId: string) => void;
}

export const GuidedDemoPanel: React.FC<GuidedDemoPanelProps> = ({ cases, onSelectCaseForInspector }) => {
  const [selectedId, setSelectedId] = useState<string>('E01');
  const [activeCaseDetail, setActiveCaseDetail] = useState<CaseDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch selected case detail
  const handleSelectCase = async (id: string) => {
    setSelectedId(id);
    setLoading(true);
    try {
      const detail = await api.getCaseDetail(id);
      setActiveCaseDetail(detail);
    } catch (err) {
      console.error('Failed to fetch guided demo case:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load of E01 if activeCaseDetail is empty
  React.useEffect(() => {
    handleSelectCase('E01');
  }, []);

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20">
            <Play className="w-5 h-5 text-brand-primary fill-brand-primary/20" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-lg text-slate-100">Guided Demo (Offline Artifact Mode)</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-status-success/10 text-status-success border border-status-success/20">
                0% API Cost
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Guided Demo không thực hiện external LLM/API call và không phát sinh chi phí. Dữ liệu lấy trực tiếp từ artifacts thông qua backend.
            </p>
          </div>
        </div>
      </div>

      {/* Preset Question Selector */}
      <div className="space-y-2">
        <label className="text-xs font-mono text-slate-300 font-bold block">
          Chọn một câu hỏi mẫu trong Golden Dataset (20 Cases):
        </label>
        <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-2 bg-bg/80 rounded-2xl border border-slate-800">
          {cases.map((c) => (
            <button
              key={c.id}
              onClick={() => handleSelectCase(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center space-x-1.5 ${
                selectedId === c.id
                  ? 'bg-brand-primary text-bg font-bold shadow-md shadow-brand-primary/20'
                  : c.passed
                  ? 'bg-surface-light text-slate-300 hover:text-slate-100 hover:bg-surface-lighter border border-slate-800'
                  : 'bg-status-danger/10 text-status-danger hover:bg-status-danger/20 border border-status-danger/20'
              }`}
            >
              <span>{c.id}</span>
              <span className="text-[10px] opacity-75">({c.difficulty[0].toUpperCase()})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Demo Output Panel */}
      {loading || !activeCaseDetail ? (
        <div className="p-12 text-center text-slate-400 font-mono text-xs animate-pulse">
          Đang tải dữ liệu Guided Demo cho case {selectedId}...
        </div>
      ) : (
        <div className="space-y-6 pt-2">
          {/* Question Box */}
          <div className="bg-bg/90 p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-brand-primary font-bold">Question (ID: {activeCaseDetail.id}):</span>
              <span className="text-slate-400 capitalize">Difficulty: {activeCaseDetail.difficulty}</span>
            </div>
            <p className="text-sm font-semibold text-slate-100">{activeCaseDetail.question}</p>
          </div>

          {/* Actual Answer Box */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-brand-secondary" />
                <span className="font-bold text-xs text-slate-200 font-mono">Actual RAG Answer (Model: openai/gpt-4o-mini):</span>
              </div>
              <div>
                {activeCaseDetail.passed ? (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-status-success/10 text-status-success text-xs font-mono border border-status-success/20">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>PASSED</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-status-danger/10 text-status-danger text-xs font-mono border border-status-danger/20">
                    <XCircle className="w-3 h-3" />
                    <span>FAILED ({activeCaseDetail.failure_type})</span>
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed font-mono bg-bg/80 p-4 rounded-xl border border-slate-800">
              {activeCaseDetail.actual_answer}
            </p>

            <div className="flex justify-end">
              <button
                onClick={() => onSelectCaseForInspector(activeCaseDetail.id)}
                className="text-xs font-mono text-brand-primary hover:underline flex items-center space-x-1"
              >
                <span>Soi chi tiết Word-level Diff & 5-Whys</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 5 Metrics Cards Grid */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-slate-300 font-bold block">Kết quả 5 Metrics RAGAS (Offline Artifact):</span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-xs">
              <div className="bg-bg/90 p-3 rounded-xl border border-slate-800 text-center">
                <div className="text-[10px] text-slate-500 mb-1">Faithfulness</div>
                <div className="text-base font-extrabold text-brand-primary">
                  {activeCaseDetail.metrics.faithfulness?.toFixed(3) ?? 'N/A'}
                </div>
              </div>

              <div className="bg-bg/90 p-3 rounded-xl border border-slate-800 text-center">
                <div className="text-[10px] text-slate-500 mb-1">Relevance</div>
                <div className="text-base font-extrabold text-brand-secondary">
                  {activeCaseDetail.metrics.relevance?.toFixed(3) ?? 'N/A'}
                </div>
              </div>

              <div className="bg-bg/90 p-3 rounded-xl border border-slate-800 text-center">
                <div className="text-[10px] text-slate-500 mb-1">Completeness</div>
                <div className="text-base font-extrabold text-brand-accent">
                  {activeCaseDetail.metrics.completeness?.toFixed(3) ?? 'N/A'}
                </div>
              </div>

              <div className="bg-bg/90 p-3 rounded-xl border border-slate-800 text-center">
                <div className="text-[10px] text-slate-500 mb-1">Ctx Recall</div>
                <div className="text-base font-extrabold text-status-success">
                  {activeCaseDetail.metrics.context_recall?.toFixed(3) ?? 'N/A'}
                </div>
              </div>

              <div className="bg-bg/90 p-3 rounded-xl border border-slate-800 text-center col-span-2 sm:col-span-1">
                <div className="text-[10px] text-slate-500 mb-1">Ctx Precision</div>
                <div className="text-base font-extrabold text-status-warning">
                  {activeCaseDetail.metrics.context_precision?.toFixed(3) ?? 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Evidence Citations Snippets */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-slate-300 font-bold block">Chứng Cứ Trích Xuất (Retrieved Chunks):</span>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {activeCaseDetail.retrieved_contexts.map((ctx, idx) => (
                <div key={idx} className="bg-bg/90 p-3 rounded-xl border border-slate-800 text-xs">
                  <div className="flex items-center justify-between text-brand-primary font-mono text-[11px] mb-1">
                    <span>Rank {idx + 1}: {ctx.source_doc}</span>
                    {ctx.score && <span>BM25 Score: {ctx.score.toFixed(2)}</span>}
                  </div>
                  <p className="text-slate-300 font-sans leading-relaxed">{ctx.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
