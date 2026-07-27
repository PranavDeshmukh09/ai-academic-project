
import os
import time
import json
import sys
from dotenv import load_dotenv
from typing import TypedDict, Annotated
import operator 
from langgraph.graph import StateGraph, START, END
from langchain_core.messages import HumanMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_groq import ChatGroq

sys.stdout.reconfigure(encoding='utf-8')

load_dotenv()

# Initialize LLMs
gemini_key = os.getenv("GEMINI_API_KEY")
groq_key = os.getenv("GROQ_API_KEY")

gemini_llm = None
if gemini_key:
    gemini_llm = ChatGoogleGenerativeAI(
        model="gemini-3.5-flash", 
        temperature=0.7,
        api_key=gemini_key,
        request_timeout=15
    )

groq_llm = None
if groq_key:
    groq_llm = ChatGroq(
        model_name="llama-3.3-70b-versatile",
        temperature=0.7,
        api_key=groq_key
    )

# Helper: retry on rate limit errors with exponential backoff and provider fallback
def safe_invoke(prompt, max_retries=3, force_groq=False):
    models_to_try = []
    if force_groq:
        if groq_llm:
            models_to_try.append(("Groq", groq_llm))
        if gemini_llm:
            models_to_try.append(("Gemini", gemini_llm))
    else:
        if groq_llm:
            models_to_try.append(("Groq", groq_llm))
        if gemini_llm:
            models_to_try.append(("Gemini", gemini_llm))

    if not models_to_try:
        raise ValueError("No LLM providers (Gemini or Groq) are configured.")

    for attempt in range(max_retries):
        for name, model in models_to_try:
            try:
                print(f"   [LLM Invoke] Attempting call with {name}...", flush=True)
                response = model.invoke([HumanMessage(content=prompt)])
                print(f"   [LLM Success] Data generated using {name}.", flush=True)
                content = response.content
                if isinstance(content, list):
                    content = "\n".join(
                        block.get("text", str(block)) if isinstance(block, dict) else str(block)
                        for block in content
                    )
                return content
            except Exception as e:
                print(f"   ⚠️ {name} failed: {str(e)}", flush=True)
                # If rate limited, we continue immediately to the next provider
                if "429" in str(e) or "rate" in str(e).lower() or "limit" in str(e).lower() or "quota" in str(e).lower():
                    continue
                else:
                    # For other exceptions we still attempt other providers
                    continue
        
        wait_time = 15 * (attempt + 1)
        print(f"   ⏳ All providers busy or rate limited. Waiting {wait_time}s before retry ({attempt+1}/{max_retries})...", flush=True)
        time.sleep(wait_time)
        
    raise Exception("Max retries exceeded for all configured LLM providers.")

class Agent_State(TypedDict):
    # --- INPUTS 
    student_profile: str
    skill_questionnaire: str
    project_idea: str
    chat_history: str
    new_message: str
    
    # --- OUTPUTS 
    skill_report: str
    project_evaluation: str
    project_plan: str
    tech_stack: str
    risk_analysis: str
    mentor_advice: str
    final_documentation: str
    agents_executed : Annotated[list[str], operator.add]
    next_agent: str
    reference_documents: str
    chat_reply: str

def parse_json_response(text):
    text = text.strip()
    if text.startswith("```json"):
        text = text[7:]
    elif text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    text = text.strip()
    
    try:
        return json.loads(text)
    except Exception as e:
        print(f"   ⚠️ JSON direct parsing failed: {e}. Attempting fuzzy extraction...", flush=True)
        start = text.find('{')
        end = text.rfind('}')
        if start != -1 and end != -1:
            try:
                return json.loads(text[start:end+1])
            except Exception as ex:
                pass
        raise e

