import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { BarChart3, PieChart as PieIcon, AlertOctagon, Trophy, ShieldAlert } from 'lucide-react';
import { SummaryData, CaseItem } from '../types';

interface BenchmarkDashboardProps {
  summary: SummaryData | null;
  cases: CaseItem[];
  onSelectCase: (caseId: string) => void;
}

export const BenchmarkDashboard: React.FC<BenchmarkDashboardProps> = ({
  summary,
  cases,
  onSelectCase,
}) => {
  const total = summary ? summary.total : 20;
  const passed = summary ? summary.passed : 12;
  const failed = total - passed;
  const passRatePct = summary ? (summary.pass_rate * 100).toFixed(1) : '60.0';

  // Donut chart data: Pass vs Fail
  const passFailData = [
    { name: 'Passed (Đạt)', value: passed, color: '#22c55e' },
    { name: 'Failed (Lỗi)', value: failed, color: '#ef4444' },
  ];

  // Bar chart data: 5 Metrics Averages
  const metricsData = [
    { name: 'Faithfulness', score: summary ? summary.avg_faithfulness : 0.555, fill: '#38bdf8' },
    { name: 'Relevance', score: summary ? summary.avg_relevance : 0.664, fill: '#818cf8' },
    { name: 'Completeness', score: summary ? summary.avg_completeness : 0.769, fill: '#c084fc' },
    { name: 'Ctx Recall', score: summary ? summary.avg_context_recall : 0.944, fill: '#22c55e' },
    { name: 'Ctx Precision', score: summary ? summary.avg_context_precision : 0.955, fill: '#f59e0b' },
  ];

  // Difficulty stats calculation
  const difficultyStats: Record<string, { total: number; passed: number }> = {
    easy: { total: 0, passed: 0 },
    medium: { total: 0, passed: 0 },
    hard: { total: 0, passed: 0 },
    adversarial: { total: 0, passed: 0 },
  };

  cases.forEach((c) => {
    const diff = c.difficulty.toLowerCase();
    if (difficultyStats[diff]) {
      difficultyStats[diff].total += 1;
      if (c.passed) difficultyStats[diff].passed += 1;
    }
  });

  const difficultyData = [
    {
      name: 'Easy (Dễ)',
      passed: difficultyStats.easy.passed,
      failed: difficultyStats.easy.total - difficultyStats.easy.passed,
    },
    {
      name: 'Medium (Vừa)',
      passed: difficultyStats.medium.passed,
      failed: difficultyStats.medium.total - difficultyStats.medium.passed,
    },
    {
      name: 'Hard (Khó)',
      passed: difficultyStats.hard.passed,
      failed: difficultyStats.hard.total - difficultyStats.hard.passed,
    },
    {
      name: 'Adversarial (Tấn công)',
      passed: difficultyStats.adversarial.passed,
      failed: difficultyStats.adversarial.total - difficultyStats.adversarial.passed,
    },
  ];

  // Failure types distribution data
  const failureTypesData = summary
    ? Object.entries(summary.failure_types).map(([key, count]) => ({
        name: key === 'off_topic' ? 'Off Topic' : key === 'hallucination' ? 'Hallucination' : key,
        count: count,
      }))
    : [
        { name: 'Hallucination', count: 5 },
        { name: 'Off Topic', count: 3 },
      ];

  // Top 3 lowest cases sorted by overall_score
  const sortedCases = [...cases].sort((a, b) => a.overall_score - b.overall_score);
  const worst3Cases = sortedCases.slice(0, 3);

  return (
    <div className="space-y-12">
      {/* Top Benchmark Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-mono mb-1">Tỉ Lệ Đạt Benchmark</div>
            <div className="text-4xl font-extrabold font-mono text-status-warning">{passRatePct}%</div>
            <div className="text-xs text-slate-400 mt-1">{passed}/{total} Test Cases Passed</div>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-status-warning/10 border border-status-warning/20 flex items-center justify-center">
            <Trophy className="w-8 h-8 text-status-warning" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-mono mb-1">Chất Lượng Truy Xuất (Retrieval)</div>
            <div className="text-4xl font-extrabold font-mono text-status-success">0.950</div>
            <div className="text-xs text-slate-400 mt-1">Avg Recall 0.944 | Precision 0.955</div>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-status-success/10 border border-status-success/20 flex items-center justify-center">
            <BarChart3 className="w-8 h-8 text-status-success" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-mono mb-1">Chất Lượng Sinh Văn (Generation)</div>
            <div className="text-4xl font-extrabold font-mono text-brand-primary">0.663</div>
            <div className="text-xs text-slate-400 mt-1">Avg Faithfulness 0.555 | Relevance 0.664</div>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
            <PieIcon className="w-8 h-8 text-brand-primary" />
          </div>
        </div>
      </div>

      {/* Charts Grid 2x2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Donut Pass vs Fail */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-100 text-base">Phân Phối Trạng Thái Passed / Failed</h3>
              <p className="text-xs text-slate-400">12 ca thành công, 8 ca phát hiện lỗi</p>
            </div>
            <PieIcon className="w-5 h-5 text-brand-primary" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={passFailData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {passFailData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                  }}
                  itemStyle={{ color: '#f8fafc', fontSize: '12px', fontWeight: '600' }}
                  labelStyle={{ color: '#38bdf8', fontSize: '12px', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: 5 Metrics Averages Bar Chart */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-100 text-base">Điểm Trung Bình 5 Metrics RAGAS</h3>
              <p className="text-xs text-slate-400">Retrieval xuất sắc (0.95+), Generation cần cải thiện (0.55+)</p>
            </div>
            <BarChart3 className="w-5 h-5 text-brand-secondary" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metricsData} margin={{ top: 20, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3047" />
                <XAxis dataKey="name" stroke="#9eb0c5" fontSize={11} />
                <YAxis domain={[0, 1]} stroke="#9eb0c5" fontSize={11} />
                <Tooltip
                  formatter={(val: any) => [Number(val).toFixed(3), 'Score']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                  }}
                  itemStyle={{ color: '#f8fafc', fontSize: '12px', fontWeight: '600' }}
                  labelStyle={{ color: '#38bdf8', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                  {metricsData.map((entry, index) => (
                    <Cell key={`cell-m-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Difficulty Pass/Fail Stacked Bar */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-100 text-base">Tỉ Lệ Đạt Theo Cấp Độ Khó (Difficulty)</h3>
              <p className="text-xs text-slate-400">Easy/Medium đạt cao, Adversarial rơi vào nhóm thất bại</p>
            </div>
            <Trophy className="w-5 h-5 text-status-warning" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={difficultyData} margin={{ top: 20, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3047" />
                <XAxis dataKey="name" stroke="#9eb0c5" fontSize={11} />
                <YAxis stroke="#9eb0c5" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                  }}
                  itemStyle={{ color: '#f8fafc', fontSize: '12px', fontWeight: '600' }}
                  labelStyle={{ color: '#38bdf8', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="passed" name="Passed (Đạt)" fill="#22c55e" stackId="a" radius={[0, 0, 4, 4]} />
                <Bar dataKey="failed" name="Failed (Lỗi)" fill="#ef4444" stackId="a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Failure Types Distribution */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-100 text-base">Phân Phối Loại Lỗi (Failure Types)</h3>
              <p className="text-xs text-slate-400">5 ca Hallucination & 3 ca Off Topic</p>
            </div>
            <AlertOctagon className="w-5 h-5 text-status-danger" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={failureTypesData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3047" />
                <XAxis type="number" stroke="#9eb0c5" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#9eb0c5" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                  }}
                  itemStyle={{ color: '#f8fafc', fontSize: '12px', fontWeight: '600' }}
                  labelStyle={{ color: '#38bdf8', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Bar dataKey="count" fill="#ef4444" radius={[0, 8, 8, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top 3 Worst Cases Spotlight Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border-status-danger/30 bg-gradient-to-br from-surface to-status-danger/5">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-status-danger/10 flex items-center justify-center border border-status-danger/20">
              <ShieldAlert className="w-5 h-5 text-status-danger" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">Top 3 Ca Có Điểm Thấp Nhất (Worst Cases)</h3>
              <p className="text-xs text-slate-400">Các điểm kiểm thử cần ưu tiên mổ xẻ và sửa chữa</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {worst3Cases.map((c) => (
            <div
              key={c.id}
              onClick={() => onSelectCase(c.id)}
              className="bg-bg/90 p-5 rounded-2xl border border-slate-800 hover:border-status-danger/50 cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-status-danger px-2 py-0.5 rounded bg-status-danger/10 border border-status-danger/20">
                    ID: {c.id}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 uppercase">{c.difficulty}</span>
                </div>
                <h4 className="text-xs font-semibold text-slate-200 line-clamp-2 mb-3 group-hover:text-brand-primary transition-colors">
                  {c.question}
                </h4>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Overall Score:</span>
                <span className="font-bold text-status-danger">{c.overall_score.toFixed(3)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
