from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# TEMPORARY: using SQLite for local practice/testing
# Once teammate shares Supabase URL, replace the line below with:
# DATABASE_URL = "postgresql://username:password@host:port/dbname"
DATABASE_URL = "postgresql://postgres:ai_project_mentor%4004@db.zzqhyjxssskechisewhf.supabase.co:5432/postgres"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()