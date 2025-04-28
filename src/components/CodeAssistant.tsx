import React, { useState, useRef } from 'react';
import { Code, Loader, User } from 'lucide-react';
import { generateCodeStream } from '../services/api';

// 确保 generateCodeStream 返回 AsyncIterable<any> 或 AsyncGenerator<any, any, any>
// 如果 generateCodeStream 不是 async generator，需要在 ../services/api 里调整其实现


interface CodeAssistantProps {
  setFiles: React.Dispatch<React.SetStateAction<any[]>>;
  files: any[];
}

const CodeAssistant: React.FC<CodeAssistantProps> = ({ setFiles, files }) => {
  const [fields, setFields] = useState('');
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [question, setQuestion] = useState<string>('');
  const resultRef = useRef<HTMLDivElement>(null);
  const [selectedFile, setSelectedFile] = useState<File|null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle'|'uploading'|'success'|'error'>('idle');
  const [uploadMsg, setUploadMsg] = useState<string>('');

  // 文件上传副作用
  React.useEffect(() => {
    const uploadFile = async () => {
      if (!selectedFile) return;
      setUploadStatus('uploading');
      setUploadMsg('');
      try {
        const formData = new FormData();
        formData.append('multipartFile', selectedFile);
        const resp = await fetch('/api/codegen/uploadToMinIo', {
          method: 'POST',
          body: formData,
        });
        const data = await resp.json();
        if (resp.ok && data.code === 200) {
          setUploadStatus('success');
          setUploadMsg('上传成功OK');
        } else {
          setUploadStatus('error');
          setUploadMsg('上传失败failure');
        }
      } catch (e: any) {
        setUploadStatus('error');
        setUploadMsg('上传失败: ' + (e.message || '网络错误'));
      }
    };
    if (selectedFile) {
      uploadFile();
    }
  }, [selectedFile]);

  const handleSubmit = async () => {
    if (!fields) {
      setError('请输入实体字段描述');
      return;
    }
    setLoading(true);
    setError('');
    setResult('');
    setQuestion(fields);
    try {
      let code = '';
      // 生成唯一标题，优先用提问摘要
      const titleBase = fields.trim().slice(0, 20) || '生成内容';
      let uniqueName = titleBase;
      let suffix = 1;
      // 保证标题唯一
      while (files.some(f => f.name === uniqueName)) {
        uniqueName = `${titleBase}_${suffix++}`;
      }
      // 确保 generateCodeStream 返回 AsyncIterable<any> 或 AsyncGenerator<any, any, any>
      // 如果不是，需要在 ../services/api 里调整 generateCodeStream 的实现
      for await (const chunkObj of generateCodeStream(fields) as AsyncIterable<any>) {
        const { name, type, contentChunk } = typeof chunkObj === 'string' ? { name: uniqueName, type: 'java', contentChunk: chunkObj } : { ...chunkObj, name: uniqueName };
        code += contentChunk;
        setResult(code);
        setFiles(prevFiles => {
          // 判断是否追加到当前卡片还是新建
          const idx = prevFiles.findIndex(f => f.name === name);
          if (idx === -1) {
            // 新建卡片
            return [...prevFiles, { name, type, content: contentChunk }];
          } else {
            // 追加内容
            const updated = [...prevFiles];
            updated[idx] = { ...updated[idx], content: updated[idx].content + contentChunk };
            return updated;
          }
        });
        setTimeout(() => {
          resultRef.current?.scrollTo({ top: resultRef.current.scrollHeight, behavior: 'smooth' });
        }, 0);
      }
    } catch (err: any) {
      setError(err.message || '生成代码失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1C2333] rounded-lg p-6 max-w-2xl mx-auto shadow-2xl">
      <div className="flex items-center mb-6">
        <Code className="w-6 h-6 text-blue-400 mr-2" />
        <h2 className="text-xl font-semibold">Java 实体生成助手</h2>
      </div>
      <div className="space-y-6">
        {/* 提问区域 */}
        <div className="bg-[#232B3E] rounded-lg p-4 flex items-start gap-3 shadow hover-scale">
          <User className="w-6 h-6 text-green-400 mt-1" />
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              请输入实体字段（如："id:Long,name:String,age:Integer"）
            </label>
            <textarea
              value={fields}
              onChange={(e) => setFields(e.target.value)}
              placeholder="格式：字段名:类型,字段名:类型"
              className="w-full h-24 bg-[#0E1525] border border-[#2B3245] rounded p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              disabled={loading}
            />
            {/* 上传文件区域 */}
            <div className="flex items-center mt-2 gap-2">
              <label htmlFor="file-upload" className="cursor-pointer flex items-center text-gray-400 hover:text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.586-6.586a4 4 0 10-5.656-5.656l-6.586 6.586a6 6 0 108.486 8.486l6.586-6.586" /></svg>
                <span>上传文档/图片</span>
                <input id="file-upload" type="file" className="hidden" multiple={false} accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt" onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setSelectedFile(e.target.files[0]);
                    e.target.value = "";
                  }
                }} />
              </label>
              {/* 文件预览区域 */}
              {selectedFile && (
                <div className="mt-2 text-sm text-gray-300">
                  <span>已选择文件：</span>{selectedFile.name}
                  {uploadStatus === 'uploading' && <span className="ml-2 text-blue-400">上传中...</span>}
                  {uploadStatus === 'success' && <span className="ml-2 text-green-400">{uploadMsg}</span>}
                  {uploadStatus === 'error' && <span className="ml-2 text-red-400">{uploadMsg}</span>}
                </div>
              )}
              {/* 这里后续会根据 state 展示上传的文件名或缩略图 */}
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-3 w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-6 py-2 rounded-lg flex items-center justify-center space-x-2 disabled:opacity-50 font-semibold shadow-lg transition-all"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>生成中...</span>
                </>
              ) : (
                <>
                  <Code className="w-4 h-4" />
                  <span>生成实体代码</span>
                </>
              )}
            </button>
            {error && (
              <div className="text-red-400 text-sm mt-2">{error}</div>
            )}
          </div>
        </div>
        {/* 展示历史提问 */}
        {question && (
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-green-400 mt-1" />
            <div className="bg-[#232B3E] rounded-lg px-4 py-2 text-gray-200 text-sm shadow max-w-xl">
              <span className="font-semibold text-blue-300">提问：</span>{question}
            </div>
          </div>
        )}
        {/* 回答区域 */}
        <div className="flex items-start gap-3">
          <Code className="w-5 h-5 text-blue-400 mt-1" />
          <div className="flex-1">
            <div className="bg-[#0E1525] border border-[#2B3245] rounded-lg p-4 min-h-[120px] shadow-lg relative overflow-auto" ref={resultRef} style={{maxHeight: 400}}>
              <span className="font-semibold text-blue-300">AI回答：</span>
              <pre className="text-sm text-gray-300 whitespace-pre-wrap overflow-auto mt-2">
                {result || (loading ? '正在生成代码...' : '请先输入字段并点击生成')}
              </pre>
              {loading && <div className="absolute right-4 top-4"><Loader className="w-4 h-4 animate-spin text-blue-400" /></div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeAssistant;