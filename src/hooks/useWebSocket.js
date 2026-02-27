/**
 * WebSocket Hook
 * 用于接收后端实时大屏告警事件
 * 
 * 使用示例:
 * ```jsx
 * function AlertPanel() {
 *   const { isConnected, alerts, connect, disconnect } = useWebSocket({
 *     url: 'wss://api.example.com/ws/alerts',
 *     autoConnect: true,
 *     onMessage: (data) => console.log('New alert:', data),
 *   });
 *   
 *   return <div>{alerts.length} 条实时告警</div>;
 * }
 * ```
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import useDashboardStore from '../store/useDashboardStore.js';

/**
 * WebSocket 配置选项
 * @typedef {Object} WebSocketOptions
 * @property {string} url - WebSocket 连接地址
 * @property {boolean} [autoConnect=true] - 是否自动连接
 * @property {number} [reconnectInterval=3000] - 重连间隔(毫秒)
 * @property {number} [maxReconnectAttempts=5] - 最大重连次数
 * @property {function} [onMessage] - 消息回调
 * @property {function} [onConnect] - 连接成功回调
 * @property {function} [onDisconnect] - 断开连接回调
 * @property {function} [onError] - 错误回调
 */

/**
 * WebSocket Hook
 * @param {WebSocketOptions} options
 * @returns {Object} WebSocket 状态和操作方法
 */
export function useWebSocket(options = {}) {
  const {
    url = import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws/alerts',
    autoConnect = true,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
    onMessage,
    onConnect,
    onDisconnect,
    onError,
  } = options;

  // 状态
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [alerts, setAlerts] = useState([]);

  // Refs
  const wsRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimerRef = useRef(null);
  const isManualCloseRef = useRef(false);

  // 获取 Store 的 addRealtimeAlert 方法
  const addRealtimeAlert = useDashboardStore((state) => state.addRealtimeAlert);

  /**
   * 处理 WebSocket 消息
   */
  const handleMessage = useCallback((event) => {
    try {
      const data = JSON.parse(event.data);
      
      // 开发环境日志
      if (import.meta.env.DEV) {
        console.log('[WebSocket] Received:', data);
      }

      // 处理不同类型的消息
      switch (data.type) {
        case 'ALERT':
          // 实时告警
          addRealtimeAlert(data.payload);
          setAlerts((prev) => [data.payload, ...prev].slice(0, 100));
          break;
        
        case 'ALERT_UPDATE':
          // 告警更新
          setAlerts((prev) =>
            prev.map((alert) =>
              alert.id === data.payload.id ? { ...alert, ...data.payload } : alert
            )
          );
          break;
        
        case 'ALERT_CLEAR':
          // 告警清除
          setAlerts((prev) => prev.filter((alert) => alert.id !== data.payload.id));
          break;
        
        case 'METRICS_UPDATE':
          // 指标更新（可用于实时刷新图表）
          // TODO: 更新对应指标数据
          break;
        
        case 'PING':
          // 心跳响应
          wsRef.current?.send(JSON.stringify({ type: 'PONG' }));
          break;
        
        default:
          console.warn('[WebSocket] Unknown message type:', data.type);
      }

      // 调用外部回调
      onMessage?.(data);
    } catch (err) {
      console.error('[WebSocket] Failed to parse message:', err);
    }
  }, [addRealtimeAlert, onMessage]);

  /**
   * 连接 WebSocket
   */
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('[WebSocket] Already connected');
      return;
    }

    setIsConnecting(true);
    setError(null);
    isManualCloseRef.current = false;

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('[WebSocket] Connected');
        setIsConnected(true);
        setIsConnecting(false);
        setError(null);
        reconnectAttemptsRef.current = 0;

        // 发送订阅请求
        ws.send(JSON.stringify({
          type: 'SUBSCRIBE',
          channels: ['alerts', 'metrics'],
        }));

        onConnect?.();
      };

      ws.onmessage = handleMessage;

      ws.onclose = (event) => {
        console.log('[WebSocket] Disconnected:', event.code, event.reason);
        setIsConnected(false);
        setIsConnecting(false);
        wsRef.current = null;

        onDisconnect?.();

        // 自动重连
        if (!isManualCloseRef.current && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current += 1;
          console.log(`[WebSocket] Reconnecting... (${reconnectAttemptsRef.current}/${maxReconnectAttempts})`);
          
          reconnectTimerRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      };

      ws.onerror = (error) => {
        console.error('[WebSocket] Error:', error);
        setError(error);
        setIsConnecting(false);
        onError?.(error);
      };
    } catch (err) {
      console.error('[WebSocket] Failed to create connection:', err);
      setError(err);
      setIsConnecting(false);
    }
  }, [url, maxReconnectAttempts, reconnectInterval, handleMessage, onConnect, onDisconnect, onError]);

  /**
   * 断开 WebSocket 连接
   */
  const disconnect = useCallback(() => {
    isManualCloseRef.current = true;
    
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setIsConnected(false);
    setIsConnecting(false);
  }, []);

  /**
   * 发送消息
   */
  const send = useCallback((data) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
      return true;
    }
    console.warn('[WebSocket] Cannot send, connection not open');
    return false;
  }, []);

  /**
   * 清空本地告警缓存
   */
  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  // 自动连接
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    isConnecting,
    error,
    alerts,
    connect,
    disconnect,
    send,
    clearAlerts,
  };
}

/**
 * 简化版实时告警 Hook
 * 自动连接 WebSocket 并同步告警到全局 Store
 * 
 * 使用示例:
 * ```jsx
 * function MyComponent() {
 *   const { isConnected } = useRealtimeAlerts();
 *   const alerts = useDashboardStore(state => state.activeAlerts);
 *   // ...
 * }
 * ```
 */
export function useRealtimeAlerts(options = {}) {
  const { url, onAlert } = options;
  
  const wsResult = useWebSocket({
    url,
    autoConnect: true,
    onMessage: (data) => {
      if (data.type === 'ALERT' && onAlert) {
        onAlert(data.payload);
      }
    },
  });

  return wsResult;
}

export default useWebSocket;
