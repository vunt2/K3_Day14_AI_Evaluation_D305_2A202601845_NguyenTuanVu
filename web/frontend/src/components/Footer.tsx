import React from 'react';
import { ShieldCheck, Heart, Github } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-12 bg-bg border-t border-slate-800/80 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-surface-light flex items-center justify-center border border-slate-700">
            <ShieldCheck className="w-4 h-4 text-brand-primary" />
          </div>
          <div>
            <div className="font-semibold text-slate-200 text-sm">Northstar Student Services RAG Evaluation</div>
            <p className="text-[11px] text-slate-500 font-mono">Xây dựng & Đóng gói bởi Nguyễn Tuấn Vũ (K3_Day14_AI_Evaluation_D305_2A202601845)</p>
          </div>
        </div>

        {/* Disclaimer Center */}
        <div className="text-center md:text-right text-[11px] text-slate-500 max-w-md">
          <p>⚠️ <strong>Disclaimer:</strong> Đây là sản phẩm portfolio bài lab giáo dục, không thay thế thông tin chính thức của Northstar University.</p>
        </div>
      </div>
    </footer>
  );
};
