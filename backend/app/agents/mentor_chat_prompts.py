import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def get_mentor_reply(student_message: str, conversation_history: list = None):
    """
    student_message: the new message from the student
    conversation_history: list of past messages, each like {"role": "user"/"assistant", "content": "..."}
    """
    system_prompt = """
You are a friendly, knowledgeable academic project mentor. You help students with their
academic projects — answering questions about project ideas, technology choices, planning,
and general guidance. Keep your responses helpful, encouraging, and concise (2-4 sentences
unless the student asks for more detail).
"""

    messages = [{"role": "system", "content": system_prompt}]

    if conversation_history:
        messages.extend(conversation_history)

    messages.append({"role": "user", "content": student_message})

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        temperature=0.7,
    )

    return response.choices[0].message.content


if __name__ == "__main__":
    reply = get_mentor_reply("How do I choose a good project topic?")
    print(reply)