import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def define_scope(title: str, description: str, domain: str):
    prompt = f"""
You are a project mentor helping a student clearly define the scope of their academic project.

Project Title: {title}
Domain: {domain}
Description: {description}

Format your response EXACTLY like this, with each section clearly separated by a blank line:

Core Features (Must-Have):
- [feature 1]
- [feature 2]
- [feature 3]

Optional/Stretch Features (Nice-to-Have):
- [feature 1]
- [feature 2]

Out of Scope (Explicitly Excluded):
- [item 1]
- [item 2]

Keep this realistic for a student-level project with limited time. Do not add any extra text before or after this format.
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
    result = define_scope(
        title="AI-Based Attendance System",
        description="A facial recognition system that automatically marks student attendance in classrooms.",
        domain="Computer Vision"
    )
    print(result)