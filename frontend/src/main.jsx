import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught React Error Boundary Triggered:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center font-sans">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-md w-full shadow-xl space-y-4">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto border border-rose-100 font-bold text-xl">
              ⚠️
            </div>
            <h2 className="text-lg font-black text-slate-900">Application Recovered from Interface Error</h2>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              A temporary render error occurred ({this.state.error?.message || 'Component state sync error'}). Your session data is intact.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = '/';
              }}
              className="w-full py-3 bg-[#0252CD] text-white font-bold rounded-2xl text-xs shadow-md hover:bg-blue-700 transition-all cursor-pointer"
            >
              Reload & Return to Workspace
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const container = document.getElementById('root')
const root = createRoot(container)
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
)
