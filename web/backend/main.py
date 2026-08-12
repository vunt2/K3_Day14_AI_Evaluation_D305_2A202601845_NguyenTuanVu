import os
import sys
import logging
from pathlib import Path
from typing import List, Optional

from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Ensure root workspace is in sys.path
BASE_DIR = Path(__file__).resolve().parent.parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

load_dotenv(BASE_DIR / ".env")

from schemas import (
    SummaryResponse,
    CaseItem,
    CaseDetail,
    FailureAnalysisResponse,
    ChatRequest,
    ChatResponse
)
from services.data_service import data_service
from services.chat_service import chat_service

# Logging setup
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("web_backend.main")

app = FastAPI(
    title="AI Evaluation Lab Presentation API",
    description="FastAPI Backend for Northstar Student Services RAG Assistant Evaluation Portfolio",
    version="1.0.0"
)

# CORS configuration
raw_allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173")
allowed_origins = [origin.strip() for origin in raw_allowed_origins.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "live_chat_available": chat_service.is_available()
    }


@app.get("/api/summary", response_model=SummaryResponse)
def get_summary():
    try:
        return data_service.get_summary()
    except Exception as e:
        logger.error(f"Error fetching summary: {e}")
        raise HTTPException(status_code=500, detail="Internal server error fetching summary.")


@app.get("/api/cases", response_model=List[CaseItem])
def get_cases(
    difficulty: Optional[str] = Query(None, description="Filter by difficulty: easy, medium, hard, adversarial"),
    passed: Optional[bool] = Query(None, description="Filter by pass status: true, false"),
    failure_type: Optional[str] = Query(None, description="Filter by failure type: hallucination, off_topic, none"),
    search: Optional[str] = Query(None, description="Search keyword in question/answers")
):
    try:
        return data_service.get_cases(
            difficulty=difficulty,
            passed=passed,
            failure_type=failure_type,
            search=search
        )
    except Exception as e:
        logger.error(f"Error fetching cases: {e}")
        raise HTTPException(status_code=500, detail="Internal server error fetching cases.")


@app.get("/api/cases/{case_id}", response_model=CaseDetail)
def get_case_detail(case_id: str):
    case = data_service.get_case_detail(case_id)
    if not case:
        raise HTTPException(status_code=404, detail=f"Case with ID '{case_id}' not found.")
    return case


@app.get("/api/failure-analysis", response_model=FailureAnalysisResponse)
def get_failure_analysis():
    try:
        return data_service.get_failure_analysis()
    except Exception as e:
        logger.error(f"Error fetching failure analysis: {e}")
        raise HTTPException(status_code=500, detail="Internal server error fetching failure analysis.")


@app.post("/api/chat", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest):
    try:
        return chat_service.process_live_chat(request)
    except ValueError as ve:
        logger.warning(f"Validation / Missing Key error in chat: {ve}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(ve)
        )
    except Exception as e:
        logger.error(f"Error processing live chat: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Đã xảy ra lỗi hệ thống khi xử lý câu hỏi Live Chat."
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
