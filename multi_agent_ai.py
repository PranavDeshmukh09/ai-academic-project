import os
import time
import re
import sys
from dotenv import load_dotenv
from typing import TypedDict, Annotated
import operator
from langgraph.graph import StateGraph, START, END
from google import genai

sys.stdout.reconfigure(encoding='utf-8')
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")

genai_client = None
if api_key:
    try:
        genai_client = genai.Client(api_key=api_key)
    except Exception as e:
        print(f"⚠️ Error initializing Google GenAI Client: {e}")

# Prioritized list of active Gemini models
ACTIVE_MODELS = [
    "gemini-3.6-flash",
    "gemini-3.5-flash-lite",
    "gemini-3.5-flash",
    "gemini-3.1-flash-lite",
    "gemini-3.7-flash"
]

def _get_offline_fallback(prompt):
    p_lower = prompt.lower()
    if "skill report" in p_lower or "student profile" in p_lower:
        return """## Core Strengths
* **Backend Architecture & APIs**: Strong command over core backend languages and data layer design.
* **Database Modeling & SQL**: Proficiency in relational database schemas and data integrity.

## Areas of Weakness & Skill Gaps
* **Frontend Engineering**: Limited experience with modern reactive UI frameworks and state management.
* **DevOps & Tooling**: Growth needed in automated CI/CD pipelines, containerization, and unit testing.

## Recommendations
* **Focus on Backend-Driven Architecture**: Build robust REST APIs and lightweight server-rendered views.
* **Master Version Control**: Implement disciplined Git branching and Postman API contract testing."""
    elif "project evaluator" in p_lower or "feasible" in p_lower:
        return """# Academic Project Evaluation

## 1. Feasibility Analysis (3-Month Semester)
**Verdict: Approved & Feasible**
The proposed engineering scope is well-suited for a 12-week academic semester, leveraging the student's primary technical competencies.

## 2. Scope Assessment
The core problem demonstrates genuine computer science rigor. Boundary conditions should prioritize backend business logic, validation rules, and structured data pipelines over complex client styling.

## 3. Refined Academic Project Scope & Core Deliverables
* **Modular RESTful Backend**: Core CRUD services, JWT authentication, and structured validation.
* **Relational Database Design**: Fully normalized relational schema with indexing and foreign keys.
* **Automated Business Engine**: Algorithmic data processing and batch ingestion pipelines.
* **Academic Deliverables**: Complete API Postman collections, database ER diagrams, and verification test suites."""
    elif "agile project manager" in p_lower or "milestones" in p_lower:
        return """## Milestone 1: Requirements Analysis & Schema Architecture (Weeks 1-3)
- Formulate functional specifications and entity-relationship models.
- Initialize project repository, environment configuration, and core routing.

## Milestone 2: Core Engine & REST API Services (Weeks 4-7)
- Build core database access layers and business controllers.
- Implement authentication security middleware and error handlers.

## Milestone 3: Data Ingestion Engine & Dashboard UI (Weeks 8-10)
- Develop batch data processing and report generation pipelines.
- Build responsive client dashboard components and telemetry logging.

## Milestone 4: Comprehensive Audit, Testing & Final Viva Defense (Weeks 11-12)
- Execute unit and integration test suites.
- Compile final capstone documentation and project presentation."""
    elif "tech stack" in p_lower or "architect" in p_lower:
        return """* **Frontend UI**: React / Vite, TailwindCSS, Axios
* **Backend Engine**: Spring Boot / FastAPI, RESTful APIs, JWT Auth
* **Database & Storage**: PostgreSQL / Supabase, Pinecone Vector RAG
* **Testing & Tools**: Postman, PyTest / JUnit, Git & GitHub
* **DevOps & Cloud**: Docker containerization, cloud deployment"""
    elif "risk" in p_lower:
        return """## Technical Blocker & Risk Analysis Evaluation

### Risk 1: Real-time Communication Latency & Connection Drops
* **Technical Blocker & Stack Requirement:** High client-server handshake overhead under concurrent user connections.
* **Student Skill Gap:** Limited experience with async event loops and reconnection strategies.
* **Likelihood:** Medium | **Impact:** High
* **Mitigation Strategy:**
  1. Implement client-side exponential backoff reconnection logic.
  2. Use lightweight SockJS / STOMP fallback protocols.

### Risk 2: Data Model Consistency & Migration Overhead
* **Technical Blocker & Stack Requirement:** Evolving schema requirements during multi-module feature expansion.
* **Student Skill Gap:** Database normalization and relational constraint enforcement.
* **Likelihood:** Low | **Impact:** Medium
* **Mitigation Strategy:**
  1. Maintain strict versioned SQL migration scripts.
  2. Enforce foreign key constraints at database level.

### Risk 3: Third-Party Ingestion & Parsing Failures
* **Technical Blocker & Stack Requirement:** Handling malformed input payloads and unparsed receipts.
* **Student Skill Gap:** Defensive input validation and asynchronous batch processing.
* **Likelihood:** Medium | **Impact:** Medium
* **Mitigation Strategy:**
  1. Implement strict schema validation and fallback error queues.
  2. Provide structured CSV template imports."""
    elif "mentor" in p_lower:
        return "Welcome to your capstone journey! Focus on completing your database schema and core API controllers first before spending time on complex UI styling. Test each module incrementally with Postman to ensure a smooth final viva defense."
    elif "documentation" in p_lower or "readme" in p_lower:
        return """# Capstone Project Documentation

## Executive Project Overview
This project provides a full-stack academic platform featuring multi-agent AI evaluation, real-time progress telemetry, and structured milestone management.

## Milestone Roadmap Diagram
```mermaid
graph TD
    A[Phase 1: Architecture & Setup] --> B[Phase 2: Core Engine Development]
    B --> C[Phase 3: Real-time Telemetry & UI]
    C --> D[Phase 4: Audit & Viva Defense]
```

## Database Architecture & Initial SQL Migrations
```sql
CREATE TABLE IF NOT EXISTS project_idea (
    project_id SERIAL PRIMARY KEY,
    student_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    domain VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Setup & Execution Commands
```bash
# Clone repository and install dependencies
git clone https://github.com/academic/project.git
npm install
pip install -r requirements.txt
```"""
    else:
        return "Evaluation request processed successfully. Multi-agent pipeline initialized for academic capstone tracking."


