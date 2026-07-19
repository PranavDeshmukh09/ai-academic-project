import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def analyze_feasibility(title: str, description: str, domain: str):
    prompt = f"""
You are a project mentor evaluating whether a student's academic project is feasible.

Project Title: {title}
Domain: {domain}
Description: {description}

Format your response EXACTLY like this, with each section clearly separated by a blank line:

Technical Feasibility:
[2-3 sentences on whether it's realistically buildable]

Difficulty Level: [Beginner / Intermediate / Advanced]

Potential Challenges:
- [challenge 1]
- [challenge 2]

Feasibility Verdict: [Feasible / Feasible with modifications / Not recommended]

Suggested Simplification (if needed):
[1-2 sentences, or write "Not needed" if the project is already appropriately scoped]

Do not add any extra text before or after this format.
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
    result = analyze_feasibility(
        title="AI-Based Attendance System",
        description="A facial recognition system that automatically marks student attendance in classrooms.",
        domain="Computer Vision"
    )
    print(result)