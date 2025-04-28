import React, { useState } from 'react';
import { analyzeApi } from '../services/api';
import { Code, Send, Loader } from 'lucide-react';

const ApiAnalyzer: React.FC = () => {
  const [apiUrl, setApiUrl] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!apiUrl) {
      setError('Please enter an API URL');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const result = await analyzeApi(apiUrl);
      setAnalysis(result.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to analyze API');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-[#1C2333] rounded-lg shadow-lg">
      <div className="flex items-center mb-6">
        <Code className="w-6 h-6 text-blue-400 mr-2" />
        <h2 className="text-xl font-semibold">API Analyzer</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            API URL
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="Enter API URL to analyze"
              className="flex-1 bg-[#0E1525] border border-[#2B3245] rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Analyze
            </button>
          </div>
        </div>

        {error && (
          <div className="text-red-400 text-sm mt-2">
            {error}
          </div>
        )}

        {analysis && (
          <div className="mt-6 bg-[#0E1525] border border-[#2B3245] rounded-lg p-4">
            <pre className="text-sm text-gray-300 whitespace-pre-wrap">
              {JSON.stringify(analysis, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiAnalyzer;