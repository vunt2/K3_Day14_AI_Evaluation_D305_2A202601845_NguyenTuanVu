export interface SummaryData {
  total: number;
  passed: number;
  pass_rate: number;
  avg_faithfulness: number;
  avg_relevance: number;
  avg_completeness: number;
  avg_context_recall: number;
  avg_context_precision: number;
  failure_types: Record<string, number>;
}

export interface ContextItem {
  source_doc: string;
  text: string;
  chunk_id?: string;
  score?: number;
}

export interface MetricsDetail {
  faithfulness?: number | null;
  relevance?: number | null;
  completeness?: number | null;
  context_recall?: number | null;
  context_precision?: number | null;
  overall?: number | null;
}

export interface CaseItem {
  id: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'adversarial';
  question: string;
  expected_answer: string;
  actual_answer: string;
  source_docs: string[];
  overall_score: number;
  passed: boolean;
  failure_type?: string | null;
  attack_type?: string | null;
}

export interface FiveWhyItem {
  level: string;
  question: string;
  answer: string;
}

export interface TopFailureDetail {
  id: string;
  question: string;
  expected_answer: string;
  actual_answer: string;
  scores: Record<string, number>;
  five_whys: FiveWhyItem[];
  root_cause: string;
  proposed_fix: string;
}

export interface CaseDetail extends CaseItem {
  contexts: ContextItem[];
  retrieved_contexts: ContextItem[];
  metrics: MetricsDetail;
  five_whys?: FiveWhyItem[] | null;
  root_cause?: string | null;
  proposed_fix?: string | null;
}

export interface ClusterItem {
  cluster_id: number;
  title: string;
  root_cause: string;
  failure_ids: string[];
  priority: 'High' | 'Medium' | 'Low';
}

export interface ImprovementRoadmapItem {
  priority: number;
  action: string;
  target_metric: string;
  expected_impact: string;
}

export interface FailureAnalysisData {
  summary: string;
  top_failures: TopFailureDetail[];
  clusters: ClusterItem[];
  improvement_roadmap: ImprovementRoadmapItem[];
}

export interface CitationItem {
  document: string;
  text: string;
  rank: number;
  score?: number;
}

export interface LiveMetrics {
  faithfulness?: number | null;
  relevance?: number | null;
  completeness?: number | null;
  context_recall?: number | null;
  context_precision?: number | null;
}

export interface ChatResponse {
  answer: string;
  sources: CitationItem[];
  metrics: LiveMetrics;
  metric_notes: Record<string, string>;
  warnings: string[];
  is_live_chat_available: boolean;
}
