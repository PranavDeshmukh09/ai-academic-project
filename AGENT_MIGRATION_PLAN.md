# Migration Plan: Architecture & Multi-Project Refactor

This document contains the agreed-upon plan to restructure the AI Mentor architecture. The goal is to separate the pipeline into Initialization and Chat phases, and to support multiple projects per student.

## Phase 1: Database & Memory Layer
Since the database now uses project_id instead of student_id for agent outputs and chat messages, we need to update the data layer.
1. memory.py: Update load_memory and save_memory to accept project_id.
2. Rag_system.py: Update ingest_document and retrive_documents to use project_id in Pinecone metadata. Add a new function ingest_text(text, project_id) to push AI-generated documents into Pinecone.

## Phase 2: LangGraph Restructuring (multi_agent_ai.py)
1. initialization_app: Create a linear graph (assessment -> evaluation -> plan -> tech -> risk -> mentor -> docs).
2. chat_responder_agent: Rewrite to output structured JSON.
3. chat_app: Create a fast, single-node graph for chat_responder_agent.

## Phase 3: The API (api.py)
1. POST /initialize: New endpoint taking project_id, runs initialization_app, saves to Supabase, pushes to Pinecone.
2. POST /chat: Update to use project_id, run chat_app.

## Phase 4: The Frontend (streamlit_app.py)
1. Hardcode or add a selector for project_id (default to 1).
2. Add a 'Initialize Project' button.
3. Update chat API calls to pass project_id.

**Next Step for the IDE Agent:**
Begin executing Phase 1: Database & Memory Layer.
