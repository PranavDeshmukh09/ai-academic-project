import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_pipeline():
    print("🚀 Starting End-to-End Pipeline Test...\n")
    
    # 1. Onboarding
    print("1️⃣ Testing /onboard endpoint...")
    student_payload = {
        "name": "Test Student",
        "email": "test@student.edu",
        "department": "Computer Science",
        "year": "Senior",
        "skills": ["Python", "HTML"],
        "experience_level": "Beginner",
        "project_idea": "An AI app for students",
        "domain": "Education"
    }
    res = requests.post(f"{BASE_URL}/onboard", json=student_payload)
    print(f"Status: {res.status_code}")
    if res.status_code != 200:
        print("Failed to onboard.")
        return
    
    project_id = res.json().get("project_id")
    print(f"Success! Project ID: {project_id}\n")
    
    # 2. Initialization
    print("2️⃣ Testing /initialize endpoint (Warning: This may take a few minutes and consume tokens)...")
    res = requests.post(f"{BASE_URL}/initialize", json={"project_id": project_id})
    print(f"Status: {res.status_code}")
    print("Initialization Complete.\n")
    
    # 3. Progress Update
    print("3️⃣ Testing /progress_update endpoint...")
    update_payload = {
        "project_id": project_id,
        "update_text": "I set up the backend server but I am stuck on the database connection."
    }
    res = requests.post(f"{BASE_URL}/progress_update", json=update_payload)
    print(f"Status: {res.status_code}")
    print("Progress Update Complete.\n")
    
    # 4. Weekly Check-in
    print("4️⃣ Testing /check_in endpoint...")
    res = requests.post(f"{BASE_URL}/check_in", json={"project_id": project_id})
    print(f"Status: {res.status_code}")
    print("Check-in Complete.\n")
    
    # 5. Faculty Dashboard
    print("5️⃣ Testing /faculty/dashboard endpoint...")
    res = requests.get(f"{BASE_URL}/faculty/dashboard")
    print(f"Status: {res.status_code}")
    dashboard_data = res.json()
    print(f"Found {dashboard_data.get('total_projects')} projects in dashboard.\n")
    
    # 6. Faculty Dashboard Export
    print("6️⃣ Testing /faculty/dashboard/export endpoint...")
    res = requests.get(f"{BASE_URL}/faculty/dashboard/export")
    print(f"Status: {res.status_code}")
    if res.status_code == 200:
        print("CSV Export Successful (Output hidden for brevity).")
    
    print("\n✅ End-to-End Test Completed!")

if __name__ == "__main__":
    test_pipeline()
