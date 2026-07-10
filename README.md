# AI Academic Project (Milestone 1)

This project represents the completion of **Milestone 1**, providing a full-stack, production-ready Student Onboarding sequence. It features a bespoke, premium Split-Screen UI built with React and TailwindCSS, and a robust FastAPI backend connected directly to a Supabase PostgreSQL database.

## System Architecture
The application is entirely decoupled:
- **Frontend**: A modern, high-fidelity React application running on Vite. It utilizes a custom "Premium Academic" design system, avoiding generic UI templates to provide an authentic, human-made feel.
- **Backend**: A Python-based FastAPI gateway that receives onboarding payloads and safely commits them into the database using upsert operations.
- **Database**: Supabase handles the persistent storage across three normalized tables (`student`, `skill_assessment`, and `project_idea`).

## Prerequisites
Before running this project, ensure you have the following installed on your machine:
- [Node.js (v18+)](https://nodejs.org/)
- [Python (3.10+)](https://www.python.org/)
- A `.env` file in the root directory containing your Supabase credentials:
  ```env
  SUPABASE_URL="your-supabase-url"
  SUPABASE_KEY="your-supabase-anon-key"
  ```

---

## Getting Started: Step-by-Step Guide

Follow these instructions strictly to create your isolated environment and run both the frontend and backend servers.

### 1. Backend Setup (Terminal 1)
Open a terminal in the root of the project to initialize the Python backend.

**Create a Virtual Environment:**
```bash
python -m venv venv
```

**Activate the Virtual Environment:**
*(For Windows PowerShell)*
```bash
.\venv\Scripts\Activate.ps1
```
*(For Mac/Linux)*
```bash
source venv/bin/activate
```

**Install Backend Dependencies:**
```bash
pip install -r requirements.txt
```

**Start the FastAPI Server:**
```bash
uvicorn api:app --reload
```
*The backend is now live on `http://127.0.0.1:8000`.*

---

### 2. Frontend Setup (Terminal 2)
Open a **second, separate terminal** in the root of the project to start the frontend interface.

**Navigate to the frontend folder:**
```bash
cd frontend
```

**Install Frontend Dependencies:**
```bash
npm install
```

**Start the Vite Development Server:**
```bash
npm run dev
```
*The frontend is now live (typically on `http://localhost:5173`). Check your terminal output for the exact local link and click it to open the application in your browser.*

---

## Verification
Once both servers are running:
1. Fill out the "Student Initialization" form on the frontend.
2. Click **Commit Official Record**.
3. The system will push the data to Supabase, and exactly one second later, it will automatically query the database and render a beautiful, verified transcript widget to prove the round-trip pipeline is functioning perfectly.
