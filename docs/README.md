# 📚 AI Academic Project Mentor - Central Documentation Hub

Welcome to the unified documentation center for the **AI Academic Project Mentor** platform. All technical specifications, architecture blueprints, API references, database models, and agile management artifacts are indexed below for single-point access.

---

## 🧭 Documentation Index

```
docs/
├── 📄 README.md                # Documentation Center Index (This File)
├── 📐 ARCHITECTURE.md          # Multi-Agent State Machines, RAG & System Topology
├── 📡 API_REFERENCE.md         # Complete REST API Specifications & Schemas
├── 🗄️ DATABASE_SCHEMA.md       # Supabase PostgreSQL Models, DDL & Mermaid ERD
├── 🎨 FRONTEND_GUIDE.md        # React 18, Vite & Tailwind CSS Component Architecture
├── 📊 AGILE_MANAGEMENT.md      # Agile Sprints, Burndown Velocity & QA Deliverables
├── 🤝 CONTRIBUTING.md          # Engineering Workflows, GitFlow & PR Standards
└── 🛡️ SECURITY.md              # Security Architecture, JWT Protocols & SLAs
```

---

## 📑 Detailed Guides

### 1. [System Architecture & Multi-Agent Engine](file:///d:/ai-academic-project/docs/ARCHITECTURE.md)
* **Decoupled 3-Tier Topology:** Presentation (React 18), API Gateway (FastAPI), AI Engine (LangGraph).
* **LangGraph 7-Agent Pipeline:** Sequential execution state schema, prompt strategies, and agent roles.
* **Pinecone RAG Vector Pipeline:** 384-dimensional dense embeddings (`all-MiniLM-L6-v2`) and cosine similarity search.
* **Resilience Circuit Breaker:** Automatic fallback to **Groq LLaMA 3 70B** on Google Gemini rate limits (HTTP 429).
* **Performance Benchmarks:** P95 latency budgets across authentication, RAG queries, and pipeline initializations.

---

### 2. [REST API Specifications](file:///d:/ai-academic-project/docs/API_REFERENCE.md)
* **Authentication & Onboarding:** `/auth/register`, `/auth/login`, `/onboard`, `/student/{id}`.
* **Multi-Agent Execution:** `/initialize` (7-Agent LangGraph initialization), `/upload` (PDF semantic ingestion).
* **Interactive Mentoring:** `/chat` (RAG Q&A), `/progress_update` (Dynamic plan recalibration), `/check_in`.
* **Academic Document Generation:** `/generate_document` (Synopsis, Methodology, Progress Report, Thesis Outline).
* **Faculty Oversight:** `/faculty/dashboard` (Project health cards, status badges & weekly summaries).
* **Mermaid Rendering Wrapper:** Regex snippet for dynamic chart rendering in React and Streamlit.

---

### 3. [Database Architecture & ERD](file:///d:/ai-academic-project/docs/DATABASE_SCHEMA.md)
* **Normalized Schemas:** `student`, `skill_assessment`, and `project_idea` relational tables.
* **Visual Mermaid ER Diagram:** Entity relationships and foreign key cascades.
* **Optimization Strategy:** B-tree indexes, upsert idempotency, and the `faculty_dashboard_view` materialized query.

---

### 4. [Frontend Application Guide](file:///d:/ai-academic-project/docs/FRONTEND_GUIDE.md)
* **UI/UX Philosophy:** Bespoke split-screen onboarding layout with Dark Mode (Slate) and Light Mode (Off-White).
* **Component Tree:** Onboarding, quiz assessment, interactive RAG chat, report generation, and supervisor dashboard.
* **Build & Dev Tooling:** Vite bundling, Tailwind CSS tokens, and Docker production containerization.

---

### 5. [Agile Project Management & QA](file:///d:/ai-academic-project/docs/AGILE_MANAGEMENT.md)
* **3-Month Lifecycle (May 27 – Aug 24, 2026):** Mapped across 6 Agile Sprints.
* **Master Tracking Workbooks ([`Agile Document/`](file:///d:/ai-academic-project/Agile%20Document/)):**
  * `Agile_Template_v0.1.xlsx`: 20 User Stories, 37 Sprint tasks, 20 daily standup logs, and 14 retrospectives.
  * `Defect_Tracker Template_v0.1.xlsx`: 18 remediated and verified defects (100% resolution).
  * `Unit_Test_Plan_v0.1.xlsx`: 22 unit test cases matching automated `pytest` test suite (100% pass rate).

---

### 6. [Engineering Standards & Contributing](file:///d:/ai-academic-project/docs/CONTRIBUTING.md)
* **Branching Strategy:** GitFlow branch naming (`feature/*`, `fix/*`, `docs/*`, `refactor/*`).
* **Conventional Commits:** Standardized commit message grammar.
* **Code Quality Rules:** PEP 8 compliance, Pydantic type safety, and PR peer review checklists.

---

### 7. [Security & Data Governance](file:///d:/ai-academic-project/docs/SECURITY.md)
* **Cryptographic Standards:** Bcrypt password hashing (cost factor 12) and HMAC-SHA256 JWT tokens.
* **Data Isolation:** Namespace scoping in Pinecone vector DB and relational foreign key scoping.
* **Responsible Disclosure:** Reporting channels and 48-hour response SLA.
