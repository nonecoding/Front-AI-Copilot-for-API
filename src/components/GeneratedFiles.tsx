import React, { useEffect, useRef } from 'react';

interface GeneratedFile {
  name: string;
  type: string;
  content: string;
}

interface GeneratedFilesProps {
  tabs: { id: string; title: string; files: GeneratedFile[] }[];
  activeTabId: string;
  onTabChange: (id: string) => void;
  onTabClose: (id: string) => void;
}

const getLanguageClass = (type: string) => {
  switch (type.toLowerCase()) {
    case 'java':
      return 'language-java';
    case 'json':
      return 'language-json';
    case 'xml':
      return 'language-xml';
    case 'txt':
      return 'language-text';
    default:
      return 'language-text';
  }
};

const GeneratedFiles: React.FC<GeneratedFilesProps> = ({ tabs, activeTabId, onTabChange, onTabClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeTab = tabs.find(tab => tab.id === activeTabId);
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [activeTabId, tabs]);
  if (!tabs || tabs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        暂无生成文件，请先生成内容。
      </div>
    );
  }
  return (
    <div className="flex flex-col h-full">
      {/* 标签栏 */}
      <div className="flex space-x-2 border-b border-[#2B3245] mb-2">
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`flex items-center px-4 py-2 cursor-pointer rounded-t-md ${tab.id === activeTabId ? 'bg-[#232B3E] text-blue-400' : 'bg-[#1C2333] text-gray-300'}`}
            onClick={() => onTabChange(tab.id)}
          >
            <span className="mr-2">{tab.title}</span>
            <button
              className="ml-1 text-gray-400 hover:text-red-400 focus:outline-none"
              onClick={e => { e.stopPropagation(); onTabClose(tab.id); }}
              title="关闭"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      {/* 当前标签内容 */}
      <div className="space-y-6 overflow-auto flex-1 max-h-[calc(100vh-200px)]" ref={containerRef}>
        {activeTab && activeTab.files.map((file, idx) => (
          <div key={idx} className="bg-[#232B3E] rounded-lg shadow p-4 border border-[#2B3245]">
            <div className="flex items-center mb-2">
              <span className="font-semibold text-blue-400 mr-2">{file.name}</span>
              <span className="text-xs text-gray-400 bg-[#1C2333] rounded px-2 py-0.5 ml-2">{file.type}</span>
            </div>
            <pre className={`whitespace-pre-wrap text-sm text-gray-200 overflow-x-auto ${getLanguageClass(file.type)}`}
              style={{ minHeight: 40 }}
              data-testid={`file-content-${file.name}`}
            >{file.content}</pre>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GeneratedFiles;