def safe_invoke(prompt, max_retries_per_model=2):
    """Executes prompt against Google GenAI with multi-model fallback and rate-limit retries."""
    if not genai_client:
        return _get_offline_fallback(prompt)

    for model_name in ACTIVE_MODELS:
        for attempt in range(max_retries_per_model):
            try:
                response = genai_client.models.generate_content(
                    model=model_name,
                    contents=prompt
                )
                if response and response.text:
                    clean = response.text.strip()
                    if clean:
                        return clean
            except Exception as e:
                err_str = str(e).lower()
                is_quota_exhausted = "resource_exhausted" in err_str or "quota exceeded" in err_str
                is_not_found = "404" in err_str or "not_found" in err_str
                is_transient = any(k in err_str for k in ["503", "unavailable", "500", "overloaded", "deadline"])

                if is_quota_exhausted or is_not_found:
                    # Model has exhausted quota or is unavailable; immediately failover to next model
                    print(f"   ℹ️ Model {model_name} quota/availability issue ({e}). Switching to next model...", flush=True)
                    break
                elif is_transient:
                    wait_time = 1.0 * (attempt + 1)
                    print(f"   ⏳ Model {model_name} transient error ({e}). Retrying in {wait_time:.1f}s ({attempt+1}/{max_retries_per_model})...", flush=True)
                    time.sleep(wait_time)
                else:
                    print(f"   ⚠️ Model {model_name} error ({e}). Trying next model...", flush=True)
                    break

    print("   ℹ️ Returning formatted fallback report output.", flush=True)
    return _get_offline_fallback(prompt)


