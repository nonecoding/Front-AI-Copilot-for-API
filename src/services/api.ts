import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:18080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

export interface ApiResponse {
  code: number;
  message: string;
  data: any;
}

export interface GenerateCodeRequest {
  entity_name: string;
  fields: string;
}

// 流式请求，返回 async generator
export async function* generateCodeStream(fields: string): AsyncGenerator<string, void, unknown> {
  const request: GenerateCodeRequest = {
    entity_name: "Entity",
    fields: fields
  };
  const response = await fetch(`${API_BASE_URL}/api/codegen/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(request)
  });
  if (!response.body) throw new Error('No response body');
  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let { value, done } = await reader.read();
  while (!done) {
    yield decoder.decode(value, { stream: true });
    ({ value, done } = await reader.read());
  }
}

export default api;