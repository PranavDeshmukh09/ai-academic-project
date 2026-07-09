import os
import time
from dotenv import load_dotenv
from typing import TypedDict
from langgraph.graph import StateGraph, START, END
from langchain_core.messages import HumanMessage
from langchain_groq import ChatGroq

load_dotenv()

api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    raise ValueError("GROQ_API_KEY environment variable is not set. Please check your .env file.")

# Initialize the Groq model
llm = ChatGroq(
    model="llama-3.1-8b-instant",
    temperature=0.7,
    api_key=api_key
)

# Helper: retry on rate limit errors (Groq free tier has strict limits)
def safe_invoke(prompt, max_retries=3):
    for attempt in range(max_retries):
        try:
            response = llm.invoke([HumanMessage(content=prompt)])
            return response.content
        except Exception as e:
            if "429" in str(e) or "rate" in str(e).lower():
                wait_time = 15 * (attempt + 1)
                print(f"   ⏳ Rate limited. Waiting {wait_time}s before retry ({attempt+1}/{max_retries})...")
                time.sleep(wait_time)
            else:
                raise e
    raise Exception("Max retries exceeded due to rate limiting.")

# ──────────────────────────────────────────────
# SHARED STATE — The "clipboard" all agents share
# ──────────────────────────────────────────────
class Agent_State(TypedDict):
    # --- INPUTS (provided by user via API)
    student_profile: str
    skill_questionnaire: str
    project_idea: str

    # --- OUTPUTS (filled in by each agent)
    skill_report: str
    project_evaluation: str
    project_plan: str
    tech_stack: str
    risk_analysis: str
    mentor_advice: str
    final_documentation: str

    # --- ORCHESTRATOR ROUTING (the "sticky note")
    next_agent: str


# ──────────────────────────────────────────────
# THE ORCHESTRATOR — The "Head Doctor"
# Checks what's done, asks LLM what to do next,
# writes the decision to state["next_agent"]
# ──────────────────────────────────────────────
def orchestrator(state: Agent_State):
    print("--- 🧠 Orchestrator deciding next step... ---")

    # Check which agents have already produced output
    completed = []
    if state.get('skill_report'):       completed.append("Student Assessment")
    if state.get('project_evaluation'): completed.append("Project Evaluation")
    if state.get('project_plan'):       completed.append("Project Planning")
    if state.get('tech_stack'):         completed.append("Tech Recommendation")
    if state.get('risk_analysis'):      completed.append("Risk Analysis")
    if state.get('mentor_advice'):      completed.append("Mentor Advice")
    if state.get('final_documentation'):completed.append("Documentation")

    completed_str = ", ".join(completed) if completed else "None yet"

    prompt = f"""You are an AI Workflow Orchestrator managing a student project mentoring system.
Your job is to decide which agent to call next based on what has been completed.

Completed steps: {completed_str}

Available agents (call them in this logical order):
- "assessment"   -> Analyzes student skills (run FIRST, always)
- "evaluation"   -> Evaluates the project idea (needs assessment done)
- "planning"     -> Creates project milestones (needs evaluation done)
- "tech"         -> Recommends technologies (needs planning done)
- "risk"         -> Analyzes risks (needs tech done)
- "mentor"       -> Provides advice (needs risk done)
- "docs"         -> Writes final documentation (needs mentor done)
- "finish"       -> End the workflow (only when ALL 7 steps are done)

Reply with ONLY a single word from the list above. No explanation.
Next agent:"""

    result = safe_invoke(prompt)
    # Take just the first word/line and lowercase it
    decision = result.strip().split('\n')[0].strip().split()[0].lower()
    print(f"   🧠 Orchestrator decided: '{decision}'")
    return {"next_agent": decision}


# ──────────────────────────────────────────────
# THE ROUTER — The "Receptionist"
# Reads next_agent from state and returns it
# so LangGraph knows which node to go to next.
# No AI here — just reads and returns.
# ──────────────────────────────────────────────
def router(state: Agent_State) -> str:
    decision = state.get("next_agent", "finish").strip().lower()
    print(f"   🔀 Router directing to: '{decision}'")
    return decision


# ──────────────────────────────────────────────
# SPECIALIST AGENTS
# ──────────────────────────────────────────────
def student_assesment_agent(state: Agent_State):
    print("--- 🧑‍🎓 Assessing student profile... ---")
    profile = state['student_profile']
    questionnaire = state['skill_questionnaire']
    prompt = f"""You are an expert academic advisor and technical mentor.
    Analyze the following student profile and their skill questionnaire answers.
    Identify their core strengths and areas of weakness.
    Write a concise Skill Report summarizing this.

    Student Profile: {profile}
    Skill Questionnaire: {questionnaire}
    """
    result = safe_invoke(prompt)
    return {"skill_report": result}


def project_evaluation_agent(state: Agent_State):
    print("--- 🧐 Evaluating project idea... ---")
    idea = state['project_idea']
    skills = state['skill_report']
    prompt = f"""You are a strict but helpful Project Evaluator.
    Review the student's project idea against their actual skills.
    Evaluate the feasibility of the project and suggest concrete improvements.

    Project Idea: {idea}
    Student Skills: {skills}
    """
    result = safe_invoke(prompt)
    return {"project_evaluation": result}


def project_planing_agent(state: Agent_State):
    print("--- 📅 Creating project plan... ---")
    evaluation = state['project_evaluation']
    prompt = f"""You are an expert Agile Project Manager.
    Take the following project evaluation and create a structured plan.
    Define the scope, break the project into 3-5 milestones, and estimate a timeline.

    Project Evaluation: {evaluation}
    """
    result = safe_invoke(prompt)
    return {"project_plan": result}


def tech_recommendation_agent(state: Agent_State):
    print("--- 💻 Recommending technology stack... ---")
    plan = state['project_plan']
    skills = state['skill_report']
    prompt = f"""You are a Senior Software Architect.
    Based on the project plan and the student's current skills, recommend the best
    technologies, frameworks, and tools for them to use.

    Student Skills: {skills}
    Project Plan: {plan}
    """
    result = safe_invoke(prompt)
    return {"tech_stack": result}


def risk_analysis_agent(state: Agent_State):
    print("--- ⚠️ Analyzing risks... ---")
    plan = state['project_plan']
    tech = state['tech_stack']
    prompt = f"""You are a strict Risk Analyst.
    Look at this project plan and tech stack. Identify the top 3 biggest risks
    or roadblocks this student will face, and how they can mitigate them.

    Project Plan: {plan}
    Tech Stack: {tech}
    """
    result = safe_invoke(prompt)
    return {"risk_analysis": result}


def mentor_agent(state: Agent_State):
    print("--- 🤝 Providing mentor advice... ---")
    skills = state['skill_report']
    risks = state['risk_analysis']
    prompt = f"""You are an encouraging AI Coding Mentor.
    Look at the student's weaknesses and the project risks.
    Give them a short, highly encouraging pep talk and 2 specific tips on what to study first.

    Student Skills: {skills}
    Project Risks: {risks}
    """
    result = safe_invoke(prompt)
    return {"mentor_advice": result}


def documentation_agent(state: Agent_State):
    print("--- 📝 Compiling final documentation... ---")
    idea = state['project_idea']
    plan = state['project_plan']
    tech = state['tech_stack']
    risks = state['risk_analysis']
    mentor = state['mentor_advice']
    prompt = f"""You are a Technical Writer.
    Compile all of the following information into a single, beautiful Markdown document
    that the student can use as their Project README. Use nice headers and bullet points.

    Idea: {idea}
    Plan: {plan}
    Tech Stack: {tech}
    Risks: {risks}
    Advice: {mentor}
    """
    result = safe_invoke(prompt)
    return {"final_documentation": result}


# ──────────────────────────────────────────────
# BUILD THE GRAPH
# ──────────────────────────────────────────────
workplace = StateGraph(Agent_State)

# 1. Register all nodes
workplace.add_node("orchestrator",       orchestrator)
workplace.add_node("student_assesment",  student_assesment_agent)
workplace.add_node("project_evaluation", project_evaluation_agent)
workplace.add_node("project_planing",    project_planing_agent)
workplace.add_node("tech_recommendation",tech_recommendation_agent)
workplace.add_node("risk_analysis",      risk_analysis_agent)
workplace.add_node("mentor",             mentor_agent)
workplace.add_node("documentation",      documentation_agent)

# 2. Always start at the orchestrator
workplace.add_edge(START, "orchestrator")

# 3. Conditional edges: orchestrator → router decides → which node
workplace.add_conditional_edges(
    "orchestrator",  # FROM: after orchestrator runs...
    router,          # WHO DECIDES: call router() to read next_agent...
    {                # MAP: router's return value → actual node name
        "assessment": "student_assesment",
        "evaluation": "project_evaluation",
        "planning":   "project_planing",
        "tech":       "tech_recommendation",
        "risk":       "risk_analysis",
        "mentor":     "mentor",
        "docs":       "documentation",
        "finish":     END
    }
)

# 4. After every specialist agent, loop BACK to the orchestrator
workplace.add_edge("student_assesment",   "orchestrator")
workplace.add_edge("project_evaluation",  "orchestrator")
workplace.add_edge("project_planing",     "orchestrator")
workplace.add_edge("tech_recommendation", "orchestrator")
workplace.add_edge("risk_analysis",       "orchestrator")
workplace.add_edge("mentor",              "orchestrator")
workplace.add_edge("documentation",       "orchestrator")

# 5. Compile
app = workplace.compile()
