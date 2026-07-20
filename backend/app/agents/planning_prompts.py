import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def generate_project_plan(title: str, description: str, domain: str):
    prompt = f"""
You are a project mentor helping a student plan their academic project.

Project Title: {title}
Domain: {domain}
Description: {description}

Break this project into a 4-week execution plan.

Format your response EXACTLY like this, with each week clearly separated by a blank line:

Week 1: [short milestone title]
- [task 1]
- [task 2]

Week 2: [short milestone title]
- [task 1]
- [task 2]

Week 3: [short milestone title]
- [task 1]
- [task 2]

Week 4: [short milestone title]
- [task 1]
- [task 2]

Keep it realistic for a student project. Do not add any extra text before or after the plan.
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
    )

    return response.choices[0].message.content


if __name__ == "__main__":
    result = generate_project_plan(
        title="AI-Based Attendance System",
        description="A facial recognition system that automatically marks student attendance in classrooms.",
        domain="Computer Vision"
    )
    print(result)