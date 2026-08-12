import React from 'react';
import { AlertCircle, Eye, ShieldAlert, Sliders, RefreshCcw } from 'lucide-react';

export const LimitationsSection: React.FC = () => {
  const limitations = [
    {
      title: "Hạn Chế Của Phép Đo Word-Overlap",
      desc: "Heuristic trùng từ vựng không hiểu ngữ nghĩa (semantics). Nó có thể phạt điểm các câu trả lời viết súc tích hoặc đúng ngữ nghĩa nhưng dùng từ khác.",
      icon: Eye,
      tag: "Semantic Gap"
    },
    {
      title: "Hình Phạt Paraphrase (Paraphrase Penalty)",
      desc: "Nếu LLM Generator diễn đạt lại bằng từ đồng nghĩa hoặc cấu trúc câu mới so với text gốc, điểm Faithfulness sẽ bị sụt giảm dù câu trả lời đúng.",
      icon: Sliders,
      tag: "Heuristic Bias"
    },
    {
      title: "Báo Lỗi Giả Đối Với Refusal An Toàn",
      desc: "Khi AI từ chối đúng quy chuẩn trước các câu hỏi Prompt Injection (A02) hay Out-of-Scope (A01), câu trả lời ngắn làm điểm Word-Overlap bị chấm rất thấp.",
      icon: ShieldAlert,
      tag: "Refusal Anomaly"
    },
    {
      title: "Mẫu Benchmark Nhỏ (20 Cases)",
      desc: "Tập 20 QA là bước kiểm thử baseline chuẩn hóa đại diện, nhưng chưa thể bao phủ 100% tất cả các tình huống sinh viên hỏi trong thực tế.",
      icon: AlertCircle,
      tag: "Sample Size"
    },
    {
      title: "Biến Thiên Output Của LLM",
      desc: "Câu trả lời của LLM có thể thay đổi nhẹ giữa các lần chạy do tính chất ngẫu nhiên. Cần tích hợp CI/CD để đánh giá liên tục (Continuous Evaluation).",
      icon: RefreshCcw,
      tag: "LLM Non-determinism"
    }
  ];

  return (
    <section className="py-20 border-b border-slate-800/60 bg-surface/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-status-warning/10 text-status-warning text-xs font-mono mb-3 border border-status-warning/20">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Tư Duy Đánh Giá Khách Quan</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight mb-4">
            Giới Hạn Của Phương Pháp Đánh Giá
          </h2>
          <p className="text-slate-300 text-base leading-relaxed">
            Một tư duy AI Engineering nghiêm túc luôn đi kèm việc nhìn nhận trung thực các giới hạn kỹ thuật để không ngừng cải tiến hệ thống trong tương lai.
          </p>
        </div>

        {/* 5 Limitations Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {limitations.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between hover:border-slate-600 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-9 h-9 rounded-xl bg-status-warning/10 flex items-center justify-center border border-status-warning/20">
                      <Icon className="w-4.5 h-4.5 text-status-warning" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-bg text-slate-400 border border-slate-800">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-100 mb-2">{item.title}</h3>
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