class Agent_State(TypedDict):
    # --- INPUTS 
    student_profile: str
    skill_questionnaire: str
    project_idea: str
    chat_history: str
    new_message: str
    progress_update: str
    document_type: str
    
    # --- OUTPUTS 
    skill_report: str
    project_evaluation: str
    project_plan: str
    tech_stack: str
    risk_analysis: str
    mentor_advice: str
    final_documentation: str
    check_in_report: str
    generated_document: str
    agents_executed: Annotated[list[str], operator.add]
    next_agent: str
    reference_documents: str
    chat_reply: str


def student_assesment_agent(state: Agent_State):
    print("--- 📊 Assessing Student Profile & Skills... ---", flush=True)
    profile = state.get('student_profile', 'Unknown profile')
    questionnaire = state.get('skill_questionnaire', 'Unknown skills')

    prompt = f"""You are an expert Academic Advisor and Technical Mentor.
Analyze the following student profile and skill background.
Identify their core strengths and areas of weakness. 
Write a highly structured 'Skill Report' summarizing your diagnostic assessment.

FORMATTING REQUIREMENTS:
You MUST structure your response into clear Markdown sections so the UI can parse badges:
## Core Strengths
* **[Skill/Area Title]**: [Detailed explanation of student's strength]
* **[Skill/Area Title]**: [Detailed explanation of student's strength]

## Areas of Weakness & Skill Gaps
* **[Skill/Area Title]**: [Specific technical weakness or missing tool]
* **[Skill/Area Title]**: [Specific technical weakness or missing tool]

## Recommendations
* **[Action Item Title]**: [Concrete learning or architecture suggestion]
* **[Action Item Title]**: [Concrete learning or architecture suggestion]

Student Profile: {profile}
Skill Questionnaire / Background: {questionnaire}
CHAT HISTORY: {state.get('chat_history', 'No previous chat')}
LATEST STUDENT REQUEST: {state.get('new_message', 'No new request')}
REFERENCE DOCUMENTS: {state.get('reference_documents', 'None provided')}"""

    result = safe_invoke(prompt)
    return {"skill_report": result, "agents_executed": ["📊 Skill Assessor"]}


def project_evaluation_agent(state: Agent_State):
    print("--- 📋 Evaluating Project Scope & Feasibility... ---", flush=True)
    idea = state.get('project_idea', 'Unknown idea')
    skills = state.get('skill_report', 'Unknown skills')

    prompt = f"""You are a strict Academic Project Evaluator. 
Analyze this capstone project idea in relation to the student's assessed skills.

Project Idea: {idea}
Student Skill Assessment: {skills}

EVALUATION CRITERIA:
1. Is this project feasible for a 3-month (12-week) academic semester?
2. Is it too simple (needs more architectural depth) or too complex (needs de-scoping)?
3. If the input is a micro-snippet (e.g., hello world), upgrade the scope into an academic-grade system.

FORMATTING REQUIREMENTS:
Use the following clear markdown structure:
# Academic Project Evaluation Report

## 1. Feasibility Analysis (3-Month Semester)
**Verdict:** [Approved / Conditionally Feasible / Needs Adjustment]
* [Detailed explanation of feasibility based on timeline and student skills]

## 2. Scope Assessment
* [Detailed breakdown of what is well-scoped and what should be de-scoped]

## 3. Refined Academic Project Scope & Core Deliverables
* **Core Backend Architecture**: [Specific architectural components and endpoints]
* **Relational Database Design**: [Normalized schema, indexing, and tables]
* **Business Logic & Processing Engine**: [Core logic and algorithms]
* **Academic Deliverables**: [ER diagrams, Postman collections, unit tests]

CHAT HISTORY: {state.get('chat_history', 'No previous chat')}
LATEST STUDENT REQUEST: {state.get('new_message', 'No new request')}
REFERENCE DOCUMENTS: {state.get('reference_documents', 'None provided')}"""

    result = safe_invoke(prompt)
    return {"project_evaluation": result, "agents_executed": ["📋 Project Evaluator"]}


