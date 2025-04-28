import React, { useState, useRef } from 'react';
import { generateCodeStream } from '../services/api';
import { Code, Loader, User } from 'lucide-react';

const CodeAssistant: React.FC = () => {
  const [fields, setFields] = useState('');
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [question, setQuestion] = useState<string>('');
  const resultRef = useRef<HTMLDivElement>(null);

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
      for await (const chunk of generateCodeStream(fields)) {
        code += chunk;
        setResult(code);
        // 滚动到底部
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