def run_consolidated_pipeline(state: Agent_State):
    print("--- 🧠 Running Consolidated 7-Agent Pipeline in a Single LLM Call ---", flush=True)
    profile = state['student_profile']
    questionnaire = state['skill_questionnaire']
    idea = state['project_idea']
    chat_history = state.get('chat_history', 'No previous chat')
    new_message = state.get('new_message', 'No new request')
    ref_docs = state.get('reference_documents', 'None provided')

    prompt = f"""You are a team of expert academic advisors, technical mentors, project managers, senior architects, risk analysts, and technical writers.
Analyze the following student details and project idea, and generate all required mentoring assessments, plans, and documentation.

--- STUDENT PROFILE ---
{profile}

--- SKILL QUESTIONNAIRE ---
{questionnaire}

--- PROJECT IDEA ---
{idea}

--- CONVERSATION CONTEXT (if any) ---
Chat History: {chat_history}
Latest Student Request: {new_message}
Uploaded Reference Documents: {ref_docs}

Please perform the following 7 tasks:
1. Skill Assessment: Identify the student's core strengths and areas of weakness based on their profile and skills questionnaire. Write a concise 'Skill Report'.
2. Project Feasibility/Evaluation: Review the project idea against their skills. Evaluate the feasibility of the project and suggest concrete improvements.
3. Project Planning: Create a structured Agile project plan. Define the scope, break the project into 3-5 milestones, and estimate a timeline.
4. Tech Stack Recommendation: Based on the project plan and the student's current skills, recommend the best technologies, frameworks, and tools.
5. Risk Analysis: Identify the top 3 biggest risks or roadblocks this student will face, and how they can mitigate them.
6. Mentor Advice: Give an encouraging pep talk and 2 specific tips on what to study first.
7. Final README: Compile all the generated information above into a single, beautiful, complete Markdown document (Project README) with clean headers and bullet points.

CRITICAL INSTRUCTION: You MUST return your response as a valid JSON object. Do not include markdown code block formatting (such as ```json ... ```) in your output. Return raw JSON text only.
The JSON object must have exactly these keys:
{{
    "skill_report": "Concise skill report text...",
    "project_evaluation": "Feasibility evaluation and suggested improvements...",
    "project_plan": "Structured Agile project plan with milestones and timeline...",
    "tech_stack": "Recommended technologies and frameworks...",
    "risk_analysis": "Top 3 risks and mitigation strategies...",
    "mentor_advice": "Encouraging pep talk and 2 study tips...",
    "final_documentation": "Complete Markdown Project README compiling all the above..."
}}
"""
    return safe_invoke(prompt)

def student_assesment_agent(state:Agent_State):
    print("--- 📊 Assessing Student Profile... ---", flush=True)
    
    # Check if we already have the outputs pre-populated in the state
    if state.get("skill_report"):
        print("   [Using cached data]", flush=True)
        return {"agents_executed": ["📊 Skill Assessor"]}

    try:
        raw_res = run_consolidated_pipeline(state)
        res_dict = parse_json_response(raw_res)
        return {
            "skill_report": res_dict.get("skill_report", ""),
            "project_evaluation": res_dict.get("project_evaluation", ""),
            "project_plan": res_dict.get("project_plan", ""),
            "tech_stack": res_dict.get("tech_stack", ""),
            "risk_analysis": res_dict.get("risk_analysis", ""),
            "mentor_advice": res_dict.get("mentor_advice", ""),
            "final_documentation": res_dict.get("final_documentation", ""),
            "agents_executed": ["📊 Skill Assessor"]
        }
    except Exception as e:
        print(f"   ⚠️ Consolidated pipeline failed ({e}). Falling back to individual call...", flush=True)
        profile = state['student_profile']
        questionnaire = state['skill_questionnaire']

        prompt = f"""You are an expert academic advisor and technical mentor.
        Analyze the following student profile and their skill questionnaire answers.
        Identify their core strengths and areas of weakness. 
        Write a concise 'Skill Report' summarizing this.

        student profile : {profile}
        skill questionnaire : {questionnaire}
        CHAT HISTORY: {state.get('chat_history', 'No previous chat')}
        LATEST STUDENT REQUEST: {state.get('new_message', 'No new request')}
        
        If the student made a request, rewrite your specific section to incorporate their feedback.
        REFERENCE DOCUMENTS UPLOADED BY STUDENT: {state.get('reference_documents', 'None provided')}"""

        result = safe_invoke(prompt)
        return {"skill_report": result, "agents_executed": ["📊 Skill Assessor"]}


