import React, { useEffect, useState } from 'react';
import { SearchCode, Layers, GitBranch, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { FailureAnalysisData } from '../types';

export const FailureAnalysisTimeline: React.FC = () => {
  const [data, setData] = useState<FailureAnalysisData | null>(null);
  const [selectedFailureId, setSelectedFailureId] = useState<string>('A02');

  useEffect(() => {
    async function fetchFailureAnalysis() {
      try {
        const res = await api.getFailureAnalysis();
        setData(res);
      } catch (err) {
        console.error('Failed to fetch failure analysis:', err);
      }
    }
    fetchFailureAnalysis();
  }, []);

  if (!data) {
    return <div className="text-slate-400 font-mono text-xs text-center py-8">Đang tải phân tích 5-Whys...</div>;
  }

  const currentFailure = data.top_failures.find((f) => f.id === selectedFailureId) || data.top_failures[0];

  return (
    <div className="space-y-12">
      {/* 5 Whys Stepper Section */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-status-danger/10 flex items-center justify-center border border-status-danger/20">
              <SearchCode className="w-5 h-5 text-status-danger" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-100">Phân Tích Thất Bại Bằng Phương Pháp 5-Whys</h3>
              <p className="text-xs text-slate-400">Mổ xẻ nguyên nhân gốc rễ (Root Cause) từng bước một</p>
            </div>
          </div>

          {/* Failure Selection Buttons */}
          <div className="flex items-center space-x-2">
            {data.top_failures.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFailureId(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                  selectedFailureId === f.id
                    ? 'bg-status-danger text-slate-100 shadow-lg shadow-status-danger/20'
                    : 'bg-surface-light text-slate-400 hover:text-slate-200 border border-slate-700'
                }`}
              >
                Case {f.id}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Failure Details */}
        <div className="space-y-4">
          <div className="bg-bg/90 p-4 rounded-2xl border border-slate-800 font-mono text-xs">
            <div className="text-status-danger font-bold mb-1">Case ID {currentFailure.id}: {currentFailure.question}</div>
            <div className="text-slate-400 leading-relaxed">
              <strong className="text-slate-300">Expected:</strong> {currentFailure.expected_answer}
            </div>
          </div>

          {/* 5 Whys Vertical Timeline */}
          <div className="relative pl-6 space-y-4 border-l-2 border-slate-800 py-2">
            {currentFailure.five_whys.map((fw, idx) => (
              <div key={idx} className="relative group">
                {/* Timeline Dot */}
                <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-surface-lighter border-2 border-brand-primary group-hover:bg-brand-primary transition-colors" />

                <div className="bg-surface-light/60 p-3.5 rounded-xl border border-slate-800 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-brand-primary">{fw.level}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{fw.question}</span>
                  </div>
                  <p className="text-slate-200 font-sans leading-relaxed">{fw.answer}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Proposed Fix Box */}
          <div className="p-4 rounded-2xl bg-status-success/10 border border-status-success/20 text-xs text-slate-200 font-mono">
            <div className="flex items-center space-x-2 text-status-success font-bold mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Đề Xuất Khắc Phục (Proposed Fix):</span>
            </div>
            <p className="leading-relaxed">{currentFailure.proposed_fix}</p>
          </div>
        </div>
      </div>

      {/* Failure Clusters Grid */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-slate-200 font-bold text-base font-mono">
          <Layers className="w-4 h-4 text-brand-secondary" />
          <span>Nhóm Lỗi (Failure Clusters) & Mức Độ Ưu Tiên</span>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {data.clusters.map((c) => (
            <div key={c.cluster_id} className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-brand-secondary">Cluster #{c.cluster_id}</span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                      c.priority === 'High'
                        ? 'bg-status-danger/10 text-status-danger border-status-danger/20'
                        : 'bg-status-warning/10 text-status-warning border-status-warning/20'
                    }`}
                  >
                    Priority: {c.priority}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-100 mb-2">{c.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{c.root_cause}</p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500">Failures:</span>
                <div className="flex space-x-1">
                  {c.failure_ids.map((id) => (
                    <span key={id} className="px-1.5 py-0.5 rounded bg-bg text-slate-300 border border-slate-800">
                      {id}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Improvement Roadmap Section */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center space-x-2 text-slate-100 font-bold text-base font-mono">
          <GitBranch className="w-4 h-4 text-brand-accent" />
          <span>Lộ Trình Cải Tiến Chất Lượng (Improvement Roadmap)</span>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {data.improvement_roadmap.map((item) => (
            <div key={item.priority} className="bg-bg/90 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-brand-accent">Ưu tiên #{item.priority}</span>
                <span className="text-[10px] font-mono text-slate-400">{item.target_metric}</span>
              </div>
              <h5 className="font-bold text-xs text-slate-200">{item.action}</h5>
              <p className="text-[11px] text-slate-400 leading-normal">{item.expected_impact}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
