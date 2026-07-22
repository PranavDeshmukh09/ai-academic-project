
import os
import time
from dotenv import load_dotenv
from typing import TypedDict, Annotated
import operator 
from langgraph.graph import StateGraph, START, END
from langchain_core.messages import HumanMessage
from langchain_google_genai import ChatGoogleGenerativeAI
import sys


sys.stdout.reconfigure(encoding='utf-8')


load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY environment variable is not set. Please check your .env file.")

# Initialize the Google Gemini model
llm = ChatGoogleGenerativeAI(
    model="gemini-flash-latest", 
    temperature=0.7,
    api_key=api_key
)

# Helper: retry on rate limit errors with exponential backoff
def safe_invoke(prompt, max_retries=5):
    for attempt in range(max_retries):
        try:
            response = llm.invoke([HumanMessage(content=prompt)])
            time.sleep(4)
            content = response.content
            if isinstance(content, list):
                content = "\n".join(
                    block.get("text", str(block)) if isinstance(block, dict) else str(block)
                    for block in content
                )
            return content
        except Exception as e:
            if "429" in str(e) or "rate" in str(e).lower():
                wait_time = 20 * (attempt + 1)
                print(f"   ⏳ Rate limited. Waiting {wait_time}s before retry ({attempt+1}/{max_retries})...")
                time.sleep(wait_time)
            else:
                raise e
    raise Exception("Max retries exceeded due to rate limiting.")

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


def student_assesment_agent(state:Agent_State):

    print("assesing student profile")

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

    print("evaluating project idea")

    idea = state['project_idea']
    skills = state['skill_report']

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
    print("project planing")

    evaluation = state['project_evaluation']

    prompt = f"""You are an expert Agile Project Manager.
    Take the following project evaluation and create a structured plan.
    Define the scope, break the project into 3-5 milestones, and estimate a timeline.
    
    Project Evaluation: {evaluation}
    CHAT HISTORY: {state.get('chat_history', 'No previous chat')}
    LATEST STUDENT REQUEST: {state.get('new_message', 'No new request')}
    
    If the student made a request, rewrite your specific section to incorporate their feedback.
    REFERENCE DOCUMENTS UPLOADED BY STUDENT: {state.get('reference_documents', 'None provided')}"""

    result = safe_invoke(prompt)
    return {"project_plan": result, "agents_executed": ["📅 Project Planner"]}


def tech_recommendation_agent(state: Agent_State):
    print("--- 💻 Recommending Technology Stack... ---")
    plan = state['project_plan']
    skills = state['skill_report']
    
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
    print("--- ⚠️ Analyzing Risks... ---")
    plan = state['project_plan']
    tech = state['tech_stack']
    
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
    print("--- 🤝 Providing Mentorship Advice... ---")
    skills = state['skill_report']
    risks = state['risk_analysis']
    
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
    print("--- 📝 Compiling Final Documentation... ---")
    # This agent looks at EVERYTHING to create the final README
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
    CHAT HISTORY: {state.get('chat_history', 'No previous chat')}
    LATEST STUDENT REQUEST: {state.get('new_message', 'No new request')}
    
    If the student made a request, rewrite your specific section to incorporate their feedback.
    REFERENCE DOCUMENTS UPLOADED BY STUDENT: {state.get('reference_documents', 'None provided')} """
    result = safe_invoke(prompt)
    return {"final_documentation": result, "agents_executed": ["📝 Documentation Writer"]}


def chat_responder_agent(state: Agent_State):
    print("--- 🗣️ Generating Conversational Reply... ---")
    
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
    
    # We use safe_invoke, but we might want to clean up markdown backticks if Gemini adds them
    result = safe_invoke(prompt).strip()
    if result.startswith("```json"):
        result = result[7:-3].strip()
    elif result.startswith("```"):
        result = result[3:-3].strip()
    return {"chat_reply": result}



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
