from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class SummaryResponse(BaseModel):
    total: int
    passed: int
    pass_rate: float
    avg_faithfulness: float
    avg_relevance: float
    avg_completeness: float
    avg_context_recall: float
    avg_context_precision: float
    failure_types: Dict[str, int]


class ContextItem(BaseModel):
    source_doc: str
    text: str
    chunk_id: Optional[str] = None
    score: Optional[float] = None


class MetricsDetail(BaseModel):
    faithfulness: Optional[float] = None
    relevance: Optional[float] = None
    completeness: Optional[float] = None
    context_recall: Optional[float] = None
    context_precision: Optional[float] = None
    overall: Optional[float] = None


class CaseItem(BaseModel):
    id: str
    difficulty: str
    question: str
    expected_answer: str
    actual_answer: str
    source_docs: List[str]
    overall_score: float
    passed: bool
    failure_type: Optional[str] = None
    attack_type: Optional[str] = None


class FiveWhyItem(BaseModel):
    level: str
    question: str
    answer: str


class TopFailureDetail(BaseModel):
    id: str
    question: str
    expected_answer: str
    actual_answer: str
    scores: Dict[str, float]
    five_whys: List[FiveWhyItem]
    root_cause: str
    proposed_fix: str


class CaseDetail(BaseModel):
    id: str
    difficulty: str
    question: str
    expected_answer: str
    actual_answer: str
    contexts: List[ContextItem]
    retrieved_contexts: List[ContextItem]
    metrics: MetricsDetail
    passed: bool
    failure_type: Optional[str] = None
    attack_type: Optional[str] = None
    five_whys: Optional[List[FiveWhyItem]] = None
    root_cause: Optional[str] = None
    proposed_fix: Optional[str] = None


class ClusterItem(BaseModel):
    cluster_id: int
    title: str
    root_cause: str
    failure_ids: List[str]
    priority: str


class ImprovementRoadmapItem(BaseModel):
    priority: int
    action: str
    target_metric: str
    expected_impact: str


class FailureAnalysisResponse(BaseModel):
    summary: str
    top_failures: List[TopFailureDetail]
    clusters: List[ClusterItem]
    improvement_roadmap: List[ImprovementRoadmapItem]


class ChatRequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=2000)
    mode: str = Field("live", description="live or guided")


class CitationItem(BaseModel):
    document: str
    text: str
    rank: int
    score: Optional[float] = None


class LiveMetrics(BaseModel):
    faithfulness: Optional[float] = None
    relevance: Optional[float] = None
    completeness: Optional[float] = None
    context_recall: Optional[float] = None
    context_precision: Optional[float] = None


class ChatResponse(BaseModel):
    answer: str
    sources: List[CitationItem]
    metrics: LiveMetrics
    metric_notes: Dict[str, str]
    warnings: List[str]
    is_live_chat_available: bool = True
