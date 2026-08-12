import React from 'react';
import { AlertOctagon, CheckCircle, XCircle, FileSearch, Scale } from 'lucide-react';

export const ProblemSection: React.FC = () => {
  return (
    <section className="py-20 border-b border-slate-800/60 bg-surface/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-status-warning/10 text-status-warning text-xs font-mono mb-3 border border-status-warning/20">
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Vấn Đề Thực Tế Cần Giải Quyết</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight mb-4">
            Tại Sao Cần Đánh Giá & Đo Lường AI?
          </h2>
          <p className="text-slate-300 text-base leading-relaxed">
            Nếu trợ lý AI đưa ra thông tin sai về học phí, deadline nộp hồ sơ hoặc điều kiện giữ học bổng, sinh viên có thể chịu thiệt hại lớn. <strong className="text-slate-100 font-semibold">Mộc câu trả lời lưu khoát không đồng nghĩa với câu trả lời chính xác.</strong>
          </p>
        </div>

        {/* Comparison Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Un-grounded AI Card */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border-status-danger/30 relative overflow-hidden bg-gradient-to-b from-surface to-status-danger/5">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-status-danger/10 flex items-center justify-center border border-status-danger/20">
                <XCircle className="w-5 h-5 text-status-danger" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100">AI Trôi Chảy Nhưng Bị Ảo Giác</h3>
                <p className="text-xs text-status-danger font-mono">Ungrounded / Hallucinating AI</p>
              </div>
            </div>

            <div className="bg-bg/80 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 mb-4 font-mono">
              <span className="text-slate-500">Sinh viên hỏi:</span> "Rút môn sau census date có được hoàn 100% học phí không?"
            </div>

            <div className="p-4 rounded-xl bg-status-danger/10 border border-status-danger/20 text-xs text-slate-200 leading-relaxed mb-6">
              <p className="font-semibold text-status-danger mb-1">❌ Phản hồi tự tin nhưng sai sự thật:</p>
              "Có chứ! Nhà trường hỗ trợ hoàn 100% bằng tiền mặt cho mọi trường hợp sinh viên rút học phần sau ngày census date."
            </div>

            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-status-danger"></span>
                <span>Không có tài liệu chứng cứ chứng minh</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-status-danger"></span>
                <span>Tạo tâm lý tin tưởng giả cho sinh viên</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-status-danger"></span>
                <span>Điểm Faithfulness = 0.0</span>
              </div>
            </div>
          </div>

          {/* Grounded AI Card */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border-status-success/30 relative overflow-hidden bg-gradient-to-b from-surface to-status-success/5">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-status-success/10 flex items-center justify-center border border-status-success/20">
                <CheckCircle className="w-5 h-5 text-status-success" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100">AI Có Kiểm Thử & Trích Dẫn Nguồn</h3>
                <p className="text-xs text-status-success font-mono">Grounded & Verified RAG AI</p>
              </div>
            </div>

            <div className="bg-bg/80 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 mb-4 font-mono">
              <span className="text-slate-500">Sinh viên hỏi:</span> "Rút môn sau census date có được hoàn 100% học phí không?"
            </div>

            <div className="p-4 rounded-xl bg-status-success/10 border border-status-success/20 text-xs text-slate-200 leading-relaxed mb-6">
              <p className="font-semibold text-status-success mb-1">✅ Phản hồi chính xác dựa trên quy định:</p>
              "Sau mốc census date (04/09), 0% học phí được hoàn trả cho các trường hợp rút môn thông thường."
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center space-x-2 text-brand-primary font-mono">
                <FileSearch className="w-3.5 h-3.5" />
                <span>Nguồn: 03_tuition_payment_refund.md (Paragraph 3)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-status-success"></span>
                <span>Được đối soát qua 5 RAGAS Evaluation Metrics</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-status-success"></span>
                <span>Điểm Groundedness = 1.0 (Bám sát tài liệu 100%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
