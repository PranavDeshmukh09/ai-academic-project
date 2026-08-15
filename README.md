# AI Academic Project Mentor — Backend

A cloud-native, multi-agent AI system that guides students through their entire academic project lifecycle — from a 2-line idea to a finished, well-documented deliverable.

Built with **LangGraph** for AI orchestration, **FastAPI** for the API layer, **Supabase (PostgreSQL)** for persistent memory, and **Pinecone** for Retrieval-Augmented Generation (RAG).

---

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     FastAPI Backend                      │
│                                                         │
│  /initialize ──► 7-Agent LangGraph Pipeline             │
│  /chat ────────► Single-Agent Chat Responder + RAG      │
│  /progress ───► Plan Adjustment Agent                   │
│  /check_in ──► Weekly Check-in Agent (JSON Health)      │
│  /faculty ───► Dashboard Aggregation + CSV Export        │
│                                                         │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ Supabase │  │   Pinecone   │  │  Google Gemini   │  │
│  │ (Memory) │  │    (RAG)     │  │   (Inference)    │  │
│  └──────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Core Components

| File | Responsibility |
|------|---------------|
| `api.py` | FastAPI application — all REST endpoints, request validation, response formatting |
| `multi_agent_ai.py` | LangGraph agent definitions, prompt engineering, StateGraph compilation |
| `memory.py` | Supabase read/write — loads student context, persists agent outputs and chat history |
| `Rag_system.py` | Pinecone vector operations — document ingestion, embedding, semantic retrieval |

---

## Prerequisites

- **Python 3.10+**
- A `.env` file in the project root:

```env
SUPABASE_URL="your-supabase-url"
SUPABASE_KEY="your-supabase-anon-key"
GEMINI_API_KEY="your-google-gemini-api-key"
PINECONE_API_KEY="your-pinecone-api-key"
PINECONE_INDEX_NAME="your-pinecone-index-name"
```

### Supabase Tables Required

| Table | Key Columns |
|-------|-------------|
| `student` | `student_id`, `name`, `department`, `year` |
| `skill_assessment` | `student_id`, `skills` (array), `experience_level` |
| `project_idea` | `project_id` (auto), `student_id`, `title`, `description`, `domain` |
| `agent_output` | `output_id` (auto), `project_id`, `skill_report`, `project_evaluation`, `project_plan`, `tech_stack`, `risk_analysis`, `mentor_advice`, `final_documentation`, `check_in_report` |
| `chat_messages` | `project_id`, `role`, `content`, `created_at` |

---

## Getting Started

```bash
# 1. Create and activate virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1      # Windows PowerShell
# source venv/bin/activate       # Mac/Linux

# 2. Install dependencies
pip install -r requirements.txt

# 3. Start the backend
uvicorn api:app --reload
```

The API is now live at `http://127.0.0.1:8000`.  
Interactive docs at `http://127.0.0.1:8000/docs`.

---

## API Endpoints

### Student Lifecycle

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/onboard` | Register a new student. Returns the auto-generated `project_id`. |
| `GET` | `/student/{student_id}` | Fetch a student's profile, skills, and project idea. |
| `POST` | `/initialize` | Run the full 7-agent pipeline. Generates skill report, project evaluation, plan, tech stack, risk analysis, mentor advice, and documentation. |
| `POST` | `/chat` | Send a message to the AI Mentor. Uses RAG context from Pinecone. |
| `POST` | `/progress_update` | Submit a progress update. The AI adjusts the project plan without extending deadlines. |
| `POST` | `/check_in` | Run a weekly check-in. Returns structured JSON with `health_status`, `faculty_summary`, and `student_feedback`. |
| `POST` | `/generate_document` | Generate an academic document on demand (Synopsis, Methodology, Progress Report, Thesis Outline). |
| `POST` | `/upload` | Upload a PDF to the Pinecone RAG knowledge base. |

### Faculty Tools

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/faculty/dashboard` | Aggregated view of all student projects with AI-generated health indicators and mentor summaries. |
| `GET` | `/faculty/dashboard/export` | Download the dashboard as a CSV file. |

### Health Checks

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health/supabase` | Verify Supabase database connectivity. |
| `GET` | `/health/pinecone` | Verify Pinecone vector database connectivity. |

---

## Multi-Agent Pipeline

When `/initialize` is called, **7 specialized agents** execute in sequence via a LangGraph StateGraph:

```
START
  │
  ▼
📊 Skill Assessor ──── Evaluates the student's technical strengths and weaknesses
  │
  ▼
📋 Project Evaluator ── Validates feasibility and refines scope
  │
  ▼
📅 Project Planner ──── Creates a milestone-based timeline
  │
  ▼
💻 Tech Architect ───── Recommends technologies based on skills + plan
  │
  ▼
⚠️ Risk Analyst ─────── Identifies blockers using Chain-of-Thought reasoning
  │
  ▼
🤝 Mentor Advisor ───── Personalized encouragement and study tips
  │
  ▼
📝 Documentation Writer ── Compiles everything into a master README
  │
  ▼
END
```

Each agent reads the output of the previous agent from a shared state dictionary. After the pipeline completes, all outputs are persisted to Supabase and the documentation is indexed into Pinecone for future RAG retrieval.

### Lightweight Single-Agent Graphs

To avoid burning through API rate limits, every endpoint after initialization uses a **single-agent graph**:

- `/chat` → `chat_responder_agent` only
- `/progress_update` → `plan_adjustment_agent` only
- `/check_in` → `weekly_checkin_agent` only
- `/generate_document` → `document_generation_agent` only

---

## Engineering Safeguards

### Fault Tolerance (`safe_invoke`)
All Gemini API calls go through a `safe_invoke()` wrapper that detects `429 Rate Limit` errors and applies exponential backoff (20s, 40s, 60s...) with up to 5 retries. The pipeline pauses and resumes without corrupting the database.

### Anti-Prompt Injection
The `plan_adjustment_agent` and `chat_responder_agent` include explicit guardrails. If a student submits gibberish, malicious prompts, or non-academic requests, the AI rejects the input and preserves the original project state.

### Non-Destructive Memory Writes
`save_memory()` only writes fields that the current agent run actually produced. This prevents a `/chat` call (which only generates `chat_reply`) from overwriting `project_plan`, `tech_stack`, etc. with empty strings.

### Academic Deadline Enforcement
The `plan_adjustment_agent` is strictly prohibited from extending final deadlines. If a student falls behind, the AI compresses milestones and cuts scope instead of pushing the timeline.

---

## Testing

Run the end-to-end simulation script:

```bash
python test_pipeline.py
```

This script programmatically hits `/onboard` → `/initialize` → `/progress_update` → `/check_in` → `/faculty/dashboard` → `/faculty/dashboard/export` in sequence.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| API | FastAPI, Uvicorn |
| AI Orchestration | LangGraph, LangChain |
| LLM | Google Gemini (via `langchain-google-genai`) |
| Vector DB | Pinecone |
| Embeddings | HuggingFace (`all-MiniLM-L6-v2`) |
| Relational DB | Supabase (PostgreSQL) |
| Document Parsing | PyPDF |
