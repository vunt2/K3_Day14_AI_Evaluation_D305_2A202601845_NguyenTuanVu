import React from 'react';
import { HelpCircle, Search, Cpu, CheckSquare, SearchCode, RefreshCw } from 'lucide-react';

export const PipelineDiagram: React.FC = () => {
  const steps = [
    {
      num: "01",
      title: "Student Question",
      role: "Đầu vào",
      icon: HelpCircle,
      desc: "Sinh viên gửi câu hỏi thắc mắc về học phí, deadline hay quy chế.",
      color: "from-blue-500 to-cyan-500",
      textColor: "text-cyan-400"
    },
    {
      num: "02",
      title: "Retrieve Evidence",
      role: "Retriever (BM25)",
      icon: Search,
      desc: "Giống thủ thư nhanh chóng tìm đúng 5 đoạn tài liệu chính sách liên quan nhất.",
      color: "from-cyan-500 to-teal-500",
      textColor: "text-teal-400"
    },
    {
      num: "03",
      title: "Generate Answer",
      role: "Generator (LLM)",
      icon: Cpu,
      desc: "Tổng hợp thông tin từ chứng cứ để viết nên câu trả lời mạch lạc.",
      color: "from-teal-500 to-indigo-500",
      textColor: "text-indigo-400"
    },
    {
      num: "04",
      title: "Evaluate Metrics",
      role: "Evaluator (RAGAS)",
      icon: CheckSquare,
      desc: "Giáo viên chấm bài tự động khắt khe qua 5 thước đo chất lượng.",
      color: "from-indigo-500 to-purple-500",
      textColor: "text-purple-400"
    },
    {
      num: "05",
      title: "Failure Analysis",
      role: "Analyzer (5 Whys)",
      icon: SearchCode,
      desc: "Thám tử mổ xẻ ca thất bại để tìm nguyên nhân gốc và cải tiến.",
      color: "from-purple-500 to-pink-500",
      textColor: "text-pink-400"
    }
  ];

  return (
    <section className="py-20 border-b border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-mono mb-3 border border-brand-primary/20">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Quy Trình Hoạt Động End-to-End</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight mb-4">
            Hệ Thống RAG & Evaluation Hoạt Động Như Thế Nào?
          </h2>
          <p className="text-slate-300 text-base leading-relaxed">
            Quy trình khép kín 5 bước đảm bảo mọi phản hồi AI đưa ra đều được trích xuất bằng chứng, tự động chấm điểm và liên tục được tối ưu hóa.
          </p>
        </div>

        {/* 5 Steps Pipeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="glass-panel p-5 rounded-2xl border border-slate-800 relative flex flex-col justify-between group hover:border-slate-600 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs text-slate-500 font-bold">{step.num}</span>
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${step.color} p-0.5 shadow-md`}>
                      <div className="w-full h-full bg-bg rounded-[10px] flex items-center justify-center">
                        <Icon className={`w-4 h-4 ${step.textColor}`} />
                      </div>
                    </div>
                  </div>

                  <h3 className="font-bold text-sm text-slate-100 mb-1">{step.title}</h3>
                  <div className={`text-[11px] font-mono mb-3 font-semibold ${step.textColor}`}>{step.role}</div>
                  <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
