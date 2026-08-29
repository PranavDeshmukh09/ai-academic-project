# AI Academic Project Mentor - Frontend Integration Guide

This document is for the frontend engineering team. It provides a comprehensive overview of the AI Academic Mentor system, the available REST API endpoints (including the newly added Milestone 3 endpoints), and explicit instructions on how to build the UI to accurately render all AI-generated content (including Mermaid diagrams).

---

## 1. System Overview

The **AI Academic Project Mentor** is an agentic platform designed to guide students through their entire academic project lifecycle. 

Instead of a standard chatbot, this system uses a **LangGraph Multi-Agent Pipeline**. When a student submits a 2-3 line project idea, the backend orchestrates 7 specialized AI agents in sequence:
1. **Skill Assessor**: Evaluates the student's technical background.
2. **Project Evaluator**: Checks the feasibility of the idea.
3. **Project Planner**: Generates a week-by-week timeline.
4. **Tech Architect**: Recommends the optimal technology stack.
5. **Risk Analyst**: Identifies blockers and mitigation strategies.
6. **Mentor Advisor**: Gives a motivational summary.
7. **Documentation Writer**: Compiles everything into a master README.

After this initial setup, the student can chat with the AI, submit weekly progress updates (which automatically adjust the project plan), run weekly check-ins, and generate specific academic documents on-demand.

---

## 2. API Endpoints Catalog

All endpoints are hosted at `http://localhost:8000` (or your production API URL).

### 2.1 Core Onboarding & Setup

#### `POST /onboard`
- **Purpose**: Saves the student's profile and initial project idea to the database.
- **Request Body** (JSON):
  ```json
  {
    "student_id": 1,
    "name": "John Doe",
    "department": "Computer Science",
    "year": 4,
    "skills": ["Python", "React"],
    "experience_level": "Intermediate",
    "project_title": "AI Task Manager",
    "project_description": "An app that organizes tasks using AI.",
    "project_domain": "Web Development"
  }
  ```

#### `POST /upload` (Multipart Form)
- **Purpose**: Uploads a PDF (like a grading rubric) to Pinecone for RAG (Retrieval-Augmented Generation).
- **Form Data**: `project_id` (int), `description` (string), `file` (File).

#### `POST /initialize`
- **Purpose**: Triggers the heavy 7-agent pipeline. **(Warning: Can take 1-3 minutes to run).**
- **Request Body**: `{"project_id": 1}`
- **Response**: Returns a JSON object containing `skill_report`, `project_evaluation`, `project_plan`, `tech_stack`, `risk_analysis`, `mentor_advice`, and `final_documentation`.

---

### 2.2 Interactive & Milestone 3 Endpoints (NEW)

#### `POST /chat`
- **Purpose**: Conversational Q&A regarding the project.
- **Request Body**: `{"project_id": 1, "message": "How do I setup the database?"}`
- **Response**: `{"chat_reply": "..."}`

#### `POST /progress_update`
- **Purpose**: Student submits a weekly update. The AI reads this and **rewrites the project plan**.
- **Request Body**: `{"project_id": 1, "update_text": "I finished the API but struggled with the database."}`
- **Response**: Returns the `project_plan` (markdown string) which replaces the old plan in the UI.

#### `POST /check_in`
- **Purpose**: Triggers the mentor agent to evaluate the student's progress and set goals for next week.
- **Request Body**: `{"project_id": 1}`
- **Response**: `{"check_in_report": "..."}`

#### `POST /generate_document`
- **Purpose**: Generates a specific academic document on demand.
- **Request Body**: `{"project_id": 1, "doc_type": "Synopsis"}` *(Valid types: Synopsis, Methodology, Progress Report, Thesis Outline)*
- **Response**: `{"generated_document": "..."}`

---

### 2.3 Faculty Dashboard Endpoint (NEW)

#### `GET /faculty/dashboard`
- **Purpose**: Fetches a high-level summary of ALL students for the faculty monitoring view.
- **Response**:
  ```json
  {
    "status": "success",
    "total_projects": 1,
    "projects": [
      {
        "student_id": 1,
        "name": "John Doe",
        "department": "CS",
        "project_id": 1,
        "project_title": "AI Task Manager",
        "has_been_initialized": true,
        "risk_analysis_summary": "The main risk is...",
        "latest_checkin": "Doing well..."
      }
    ]
  }
  ```

---

## 3. UI Implementation Instructions

### 3.1 Rendering Mermaid.js Diagrams (CRITICAL)
The AI agents (especially the Project Planner and Tech Architect) are prompted to output architecture diagrams and Gantt charts using **Mermaid.js**. 

If you are using **Streamlit**, `st.markdown()` supports Mermaid natively in newer versions. However, for robust rendering without errors, use this custom wrapper pattern in your frontend code:

