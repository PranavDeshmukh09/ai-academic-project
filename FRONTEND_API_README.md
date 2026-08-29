# AI Academic Mentor - Backend API Guide

This document outlines the updated API structure following the migration to our multi-agent LangGraph pipeline.

## Base URL
`http://localhost:8000`

## Important Architectural Change: Project ID
The backend has been completely refactored to revolve around `project_id` rather than `student_id`. This means that **chats, memory, and documents are scoped entirely to a specific project.**

You will need to pass `project_id` in almost all payloads moving forward.

---

## Endpoints

### 1. Initialize Project (NEW)
**`POST /initialize`**

Initializes a new project by spinning up the 7-agent pipeline to generate initial documents (skill evaluation, project plan, tech stack, risk analysis, mentor advice, and documentation). It then indexes these documents into the Pinecone RAG system.

**Payload (JSON):**
```json
{
    "project_id": 1
}
```

**Response (JSON):**
```json
{
    "status": "success",
    "message": "Project 1 initialized and indexed!"
}
```

---

### 2. Chat with Mentor
**`POST /chat`**

The core interaction endpoint. Sends a user message to the AI, which uses RAG and project memory to generate a response. The AI will output structured JSON.

**Payload (JSON):**
```json
{
    "project_id": 1,
    "message": "Can you recommend a database for my project?"
}
```

**Response (JSON):**
```json
{
    "project_id": 1,
    "chat_reply": "{\"reply\": \"I recommend Supabase because...\", \"action\": \"none\"}",
    "skill_report": "...",
    "project_evaluation": "...",
    "project_plan": "...",
    "tech_stack": "...",
    "risk_analysis": "...",
    "mentor_advice": "...",
    "final_documentation": "...",
    "agents_executed": []
}
```
*Note: `chat_reply` contains a stringified JSON object from the AI. Be sure to parse it using `JSON.parse(data.chat_reply)` in your frontend code.*

---

### 3. Upload Context Document (RAG)
**`POST /upload`**

Upload a PDF file (e.g. grading rubrics, project requirements) to give the AI additional context.

**Content-Type:** `multipart/form-data`

**Form Data:**
- `file`: The PDF file.
- `project_id`: (integer) The ID of the project.
- `description`: (string) Short description of the file.

**Response (JSON):**
```json
{
    "status": "success",
    "message": "Saved 12 chunks for project 1!"
}
```

---

### 4. Fetch Student Profile
**`GET /student/{student_id}`**

Fetches basic information about the student.
*(Note: This endpoint still uses `student_id` because it interacts directly with the `student` table).*

**Response (JSON):**
```json
{
    "student_profile": { ... },
    "project_idea": { ... },
    "skill_questionnaire": { ... }
}
```
