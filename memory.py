import os 
from supabase import create_client, Client 
from dotenv import load_dotenv 
import sys

sys.stdout.reconfigure(encoding='utf-8')


load_dotenv()

supabase: Client = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))


def _clean_text(val):
    if not val:
        return ""
    if isinstance(val, list):
        val = "\n".join(
            v.get("text", str(v)) if isinstance(v, dict) else str(v)
            for v in val
        )
    text = str(val).strip()
    
    if text.startswith("```json"):
        text = text[7:]
        if text.endswith("```"):
            text = text[:-3]
        text = text.strip()
    elif text.startswith("```markdown"):
        text = text[11:]
        if text.endswith("```"):
            text = text[:-3]
        text = text.strip()
        
    if text.startswith("{") and text.endswith("}"):
        try:
            import json
            parsed = json.loads(text, strict=False)
            if isinstance(parsed, dict):
                text = parsed.get("reply") or parsed.get("chat_reply") or parsed.get("content") or parsed.get("message_text") or text
        except Exception:
            import re
            m = re.search(r'"reply"\s*:\s*"(.*)"', text, re.DOTALL)
            if m:
                text = m.group(1)

    if "\\n" in text:
        text = text.replace("\\n", "\n")
    if "\\\"" in text:
        text = text.replace("\\\"", '"')
    if "\\t" in text:
        text = text.replace("\\t", "\t")
        
    return text.strip()


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
        
        skill_res = supabase.table("skill_assessment").select("*").eq("student_id", student_id).order("assessment_id", desc=True).execute()
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
            clean_content = _clean_text(msg['content'])
            chat_history_str += f"\n{prefix}: {clean_content}"

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
                state_updates[key] = _clean_text(memory_data[key])
                
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
            "content": _clean_text(new_message)
        }).execute()
    
    if chat_reply:
        cleaned_reply = _clean_text(chat_reply)
        supabase.table("chat_messages").insert({
            "project_id": project_id,
            "role": "ai",
            "content": cleaned_reply
        }).execute()

    record = {
        "project_id": project_id,
        "skill_report": _clean_text(result.get("skill_report", "")),
        "project_evaluation": _clean_text(result.get("project_evaluation", "")),
        "project_plan": _clean_text(result.get("project_plan", "")),
        "tech_stack": _clean_text(result.get("tech_stack", "")),
        "risk_analysis": _clean_text(result.get("risk_analysis", "")),
        "mentor_advice": _clean_text(result.get("mentor_advice", "")),
        "final_documentation": _clean_text(result.get("final_documentation", ""))
    }

    existing = supabase.table("agent_output").select("output_id").eq("project_id", project_id).execute()
    if existing.data:
        supabase.table("agent_output").update(record).eq("project_id", project_id).execute()
    else:
        supabase.table("agent_output").insert(record).execute()
    print(f"   💾 Memory saved for project {project_id}")
