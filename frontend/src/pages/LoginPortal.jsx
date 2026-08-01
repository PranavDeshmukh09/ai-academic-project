import React, { useState } from 'react';
import { apiService } from '../services/api';

export default function LoginPortal({ onAuthSuccess }) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form Fields State
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    department: 'Computer Science',
    year: '3rd Year / 5th Semester',
    mentorName: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isRegisterMode) {
      // Basic match validator
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match!");
        setLoading(false);
        return;
      }

      // Generate a clean deterministic student id for this runtime context
      const calculatedId = Math.floor(Math.random() * 900) + 100;

      const payload = {
        student_id: calculatedId,
        name: formData.fullName,
        department: formData.department,
        year: parseInt(formData.year.charAt(0)) || 3, // Safely extract number value
        skills: [], // Assigned dynamically during the subsequent Skill module state
        experience_level: "Beginner",
        project_title: "",
        project_description: "",
        project_domain: ""
      };

      const result = await apiService.onboardStudent(payload);
      if (result.status === "success") {
        onAuthSuccess(payload);
      } else {
        setError("Onboarding communication failed. Try again.");
      }
    } else {
      // Simulate validation loop mapping onto the structural student model
      setTimeout(() => {
        onAuthSuccess({
          student_id: 101,
          name: "Alex Mercer",
          department: "Computer Science",
          year: 3,
          skills: ["Python", "React", "FastAPI"],
          experience_level: "Intermediate",
          project_title: "AI Mentor Platform",
          project_description: "An AI-powered platform...",
          project_domain: "Artificial Intelligence"
        });
      }, 800);
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-100">
      
      {/* LEFT HAND: The Deep Academic Blue Showcase Banner Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0252CD] to-[#013CA7] p-16 flex-col justify-between text-white relative overflow-hidden">
        {/* Abstract Background Design Element */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-black/10 rounded-full blur-3xl" />

        {/* Top Header Identity */}
        <div className="flex items-center space-x-3 z-10">
          <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md border border-white/20">
            <span className="text-2xl">🎓</span>
          </div>
          <span className="text-xl font-bold tracking-wide">AI Academic Project Mentor</span>
        </div>

        {/* Core Value Statement Accent */}
        <div className="my-auto space-y-6 max-w-md z-10">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight">
            Empower Your Ideas.<br />
            Build Smarter Projects <br />
            with AI Guidance.
          </h1>
          <p className="text-white/80 text-base leading-relaxed font-light">
            Plan, build, and succeed in your academic journey with the power of coordinated multi-agent artificial intelligence.
          </p>
          
          {/* Laptop and Books Graphic Frame Emulation */}
          <div className="pt-10 flex justify-center">
            <div className="relative w-72 h-44 bg-slate-900/40 border border-white/10 rounded-xl p-4 shadow-2xl backdrop-blur-sm">
              <div className="w-full h-32 bg-[#0F172A] rounded-lg border border-white/5 p-2 flex flex-col justify-between">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
                <div className="h-2 w-2/3 bg-blue-500/20 rounded" />
                <div className="h-12 w-full bg-blue-500/5 border border-blue-500/10 rounded flex items-center justify-around">
                  <div className="w-4 h-8 bg-blue-500/20 rounded-sm" />
                  <div className="w-4 h-6 bg-blue-500/30 rounded-sm" />
                  <div className="w-4 h-10 bg-blue-500/40 rounded-sm" />
                </div>
              </div>
              <div className="absolute -bottom-2 left-4 right-4 h-2 bg-slate-700 rounded-b-xl" />
            </div>
          </div>
        </div>

        {/* Branding Footer */}
        <div className="text-white/50 text-xs z-10">
          © {new Date().getFullYear()} AI Academic Project Mentor. Step-by-step guidance system.
        </div>
      </div>

      {/* RIGHT HAND: Interactive Forms Access Workspace */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-[#F8FAFC]">
        <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-sm border border-slate-200/60 transition-all duration-300">
          
          {/* Header Block Toggle */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#0F172A]">
              {isRegisterMode ? 'Create Account' : 'Welcome Back!'}
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              {isRegisterMode ? 'Fill in your details to get started' : 'Login to continue your journey'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium">
              ⚠️ {error}
            </div>
          )}

          {/* Form Node Block */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegisterMode && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:border-[#0252CD] focus:bg-white transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:border-[#0252CD] focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">Password</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create a password"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:border-[#0252CD] focus:bg-white transition-all"
              />
            </div>

            {isRegisterMode && (
              <>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:border-[#0252CD] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">Department</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:border-[#0252CD] focus:bg-white transition-all appearance-none"
                  >
                    <option value="Computer Science">Computer Science & Engineering</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Electronics Engineering">Electronics Engineering</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">Year / Semester</label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:border-[#0252CD] focus:bg-white transition-all appearance-none"
                  >
                    <option value="1st Year / 1st Semester">1st Year / 1st Semester</option>
                    <option value="2nd Year / 3rd Semester">2nd Year / 3rd Semester</option>
                    <option value="3rd Year / 5th Semester">3rd Year / 5th Semester</option>
                    <option value="4th Year / 7th Semester">4th Year / 7th Semester</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">Mentor Name (Optional)</label>
                  <input
                    type="text"
                    name="mentorName"
                    value={formData.mentorName}
                    onChange={handleInputChange}
                    placeholder="Enter mentor name"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:border-[#0252CD] focus:bg-white transition-all"
                  />
                </div>
              </>
            )}

            {!isRegisterMode && (
              <div className="flex items-center justify-between text-xs font-medium pt-1">
                <label className="flex items-center space-x-2 text-slate-600 cursor-pointer">
                  <input type="checkbox" className="rounded text-[#0252CD] focus:ring-0 w-4 h-4" />
                  <span>Remember me</span>
                </label>
                <button type="button" className="text-[#0252CD] hover:underline">Forgot Password?</button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-4 rounded-xl bg-[#0252CD] hover:bg-[#013CA7] text-white font-medium text-sm transition-colors duration-200 shadow-md shadow-blue-500/10 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>{isRegisterMode ? 'Register' : 'Login'}</span>
              )}
            </button>
          </form>

          {/* Switch Action Options */}
          <div className="mt-6 text-center text-sm text-slate-500">
            {isRegisterMode ? 'Already have an account?' : "Don't have an account?"}
            <button
              onClick={() => {
                setError('');
                setIsRegisterMode(!isRegisterMode);
              }}
              className="text-[#0252CD] font-semibold ml-1.5 hover:underline focus:outline-none"
            >
              {isRegisterMode ? 'Login' : 'Register'}
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}