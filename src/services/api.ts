import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:18080';

// 创建 axios 实例
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30秒超时
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// 请求拦截器
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 可以在这里添加认证 token
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log('API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      data: config.data
    });
    
    return config;
  },
  (error: AxiosError) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error: AxiosError) => {
    console.error('Response Error:', {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url,
      data: error.response?.data
    });
    
    // 统一错误处理
    if (error.response?.status === 401) {
      // 未授权，清除 token 并跳转到登录页
      localStorage.removeItem('token');
      // window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// 类型定义
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  success?: boolean;
}

export interface GenerateCodeRequest {
  entity_name: string;
  fields: string;
}

export interface ApiError {
  code: number;
  message: string;
  details?: any;
}

// API 方法封装
export const apiMethods = {
  // GET 请求
  get: async <T = any>(url: string, params?: any): Promise<ApiResponse<T>> => {
    try {
      const response = await api.get(url, { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error as AxiosError);
    }
  },

  // POST 请求
  post: async <T = any>(url: string, data?: any): Promise<ApiResponse<T>> => {
    try {
      const response = await api.post(url, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error as AxiosError);
    }
  },

  // PUT 请求
  put: async <T = any>(url: string, data?: any): Promise<ApiResponse<T>> => {
    try {
      const response = await api.put(url, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error as AxiosError);
    }
  },

  // DELETE 请求
  delete: async <T = any>(url: string): Promise<ApiResponse<T>> => {
    try {
      const response = await api.delete(url);
      return response.data;
    } catch (error) {
      throw handleApiError(error as AxiosError);
    }
  }
};

// 错误处理函数
function handleApiError(error: AxiosError): ApiError {
  if (error.response) {
    // 服务器返回错误状态码
    const { status, data } = error.response;
    return {
      code: status,
      message: (data as any)?.message || `HTTP Error ${status}`,
      details: data
    };
  } else if (error.request) {
    // 请求发送但没有收到响应
    return {
      code: 0,
      message: '网络连接失败，请检查网络设置',
      details: error.message
    };
  } else {
    // 其他错误
    return {
      code: -1,
      message: error.message || '未知错误',
      details: error
    };
  }
}

// 流式请求，返回 async generator
export async function* generateCodeStream(fields: string): AsyncGenerator<string, void, unknown> {
  const request: GenerateCodeRequest = {
    entity_name: "Entity",
    fields: fields
  };
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/codegen/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 添加认证头
        ...(localStorage.getItem('token') && {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        })
      },
      credentials: 'include',
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error('No response body');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    
    try {
      let { value, done } = await reader.read();
      while (!done) {
        const chunk = decoder.decode(value, { stream: true });
        if (chunk.trim()) {
          yield chunk;
        }
        ({ value, done } = await reader.read());
      }
    } finally {
      reader.releaseLock();
    }
  } catch (error) {
    console.error('Stream error:', error);
    throw error;
  }
}

// 代码生成相关 API
export const codegenApi = {
  // 生成代码（非流式）
  generateCode: async (request: GenerateCodeRequest): Promise<ApiResponse<string>> => {
    return apiMethods.post('/api/codegen/generate-sync', request);
  },

  // 获取生成历史
  getHistory: async (): Promise<ApiResponse<any[]>> => {
    return apiMethods.get('/api/codegen/history');
  },

  // 保存生成的代码
  saveCode: async (code: string, filename: string): Promise<ApiResponse<any>> => {
    return apiMethods.post('/api/codegen/save', { code, filename });
  }
};

export default api;