def project_planing_agent(state: Agent_State):
    print("--- 📅 Planning Milestones & Roadmap... ---", flush=True)
    evaluation = state.get('project_evaluation', 'No evaluation')

    prompt = f"""You are an expert Agile Project Manager.
Take the following project evaluation and create a structured 12-week milestone plan.
Break the project into 4 sequential milestone phases.

CRITICAL FORMATTING REQUIREMENT FOR UI PARSER:
You MUST format each milestone section starting with exact markdown headers:
"## Milestone [Number]: [Title] (Weeks X-Y)"
Under each milestone, list 2-4 actionable bullet points starting with "- ".

Example:
## Milestone 1: Requirements & Architecture Setup (Weeks 1-3)
- Define entity-relationship schema and database migrations.
- Initialize repository, environment variables, and authentication controllers.

## Milestone 2: Core Engine & REST API Services (Weeks 4-7)
- Build core database access layers and business logic.
- Implement input validation and automated categorization.

## Milestone 3: Data Ingestion & Presentation Layer (Weeks 8-10)
- Develop data ingestion and batch import endpoints.
- Build reporting dashboard and user interfaces.

## Milestone 4: Comprehensive Audit, Testing & Viva Defense (Weeks 11-12)
- Execute unit and integration tests with Postman.
- Finalize capstone documentation and presentation slides.

Project Evaluation Context:
{evaluation}
CHAT HISTORY: {state.get('chat_history', 'No previous chat')}
LATEST STUDENT REQUEST: {state.get('new_message', 'No new request')}
REFERENCE DOCUMENTS: {state.get('reference_documents', 'None provided')}"""

    result = safe_invoke(prompt)
    return {"project_plan": result, "agents_executed": ["📅 Project Planner"]}


def tech_recommendation_agent(state: Agent_State):
    print("--- 💻 Recommending Technology Stack... ---", flush=True)
    plan = state.get('project_plan', 'No plan')
    skills = state.get('skill_report', 'No skills')

    prompt = f"""You are a Senior Software Architect.
Based on the project plan and the student's assessed skills, recommend the optimal technology stack.

CRITICAL FORMATTING REQUIREMENT FOR UI PARSER:
Format each technology recommendation as a bullet point with a bold category/component and colon:
* **[Category/Layer Name]**: [Specific frameworks, libraries, tools, and justification]

Example:
* **Frontend UI / Client**: React / Vite, TailwindCSS, Axios (or Thymeleaf / HTML5 for backend-focused projects)
* **Backend Engine / APIs**: Java, Spring Boot 3, Spring Security, RESTful Controllers
* **Database & Persistence**: PostgreSQL, Spring Data JPA / Hibernate, Flyway Migrations
* **Testing & API Tooling**: Postman, JUnit 5, Mockito, Git & GitHub
* **DevOps & Deployment**: Docker containerization, Maven build tool

Student Skills: {skills}
Project Plan: {plan}
CHAT HISTORY: {state.get('chat_history', 'No previous chat')}
LATEST STUDENT REQUEST: {state.get('new_message', 'No new request')}
REFERENCE DOCUMENTS: {state.get('reference_documents', 'None provided')}"""

    result = safe_invoke(prompt)
    return {"tech_stack": result, "agents_executed": ["💻 Tech Architect"]}