```python
import streamlit as st
import re

def render_markdown_with_mermaid(markdown_text):
    """
    Parses LLM output. Standard markdown is rendered normally.
    Mermaid code blocks are extracted and rendered using st.markdown
    which natively supports Mermaid charts in recent Streamlit versions.
    """
    # Split text by mermaid code blocks
    parts = re.split(r'```(?:mermaid)\n(.*?)\n```', markdown_text, flags=re.DOTALL)
    
    for i, part in enumerate(parts):
        if i % 2 == 0:
            # Normal Markdown
            st.markdown(part)
        else:
            # This is the extracted Mermaid code
            st.markdown(f"```mermaid\n{part}\n```")
```
*Usage in UI*: Instead of `st.markdown(data["project_plan"])`, use `render_markdown_with_mermaid(data["project_plan"])`.

### 3.2 Drop-in UI Code for Milestone 3 Tabs (Streamlit)
You can directly paste this snippet into the main dashboard section of `streamlit_app.py` to seamlessly integrate the new endpoints:

```python
    tab1, tab2, tab3, tab4, tab5, tab6, tab7, tab8, tab9, tab10 = st.tabs([
        "📈 Skills", "📝 Evaluation", "📅 Plan", "💻 Tech Stack", "⚠️ Risks", "🤝 Mentor", "📚 Final Docs", "🔄 Progress", "📅 Check-in", "📄 Gen Docs"
    ])
    
    # ... (Tabs 1-7 remain the same, but use render_markdown_with_mermaid for tab3 and tab4) ...

    with tab8:
        st.subheader("🔄 Submit Progress Update")
        st.info("Submitting an update will cause the AI to dynamically adjust your project plan.")
        progress_text = st.text_area("What did you accomplish this week?", placeholder="e.g. I finished setting up the database and wrote the API endpoints.")
        
        if st.button("Submit Update & Adjust Plan", type="primary"):
            if progress_text:
                with st.spinner("Analyzing progress and revising project timeline..."):
                    res = requests.post(f"{API_URL}/progress_update", json={"project_id": st.session_state.project_id, "update_text": progress_text})
                    if res.status_code == 200:
                        st.success("Plan updated successfully! Check the '📅 Plan' tab.")
                        st.session_state.latest_insight["project_plan"] = res.json().get("project_plan")
                        st.rerun() # Refresh to show new plan
                    else:
                        st.error("Failed to adjust plan.")
            else:
                st.warning("Please enter your progress update.")

    with tab9:
        st.subheader("📅 Weekly Mentor Check-in")
        if st.button("Run Weekly Check-in", type="primary"):
            with st.spinner("Mentor is reviewing your progress..."):
                res = requests.post(f"{API_URL}/check_in", json={"project_id": st.session_state.project_id})
                if res.status_code == 200:
                    st.session_state.latest_insight["check_in_report"] = res.json().get("check_in_report", "")
                    st.rerun()
                else:
                    st.error("Check-in failed.")
        
        if st.session_state.latest_insight.get("check_in_report"):
            st.markdown("### Mentor Feedback")
            st.markdown(st.session_state.latest_insight["check_in_report"])
            
    with tab10:
        st.subheader("📄 On-Demand Document Generation")
        doc_type = st.selectbox("Select Document Type", ["Synopsis", "Methodology", "Progress Report", "Final Thesis Outline"])
        
        if st.button("Generate Document", type="primary"):
            with st.spinner(f"Generating professional {doc_type}..."):
                res = requests.post(f"{API_URL}/generate_document", json={"project_id": st.session_state.project_id, "doc_type": doc_type})
                if res.status_code == 200:
                    st.session_state.latest_insight["generated_document"] = res.json().get("generated_document", "")
                    st.rerun()
                else:
                    st.error("Failed to generate document.")
                    
        if st.session_state.latest_insight.get("generated_document"):
            st.markdown(f"### Your {doc_type}")
            st.markdown(st.session_state.latest_insight["generated_document"])
            
            # Allow user to download the generated document
            st.download_button(
                label="📥 Download as Markdown", 
                data=st.session_state.latest_insight["generated_document"], 
                file_name=f"{doc_type.lower().replace(' ', '_')}.md",
                mime="text/markdown"
            )
```

### 3.3 UI State Management Tips
1. **Timeouts**: The `/initialize` endpoint makes 7 sequential LLM calls. The frontend HTTP client **MUST** be configured with a timeout of at least `300` seconds (5 minutes) to prevent premature disconnection.
2. **Error Handling**: If the API returns a `500 Internal Server Error`, gracefully display: *"AI Mentor is currently experiencing high load. Please wait 60 seconds and try again."* (This is critical to mask Gemini API rate limiting).
3. **Faculty View**: Create a separate route/page (e.g., `/faculty`) that calls `GET /faculty/dashboard` on load and displays the returned array of student projects in a standard DataGrid or Table component.
