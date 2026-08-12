import React, { useEffect, useState } from 'react';
import { X, CheckCircle2, XCircle, FileText, Layers, Target, Award, SearchCode, ShieldAlert } from 'lucide-react';
import { api } from '../services/api';
import { CaseDetail } from '../types';

interface CaseInspectorDrawerProps {
  caseId: string | null;
  onClose: () => void;
}

export const CaseInspectorDrawer: React.FC<CaseInspectorDrawerProps> = ({ caseId, onClose }) => {
  const [detail, setDetail] = useState<CaseDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!caseId) {
      setDetail(null);
      return;
    }

    async function fetchDetail() {
      setLoading(true);
      try {
        const data = await api.getCaseDetail(caseId!);
        setDetail(data);
      } catch (err) {
        console.error('Failed to fetch case detail:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDetail();
  }, [caseId]);

  if (!caseId) return null;

  // Simple Word-level comparison helper (safe HTML escaping)
  const renderWordDiff = (expected: string, actual: string) => {
    const expWords = new Set(expected.toLowerCase().split(/\s+/));
    const actWords = actual.split(/\s+/);

    return actWords.map((word, idx) => {
      const clean = word.toLowerCase().replace(/[^\w]/g, '');
      const isMatched = clean && expWords.has(clean);
      return (
        <span
          key={idx}
          className={
            isMatched
              ? 'text-status-success font-semibold'
              : 'text-slate-100 bg-status-warning/10 px-0.5 rounded'
          }
        >
          {word}{' '}
        </span>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-bg/80 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Click outside to close */}
      <div className="flex-1 cursor-pointer" onClick={onClose} />

      {/* Drawer content */}
      <div className="w-full max-w-2xl bg-surface border-l border-slate-800 h-full overflow-y-auto p-6 shadow-2xl flex flex-col justify-between">
        {loading || !detail ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-slate-400 font-mono text-sm animate-pulse">Đang tải thông tin case {caseId}...</div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-mono text-sm font-bold text-brand-primary px-3 py-1 rounded-lg bg-brand-primary/10 border border-brand-primary/20">
                    ID: {detail.id}
                  </span>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-surface-light text-slate-300 capitalize border border-slate-700">
                    {detail.difficulty}
                  </span>
                  {detail.attack_type && (
                    <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-status-danger/10 text-status-danger border border-status-danger/20">
                      {detail.attack_type}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-extrabold text-slate-100">{detail.question}</h3>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-surface-light hover:bg-surface-lighter flex items-center justify-center text-slate-400 hover:text-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Pass / Fail & Overall Score Header */}
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {detail.passed ? (
                  <div className="w-10 h-10 rounded-xl bg-status-success/10 border border-status-success/20 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-status-success" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-status-danger/10 border border-status-danger/20 flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-status-danger" />
                  </div>
                )}
                <div>
                  <div className="text-xs text-slate-400 font-mono">Trạng thái Đánh Giá</div>
                  <div className={`font-bold text-sm ${detail.passed ? 'text-status-success' : 'text-status-danger'}`}>
                    {detail.passed ? 'PASSED (Đạt Yêu Cầu)' : `FAILED (${detail.failure_type})`}
                  </div>
                </div>
              </div>

              <div className="text-right font-mono">
                <div className="text-xs text-slate-400">Overall Score</div>
                <div className={`text-2xl font-extrabold ${detail.passed ? 'text-status-success' : 'text-status-danger'}`}>
                  {detail.metrics.overall ? detail.metrics.overall.toFixed(3) : 'N/A'}
                </div>
              </div>
            </div>

            {/* Expected vs Actual Answer (Word-level Comparison) */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-200 uppercase font-mono tracking-wider">So Sánh Đáp Án</h4>

              <div className="bg-bg/90 p-4 rounded-xl border border-slate-800 font-mono text-xs leading-relaxed">
                <span className="text-slate-500 font-bold block mb-1">Expected Answer (Kỳ Vọng):</span>
                <p className="text-slate-200">{detail.expected_answer}</p>
              </div>

              <div className="bg-bg/90 p-4 rounded-xl border border-slate-800 font-mono text-xs leading-relaxed">
                <span className="text-brand-primary font-bold block mb-1">Actual Answer (AI Sinh Ra):</span>
                <p>{renderWordDiff(detail.expected_answer, detail.actual_answer)}</p>
                <div className="mt-2 text-[10px] text-slate-500 italic">
                  * Chữ màu xanh = Trùng khớp từ vựng với Expected Answer. Chữ màu trắng/vàng = Từ ngữ paraphrase hoặc bổ sung.
                </div>
              </div>
            </div>

            {/* 5 RAGAS Metrics Bars */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-200 uppercase font-mono tracking-wider">Chi Tiết 5 Metrics</h4>

              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <div className="bg-surface-light p-3 rounded-xl border border-slate-800">
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Faithfulness:</span>
                    <span className="font-bold text-brand-primary">{detail.metrics.faithfulness?.toFixed(3) ?? 'N/A'}</span>
                  </div>
                  <div className="w-full h-1.5 bg-bg rounded-full overflow-hidden">
                    <div className="h-full bg-brand-primary" style={{ width: `${(detail.metrics.faithfulness || 0) * 100}%` }}></div>
                  </div>
                </div>

                <div className="bg-surface-light p-3 rounded-xl border border-slate-800">
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Relevance:</span>
                    <span className="font-bold text-brand-secondary">{detail.metrics.relevance?.toFixed(3) ?? 'N/A'}</span>
                  </div>
                  <div className="w-full h-1.5 bg-bg rounded-full overflow-hidden">
                    <div className="h-full bg-brand-secondary" style={{ width: `${(detail.metrics.relevance || 0) * 100}%` }}></div>
                  </div>
                </div>

                <div className="bg-surface-light p-3 rounded-xl border border-slate-800">
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Completeness:</span>
                    <span className="font-bold text-brand-accent">{detail.metrics.completeness?.toFixed(3) ?? 'N/A'}</span>
                  </div>
                  <div className="w-full h-1.5 bg-bg rounded-full overflow-hidden">
                    <div className="h-full bg-brand-accent" style={{ width: `${(detail.metrics.completeness || 0) * 100}%` }}></div>
                  </div>
                </div>

                <div className="bg-surface-light p-3 rounded-xl border border-slate-800">
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Ctx Recall:</span>
                    <span className="font-bold text-status-success">{detail.metrics.context_recall?.toFixed(3) ?? 'N/A'}</span>
                  </div>
                  <div className="w-full h-1.5 bg-bg rounded-full overflow-hidden">
                    <div className="h-full bg-status-success" style={{ width: `${(detail.metrics.context_recall || 0) * 100}%` }}></div>
                  </div>
                </div>

                <div className="bg-surface-light p-3 rounded-xl border border-slate-800 col-span-2">
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Context Precision:</span>
                    <span className="font-bold text-status-warning">{detail.metrics.context_precision?.toFixed(3) ?? 'N/A'}</span>
                  </div>
                  <div className="w-full h-1.5 bg-bg rounded-full overflow-hidden">
                    <div className="h-full bg-status-warning" style={{ width: `${(detail.metrics.context_precision || 0) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Retrieved Evidence Chunks */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-200 uppercase font-mono tracking-wider">Chứng Cứ Trích Xuất (Retrieved Chunks)</h4>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {detail.retrieved_contexts.map((ctx, idx) => (
                  <div key={idx} className="bg-bg/80 p-3 rounded-xl border border-slate-800 text-xs">
                    <div className="flex items-center justify-between text-brand-primary font-mono mb-1">
                      <span>Rank {idx + 1}: {ctx.source_doc}</span>
                      {ctx.score && <span>BM25 Score: {ctx.score.toFixed(2)}</span>}
                    </div>
                    <p className="text-slate-300 leading-relaxed font-sans">{ctx.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 5 Whys Failure Analysis Section (If available) */}
            {detail.five_whys ? (
              <div className="glass-panel p-5 rounded-2xl border border-status-danger/30 bg-status-danger/5 space-y-4">
                <div className="flex items-center space-x-2 text-status-danger font-bold text-sm">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Phân Tích Nguyên Nhân Gốc Rễ (5 Whys Analysis)</span>
                </div>

                <div className="space-y-2 font-mono text-xs">
                  {detail.five_whys.map((fw, idx) => (
                    <div key={idx} className="bg-bg/80 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-status-warning font-bold">{fw.level}:</span>{' '}
                      <span className="text-slate-200">{fw.answer}</span>
                    </div>
                  ))}
                </div>

                {detail.proposed_fix && (
                  <div className="p-3 bg-status-success/10 border border-status-success/20 rounded-xl text-xs text-slate-200 font-mono">
                    <span className="text-status-success font-bold block mb-1">Proposed Fix:</span>
                    {detail.proposed_fix}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 bg-status-success/10 border border-status-success/20 rounded-2xl text-xs text-slate-300 font-mono flex items-center space-x-3">
                <CheckCircle2 className="w-5 h-5 text-status-success shrink-0" />
                <div>
                  <div className="font-bold text-status-success mb-0.5">Trạng thái 5-Whys:</div>
                  <p className="text-slate-300 font-sans">
                    {detail.passed
                      ? 'Case này đã PASSED thành công (không bị lỗi nên không cần mổ xẻ 5-Whys). Phân tích 5-Whys chi tiết áp dụng cho các ca thất bại (như A02, A01, H01).'
                      : 'Ca này không thuộc nhóm ca lỗi được mổ xẻ 5-Whys sâu trong bài lab.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