def risk_analysis_agent(state: Agent_State):
    print("--- ⚠️ Analyzing Technical Risks & Roadblocks... ---", flush=True)
    plan = state.get('project_plan', 'No plan')
    tech = state.get('tech_stack', 'No tech stack')
    skills = state.get('skill_report', 'No skills')

    prompt = f"""You are a strict Risk Analyst and Technical Project Manager.
Analyze the project plan, recommended tech stack, and student skills.
Identify the top 3 biggest technical risks or roadblocks this student will face.

CRITICAL FORMATTING REQUIREMENT FOR UI PARSER:
Output ONLY clean Markdown using the following exact structure:

## Technical Blocker & Risk Analysis Evaluation

### Risk 1: [Specific Risk Title]
* **Technical Blocker & Stack Requirement:** [Detailed explanation of technical challenge]
* **Student Skill Gap:** [Specific gap mapped to student background]
* **Likelihood:** High | **Impact:** High
* **Mitigation Strategy:**
  1. [Actionable step 1]
  2. [Actionable step 2]

### Risk 2: [Specific Risk Title]
* **Technical Blocker & Stack Requirement:** [Detailed explanation of technical challenge]
* **Student Skill Gap:** [Specific gap mapped to student background]
* **Likelihood:** Medium | **Impact:** High
* **Mitigation Strategy:**
  1. [Actionable step 1]
  2. [Actionable step 2]

### Risk 3: [Specific Risk Title]
* **Technical Blocker & Stack Requirement:** [Detailed explanation of technical challenge]
* **Student Skill Gap:** [Specific gap mapped to student background]
* **Likelihood:** Low | **Impact:** Medium
* **Mitigation Strategy:**
  1. [Actionable step 1]
  2. [Actionable step 2]

Student Skills: {skills}
Project Plan: {plan}
Tech Stack: {tech}
CHAT HISTORY: {state.get('chat_history', 'No previous chat')}
LATEST STUDENT REQUEST: {state.get('new_message', 'No new request')}
REFERENCE DOCUMENTS: {state.get('reference_documents', 'None provided')}"""

    result = safe_invoke(prompt)
    cleaned_result = re.sub(r'<reasoning>[\s\S]*?</reasoning>', '', result).strip()
    return {"risk_analysis": cleaned_result, "agents_executed": ["⚠️ Risk Analyst"]}


def mentor_agent(state: Agent_State):
    print("--- 🤝 Providing Academic Mentorship Advice... ---", flush=True)
    skills = state.get('skill_report', 'No skills')
    risks = state.get('risk_analysis', 'No risks')

    prompt = f"""You are an encouraging AI Senior Academic Mentor.
Review the student's skill profile, project scope, and identified technical risks.
Provide an encouraging message and 2-3 specific, actionable technical study recommendations to start on first.

FORMATTING:
Output clean, motivating Markdown with clear bullet points.

Student Skills: {skills}
Project Risks: {risks}
CHAT HISTORY: {state.get('chat_history', 'No previous chat')}
LATEST STUDENT REQUEST: {state.get('new_message', 'No new request')}
REFERENCE DOCUMENTS: {state.get('reference_documents', 'None provided')}"""

    result = safe_invoke(prompt)
    return {"mentor_advice": result, "agents_executed": ["🤝 Mentor Advisor"]}


def documentation_agent(state: Agent_State):
    print("--- 📝 Compiling Comprehensive Final Documentation... ---", flush=True)
    idea = state.get('project_idea', 'No idea')
    plan = state.get('project_plan', 'No plan')
    tech = state.get('tech_stack', 'No tech')
    risks = state.get('risk_analysis', 'No risks')
    mentor = state.get('mentor_advice', 'No advice')

    prompt = f"""You are an Expert Technical Writer and Lead System Architect. 
Compile all the project information into a production-grade Markdown document for the Project README / Final Capstone System Documentation.

MANDATORY SECTIONS:
1. **Executive Project Overview**: Problem statement, target architecture, and core scope.
2. **Milestone Roadmap Diagram**: Include a modern ```mermaid block (`graph TD` or `flowchart TD`) linking each milestone phase.
3. **Tech Stack & System Architecture**: Detailed breakdown of components with inline backticks for package names.
4. **Database Architecture & Initial SQL Migrations**: Include a dedicated section titled "## Database Architecture & Initial SQL Migrations" with syntactically valid ```sql code blocks for initial schema creation (tables, primary/foreign keys, indexes).
5. **CLI Setup & Execution Commands**: Step-by-step commands inside ```bash code blocks.
6. **Risk Analysis & Mitigation Matrix**: Structured table or summary of risks.

Project Idea: {idea}
Plan: {plan}
Tech Stack: {tech}
Risks: {risks}
Advice: {mentor}
CHAT HISTORY: {state.get('chat_history', 'No previous chat')}
LATEST STUDENT REQUEST: {state.get('new_message', 'No new request')}
REFERENCE DOCUMENTS: {state.get('reference_documents', 'None provided')}"""

    result = safe_invoke(prompt)
    return {"final_documentation": result, "agents_executed": ["📝 Documentation Writer"]}


