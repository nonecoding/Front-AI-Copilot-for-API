import React from 'react';
import CodeAssistant from './components/CodeAssistant';

function App() {
  return (
    <div className="min-h-screen bg-[#0E1525] text-white">
      <header className="bg-[#1C2333] border-b border-[#2B3245] p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">Java AI Assistant</h1>
          <p className="text-gray-400 text-sm">AI-powered Java code generation</p>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-8 px-4">
        <CodeAssistant />
      </main>
    </div>
  );
}

export default App;