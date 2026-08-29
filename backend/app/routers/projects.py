# backend/app/routers/projects.py
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from supabase import Client
from typing import List

from ..database import get_supabase
from ..schemas import ProjectIdeaCreate
from ..auth_utils import get_current_student_id

router = APIRouter(prefix="/projects", tags=["Projects"])

def _run_async_initialization(project_id: int):
    try:
        from memory import load_memory, save_memory
        from multi_agent_ai import initialization_app
        initial_state = load_memory(project_id)
        initial_state["agents_executed"] = []
        res = initialization_app.invoke(initial_state)
        save_memory(project_id, res)
    except Exception as e:
        print(f"⚠️ Background initialization error for project {project_id}: {e}")

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_project(
    project_data: ProjectIdeaCreate, 
    background_tasks: BackgroundTasks,
    supabase: Client = Depends(get_supabase),
    current_student_id: int = Depends(get_current_student_id) # Extract ID from JWT
):
    """
    Creates a new project idea and launches background AI evaluation pipeline.
    """
    if not project_data.title.strip():
        raise HTTPException(status_code=400, detail="Project title cannot be empty")
    if len(project_data.title.strip()) < 3:
        raise HTTPException(status_code=400, detail="Project title must be at least 3 characters")
    if not project_data.description.strip():
        raise HTTPException(status_code=400, detail="Project description cannot be empty")
    if len(project_data.description.strip()) < 10:
        raise HTTPException(status_code=400, detail="Project description must be at least 10 characters")
    if not project_data.domain.strip():
        raise HTTPException(status_code=400, detail="Project domain cannot be empty")

    new_project_data = {
        "student_id": current_student_id,  # Injected securely from the token
        "title": project_data.title,
        "description": project_data.description,
        "domain": project_data.domain,
        "status": "Pending"  # Default initial status
    }
    
    res = supabase.table("project_idea").insert(new_project_data).execute()
    if not res.data:
        raise HTTPException(status_code=500, detail="Failed to initialize project idea")
        
    proj_id = res.data[0]["project_id"]
    return {
        "status": "success",
        "message": "Project idea initialized successfully!",
        "project_id": proj_id
    }


@router.get("/", response_model=List[dict])
def get_student_projects(
    supabase: Client = Depends(get_supabase),
    current_student_id: int = Depends(get_current_student_id)
):
    """
    Retrieves all projects belonging strictly to the currently logged-in student,
    or all projects if logged in as faculty.
    """
    if current_student_id == 999999:
        res = supabase.table("project_idea").select("*").execute()
    else:
        res = supabase.table("project_idea").select("*").eq("student_id", current_student_id).execute()
    
    return [
        {
            "project_id": p["project_id"],
            "title": p["title"],
            "description": p["description"],
            "domain": p["domain"],
            "status": p["status"]
        }
        for p in res.data
    ]


@router.put("/{project_id}")
def update_project(
    project_id: int,
    project_data: ProjectIdeaCreate,
    supabase: Client = Depends(get_supabase),
    current_student_id: int = Depends(get_current_student_id)
):
    """
    Updates an existing project idea belonging to the authenticated student.
    """
    # Verify ownership
    existing = supabase.table("project_idea").select("student_id").eq("project_id", project_id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Project not found")
    if existing.data[0]["student_id"] != current_student_id:
        raise HTTPException(status_code=403, detail="You do not own this project")

    # Validate input
    if not project_data.title.strip():
        raise HTTPException(status_code=400, detail="Project title cannot be empty")
    if len(project_data.title.strip()) < 3:
        raise HTTPException(status_code=400, detail="Project title must be at least 3 characters")
    if not project_data.description.strip():
        raise HTTPException(status_code=400, detail="Project description cannot be empty")
    if len(project_data.description.strip()) < 10:
        raise HTTPException(status_code=400, detail="Project description must be at least 10 characters")
    if not project_data.domain.strip():
        raise HTTPException(status_code=400, detail="Project domain cannot be empty")

    update_data = {
        "title": project_data.title.strip(),
        "description": project_data.description.strip(),
        "domain": project_data.domain.strip()
    }
    
    res = supabase.table("project_idea").update(update_data).eq("project_id", project_id).execute()
    if not res.data:
        raise HTTPException(status_code=500, detail="Failed to update project")
        
    return {"status": "success", "message": "Project updated successfully"}


@router.delete("/{project_id}")
def delete_project(
    project_id: int,
    supabase: Client = Depends(get_supabase),
    current_student_id: int = Depends(get_current_student_id)
):
    """
    Deletes an existing project idea belonging to the authenticated student.
    """
    # Verify ownership
    existing = supabase.table("project_idea").select("student_id").eq("project_id", project_id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Project not found")
    if existing.data[0]["student_id"] != current_student_id:
        raise HTTPException(status_code=403, detail="You do not own this project")

    # Delete project
    res = supabase.table("project_idea").delete().eq("project_id", project_id).execute()
    return {"status": "success", "message": "Project deleted successfully"}