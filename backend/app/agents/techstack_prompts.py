import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def recommend_tech_stack(title: str, description: str, domain: str):
    prompt = f"""
You are a technical mentor helping a student choose the right technology stack for their academic project.

Project Title: {title}
Domain: {domain}
Description: {description}

Format your response EXACTLY like this, with each section clearly separated by a blank line:

Programming Language(s):
- [language] — [why it fits, 1 sentence]

Framework(s)/Library(s):
- [framework] — [why it fits, 1 sentence]

Database:
- [database] — [why it fits, 1 sentence]

Additional Tools:
- [tool/API/service] — [why it fits, 1 sentence]

Keep recommendations practical and beginner-to-intermediate friendly, considering this is a student project with limited time and resources. Do not add any extra text before or after this format.
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
    result = recommend_tech_stack(
        title="AI-Based Attendance System",
        description="A facial recognition system that automatically marks student attendance in classrooms.",
        domain="Computer Vision"
    )
    print(result)