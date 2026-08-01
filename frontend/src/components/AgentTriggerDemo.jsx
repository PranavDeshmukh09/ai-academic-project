import React, { useState } from 'react';

export default function AgentTriggerDemo() {
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  const triggerPipeline = async () => {
    setStatus('loading');
    setMessage('Initializing Multi-Agent Pipeline...');
    
    try {
      const response = await fetch('http://localhost:8000/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ project_id: 1 })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setStatus('success');
        setMessage(data.message || 'Pipeline triggered successfully!');
      } else {
        setStatus('error');
        setMessage(data.detail || 'Failed to trigger pipeline.');
      }
    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'Network error occurred.');
    }
  };

  return (
    <div className="mt-6 p-6 border border-purple-200 bg-purple-50 rounded-2xl shadow-sm">
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <div>
          <h3 className="text-lg font-bold text-purple-900">Multi-Agent Pipeline Demo</h3>
          <p className="text-sm text-purple-700 mt-1">
            Click the button below to trigger the 7-agent pipeline for Project ID: 1.
            <br/>
            <span className="text-xs italic">(This is a temporary component for Milestone 1 demo purposes)</span>
          </p>
        </div>
        
        <button
          onClick={triggerPipeline}
          disabled={status === 'loading'}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all shadow-md disabled:opacity-50 flex items-center space-x-2"
        >
          {status === 'loading' ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Running Pipeline...</span>
            </>
          ) : (
            <span>🚀 Trigger AI Pipeline</span>
          )}
        </button>

        {status === 'success' && (
          <div className="text-sm font-semibold text-green-700 bg-green-100 px-4 py-2 rounded-lg">
            ✅ {message}
          </div>
        )}
        
        {status === 'error' && (
          <div className="text-sm font-semibold text-red-700 bg-red-100 px-4 py-2 rounded-lg">
            ❌ {message}
          </div>
        )}
      </div>
    </div>
  );
}
