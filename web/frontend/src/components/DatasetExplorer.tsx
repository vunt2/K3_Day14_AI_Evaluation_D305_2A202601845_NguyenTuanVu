import React, { useState } from 'react';
import { Search, Filter, CheckCircle2, XCircle, ChevronRight, Database } from 'lucide-react';
import { CaseItem } from '../types';

interface DatasetExplorerProps {
  cases: CaseItem[];
  onSelectCase: (caseId: string) => void;
}

export const DatasetExplorer: React.FC<DatasetExplorerProps> = ({ cases, onSelectCase }) => {
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [failureTypeFilter, setFailureTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredCases = cases.filter((c) => {
    if (difficultyFilter !== 'all' && c.difficulty.toLowerCase() !== difficultyFilter.toLowerCase()) {
      return false;
    }
    if (statusFilter === 'passed' && !c.passed) return false;
    if (statusFilter === 'failed' && c.passed) return false;

    if (failureTypeFilter !== 'all') {
      if (failureTypeFilter === 'none' && c.failure_type !== null) return false;
      if (failureTypeFilter !== 'none' && c.failure_type?.toLowerCase() !== failureTypeFilter.toLowerCase()) {
        return false;
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = c.id.toLowerCase().includes(q);
      const matchQuestion = c.question.toLowerCase().includes(q);
      const matchExpected = c.expected_answer.toLowerCase().includes(q);
      const matchActual = c.actual_answer.toLowerCase().includes(q);
      if (!matchId && !matchQuestion && !matchExpected && !matchActual) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls Bar */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20">
              <Database className="w-5 h-5 text-brand-primary" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-100">Golden Dataset Explorer</h3>
              <p className="text-xs text-slate-400">Khám phá 20 tình huống kiểm thử bài lab</p>
            </div>
          </div>

          <div className="text-xs font-mono text-slate-400">
            Hiển thị <span className="text-brand-primary font-bold">{filteredCases.length}</span> / {cases.length} cases
          </div>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo ID, câu hỏi, từ khóa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-surface-light border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-primary font-sans"
            />
          </div>

          {/* Difficulty Filter */}
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="w-full px-3 py-2 bg-surface-light border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-brand-primary font-sans"
          >
            <option value="all">Tất cả Độ Khó (Difficulty)</option>
            <option value="easy">Easy (5 cases)</option>
            <option value="medium">Medium (7 cases)</option>
            <option value="hard">Hard (5 cases)</option>
            <option value="adversarial">Adversarial (3 cases)</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-surface-light border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-brand-primary font-sans"
          >
            <option value="all">Tất cả Trạng Thái (Passed/Failed)</option>
            <option value="passed">Passed (12 cases)</option>
            <option value="failed">Failed (8 cases)</option>
          </select>

          {/* Failure Type Filter */}
          <select
            value={failureTypeFilter}
            onChange={(e) => setFailureTypeFilter(e.target.value)}
            className="w-full px-3 py-2 bg-surface-light border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-brand-primary font-sans"
          >
            <option value="all">Tất cả Loại Lỗi (Failure Types)</option>
            <option value="hallucination">Hallucination (5 cases)</option>
            <option value="off_topic">Off Topic (3 cases)</option>
            <option value="none">Không có lỗi (Passed)</option>
          </select>
        </div>
      </div>

      {/* Cases Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCases.map((c) => {
          const isPassed = c.passed;
          return (
            <div
              key={c.id}
              onClick={() => onSelectCase(c.id)}
              className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-brand-primary/50 cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header info */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-brand-primary px-2.5 py-0.5 rounded-md bg-brand-primary/10 border border-brand-primary/20">
                      {c.id}
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-surface-light text-slate-300 capitalize border border-slate-700">
                      {c.difficulty}
                    </span>
                    {c.attack_type && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-status-danger/10 text-status-danger border border-status-danger/20">
                        {c.attack_type}
                      </span>
                    )}
                  </div>

                  {/* Pass / Fail badge */}
                  <div className="flex items-center space-x-1.5">
                    {isPassed ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-status-success/10 text-status-success text-xs font-mono border border-status-success/20">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Pass</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-status-danger/10 text-status-danger text-xs font-mono border border-status-danger/20">
                        <XCircle className="w-3 h-3" />
                        <span>Fail ({c.failure_type})</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Question */}
                <h4 className="text-sm font-semibold text-slate-100 mb-3 group-hover:text-brand-primary transition-colors">
                  {c.question}
                </h4>

                {/* Expected & Actual Snippets */}
                <div className="space-y-2 mb-4 text-xs font-mono">
                  <div className="bg-bg/60 p-2.5 rounded-lg border border-slate-800/80">
                    <span className="text-slate-500 font-bold block mb-0.5">Expected Answer:</span>
                    <p className="text-slate-300 line-clamp-2">{c.expected_answer}</p>
                  </div>
                </div>
              </div>

              {/* Footer info */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center space-x-2">
                  <span className="text-slate-500">Overall Score:</span>
                  <span className={`font-bold ${isPassed ? 'text-status-success' : 'text-status-danger'}`}>
                    {c.overall_score.toFixed(3)}
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-slate-400 group-hover:text-brand-primary transition-colors">
                  <span>Soi chi tiết</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}

        {filteredCases.length === 0 && (
          <div className="col-span-full glass-panel p-12 rounded-3xl text-center border border-slate-800">
            <p className="text-slate-400 text-sm">Không tìm thấy test case nào phù hợp với bộ lọc hiện tại.</p>
          </div>
        )}
      </div>
    </div>
  );
};