def project_evaluation_agent(state:Agent_State):
    print("--- 📋 Evaluating Project Idea... ---", flush=True)
    
    if state.get("project_evaluation"):
        print("   [Using cached data]", flush=True)
        return {"agents_executed": ["📋 Project Evaluator"]}

    idea = state['project_idea']
    skills = state.get('skill_report', '')

    prompt = f"""You are a strict but helpful Project Evaluator.
    Review the student's project idea against their actual skills.
    Evaluate the feasibility of the project and suggest concrete improvements.
    
    Project Idea: {idea}
    Student Skills: {skills}
    CHAT HISTORY: {state.get('chat_history', 'No previous chat')}
    LATEST STUDENT REQUEST: {state.get('new_message', 'No new request')}
    
    If the student made a request, rewrite your specific section to incorporate their feedback.
    REFERENCE DOCUMENTS UPLOADED BY STUDENT: {state.get('reference_documents', 'None provided')}"""

    result = safe_invoke(prompt)
    return {"project_evaluation": result, "agents_executed": ["📋 Project Evaluator"]}


def project_planing_agent(state:Agent_State):
    print("--- 📅 Creating Project Plan... ---", flush=True)
    
    if state.get("project_plan"):
        print("   [Using cached data]", flush=True)
        return {"agents_executed": ["📅 Project Planner"]}

    evaluation = state.get('project_evaluation', '')

    prompt = f"""You are an expert Agile Project Manager.
    Take the following project evaluation and create a structured plan.
    Define the scope, break the project into 3-5 milestones, and estimate a timeline.
    
    Structure your plan using clear markdown headings for each milestone, formatted EXACTLY as:
    ## Milestone X: [Milestone Title]
    Provide a brief description of the phase, followed by a bullet list of tasks/deliverables:
    - Task 1
    - Task 2
    
    Keep the formatting extremely clean and consistent. Do not add conversational headers before the plan.

    Project Evaluation: {evaluation}
    CHAT HISTORY: {state.get('chat_history', 'No previous chat')}
    LATEST STUDENT REQUEST: {state.get('new_message', 'No new request')}
    
    If the student made a request, rewrite your plan to incorporate their feedback, keeping the ## Milestone X formatting.
    REFERENCE DOCUMENTS UPLOADED BY STUDENT: {state.get('reference_documents', 'None provided')}"""

    result = safe_invoke(prompt)
    return {"project_plan": result, "agents_executed": ["📅 Project Planner"]}


def tech_recommendation_agent(state: Agent_State):
    print("--- 💻 Recommending Technology Stack... ---", flush=True)
    
    if state.get("tech_stack"):
        print("   [Using cached data]", flush=True)
        return {"agents_executed": ["💻 Tech Architect"]}

    plan = state.get('project_plan', '')
    skills = state.get('skill_report', '')
    
    prompt = f"""You are a Senior Software Architect.
    Based on the project plan and the student's current skills, recommend the best 
    technologies, frameworks, and tools for them to use.
    
    Student Skills: {skills}
    Project Plan: {plan}
    CHAT HISTORY: {state.get('chat_history', 'No previous chat')}
    LATEST STUDENT REQUEST: {state.get('new_message', 'No new request')}
    
    If the student made a request, rewrite your specific section to incorporate their feedback.
    REFERENCE DOCUMENTS UPLOADED BY STUDENT: {state.get('reference_documents', 'None provided')} """
    result = safe_invoke(prompt)
    return {"tech_stack": result, "agents_executed": ["💻 Tech Architect"]}


