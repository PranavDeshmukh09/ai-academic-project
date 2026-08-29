# AI Academic Mentor - Frontend Portal

A modern, responsive, split-screen web application built with **React 18**, **Vite**, and **Tailwind CSS** providing an intuitive user experience for students and faculty mentors.

---

## 🎨 UI/UX Features

1. **Split-Screen Onboarding:** 25% sticky branding panel alongside a 75% scrollable data ingestion form.
2. **Interactive Skill Assessment:** Customized quiz assessment interface that maps student capabilities and dynamically computes readiness scores.
3. **Dynamic Theming:** Seamless Dark Mode (Slate) and Light Mode (Crisp Off-White) switching with CSS variables.
4. **Mermaid.js Diagram Rendering:** Dynamic rendering of AI-generated architecture diagrams and Gantt charts.
5. **RAG-Powered Chat Workspace:** Real-time conversational interface with file uploads and citations.
6. **Faculty Monitoring Dashboard:** Grid-based supervisor view with real-time project health badges (Green/Amber/Red) and summary modals.

---

## 🏗️ Project Structure

```
frontend/
├── public/                # Static assets and icons
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   ├── MentorChat.jsx
│   │   └── ...
│   ├── pages/             # Route views
│   │   ├── AuthGateway.jsx
│   │   ├── DashboardView.jsx
│   │   ├── SkillAssessment.jsx
│   │   ├── ProjectSubmission.jsx
│   │   ├── MentorChatView.jsx
│   │   ├── ReportsView.jsx
│   │   ├── FacultyDashboardView.jsx
│   │   ├── FacultyProjectsView.jsx
│   │   └── ...
│   ├── App.jsx            # Main app router & layout
│   ├── main.jsx           # React DOM entry point
│   └── index.css          # Tailwind CSS directives & theme rules
├── package.json           # Scripts and dependencies
├── tailwind.config.js     # Tailwind styling configuration
└── vite.config.js         # Vite bundler configuration
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Runs the Vite development server on `http://localhost:5173`.

### 3. Build for Production
```bash
npm run build
```
Creates an optimized static bundle in the `dist/` directory.

### 4. Preview Production Build
```bash
npm run preview
```

---

## 🔌 API Integration
The frontend connects to the FastAPI backend at `http://localhost:8000`. Ensure the backend server is running before launching full-pipeline initializations.
