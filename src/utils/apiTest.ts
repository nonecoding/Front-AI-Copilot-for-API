import { apiMethods, generateCodeStream, codegenApi } from '../services/api';

// API 连接测试工具
export class ApiTester {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || import.meta.env.VITE_API_URL || 'http://localhost:18080';
  }

  // 测试基本连接
  async testConnection(): Promise<{ success: boolean; message: string; details?: any }> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          message: '后端连接成功',
          details: data
        };
      } else {
        return {
          success: false,
          message: `连接失败: HTTP ${response.status}`,
          details: { status: response.status, statusText: response.statusText }
        };
      }
    } catch (error) {
      return {
        success: false,
        message: '网络连接失败',
        details: error
      };
    }
  }

  // 测试代码生成 API
  async testCodeGeneration(): Promise<{ success: boolean; message: string; details?: any }> {
    try {
      const testRequest = {
        entity_name: 'TestEntity',
        fields: 'id:Long,name:String,email:String'
      };

      const response = await codegenApi.generateCode(testRequest);
      
      return {
        success: true,
        message: '代码生成 API 测试成功',
        details: response
      };
    } catch (error) {
      return {
        success: false,
        message: '代码生成 API 测试失败',
        details: error
      };
    }
  }

  // 测试流式代码生成
  async testStreamGeneration(): Promise<{ success: boolean; message: string; details?: any }> {
    try {
      const chunks: string[] = [];
      const generator = generateCodeStream('id:Long,name:String,email:String');
      
      for await (const chunk of generator) {
        chunks.push(chunk);
        if (chunks.length > 10) break; // 限制测试数据量
      }

      return {
        success: true,
        message: '流式代码生成测试成功',
        details: { chunksReceived: chunks.length, firstChunk: chunks[0] }
      };
    } catch (error) {
      return {
        success: false,
        message: '流式代码生成测试失败',
        details: error
      };
    }
  }

  // 运行所有测试
  async runAllTests(): Promise<{
    connection: { success: boolean; message: string; details?: any };
    codeGeneration: { success: boolean; message: string; details?: any };
    streamGeneration: { success: boolean; message: string; details?: any };
  }> {
    console.log('开始 API 测试...');
    
    const connection = await this.testConnection();
    console.log('连接测试:', connection);
    
    const codeGeneration = await this.testCodeGeneration();
    console.log('代码生成测试:', codeGeneration);
    
    const streamGeneration = await this.testStreamGeneration();
    console.log('流式生成测试:', streamGeneration);

    return {
      connection,
      codeGeneration,
      streamGeneration
    };
  }
}

// 导出默认实例
export const apiTester = new ApiTester();

// 便捷的测试函数
export const testBackendConnection = () => apiTester.runAllTests();