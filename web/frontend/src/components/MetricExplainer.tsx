import React from 'react';
import { Target, CheckCircle2, HelpCircle, FileCheck, Layers, Award } from 'lucide-react';
import { SummaryData } from '../types';

interface MetricExplainerProps {
  summary: SummaryData | null;
}

export const MetricExplainer: React.FC<MetricExplainerProps> = ({ summary }) => {
  const metrics = [
    {
      id: "faithfulness",
      name: "Faithfulness (Groundedness)",
      side: "Generation-side",
      score: summary ? summary.avg_faithfulness : 0.555,
      desc: "Câu trả lời có bám sát tài liệu hay tự bịa ra thông tin?",
      explanation: "Đo tỉ lệ các ý khẳng định trong câu trả lời có bằng chứng trực tiếp hỗ trợ trong văn bản trích xuất hay không.",
      example: "Nếu context ghi học phí $420, nhưng AI trả lời $450 -> Faithfulness bị trừ điểm.",
      icon: FileCheck,
      color: "text-brand-primary",
      bg: "bg-brand-primary/10",
      border: "border-brand-primary/30"
    },
    {
      id: "relevance",
      name: "Answer Relevance",
      side: "Generation-side",
      score: summary ? summary.avg_relevance : 0.664,
      desc: "Câu trả lời có đi thẳng vào trọng tâm thắc mắc không?",
      explanation: "Đo mức độ tương quan giữa câu trả lời và câu hỏi của sinh viên, phạt câu trả lời lan man ngoài lề.",
      example: "Hỏi về học phí nhưng AI trả lời về quy chế điểm số -> Relevance bị trừ điểm.",
      icon: Target,
      color: "text-brand-secondary",
      bg: "bg-brand-secondary/10",
      border: "border-brand-secondary/30"
    },
    {
      id: "completeness",
      name: "Completeness",
      side: "Generation-side",
      score: summary ? summary.avg_completeness : 0.769,
      desc: "Câu trả lời có cung cấp đủ các điều kiện kỳ vọng không?",
      explanation: "Đo tỷ lệ nội dung trả lời bao phủ được đầy đủ các ý trong câu trả lời chuẩn (Expected Answer).",
      example: "Late add cần 2 phê duyệt + nộp $40. Nếu AI quên nhắc đến lệ phí $40 -> Completeness giảm.",
      icon: CheckCircle2,
      color: "text-brand-accent",
      bg: "bg-brand-accent/10",
      border: "border-brand-accent/30"
    },
    {
      id: "context_recall",
      name: "Context Recall",
      side: "Retrieval-side",
      score: summary ? summary.avg_context_recall : 0.944,
      desc: "Bộ tìm kiếm có lấy đúng và đủ tài liệu chứa đáp án không?",
      explanation: "Đo tỉ lệ câu trong câu trả lời kỳ vọng có thể tìm thấy chứng cứ hỗ trợ trong tập chunks lấy về.",
      example: "Nếu tài liệu lấy về bỏ sót quy định bảo lưu học bổng -> Context Recall thấp.",
      icon: Layers,
      color: "text-status-success",
      bg: "bg-status-success/10",
      border: "border-status-success/30"
    },
    {
      id: "context_precision",
      name: "Context Precision",
      side: "Retrieval-side",
      score: summary ? summary.avg_context_precision : 0.955,
      desc: "Đoạn tài liệu quan trọng nhất có nằm ở vị trí đầu tiên không?",
      explanation: "Đo chất lượng sắp xếp thứ tự (ranking): thưởng điểm cao khi các chunk chứa chứng cứ đúng nằm ở Rank 1, Rank 2.",
      example: "Nếu chunk đúng nằm ở Rank 1 -> Precision = 1.0. Nếu bị đẩy xuống Rank 5 -> Precision giảm.",
      icon: Award,
      color: "text-status-warning",
      bg: "bg-status-warning/10",
      border: "border-status-warning/30"
    }
  ];

  return (
    <section className="py-20 border-b border-slate-800/60 bg-surface/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-accent/10 text-brand-accent text-xs font-mono mb-3 border border-brand-accent/20">
            <Award className="w-3.5 h-3.5" />
            <span>Thước Đo Chất Lượng Tự Động</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight mb-4">
            Giải Thích 5 Evaluation Metrics Trong RAGAS
          </h2>
          <p className="text-slate-300 text-base leading-relaxed">
            Thay vì đánh giá bằng cảm tính, hệ thống đo lường AI bằng 5 chỉ số định lượng chia làm 2 nhóm: <strong className="text-slate-100 font-semibold">Generation-side</strong> (chất lượng câu văn) và <strong className="text-slate-100 font-semibold">Retrieval-side</strong> (chất lượng truy xuất tài liệu).
          </p>
        </div>

        {/* 5 Metrics Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map((m) => {
            const Icon = m.icon;
            const pct = (m.score * 100).toFixed(1);
            return (
              <div key={m.id} className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between hover:border-slate-600 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold ${m.bg} ${m.color} border ${m.border}`}>
                      {m.side}
                    </div>
                    <div className="flex items-baseline space-x-1 font-mono">
                      <span className="text-2xl font-extrabold text-slate-100">{m.score.toFixed(3)}</span>
                      <span className="text-xs text-slate-400">({pct}%)</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2.5 mb-2">
                    <Icon className={`w-5 h-5 ${m.color}`} />
                    <h3 className="font-bold text-base text-slate-100">{m.name}</h3>
                  </div>

                  <p className="text-xs font-medium text-slate-300 mb-3">{m.desc}</p>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{m.explanation}</p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 bg-bg/50 p-3 rounded-xl">
                  <div className="flex items-start space-x-2">
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                    <p className="text-[11px] text-slate-400 italic leading-normal">{m.example}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
