import os
import sys
import logging
from pathlib import Path
from typing import Optional, List, Dict, Any

from dotenv import load_dotenv

# Ensure root workspace is in sys.path for importing lab modules
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

# Load .env from workspace root or backend .env
load_dotenv(Path(__file__).resolve().parent.parent / ".env")
load_dotenv(BASE_DIR / ".env")

from schemas import ChatRequest, ChatResponse, CitationItem, LiveMetrics

logger = logging.getLogger("web_backend.chat_service")


class ChatService:
    def __init__(self):
        self._assistant = None
        self._evaluator = None
        self._is_initialized = False
        self._init_error: Optional[str] = None

    def _lazy_init(self):
        """Lazily initializes DomainAssistant and RAGASEvaluator on demand."""
        if self._is_initialized:
            return

        api_key = os.getenv("OPENAI_API_KEY", "").strip()
        if not api_key or api_key == "your_openai_api_key_here":
            self._init_error = "Live Chat chưa được cấu hình. Trợ lý AI thiếu API Key hợp lệ."
            logger.warning("OPENAI_API_KEY missing or placeholder.")
            raise ValueError(self._init_error)

        try:
            from domain_assistant import DomainAssistant, OpenAIGenerator
            from solution.solution import RAGASEvaluator

            corpus_dir = BASE_DIR / "data" / "student_services"
            generator = OpenAIGenerator()
            self._assistant = DomainAssistant.from_corpus(corpus_dir=corpus_dir, generator=generator, top_k=5)
            self._evaluator = RAGASEvaluator()
            self._is_initialized = True
            self._init_error = None
            logger.info("Lazy initialization of DomainAssistant and RAGASEvaluator completed successfully.")
        except Exception as e:
            self._init_error = f"Lỗi khởi tạo DomainAssistant: {str(e)}"
            logger.error(f"Initialization failure: {e}", exc_info=True)
            raise RuntimeError(self._init_error)

    def is_available(self) -> bool:
        """Returns True if API key is present."""
        api_key = os.getenv("OPENAI_API_KEY", "").strip()
        return bool(api_key and api_key != "your_openai_api_key_here")

    def process_live_chat(self, request: ChatRequest) -> ChatResponse:
        """Processes a live chat question with RAG retrieval, generation, and live evaluation."""
        self._lazy_init()

        question = request.question.strip()
        if not question:
            raise ValueError("Câu hỏi không được để trống.")

        # 1. Answer Generation & Retrieval Trace via DomainAssistant
        trace = self._assistant.answer_with_trace(question)
        actual_answer = trace.actual_answer

        # 2. Extract Citations from retrieved chunks
        citations: List[CitationItem] = []
        context_texts: List[str] = []
        for idx, chunk in enumerate(trace.retrieved_chunks, 1):
            doc_name = chunk.source_doc
            text_snippet = chunk.text
            score = chunk.score
            context_texts.append(text_snippet)
            citations.append(
                CitationItem(
                    document=doc_name,
                    text=text_snippet,
                    rank=idx,
                    score=score
                )
            )

        # 3. Live Evaluation (Only Faithfulness and Relevance)
        combined_context_text = "\n\n".join(context_texts)
        faithfulness_score = 0.0
        relevance_score = 0.0

        if self._evaluator and actual_answer and combined_context_text:
            try:
                faithfulness_score = self._evaluator.evaluate_faithfulness(actual_answer, combined_context_text)
                relevance_score = self._evaluator.evaluate_relevance(actual_answer, question)
            except Exception as e:
                logger.error(f"Error during live evaluation: {e}")

        live_metrics = LiveMetrics(
            faithfulness=round(faithfulness_score, 3),
            relevance=round(relevance_score, 3),
            completeness=None,
            context_recall=None,
            context_precision=None
        )

        metric_notes = {
            "faithfulness": "Tính toán trực tiếp giữa câu trả lời và context trích xuất",
            "relevance": "Tính toán trực tiếp giữa câu trả lời và câu hỏi",
            "completeness": "N/A — Metric này cần ground-truth reference",
            "context_recall": "N/A — Metric này cần ground-truth reference",
            "context_precision": "N/A — Metric này cần ground-truth reference"
        }

        warnings: List[str] = []
        if faithfulness_score < 0.5:
            warnings.append("Cảnh báo: Câu trả lời có độ bám sát tài liệu chưa cao (Faithfulness < 0.5). Vui lòng đối soát lại trích dẫn.")

        return ChatResponse(
            answer=actual_answer,
            sources=citations,
            metrics=live_metrics,
            metric_notes=metric_notes,
            warnings=warnings,
            is_live_chat_available=True
        )


# Global singleton
chat_service = ChatService()