def risk_analysis_agent(state: Agent_State):
    print("--- ⚠️ Analyzing Risks... ---", flush=True)
    
    if state.get("risk_analysis"):
        print("   [Using cached data]", flush=True)
        return {"agents_executed": ["⚠️ Risk Analyst"]}

    plan = state.get('project_plan', '')
    tech = state.get('tech_stack', '')
    
    prompt = f"""You are a strict Risk Analyst.
    Look at this project plan and tech stack. Identify the top 3 biggest risks 
    or roadblocks this student will face, and how they can mitigate them.
    
    Project Plan: {plan}
    Tech Stack: {tech}
    CHAT HISTORY: {state.get('chat_history', 'No previous chat')}
    LATEST STUDENT REQUEST: {state.get('new_message', 'No new request')}
    
    If the student made a request, rewrite your specific section to incorporate their feedback.
    REFERENCE DOCUMENTS UPLOADED BY STUDENT: {state.get('reference_documents', 'None provided')} """
    result = safe_invoke(prompt)
    return {"risk_analysis": result, "agents_executed": ["⚠️ Risk Analyst"]}


def mentor_agent(state: Agent_State):
    print("--- 🤝 Providing Mentorship Advice... ---", flush=True)
    
    if state.get("mentor_advice"):
        print("   [Using cached data]", flush=True)
        return {"agents_executed": ["🤝 Mentor Advisor"]}

    skills = state.get('skill_report', '')
    risks = state.get('risk_analysis', '')
    
    prompt = f"""You are an encouraging AI Coding Mentor.
    Look at the student's weaknesses and the project risks. 
    Give them a short, highly encouraging pep talk and 2 specific tips on what to study first.
    
    Student Skills: {skills}
    Project Risks: {risks}
    CHAT HISTORY: {state.get('chat_history', 'No previous chat')}
    LATEST STUDENT REQUEST: {state.get('new_message', 'No new request')}
    
    If the student made a request, rewrite your specific section to incorporate their feedback.
    REFERENCE DOCUMENTS UPLOADED BY STUDENT: {state.get('reference_documents', 'None provided')} """
    result = safe_invoke(prompt)
    return {"mentor_advice": result, "agents_executed": ["🤝 Mentor Advisor"]}


def documentation_agent(state: Agent_State):
    print("--- 📝 Compiling Final Documentation... ---", flush=True)
    
    if state.get("final_documentation"):
        print("   [Using cached data]", flush=True)
        return {"agents_executed": ["📝 Documentation Writer"]}

    idea = state['project_idea']
    plan = state.get('project_plan', '')
    tech = state.get('tech_stack', '')
    risks = state.get('risk_analysis', '')
    mentor = state.get('mentor_advice', '')
    
    prompt = f"""You are a Technical Writer. 
    Compile all of the following information into a single, beautiful Markdown document 
    that the student can use as their Project README. Use nice headers and bullet points.
    
    Idea: {idea}
    Plan: {plan}
    Tech Stack: {tech}
    Risks: {risks}
    Advice: {mentor}
    CHAT HISTORY: {state.get('chat_history', 'No previous chat')}
    LATEST STUDENT REQUEST: {state.get('new_message', 'No new request')}
    
    If the student made a request, rewrite your specific section to incorporate their feedback.
    REFERENCE DOCUMENTS UPLOADED BY STUDENT: {state.get('reference_documents', 'None provided')} """
    result = safe_invoke(prompt)
    return {"final_documentation": result, "agents_executed": ["📝 Documentation Writer"]}


