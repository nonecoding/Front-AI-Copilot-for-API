import React, { useState } from 'react';
import CodeAssistant from './components/CodeAssistant';
import Sidebar from './components/Sidebar';
import GeneratedFiles from './components/GeneratedFiles';

function App() {
  const [files, setFiles] = useState([
    {
      name: 'Demo.java',
      type: 'java',
      content: 'public class Demo {\n    private Long id;\n    private String name;\n}'
    },
    {
      name: 'data.json',
      type: 'json',
      content: '{\n  "id": 1,\n  "name": "test"\n}'
    }
  ]);

  return (
    <div className="min-h-screen bg-[#0E1525] text-white flex flex-col">
      <header className="bg-[#1C2333] border-b border-[#2B3245] p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">Java AI Assistant</h1>
          <p className="text-gray-400 text-sm">AI-powered Java code generation</p>
        </div>
      </header>
      <div className="flex flex-1 max-w-7xl mx-auto w-full py-8 px-4 gap-6">
        {/* 左侧 Sidebar */}
        <div className="w-64 flex-shrink-0 hidden md:block">
          <Sidebar toggleSidebar={() => {}} />
        </div>
        {/* 中间文件展示区 */}
        <div className="flex-1 overflow-auto">
          <GeneratedFiles files={files} />
        </div>
        {/* 右侧问答区 */}
        <div className="w-full md:w-[420px] flex-shrink-0">
          <CodeAssistant setFiles={setFiles} files={files} />
        </div>
      </div>
    </div>
  );
}

export default App;