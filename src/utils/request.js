/**
 * 前端网络请求封装
 * 基于原生 fetch API 的轻量级封装
 * 基础 URL 配置为 '/api'，通过 Vite 代理转发到 BFF 服务
 */

// API 基础配置
const BASE_URL = '/api';
const DEFAULT_TIMEOUT = 30000;

/**
 * 请求配置选项
 * @typedef {Object} RequestOptions
 * @property {string} method - HTTP 方法
 * @property {Object} headers - 请求头
 * @property {Object} body - 请求体
 * @property {number} timeout - 超时时间(ms)
 */

/**
 * 统一响应格式
 * @typedef {Object} ApiResponse
 * @property {number} code - 业务状态码
 * @property {string} message - 状态描述
 * @property {T} data - 响应数据
 * @property {number} timestamp - 时间戳
 * @template T
 */

/**
 * 创建 AbortController 用于超时控制
 * @param {number} timeout 
 * @returns {AbortSignal}
 */
function createTimeoutSignal(timeout = DEFAULT_TIMEOUT) {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeout);
  return controller.signal;
}

/**
 * 统一请求处理
 * @param {string} url - 请求路径（不含 BASE_URL）
 * @param {RequestOptions} options - 请求选项
 * @returns {Promise<ApiResponse>}
 */
async function request(url, options = {}) {
  const { method = 'GET', headers = {}, body, timeout } = options;
  
  // 构建完整 URL
  const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;
  
  // 默认请求头
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  // 合并请求头
  const finalHeaders = { ...defaultHeaders, ...headers };
  
  // 构建 fetch 选项
  const fetchOptions = {
    method,
    headers: finalHeaders,
    signal: createTimeoutSignal(timeout),
  };
  
  // 添加请求体（非 GET 请求）
  if (body && method !== 'GET') {
    fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
  }
  
  try {
    // 开发环境日志
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${method} ${fullUrl}`, body);
    }
    
    const response = await fetch(fullUrl, fetchOptions);
    
    // HTTP 错误处理
    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
    }
    
    // 解析响应
    const result = await response.json();
    
    // 开发环境日志
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${method} ${fullUrl}`, result);
    }
    
    // 业务状态码检查
    if (result.code !== undefined && result.code !== 200 && result.code !== 0) {
      throw new Error(result.message || `Business Error: ${result.code}`);
    }
    
    // 返回数据体（剥离外层包装）
    return result.data ?? result;
    
  } catch (error) {
    // 统一错误处理
    if (error.name === 'AbortError') {
      console.error('[Request Timeout]', fullUrl);
      throw new Error('请求超时，请稍后重试');
    }
    
    if (error.message?.includes('Failed to fetch')) {
      console.error('[Network Error]', fullUrl);
      throw new Error('网络连接失败，请检查网络');
    }
    
    console.error('[Request Error]', error);
    throw error;
  }
}

/**
 * HTTP 方法封装
 */
export const http = {
  /**
   * GET 请求
   * @param {string} url 
   * @param {Object} params - URL 查询参数
   * @returns {Promise<any>}
   */
  get: (url, params = {}) => {
    // 构建查询字符串
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;
    return request(fullUrl, { method: 'GET' });
  },
  
  /**
   * POST 请求
   * @param {string} url 
   * @param {Object} data 
   * @returns {Promise<any>}
   */
  post: (url, data) => request(url, { method: 'POST', body: data }),
  
  /**
   * PUT 请求
   * @param {string} url 
   * @param {Object} data 
   * @returns {Promise<any>}
   */
  put: (url, data) => request(url, { method: 'PUT', body: data }),
  
  /**
   * PATCH 请求
   * @param {string} url 
   * @param {Object} data 
   * @returns {Promise<any>}
   */
  patch: (url, data) => request(url, { method: 'PATCH', body: data }),
  
  /**
   * DELETE 请求
   * @param {string} url 
   * @returns {Promise<any>}
   */
  delete: (url) => request(url, { method: 'DELETE' }),
};

export { request };
export default request;
