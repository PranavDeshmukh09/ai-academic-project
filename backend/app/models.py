from sqlalchemy import Column, Integer, String, JSON, Text, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class Student(Base):
    __tablename__ = "student"

    student_id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    department = Column(String)
    year = Column(Integer)
    mentor_name = Column(String)




class ProjectIdea(Base):
    __tablename__ = "project_idea"

    project_id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student.student_id"))
    title = Column(String)
    description = Column(Text)
    domain = Column(String)
    status = Column(String)