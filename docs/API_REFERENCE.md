# REST API Reference & Frontend Integration Guide

This guide provides the complete API specification and frontend integration guidelines for the **AI Academic Project Mentor** platform.

---

## 🌐 Base URL
```
http://localhost:8000
```
Interactive Swagger API documentation: `http://localhost:8000/docs`

---

## 🔑 Key Architecture Principles
1. **`project_id` Scoped Workflows:** Memory, documents, and chat interactions are scoped to `project_id`.
2. **Asynchronous Multi-Agent Execution:** The `/initialize` endpoint triggers a 7-agent sequential LangGraph workflow. The client HTTP timeout **MUST** be set to at least `300` seconds (5 minutes).
3. **Mermaid Diagram Rendering:** The Project Planner and Tech Stack agents generate Mermaid.js charts. Ensure your Markdown renderer is configured with the Mermaid regex parser wrapper.

---

## 📡 Complete REST API Endpoints Catalog

### 1. Authentication & Onboarding

#### `POST /auth/register`
* **Purpose:** Registers a new student profile with bcrypt password hashing.
* **Request Body (JSON):**
  ```json
  {
    "name": "Pranav Deshmukh",
    "email": "pranav@example.com",
    "password": "SecurePassword123!",
    "department": "Computer Science & Engineering",
    "year": 4
  }
  ```
* **Response (201 Created):**
  ```json
  {
    "student_id": 1,
    "access_token": "eyJhbGciOi...",
    "token_type": "bearer"
  }
  ```

#### `POST /auth/login`
* **Purpose:** Authenticates student credentials and returns a JWT session token.
* **Request Body (JSON):**
  ```json
  {
    "email": "pranav@example.com",
    "password": "SecurePassword123!"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "access_token": "eyJhbGciOi...",
    "token_type": "bearer",
    "student_id": 1,
    "name": "Pranav Deshmukh"
  }
  ```

#### `POST /onboard`
* **Purpose:** Submits student profile, skill ratings, and initial 2-3 line project proposal.
* **Request Body (JSON):**
  ```json
  {
    "student_id": 1,
    "name": "Pranav Deshmukh",
    "department": "Computer Science & Engineering",
    "year": 4,
    "skills": ["Python", "React", "FastAPI", "Machine Learning"],
    "experience_level": "Intermediate",
    "project_title": "AI Academic Project Mentor",
    "project_description": "An agentic platform that evaluates feasibility, generates week-wise milestones, and guides students through project lifecycle.",
    "project_domain": "Agentic AI / EdTech"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "status": "success",
    "project_id": 1,
    "message": "Onboarding profile saved successfully!"
  }
  ```

#### `GET /student/{student_id}`
* **Purpose:** Fetches normalized profile, skill questionnaire, and project idea.
* **Response (200 OK):**
  ```json
  {
    "student_profile": { "student_id": 1, "name": "Pranav Deshmukh", "department": "CSE", "year": 4 },
    "skill_assessment": { "skills": ["Python", "React"], "experience_level": "Intermediate" },
    "project_idea": { "project_id": 1, "title": "AI Academic Project Mentor", "status": "Initialized" }
  }
  ```

---

### 2. Multi-Agent Pipeline & Planning

#### `POST /initialize`
* **Purpose:** Triggers the sequential 7-agent LangGraph workflow.
* **Request Body (JSON):**
  ```json
  {
    "project_id": 1
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "status": "success",
    "skill_report": "...",
    "project_evaluation": "...",
    "project_plan": "...",
    "tech_stack": "...",
    "risk_analysis": "...",
    "mentor_advice": "...",
    "final_documentation": "..."
  }
  ```

#### `POST /upload` *(Multipart Form)*
* **Purpose:** Ingests syllabus/rubric PDF documents into Pinecone vector index for RAG retrieval.
* **Form Data:**
  - `file`: PDF binary file
  - `project_id`: (integer) `1`
  - `description`: "Institutional Project Rubrics 2026"
* **Response (200 OK):**
  ```json
  {
    "status": "success",
    "message": "Saved 24 chunks for project 1!"
  }
  ```

---

### 3. Interactive Conversational Mentoring & Tracking

#### `POST /chat`
* **Purpose:** Context-aware mentoring Q&A with RAG retrieval from Pinecone.
* **Request Body (JSON):**
  ```json
  {
    "project_id": 1,
    "message": "How should I structure the LangGraph fallback nodes for Gemini rate limiting?"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "project_id": 1,
    "chat_reply": "{\"reply\": \"You can configure conditional edges in LangGraph...\", \"action\": \"none\"}"
  }
  ```

#### `POST /progress_update`
* **Purpose:** Student submits a progress update; AI dynamically recalibrates future milestone schedules.
* **Request Body (JSON):**
  ```json
  {
    "project_id": 1,
    "update_text": "Completed backend authentication and Supabase integration, but delayed on vector indexing."
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "status": "success",
    "project_plan": "# Recalibrated Milestone Plan\n\n- Week 1-2: [Completed] Auth & DB\n- Week 3-4: [Adjusted] Vector Indexing & RAG..."
  }
  ```

#### `POST /check_in`
* **Purpose:** Generates a structured weekly mentor check-in report with praise and upcoming goals.
* **Request Body (JSON):**
  ```json
  {
    "project_id": 1
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "check_in_report": "### Weekly Mentor Review\n\n**Great progress on the backend APIs!** For next week, prioritize Pinecone vector chunking..."
  }
  ```

---

### 4. Academic Document Generation

#### `POST /generate_document`
* **Purpose:** Compiles formal university-standard academic documents on-demand.
* **Request Body (JSON):**
  ```json
  {
    "project_id": 1,
    "doc_type": "Synopsis"
  }
  ```
  *Valid `doc_type` values:* `"Synopsis"`, `"Methodology"`, `"Progress Report"`, `"Thesis Outline"`
* **Response (200 OK):**
  ```json
  {
    "doc_type": "Synopsis",
    "generated_document": "# Academic Project Synopsis\n\n## 1. Project Title\nAI Academic Project Mentor\n\n## 2. Problem Statement\n..."
  }
  ```

---

### 5. Faculty Monitoring Dashboard

#### `GET /faculty/dashboard`
* **Purpose:** Retrieves an aggregated overview of all student projects for academic mentors.
* **Response (200 OK):**
  ```json
  {
    "status": "success",
    "total_projects": 4,
    "projects": [
      {
        "student_id": 1,
        "name": "Pranav Deshmukh",
        "department": "Computer Science & Engineering",
        "project_id": 1,
        "project_title": "AI Academic Project Mentor",
        "status": "On Track",
        "health_indicator": "Green",
        "completion_percentage": 92,
        "latest_checkin": "Completed pipeline fallback and unit test suite.",
        "risk_summary": "Low risk; all critical milestones achieved."
      }
    ]
  }
  ```
