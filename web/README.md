# AI Evaluation Lab — Presentation & Portfolio Web App

Website portfolio dạng **interactive data storytelling** trình diễn bài lab **AI Evaluation & Benchmarking (Day 14)** cho hệ thống RAG Assistant Dịch vụ sinh viên Northstar University.

---

## 🌟 Tính Năng Nổi Bật

1. **Interactive Data Storytelling (11 Sections)**:
   - **Hero & Problem Statement**: Minh họa sự khác biệt giữa AI ảo giác (ungrounded) vs AI có trích dẫn chứng cứ (grounded).
   - **Pipeline Diagram**: Sơ đồ 5 bước khép kín (Question -> Retrieve -> Generate -> Evaluate -> 5-Whys Analyze).
   - **5 RAGAS Metrics Explainer**: Giải thích sinh động 5 chỉ số (Faithfulness, Answer Relevance, Completeness, Context Recall, Context Precision).
   - **Work Completed & Limitations**: Trình bày 10 thành quả của Vũ và 5 giới hạn kỹ thuật.

2. **Benchmark Dashboard & Dataset Inspector**:
   - Biểu đồ Recharts sinh động (Donut Pass/Fail 60.0%, Bar chart 5 Metrics, Stacked Bar Difficulty, Failure Distribution).
   - **Dataset Explorer**: Lọc 20 cases theo difficulty, status, failure type và từ khóa tìm kiếm.
   - **Case Inspector Drawer**: Drawer soi chi tiết từ vựng **Word-level Diff**, chứng cứ trích xuất và phân tích 5-Whys.
   - **Failure Analysis Timeline**: Giao diện Stepper 5-Whys, Failure Clusters và Lộ trình cải tiến.

3. **Dual Chatbot Modes**:
   - **Guided Demo (Offline Artifact Mode)**: Cho phép chọn thử 20 cases có sẵn trong Golden Dataset, phục vụ dữ liệu trực tiếp từ artifacts thông qua backend với **0% chi phí API** và không cần API key.
   - **Live Chat (Real-Time RAG Mode)**: Gọi backend FastAPI kết hợp OpenAI-compatible client (`OPENAI_API_KEY`, `OPENAI_MODEL`, `OPENAI_BASE_URL`), hiển thị Citations tài liệu, cảnh báo an toàn và Live Faithfulness/Relevance Metrics.

---

## 🛠️ Hướng Dẫn Chạy Local (Local Development)

### 1. Khởi Động Backend (FastAPI)

Cần có Python 3.11+.

```bash
# Di chuyển vào thư mục backend
cd web/backend

# Tạo file cấu hình môi trường từ mẫu (nếu cần dùng Live Chat)
cp .env.example .env

# Cài đặt các thư viện cần thiết
pip install -r requirements.txt

# Chạy server FastAPI tại port 8000
python main.py
# Hoặc: uvicorn main:app --reload --port 8000
```

FastAPI Backend sẽ chạy tại: `http://localhost:8000` (API Docs tại `http://localhost:8000/docs`).

### 2. Khởi Động Frontend (React + Vite)

Cần có Node.js 18+.

```bash
# Di chuyển vào thư mục frontend
cd web/frontend

# Cài đặt gói phụ thuộc
npm install

# Chạy dev server tại port 5173
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`.

---

## 🧪 Hướng Dẫn Chạy Automated Tests

### Chạy Backend API Unit Tests (7 Tests)
```bash
python -m pytest web/backend/tests/ -v
```

### Chạy Lab Core Regression Tests (42 Tests)
```bash
python -m pytest tests/ -v
```

### Kiểm Tra Validated Dataset
```bash
python validate_golden_dataset.py
```

### Build Production Frontend
```bash
cd web/frontend
npm run build
```

---

## 🔒 An Toàn & Bảo Mật

- Backend chỉ đọc `OPENAI_API_KEY` từ file `.env` ở server-side, tuyệt đối không gửi API Key xuống browser.
- Nếu không có `OPENAI_API_KEY`, Dashboard và Guided Demo vẫn hoạt động 100% bình thường. Live Chat sẽ trả về HTTP 503 với thông báo an toàn.
- Khóa chặt Live Chat metrics: Chỉ tính `Faithfulness` và `Relevance`. Các metric cần expected answer sẽ trả về `null` với nhãn `N/A — Metric này cần ground-truth reference`.
- Dữ liệu 3 nguồn JSON được join bằng trường `id` nguyên thể.
