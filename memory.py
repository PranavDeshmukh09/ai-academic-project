import os 
from supabase import create_client, Client 
from dotenv import load_dotenv 
import sys

sys.stdout.reconfigure(encoding='utf-8')


load_dotenv()

supabase: Client = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))


def load_memory(project_id: int):
    print(f"--- 📥 Loading full context from DB for project {project_id} ---")
    
    # 1. Fetch Student Profile
    idea_res = supabase.table("project_idea").select("*").eq("project_id", project_id).execute()
    idea_data = idea_res.data[0] if idea_res.data else {}
    student_id = idea_data.get("student_id")
    
    # 2. Fetch Skill Assessment
    student_data = {}
    skill_data = {}

    if student_id is not None:
        student_res = supabase.table("student").select("*").eq("student_id", student_id).execute()
        student_data = student_res.data[0] if student_res.data else {}
        
        skill_res = supabase.table("skill_assessment").select("*").eq("student_id", student_id).execute()
        skill_data = skill_res.data[0] if skill_res.data else {}

    # 4. Fetch Previous AI Memory (Agent Output)
    memory_res = supabase.table("agent_output").select("*").eq("project_id", project_id).execute()
    memory_data = memory_res.data[0] if memory_res.data else {}

    # 4.5 Fetch Chat Messages
    chat_res = supabase.table("chat_messages").select("*").eq("project_id", project_id).order("created_at").execute()
    chat_history_str = ""
    if chat_res.data:
        for msg in chat_res.data:
            prefix = "User" if msg["role"] == "user" else "AI"
            chat_history_str += f"\n{prefix}: {msg['content']}"

    # 5. Format DB rows into text for the LLM
    profile_text = f"Name: {student_data.get('name', 'Unknown')}, Department: {student_data.get('department', 'Unknown')}, Year: {student_data.get('year', 'Unknown')}"
    skills_list = skill_data.get('skills', []) or []
    skills_text = f"Skills: {', '.join(str(s) for s in skills_list)}. Experience Level: {skill_data.get('experience_level', 'Unknown')}."
    idea_text = f"Title: {idea_data.get('title', 'None')}. Description: {idea_data.get('description', 'None')}. Domain: {idea_data.get('domain', 'None')}"

    # 6. Return everything merged together
    state_updates = {
        "student_profile": profile_text,
        "skill_questionnaire": skills_text,
        "project_idea": idea_text,
    }
    
    # Only pull the fields LangGraph expects (ignore created_at, output_id, etc.)
    if memory_data:
        expected_keys = [
            "skill_report", "project_evaluation", "project_plan", 
            "tech_stack", "risk_analysis", "mentor_advice", "final_documentation"
        ]
        for key in expected_keys:
            if memory_data.get(key):
                state_updates[key] = memory_data[key]
                
    if chat_history_str:
        state_updates["chat_history"] = chat_history_str
                
    return state_updates


def save_memory(project_id: int, result: dict):
    new_message = result.get("new_message", "")
    chat_reply = result.get("chat_reply", "")

    # Save messages to chat_messages table
    if new_message:
        supabase.table("chat_messages").insert({
            "project_id": project_id,
            "role": "user",
            "content": new_message
        }).execute()
    
    if chat_reply:
        supabase.table("chat_messages").insert({
            "project_id": project_id,
            "role": "ai",
            "content": chat_reply
        }).execute()

    def _clean(val):
        """Ensure we always store a plain string, never a list/dict."""
        if isinstance(val, list):
            return "\n".join(str(v) for v in val)
        return str(val) if val else ""

    record = {
        "project_id": project_id,
        "skill_report": _clean(result.get("skill_report", "")),
        "project_evaluation": _clean(result.get("project_evaluation", "")),
        "project_plan": _clean(result.get("project_plan", "")),
        "tech_stack": _clean(result.get("tech_stack", "")),
        "risk_analysis": _clean(result.get("risk_analysis", "")),
        "mentor_advice": _clean(result.get("mentor_advice", "")),
        "final_documentation": _clean(result.get("final_documentation", ""))
    }

    existing = supabase.table("agent_output").select("output_id").eq("project_id", project_id).execute()
    if existing.data:
        supabase.table("agent_output").update(record).eq("project_id", project_id).execute()
    else:
        supabase.table("agent_output").insert(record).execute()
    print(f"   💾 Memory saved for project {project_id}")
