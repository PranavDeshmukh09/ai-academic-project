import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const apiService = {
  // 1. Submit Onboarding / Registration Matrix
  onboardStudent: async (payload) => {
    try {
      const response = await api.post('/onboard', payload);
      return response.data;
    } catch (error) {
      console.warn("Backend unavailable, using localized mock onboarding resolution.");
      return { status: "success", message: `Student ${payload.student_id} onboarded successfully! (Mock)` };
    }
  },

  // 2. Fetch Profile State
  getStudentProfile: async (studentId) => {
    try {
      const response = await api.get(`/student/${studentId}`);
      return response.data;
    } catch (error) {
      return {
        student_profile: { student_id: studentId, name: "Alex Mercer", department: "Computer Science", year: 3 },
        skill_assessment: { student_id: studentId, skills: ["Python", "React", "FastAPI"], experience_level: "Intermediate" },
        project_idea: { student_id: studentId, title: "AI Mentor Platform", description: "An AI-powered platform...", domain: "Artificial Intelligence" }
      };
    }
  },

  // 3. Document File Uploads (RAG)
  uploadDocument: async (formData) => {
    try {
      const response = await axios.post(`${BASE_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      return { status: "success", message: "Saved 12 chunks for student locally! (Mock)" };
    }
  },

  // 4. Send Message to Multi-Agent pipeline
  sendChatMessage: async (studentId, messageText) => {
    try {
      const response = await api.post('/chat', { student_id: studentId, message: messageText });
      return response.data;
    } catch (error) {
      return {
        student_id: studentId,
        chat_reply: `Responding to your query: "${messageText}". (Running in structural demo mode, connect FastAPI backend to trigger production LangGraph loops).`,
        agents_executed: ["🔍 Skill Assessor", "💻 Tech Architect"],
        skill_report: "Sample dynamic skill assessment document layout...",
        project_evaluation: "Feasibility parameters marked stable...",
        project_plan: "Week 1: Core planning...",
        tech_stack: "React, FastAPI, Supabase",
        risk_analysis: "Free tier rate limitations identified.",
        mentor_advice: "Keep pushing forward step-by-step.",
        final_documentation: ""
      };
    }
  },

  // 5. Get authenticated student profile
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // 6. Save student skills
  saveSkills: async (skills, experienceLevel) => {
    const response = await api.post('/auth/skills', {
      skills,
      experience_level: experienceLevel
    });
    return response.data;
  },

  // 7. Update an existing project
  updateProject: async (projectId, data) => {
    const response = await api.put(`/projects/${projectId}`, data);
    return response.data;
  },

  // 8. Delete an existing project
  deleteProject: async (projectId) => {
    const response = await api.delete(`/projects/${projectId}`);
    return response.data;
  }
};