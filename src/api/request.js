/**
 * Axios 请求封装
 * 生产级 HTTP 客户端配置
 */

import axios from 'axios';

// 环境变量配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 30000;

/**
 * 创建 axios 实例
 */
const request = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

/**
 * 请求拦截器
 * - 注入 Token
 * - 添加请求时间戳
 * - 统一请求格式
 */
request.interceptors.request.use(
  (config) => {
    // 从 localStorage 或 sessionStorage 获取 Token
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 添加请求时间戳（用于缓存控制）
    config.headers['X-Request-Time'] = Date.now().toString();

    // 添加请求 ID（用于链路追踪）
    config.headers['X-Request-ID'] = generateRequestId();

    // 开发环境日志
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.params || config.data);
    }

    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

/**
 * 响应拦截器
 * - 统一错误处理
 * - 数据解构
 * - Token 过期处理
 */
request.interceptors.response.use(
  (response) => {
    const { data, config } = response;

    // 开发环境日志
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${config.method?.toUpperCase()} ${config.url}`, data);
    }

    // 业务状态码处理
    if (data.code !== undefined && data.code !== 200 && data.code !== 0) {
      handleBusinessError(data);
      return Promise.reject(new Error(data.message || '业务处理失败'));
    }

    // 返回数据体
    return data.data ?? data;
  },
  (error) => {
    const { response, config } = error;

    // 开发环境日志
    if (import.meta.env.DEV) {
      console.error(`[API Error] ${config?.method?.toUpperCase()} ${config?.url}`, error);
    }

    // 统一错误处理
    if (response) {
      handleHttpError(response);
    } else {
      // 网络错误或请求取消
      handleNetworkError(error);
    }

    return Promise.reject(error);
  }
);

/**
 * 生成请求 ID
 */
function generateRequestId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 处理 HTTP 错误
 */
function handleHttpError(response) {
  const { status, data } = response;
  
  const errorMessages = {
    400: '请求参数错误',
    401: '登录已过期，请重新登录',
    403: '无权限访问',
    404: '请求的资源不存在',
    405: '请求方法不允许',
    408: '请求超时',
    500: '服务器内部错误',
    502: '网关错误',
    503: '服务暂时不可用',
    504: '网关超时',
  };

  const message = data?.message || errorMessages[status] || `HTTP 错误: ${status}`;

  // 401 特殊处理：清除 Token 并跳转登录
  if (status === 401) {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    // 可以在这里触发全局登录过期事件
    window.dispatchEvent(new CustomEvent('auth:expired', { detail: message }));
  }

  // 可以在这里集成消息提示组件（如 toast）
  console.error(`[HTTP Error ${status}]`, message);
}

/**
 * 处理业务错误
 */
function handleBusinessError(data) {
  const { code, message } = data;
  console.error(`[Business Error ${code}]`, message);
  // 可以在这里集成消息提示组件
}

/**
 * 处理网络错误
 */
function handleNetworkError(error) {
  if (error.message?.includes('timeout')) {
    console.error('[Network Error]', '请求超时，请检查网络连接');
  } else if (error.message?.includes('Network Error')) {
    console.error('[Network Error]', '网络连接失败，请检查网络');
  } else {
    console.error('[Network Error]', error.message || '未知网络错误');
  }
}

/**
 * 请求方法封装
 */
export const http = {
  get: (url, params, config = {}) => request.get(url, { params, ...config }),
  post: (url, data, config = {}) => request.post(url, data, config),
  put: (url, data, config = {}) => request.put(url, data, config),
  patch: (url, data, config = {}) => request.patch(url, data, config),
  delete: (url, config = {}) => request.delete(url, config),
};

export default request;