def chat_responder_agent(state: Agent_State):
    print("--- 🗣️ Generating Conversational Reply... ---", flush=True)
    
    chat_hist = str(state.get('chat_history', 'This is the first interaction.'))[-1000:]
    
    prompt = f"""You are the AI Mentor Team Coordinator — the unified voice of a multi-agent specialist team.
    Your job is to respond to the student's message by synthesizing insights from your specialist agents.

    --- WHO YOU'RE TALKING TO ---
    Student Profile: {state.get('student_profile', 'Unknown student')}
    Their Project: {state.get('project_idea', 'No project idea provided')}

    --- CONVERSATION SO FAR ---
    {chat_hist}

    --- WHAT THE STUDENT JUST ASKED ---
    {state.get('new_message', 'No new message')}

    --- KNOWLEDGE BASE SUMMARIES (from specialist agents) ---
    Skill Report: {str(state.get('skill_report', 'Not yet generated'))[:500]}
    Project Evaluation: {str(state.get('project_evaluation', 'Not yet generated'))[:500]}
    Project Plan: {str(state.get('project_plan', 'Not yet generated'))[:500]}
    Tech Stack: {str(state.get('tech_stack', 'Not yet generated'))[:500]}
    Risk Analysis: {str(state.get('risk_analysis', 'Not yet generated'))[:500]}
    Mentor Advice: {str(state.get('mentor_advice', 'Not yet generated'))[:500]}

    --- YOUR INSTRUCTIONS ---
    1. If specialist agents just ran, explicitly reference their work. 
    2. If no agents ran, answer the question directly using the existing Knowledge Base above.
    3. Address the student personally using their profile context.
    4. Keep the tone friendly, professional, and encouraging.
    
    CRITICAL INSTRUCTION: You MUST return your response as a valid JSON object with EXACTLY this structure:
    {{
        "reply": "Your conversational text response here. Use markdown for lists or bold text.",
        "action": "none" 
    }}
    Do not wrap the JSON in markdown code blocks. Just output raw JSON.
    """
    
    result = safe_invoke(prompt).strip()
    
    # Robust extraction of JSON content from markdown wrappers or extra padding
    json_text = result
    if json_text.startswith("```"):
        first_newline = json_text.find("\n")
        if first_newline != -1:
            json_text = json_text[first_newline:].strip()
        if json_text.endswith("```"):
            json_text = json_text[:-3].strip()
            
    reply_text = result
    try:
        parsed = json.loads(json_text, strict=False)
        reply_text = parsed.get("reply", result)
    except Exception:
        # Fallback to search braces
        first_brace = json_text.find("{")
        last_brace = json_text.rfind("}")
        if first_brace != -1 and last_brace != -1 and last_brace > first_brace:
            try:
                parsed = json.loads(json_text[first_brace:last_brace+1], strict=False)
                reply_text = parsed.get("reply", result)
            except Exception:
                pass
                
    return {"chat_reply": reply_text}




init_builder = StateGraph(Agent_State)

init_builder.add_node("student_assesment", student_assesment_agent)
init_builder.add_node("project_evaluation", project_evaluation_agent)
init_builder.add_node("project_planing", project_planing_agent)
init_builder.add_node("tech_recommendation", tech_recommendation_agent)
init_builder.add_node("risk_analysis", risk_analysis_agent)
init_builder.add_node("mentor", mentor_agent)
init_builder.add_node("documentation", documentation_agent)
init_builder.add_node("chat_responder", chat_responder_agent)


init_builder.add_edge(START, "student_assesment")
init_builder.add_edge("student_assesment", "project_evaluation")
init_builder.add_edge("project_evaluation", "project_planing")
init_builder.add_edge("project_planing", "tech_recommendation")
init_builder.add_edge("tech_recommendation", "risk_analysis")
init_builder.add_edge("risk_analysis", "mentor")
init_builder.add_edge("mentor", "documentation")
init_builder.add_edge("documentation", END)



initialization_app = init_builder.compile()


chat_builder = StateGraph(Agent_State)

chat_builder.add_node("chat_responder", chat_responder_agent)
chat_builder.add_edge(START, "chat_responder")
chat_builder.add_edge("chat_responder", END)

chat_app = chat_builder.compile()