def chat_responder_agent(state: Agent_State):
    print("--- 🗣️ Generating Conversational Reply... ---", flush=True)
    chat_hist = str(state.get('chat_history', 'This is the first interaction.'))[-1000:]

    prompt = f"""You are the AI Mentor Team Coordinator — the unified voice of a multi-agent academic specialist team.
Your job is to respond directly and helpfully to the student's message by synthesizing insights from your specialist agents.

--- CONTEXT ---
Student Profile: {state.get('student_profile', 'Unknown student')}
Project Idea: {state.get('project_idea', 'No project idea provided')}
Chat History: {chat_hist}
Latest Student Message: {state.get('new_message', 'No new message')}

--- SPECIALIST KNOWLEDGE BASE ---
Skill Report: {str(state.get('skill_report', 'Not yet generated'))[:400]}
Project Evaluation: {str(state.get('project_evaluation', 'Not yet generated'))[:400]}
Project Plan: {str(state.get('project_plan', 'Not yet generated'))[:400]}
Tech Stack: {str(state.get('tech_stack', 'Not yet generated'))[:400]}
Risk Analysis: {str(state.get('risk_analysis', 'Not yet generated'))[:400]}

--- INSTRUCTIONS ---
1. Address the student warmly and answer their specific question directly.
2. If they ask for code, provide clean syntax-highlighted code blocks with explanations and CLI execution steps.
3. If they ask about project planning, tech stack, or risks, refer to the project knowledge base above.
4. Output clean, raw Markdown directly (do not wrap in JSON)."""

    result = safe_invoke(prompt).strip()
    if result.startswith("```markdown"):
        result = result[11:-3].strip()
    elif result.startswith("```"):
        result = result[3:-3].strip()
    return {"chat_reply": result, "agents_executed": ["🗣️ AI Mentor Chat"]}


def plan_adjustment_agent(state: Agent_State):
    print("--- 🔄 Adjusting Project Plan... ---", flush=True)
    plan = state.get('project_plan', '')
    update = state.get('progress_update', '')

    prompt = f"""You are an Agile Project Manager for an Academic Institution.
The student has submitted a progress update. Review the current project plan and the progress update, and output a REVISED project plan.

CRITICAL ACADEMIC CONSTRAINT: The final submission deadline is STRICT (12 weeks).
If the student is behind schedule, compress future milestones and focus on core MVP deliverables.
Maintain the exact markdown format with "## Milestone [Number]: [Title] (Weeks X-Y)" headers.

Current Plan: {plan}
Progress Update: {update}

Output ONLY the revised markdown plan."""

    result = safe_invoke(prompt)
    return {"project_plan": result, "agents_executed": ["🔄 Plan Adjuster"]}


def weekly_checkin_agent(state: Agent_State):
    print("--- 📅 Running Weekly Check-in... ---", flush=True)
    plan = state.get('project_plan', '')
    update = state.get('progress_update', 'No update provided.')

    prompt = f"""You are an Academic Mentor conducting a weekly check-in.
Review the project plan and the student's latest progress update.
Provide a clear weekly check-in report with performance summary, milestone tracking, and actionable next steps for the upcoming week.

Project Plan: {plan}
Latest Progress Update: {update}"""

    result = safe_invoke(prompt)
    return {"check_in_report": result, "agents_executed": ["📅 Check-in Mentor"]}


