from fastapi import FastAPI
from .database import Base, engine
from .routers import auth

# Creates all tables in the database if they don't already exist
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Academic Project - Backend")

app.include_router(auth.router)


@app.get("/")
def root():
    return {"message": "Backend is running!"}