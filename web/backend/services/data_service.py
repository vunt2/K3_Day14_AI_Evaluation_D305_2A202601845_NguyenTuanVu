import json
import logging
from pathlib import Path
from typing import Dict, List, Optional, Any

from schemas import (
    SummaryResponse,
    CaseItem,
    CaseDetail,
    ContextItem,
    MetricsDetail,
    FailureAnalysisResponse,
    TopFailureDetail,
    FiveWhyItem
)

logger = logging.getLogger("web_backend.data_service")

# Base paths
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
GOLDEN_DATASET_PATH = BASE_DIR / "golden_dataset.json"
ACTUAL_ANSWERS_PATH = BASE_DIR / "artifacts" / "actual_answers.json"
BENCHMARK_RESULTS_PATH = BASE_DIR / "artifacts" / "benchmark_results.json"
FAILURE_ANALYSIS_PATH = Path(__file__).resolve().parent.parent / "content" / "failure_analysis.json"


class DataService:
    def __init__(self):
        self._golden_qa_map: Dict[str, dict] = {}
        self._actual_answers_map: Dict[str, dict] = {}
        self._benchmark_results_map: Dict[str, dict] = {}
        self._summary_data: dict = {}
        self._failure_analysis_data: dict = {}
        self._top_failures_map: Dict[str, dict] = {}
        
        self.reload_data()

    def reload_data(self):
        """Loads and joins data by 'id' key across JSON files."""
        # 1. Load Golden Dataset
        if GOLDEN_DATASET_PATH.exists():
            with open(GOLDEN_DATASET_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
                qa_list = data.get("qa_pairs", [])
                self._golden_qa_map = {item["id"]: item for item in qa_list if "id" in item}
        else:
            logger.warning(f"Golden dataset file not found at {GOLDEN_DATASET_PATH}")

        # 2. Load Actual Answers
        if ACTUAL_ANSWERS_PATH.exists():
            with open(ACTUAL_ANSWERS_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
                answers_list = data.get("answers", [])
                self._actual_answers_map = {item["id"]: item for item in answers_list if "id" in item}
        else:
            logger.warning(f"Actual answers file not found at {ACTUAL_ANSWERS_PATH}")

        # 3. Load Benchmark Results
        if BENCHMARK_RESULTS_PATH.exists():
            with open(BENCHMARK_RESULTS_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
                self._summary_data = data.get("summary", {})
                results_list = data.get("results", [])
                self._benchmark_results_map = {item["id"]: item for item in results_list if "id" in item}
        else:
            logger.warning(f"Benchmark results file not found at {BENCHMARK_RESULTS_PATH}")

        # 4. Load Failure Analysis Content
        if FAILURE_ANALYSIS_PATH.exists():
            with open(FAILURE_ANALYSIS_PATH, "r", encoding="utf-8") as f:
                self._failure_analysis_data = json.load(f)
                top_failures = self._failure_analysis_data.get("top_failures", [])
                self._top_failures_map = {tf["id"]: tf for tf in top_failures if "id" in tf}
        else:
            logger.warning(f"Failure analysis content file not found at {FAILURE_ANALYSIS_PATH}")

    def get_summary(self) -> SummaryResponse:
        s = self._summary_data
        return SummaryResponse(
            total=s.get("total", 20),
            passed=s.get("passed", 12),
            pass_rate=s.get("pass_rate", 0.6),
            avg_faithfulness=s.get("avg_faithfulness", 0.555),
            avg_relevance=s.get("avg_relevance", 0.664),
            avg_completeness=s.get("avg_completeness", 0.769),
            avg_context_recall=s.get("avg_context_recall", 0.944),
            avg_context_precision=s.get("avg_context_precision", 0.955),
            failure_types=s.get("failure_types", {"off_topic": 3, "hallucination": 5})
        )

    def get_cases(
        self,
        difficulty: Optional[str] = None,
        passed: Optional[bool] = None,
        failure_type: Optional[str] = None,
        search: Optional[str] = None
    ) -> List[CaseItem]:
        # Collect all unique IDs across golden dataset & benchmark results
        all_ids = list(set(list(self._golden_qa_map.keys()) + list(self._benchmark_results_map.keys())))
        all_ids.sort()

        cases: List[CaseItem] = []
        for case_id in all_ids:
            golden = self._golden_qa_map.get(case_id, {})
            benchmark = self._benchmark_results_map.get(case_id, {})
            actual = self._actual_answers_map.get(case_id, {})

            case_diff = golden.get("difficulty") or benchmark.get("difficulty") or "easy"
            case_passed = benchmark.get("passed", False)
            case_failure = benchmark.get("failure_type")
            case_attack = golden.get("attack_type")
            question = golden.get("question") or benchmark.get("question") or ""
            expected_answer = golden.get("expected_answer", "")
            actual_answer = actual.get("actual_answer") or benchmark.get("actual_answer") or ""

            # Extract source documents
            source_docs = []
            for ctx in golden.get("contexts", []):
                if ctx.get("source_doc") and ctx["source_doc"] not in source_docs:
                    source_docs.append(ctx["source_doc"])
            for ctx in actual.get("retrieved_contexts", []):
                if ctx.get("source_doc") and ctx["source_doc"] not in source_docs:
                    source_docs.append(ctx["source_doc"])

            # Filter logic
            if difficulty and case_diff.lower() != difficulty.lower():
                continue
            if passed is not None and case_passed != passed:
                continue
            if failure_type:
                if failure_type.lower() == "none":
                    if case_failure is not None:
                        continue
                elif case_failure is None or case_failure.lower() != failure_type.lower():
                    continue
            if search:
                q_term = search.lower()
                if (
                    q_term not in case_id.lower()
                    and q_term not in question.lower()
                    and q_term not in expected_answer.lower()
                    and q_term not in actual_answer.lower()
                ):
                    continue

            cases.append(
                CaseItem(
                    id=case_id,
                    difficulty=case_diff,
                    question=question,
                    expected_answer=expected_answer,
                    actual_answer=actual_answer,
                    source_docs=source_docs,
                    overall_score=benchmark.get("overall", 0.0),
                    passed=case_passed,
                    failure_type=case_failure,
                    attack_type=case_attack
                )
            )

        return cases

    def get_case_detail(self, case_id: str) -> Optional[CaseDetail]:
        if case_id not in self._golden_qa_map and case_id not in self._benchmark_results_map:
            return None

        golden = self._golden_qa_map.get(case_id, {})
        benchmark = self._benchmark_results_map.get(case_id, {})
        actual = self._actual_answers_map.get(case_id, {})
        tf = self._top_failures_map.get(case_id, {})

        # Contexts
        gold_contexts = [
            ContextItem(source_doc=c["source_doc"], text=c["text"])
            for c in golden.get("contexts", [])
        ]
        retrieved_contexts = [
            ContextItem(
                source_doc=c["source_doc"],
                text=c.get("text", ""),
                chunk_id=c.get("chunk_id"),
                score=c.get("score")
            )
            for c in actual.get("retrieved_contexts", [])
        ]

        metrics = MetricsDetail(
            faithfulness=benchmark.get("faithfulness"),
            relevance=benchmark.get("relevance"),
            completeness=benchmark.get("completeness"),
            context_recall=benchmark.get("context_recall"),
            context_precision=benchmark.get("context_precision"),
            overall=benchmark.get("overall")
        )

        five_whys = None
        if "five_whys" in tf:
            five_whys = [FiveWhyItem(**fw) for fw in tf["five_whys"]]

        return CaseDetail(
            id=case_id,
            difficulty=golden.get("difficulty") or benchmark.get("difficulty") or "easy",
            question=golden.get("question") or benchmark.get("question") or "",
            expected_answer=golden.get("expected_answer", ""),
            actual_answer=actual.get("actual_answer") or benchmark.get("actual_answer") or "",
            contexts=gold_contexts,
            retrieved_contexts=retrieved_contexts,
            metrics=metrics,
            passed=benchmark.get("passed", False),
            failure_type=benchmark.get("failure_type"),
            attack_type=golden.get("attack_type"),
            five_whys=five_whys,
            root_cause=tf.get("root_cause"),
            proposed_fix=tf.get("proposed_fix")
        )

    def get_failure_analysis(self) -> FailureAnalysisResponse:
        return FailureAnalysisResponse(**self._failure_analysis_data)


# Global singleton instance
data_service = DataService()
