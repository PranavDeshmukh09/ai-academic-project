import os 
from supabase import create_client, Client 
from dotenv import load_dotenv 

load_dotenv()

supabase: Client = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))


def load_memory(student_id: int):
    print(f"--- 📥 Loading full context from DB for student {student_id} ---")
    
    # 1. Fetch Student Profile
    student_res = supabase.table("student").select("*").eq("student_id", student_id).execute()
    student_data = student_res.data[0] if student_res.data else {}
    
    # 2. Fetch Skill Assessment
    skill_res = supabase.table("skill_assessment").select("*").eq("student_id", student_id).execute()
    skill_data = skill_res.data[0] if skill_res.data else {}

    # 3. Fetch Project Idea
    idea_res = supabase.table("project_idea").select("*").eq("student_id", student_id).execute()
    idea_data = idea_res.data[0] if idea_res.data else {}

    # 4. Fetch Previous AI Memory (Chat History)
    memory_res = supabase.table("agent_output").select("*").eq("student_id", student_id).execute()
    memory_data = memory_res.data[0] if memory_res.data else {}

    # 5. Format DB rows into text for the LLM
    profile_text = f"Name: {student_data.get('name', 'Unknown')}, Department: {student_data.get('department', 'Unknown')}, Year: {student_data.get('year', 'Unknown')}"
    skills_list = skill_data.get('skills', [])
    skills_text = f"Skills: {', '.join(skills_list)}. Experience Level: {skill_data.get('experience_level', 'Unknown')}."
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
                
    return state_updates


def save_memory(student_id: int, result: dict):
    record = {
        "student_id": student_id,
        "skill_report": result.get("skill_report", ""),
        "project_evaluation": result.get("project_evaluation", ""),
        "project_plan": result.get("project_plan", ""),
        "tech_stack": result.get("tech_stack", ""),
        "risk_analysis": result.get("risk_analysis", ""),
        "mentor_advice": result.get("mentor_advice", ""),
        "final_documentation": result.get("final_documentation", ""),
    }

    supabase.table("agent_output").upsert(record, on_conflict="student_id").execute()
    print(f"   💾 Memory saved for student {student_id}")
