from fastapi import FastAPI
from .routers import auth, projects

app = FastAPI(title="AI Academic Project - Backend Routers")

app.include_router(auth.router)
app.include_router(projects.router)


@app.get("/")
def root():
    return {"message": "AI Academic Project Backend Routers Active"}