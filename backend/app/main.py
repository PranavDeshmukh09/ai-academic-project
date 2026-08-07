from fastapi import FastAPI
from .routers import auth, projects
from .routers.planning_agent import router as planning_router
from .routers.feasibility_agent import router as feasibility_router
from .routers.techstack_agent import router as techstack_router
from .routers.scope_agent import router as scope_router
from .routers.mentor_chat_agent import router as mentor_chat_router
from .routers.progress_agent import router as progress_router

app = FastAPI(title="AI Academic Project - Backend")

app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(planning_router)
app.include_router(feasibility_router)
app.include_router(techstack_router)
app.include_router(scope_router)
app.include_router(mentor_chat_router)
app.include_router(progress_router)


@app.get("/")
def root():
    return {"message": "Backend is running!"}