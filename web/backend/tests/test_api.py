import sys
from pathlib import Path
from unittest.mock import patch, MagicMock

import pytest
from fastapi.testclient import TestClient

# Ensure web/backend is in sys.path
BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from main import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "live_chat_available" in data


def test_summary_endpoint():
    response = client.get("/api/summary")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 20
    assert data["passed"] == 12
    assert data["pass_rate"] == 0.6
    assert "avg_faithfulness" in data
    assert "failure_types" in data


def test_cases_endpoint():
    response = client.get("/api/cases")
    assert response.status_code == 200
    cases = response.json()
    assert len(cases) == 20
    
    # Test filters
    easy_cases = client.get("/api/cases?difficulty=easy").json()
    assert len(easy_cases) == 5

    passed_cases = client.get("/api/cases?passed=true").json()
    assert len(passed_cases) == 12

    failed_cases = client.get("/api/cases?passed=false").json()
    assert len(failed_cases) == 8


def test_case_detail_endpoint():
    response = client.get("/api/cases/E01")
    assert response.status_code == 200
    case = response.json()
    assert case["id"] == "E01"
    assert case["difficulty"] == "easy"
    assert len(case["contexts"]) > 0

    # Non-existent case
    notFound = client.get("/api/cases/INVALID99")
    assert notFound.status_code == 404


def test_failure_analysis_endpoint():
    response = client.get("/api/failure-analysis")
    assert response.status_code == 200
    data = response.json()
    assert "top_failures" in data
    assert "clusters" in data
    assert len(data["top_failures"]) >= 3


@patch("services.chat_service.chat_service.process_live_chat")
def test_chat_endpoint_success_mock(mock_process):
    # Mocking external LLM response
    from schemas import ChatResponse, CitationItem, LiveMetrics
    
    mock_process.return_value = ChatResponse(
        answer="Mocked LLM answer about tuition.",
        sources=[CitationItem(document="03_tuition_payment_refund.md", text="Sample text", rank=1)],
        metrics=LiveMetrics(faithfulness=0.9, relevance=0.8, completeness=None, context_recall=None, context_precision=None),
        metric_notes={"completeness": "N/A — Metric này cần ground-truth reference"},
        warnings=[],
        is_live_chat_available=True
    )

    response = client.post("/api/chat", json={"question": "How much is tuition?", "mode": "live"})
    assert response.status_code == 200
    data = response.json()
    assert data["answer"] == "Mocked LLM answer about tuition."
    assert data["metrics"]["completeness"] is None
    assert len(data["sources"]) == 1


def test_chat_endpoint_missing_key_503():
    with patch("os.getenv", return_value=""):
        # Force chat service to re-check key
        from services.chat_service import chat_service
        chat_service._is_initialized = False

        response = client.post("/api/chat", json={"question": "Sample question", "mode": "live"})
        assert response.status_code == 503
        assert "Live Chat chưa được cấu hình" in response.json()["detail"]
