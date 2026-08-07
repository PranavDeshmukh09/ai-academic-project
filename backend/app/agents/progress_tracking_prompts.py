import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def analyze_progress(project_title: str, current_plan: str, student_update: str):
    """
    project_title: the project's title
    current_plan: the existing week-by-week plan (from the Planning Agent)
    student_update: what the student says they've done/are stuck on
    """
    prompt = f"""
You are a project mentor reviewing a student's progress update.

Project Title: {project_title}

Current Plan:
{current_plan}

Student's Progress Update:
{student_update}

Based on the student's update, provide:

Progress Status: [On Track / Slightly Behind / Significantly Behind / Ahead of Schedule]

Completed So Far:
- [what they've accomplished, based on their update]

Suggested Plan Adjustment:
[1-2 sentences on whether the plan needs to change, and how]

Next Steps:
- [1-2 concrete next actions]

Do not add any extra text before or after this format.
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
    )

    return response.choices[0].message.content


if __name__ == "__main__":
    result = analyze_progress(
        project_title="Smart Attendance System",
        current_plan="Week 1: Research and planning. Week 2: Data collection. Week 3: Model development. Week 4: Integration and testing.",
        student_update="I finished the research and collected about half the dataset I need, but I'm stuck on how to preprocess the face images."
    )
    print(result)