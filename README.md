# AI Academic Mentor (Full Pipeline)

This project features a complete multi-agent LangGraph pipeline connected to a FastAPI backend, a vector database (Pinecone) for Retrieval-Augmented Generation (RAG), and a modern Streamlit Dashboard.

## System Architecture
- **Backend API**: FastAPI serving as the gateway for the AI pipeline and database operations.
- **AI Orchestration**: LangGraph orchestrating 7 specialized AI agents powered by Google Gemini.
- **Vector Database**: Pinecone for semantic document retrieval (RAG) using HuggingFace embeddings.
- **Relational Database**: Supabase (PostgreSQL) for persistent storage of student profiles, project ideas, agent outputs, and chat histories.
- **Frontend Dashboard**: Streamlit interface providing an interactive experience to initialize projects and chat with the AI Mentor.

## Prerequisites
Before running this project, ensure you have the following installed:
- [Python (3.10+)](https://www.python.org/)
- A `.env` file in the root directory containing the following credentials:
  ```env
  SUPABASE_URL="your-supabase-url"
  SUPABASE_KEY="your-supabase-anon-key"
  GEMINI_API_KEY="your-google-gemini-api-key"
  PINECONE_API_KEY="your-pinecone-api-key"
  PINECONE_INDEX_NAME="your-pinecone-index-name"
  ```

---

## Getting Started: Step-by-Step Guide

### 1. Environment Setup
Open a terminal in the root of the project to initialize the Python backend.

**Create a Virtual Environment:**
```bash
python -m venv venv
```

**Activate the Virtual Environment:**
*(For Windows PowerShell)*
```bash
.\venv\Scripts\Activate.ps1
```
*(For Mac/Linux)*
```bash
source venv/bin/activate
```

**Install Backend Dependencies:**
```bash
pip install -r requirements.txt
```

---

### 2. Run the Backend API (Terminal 1)
Keep the virtual environment activated and start the FastAPI server:

```bash
uvicorn api:app --reload
```
*The backend API is now live on `http://127.0.0.1:8000`.*

---

### 3. Run the Streamlit Dashboard (Terminal 2)
Open a **second, separate terminal** in the root of the project.
Activate the virtual environment again, then start the UI:

```bash
streamlit run streamlit_app.py
```
*The Streamlit Dashboard is now live (typically on `http://localhost:8501`).*

---

## Usage Instructions
1. Open the Streamlit Dashboard in your browser.
2. In the left sidebar, enter a **Project ID** that already exists in your Supabase `project_idea` table.
3. (Optional) Upload reference documents (PDFs) to add context to the Pinecone RAG knowledge base.
4. Click **Initialize Project**. The system will run the 7-agent LangGraph sequence, generating a comprehensive Project Evaluation, Tech Stack, Timeline, and README.
5. Once completed, explore the generated artifacts across the different tabs.
6. Use the chat interface at the bottom to have a contextual conversation with the unified AI Mentor!
