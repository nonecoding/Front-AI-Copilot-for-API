import React from 'react';

interface GeneratedFile {
  name: string;
  type: string;
  content: string;
}

interface GeneratedFilesProps {
  files: GeneratedFile[];
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

const GeneratedFiles: React.FC<GeneratedFilesProps> = ({ files }) => {
  if (!files || files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        暂无生成文件，请先生成内容。
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {files.map((file, idx) => (
        <div key={idx} className="bg-[#232B3E] rounded-lg shadow p-4 border border-[#2B3245]">
          <div className="flex items-center mb-2">
            <span className="font-semibold text-blue-400 mr-2">{file.name}</span>
            <span className="text-xs text-gray-400 bg-[#1C2333] rounded px-2 py-0.5 ml-2">{file.type}</span>
          </div>
          {/* 文件内容流式追加区域 */}
          <pre className={`whitespace-pre-wrap text-sm text-gray-200 overflow-x-auto ${getLanguageClass(file.type)}`}
            style={{ minHeight: 40 }}
            data-testid={`file-content-${file.name}`}
          >{file.content}</pre>
        </div>
      ))}
    </div>
  );
};

export default GeneratedFiles;