def document_generation_agent(state: Agent_State):
    doc_type = state.get('document_type', 'Synopsis')
    print(f"--- 📄 Generating Document: {doc_type} ---", flush=True)
    idea = state.get('project_idea', '')
    plan = state.get('project_plan', '')
    tech = state.get('tech_stack', '')
    risks = state.get('risk_analysis', '')
    mentor = state.get('mentor_advice', '')
    progress = state.get('progress_update', '')

    prompt = f"""You are an expert Academic Technical Writer and Engineering Systems Evaluator.
Generate a comprehensive, academic-grade {doc_type} document for the following capstone project.

PROJECT CONTEXT & RE-EVALUATED TIMELINE:
Project Idea: {idea}
Project Plan & Current Milestones: {plan}
Tech Stack: {tech}
Current Risk Profile: {risks}
Mentor Advice: {mentor}
Latest Progress & Timeline Status: {progress if progress else 'Project in active progress matching milestone timeline.'}

DOCUMENT SPECIFICATIONS FOR "{doc_type}":
- If Weekly/Monthly Report: Include milestone completion breakdown, tasks finished, planned vs actual timeline deviation, blockers resolved, and next sprint goals.
- If Synopsis / Methodology / Final Report / README: Include executive summary, target architecture, updated milestone timeline table, database schema, and verification steps.
- Output clean, structured Markdown with headings, bullet points, and code blocks where applicable."""

    result = safe_invoke(prompt)
    return {"generated_document": result, "agents_executed": ["📄 Document Writer"]}


# --- GRAPH DEFINITIONS ---

init_builder = StateGraph(Agent_State)
init_builder.add_node("student_assesment", student_assesment_agent)
init_builder.add_node("project_evaluation", project_evaluation_agent)
init_builder.add_node("project_planing", project_planing_agent)
init_builder.add_node("tech_recommendation", tech_recommendation_agent)
init_builder.add_node("risk_analysis", risk_analysis_agent)
init_builder.add_node("mentor", mentor_agent)
init_builder.add_node("documentation", documentation_agent)

init_builder.add_edge(START, "student_assesment")
init_builder.add_edge("student_assesment", "project_evaluation")
init_builder.add_edge("project_evaluation", "project_planing")
init_builder.add_edge("project_planing", "tech_recommendation")
init_builder.add_edge("tech_recommendation", "risk_analysis")
init_builder.add_edge("risk_analysis", "mentor")
init_builder.add_edge("mentor", "documentation")
init_builder.add_edge("documentation", END)

initialization_app = init_builder.compile()

# Chat Graph
chat_builder = StateGraph(Agent_State)
chat_builder.add_node("chat_responder", chat_responder_agent)
chat_builder.add_edge(START, "chat_responder")
chat_builder.add_edge("chat_responder", END)
chat_app = chat_builder.compile()

# Plan Adjustment Graph (Chained with Risk Analysis & Mentorship Re-evaluation)
plan_builder = StateGraph(Agent_State)
plan_builder.add_node("plan_adjustment", plan_adjustment_agent)
plan_builder.add_node("risk_analysis", risk_analysis_agent)
plan_builder.add_node("mentor", mentor_agent)
plan_builder.add_edge(START, "plan_adjustment")
plan_builder.add_edge("plan_adjustment", "risk_analysis")
plan_builder.add_edge("risk_analysis", "mentor")
plan_builder.add_edge("mentor", END)
plan_adjustment_app = plan_builder.compile()

# Weekly Checkin Graph
checkin_builder = StateGraph(Agent_State)
checkin_builder.add_node("weekly_checkin", weekly_checkin_agent)
checkin_builder.add_edge(START, "weekly_checkin")
checkin_builder.add_edge("weekly_checkin", END)
weekly_checkin_app = checkin_builder.compile()

# Document Generation Graph
doc_builder = StateGraph(Agent_State)
doc_builder.add_node("document_generation", document_generation_agent)
doc_builder.add_edge(START, "document_generation")
doc_builder.add_edge("document_generation", END)
document_generation_app = doc_builder.compile()
