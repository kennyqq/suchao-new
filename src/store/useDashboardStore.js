/**
 * Dashboard 全局状态管理
 * 使用 Zustand 实现
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import {
  fetchP0MigrationData,
  fetchP0TourismIndex,
  fetchP0TransportData,
  fetchP0TourismAnalysis,
  fetchP1GlobalData,
  fetchP1KQI,
  fetchP1FlowData,
  fetchP1OpLogs,
  fetchP2VenueData,
  fetchP3EvaluationData,
  fetchAlerts,
  fetchTimelineData,
} from '../api/services/dashboard.js';

/**
 * Dashboard Store
 * 包含所有视图的核心状态和数据获取逻辑
 */
const useDashboardStore = create(
  devtools(
    persist(
      (set, get) => ({
        // ============================================
        // 全局状态
        // ============================================
        
        /** 当前视图模式: 'p0' | 'p1' | 'p2' | 'p3' */
        currentView: 'p0',
        
        /** 当前时间轴时间 (HH:mm) */
        currentTime: '20:00',
        
        /** 时间轴播放状态 */
        isTimelinePlaying: false,
        
        /** 当前选中的指标: 'crowd' | 'traffic' | 'fiveGA' */
        selectedMetric: 'crowd',
        
        /** 选中的日期 */
        selectedDate: null,
        
        /** 加载状态 */
        loading: {
          p0: false,
          p1: false,
          p2: false,
          p3: false,
          alerts: false,
        },
        
        /** 错误状态 */
        errors: {
          p0: null,
          p1: null,
          p2: null,
          p3: null,
          alerts: null,
        },

        // ============================================
        // P0 - 宏观溯源数据
        // ============================================
        p0Data: {
          migration: null,
          tourismIndex: null,
          transport: null,
          tourismAnalysis: null,
        },

        // ============================================
        // P1 - 全局态势数据
        // ============================================
        p1Data: {
          global: null,
          kqi: null,
          flow: null,
          opLogs: null,
        },

        // ============================================
        // P2 - 场内微观数据
        // ============================================
        p2Data: {
          venue: null,
        },

        // ============================================
        // P3 - 评估闭环数据
        // ============================================
        p3Data: {
          evaluation: null,
        },

        // ============================================
        // 实时告警数据
        // ============================================
        /** 告警列表 */
        activeAlerts: [],
        /** 未读告警数量 */
        unreadAlertCount: 0,
        /** 选中的告警 */
        selectedAlert: null,

        // ============================================
        // 时间轴数据
        // ============================================
        timelineData: {
          timeSlots: [],
          metrics: {
            crowd: [],
            traffic: [],
            fiveGA: [],
          },
        },

        // ============================================
        // Actions - 状态变更
        // ============================================

        /** 设置当前视图 */
        setCurrentView: (view) => set({ currentView: view }),

        /** 设置当前时间 */
        setCurrentTime: (time) => set({ currentTime: time }),

        /** 设置播放状态 */
        setIsTimelinePlaying: (playing) => set({ isTimelinePlaying: playing }),

        /** 设置选中指标 */
        setSelectedMetric: (metric) => set({ selectedMetric: metric }),

        /** 设置选中日期 */
        setSelectedDate: (date) => set({ selectedDate: date }),

        /** 设置选中告警 */
        setSelectedAlert: (alert) => set({ selectedAlert: alert }),

        /** 标记告警为已读 */
        markAlertAsRead: (alertId) => {
          set((state) => ({
            activeAlerts: state.activeAlerts.map((alert) =>
              alert.id === alertId ? { ...alert, read: true } : alert
            ),
            unreadAlertCount: Math.max(0, state.unreadAlertCount - 1),
          }));
        },

        /** 清除所有告警 */
        clearAllAlerts: () => {
          set({ activeAlerts: [], unreadAlertCount: 0 });
        },

        /** 添加实时告警（WebSocket 推送） */
        addRealtimeAlert: (alert) => {
          set((state) => ({
            activeAlerts: [alert, ...state.activeAlerts].slice(0, 100), // 最多保留100条
            unreadAlertCount: state.unreadAlertCount + 1,
          }));
        },

        // ============================================
        // Async Actions - 数据获取
        // ============================================

        /** 获取 P0 数据 */
        fetchP0Data: async () => {
          set((state) => ({
            loading: { ...state.loading, p0: true },
            errors: { ...state.errors, p0: null },
          }));

          try {
            const [migration, tourismIndex, transport, tourismAnalysis] = await Promise.all([
              fetchP0MigrationData(),
              fetchP0TourismIndex(),
              fetchP0TransportData(),
              fetchP0TourismAnalysis(),
            ]);

            set({
              p0Data: { migration, tourismIndex, transport, tourismAnalysis },
              loading: (state) => ({ ...state.loading, p0: false }),
            });
          } catch (error) {
            set((state) => ({
              loading: { ...state.loading, p0: false },
              errors: { ...state.errors, p0: error.message },
            }));
          }
        },

        /** 获取 P1 数据 */
        fetchP1Data: async () => {
          set((state) => ({
            loading: { ...state.loading, p1: true },
            errors: { ...state.errors, p1: null },
          }));

          try {
            const [global, kqi, opLogs] = await Promise.all([
              fetchP1GlobalData(),
              fetchP1KQI(),
              fetchP1OpLogs(),
            ]);

            set({
              p1Data: { ...get().p1Data, global, kqi, opLogs },
              loading: (state) => ({ ...state.loading, p1: false }),
            });
          } catch (error) {
            set((state) => ({
              loading: { ...state.loading, p1: false },
              errors: { ...state.errors, p1: error.message },
            }));
          }
        },

        /** 获取 P1 人流数据（时间敏感） */
        fetchP1FlowData: async (time) => {
          const currentTime = time || get().currentTime;
          try {
            const flow = await fetchP1FlowData(currentTime);
            set((state) => ({
              p1Data: { ...state.p1Data, flow },
            }));
          } catch (error) {
            console.error('Failed to fetch flow data:', error);
          }
        },

        /** 获取 P2 数据 */
        fetchP2Data: async () => {
          set((state) => ({
            loading: { ...state.loading, p2: true },
            errors: { ...state.errors, p2: null },
          }));

          try {
            const venue = await fetchP2VenueData();
            set({
              p2Data: { venue },
              loading: (state) => ({ ...state.loading, p2: false }),
            });
          } catch (error) {
            set((state) => ({
              loading: { ...state.loading, p2: false },
              errors: { ...state.errors, p2: error.message },
            }));
          }
        },

        /** 获取 P3 数据 */
        fetchP3Data: async () => {
          set((state) => ({
            loading: { ...state.loading, p3: true },
            errors: { ...state.errors, p3: null },
          }));

          try {
            const evaluation = await fetchP3EvaluationData();
            set({
              p3Data: { evaluation },
              loading: (state) => ({ ...state.loading, p3: false }),
            });
          } catch (error) {
            set((state) => ({
              loading: { ...state.loading, p3: false },
              errors: { ...state.errors, p3: error.message },
            }));
          }
        },

        /** 获取告警数据 */
        fetchAlerts: async () => {
          set((state) => ({
            loading: { ...state.loading, alerts: true },
            errors: { ...state.errors, alerts: null },
          }));

          try {
            const alerts = await fetchAlerts();
            set({
              activeAlerts: alerts,
              unreadAlertCount: alerts.filter((a) => !a.read && a.level !== 'info').length,
              loading: (state) => ({ ...state.loading, alerts: false }),
            });
          } catch (error) {
            set((state) => ({
              loading: { ...state.loading, alerts: false },
              errors: { ...state.errors, alerts: error.message },
            }));
          }
        },

        /** 获取时间轴数据 */
        fetchTimelineData: async () => {
          try {
            const data = await fetchTimelineData();
            set({ timelineData: data });
          } catch (error) {
            console.error('Failed to fetch timeline data:', error);
          }
        },

        /** 初始化所有数据 */
        initDashboard: async () => {
          const { currentView } = get();
          
          // 加载当前视图数据
          switch (currentView) {
            case 'p0':
              await get().fetchP0Data();
              break;
            case 'p1':
              await get().fetchP1Data();
              await get().fetchP1FlowData();
              break;
            case 'p2':
              await get().fetchP2Data();
              break;
            case 'p3':
              await get().fetchP3Data();
              break;
          }

          // 加载公共数据
          await Promise.all([
            get().fetchAlerts(),
            get().fetchTimelineData(),
          ]);
        },

        /** 刷新当前视图数据 */
        refreshCurrentView: async () => {
          const { currentView } = get();
          switch (currentView) {
            case 'p0':
              return get().fetchP0Data();
            case 'p1':
              return Promise.all([get().fetchP1Data(), get().fetchP1FlowData()]);
            case 'p2':
              return get().fetchP2Data();
            case 'p3':
              return get().fetchP3Data();
          }
        },
      }),
      {
        name: 'dashboard-storage',
        partialize: (state) => ({
          currentView: state.currentView,
          selectedMetric: state.selectedMetric,
        }),
      }
    ),
    { name: 'DashboardStore' }
  )
);

export default useDashboardStore;
