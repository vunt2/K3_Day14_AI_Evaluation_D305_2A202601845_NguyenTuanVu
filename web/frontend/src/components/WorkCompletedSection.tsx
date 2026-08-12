import React from 'react';
import { CheckCircle2, Terminal, ShieldCheck, Code, FileJson, Cpu, Search, Lock, GitBranch } from 'lucide-react';

export const WorkCompletedSection: React.FC = () => {
  const items = [
    {
      title: "Lập trình Evaluation Core Engine",
      desc: "Cài đặt đầy đủ 5 RAGAS Metrics, Data models, BenchmarkRunner và FailureAnalyzer trong template.py / solution.py.",
      icon: Code,
      badge: "Task 1 Completed"
    },
    {
      title: "Xây dựng Golden Dataset 20 QA Pairs",
      desc: "Thiết kế bộ câu hỏi chuẩn Stratified Sampling: 5 Easy, 7 Medium, 5 Hard, 3 Adversarial bao phủ 10/10 tài liệu.",
      icon: FileJson,
      badge: "Task 2 Completed"
    },
    {
      title: "Kiểm tra Evidence Provenance (Verbatim Match)",
      desc: "100% các đoạn text chứng cứ trong contexts đều là exact verbatim substring từ tài liệu nguồn, đạt PASS trên script validator.",
      icon: ShieldCheck,
      badge: "Validator PASS"
    },
    {
      title: "Chạy RAG Thực tế qua OpenRouter API",
      desc: "Gửi 20 câu hỏi tới model openai/gpt-4o-mini, sinh ra 20 actual answers lưu tại artifacts/actual_answers.json.",
      icon: Cpu,
      badge: "Task 3 Completed"
    },
    {
      title: "Chấm điểm Benchmark Tự động",
      desc: "Xuất báo cáo artifacts/benchmark_results.json ghi nhận Overall Pass Rate 60.0%, Recall 0.944, Precision 0.955.",
      icon: Terminal,
      badge: "Benchmark Artifact"
    },
    {
      title: "Thiết kế LLM-as-a-Judge Rubric 1–5 Điểm",
      desc: "Xây dựng tiêu chí chấm điểm domain-specific cho Student Services, xử lý Edge Cases và kiểm soát Bias.",
      icon: CheckCircle2,
      badge: "Rubric Design"
    },
    {
      title: "Phân tích 5 Whys cho Top 3 Failures",
      desc: "Mổ xẻ nguyên nhân gốc rễ (Root Cause) cho ca A02, A01, H01 từ bằng chứng vết trace thực tế.",
      icon: Search,
      badge: "Failure Analysis"
    },
    {
      title: "Thử nghiệm Retrieval Reranking",
      desc: "Implement rerank_by_overlap(), chứng minh Context Precision tăng từ 0.902 lên 1.000 trong khi Recall giữ nguyên.",
      icon: GitBranch,
      badge: "Bonus Task 3.5"
    },
    {
      title: "Xây dựng Regression Strategy cho CI/CD",
      desc: "Quy định ngưỡng sụt giảm score 0.05, phân loại chỉ số Block Deployment vs Alert Only cho hệ thống Production.",
      icon: Lock,
      badge: "CI/CD Strategy"
    },
    {
      title: "Đạt 42/42 Automated Tests PASSED",
      desc: "Toàn bộ 42 unit test cases trong tests/test_solution.py đều vượt qua kiểm thử với tỉ lệ thành công 100%.",
      icon: CheckCircle2,
      badge: "100% Pytest PASS"
    }
  ];

  return (
    <section id="work-completed" className="py-20 border-b border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-status-success/10 text-status-success text-xs font-mono mb-3 border border-status-success/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Thành Quả Đã Thực Hiện</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight mb-4">
            Checklist Những Hạng Mục Vũ Đã Hoàn Thành
          </h2>
          <p className="text-slate-300 text-base leading-relaxed">
            Danh sách 10 thành quả cốt lõi đã được xây dựng, kiểm thử và đóng gói hoàn chỉnh trong bài lab Day 14.
          </p>
        </div>

        {/* 10 Items Grid */}
        <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="glass-panel p-5 rounded-2xl border border-slate-800/80 flex items-start space-x-4 hover:border-slate-600 transition-all">
                <div className="w-10 h-10 rounded-xl bg-status-success/10 flex items-center justify-center border border-status-success/20 shrink-0 mt-0.5">
                  <Icon className="w-5 h-5 text-status-success" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-sm text-slate-100">{item.title}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-surface-lighter text-slate-300 border border-slate-700">
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
