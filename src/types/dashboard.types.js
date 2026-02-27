/**
 * Dashboard 数据类型定义
 * 后端接口对接规范 - TypeScript/JSDoc 类型定义
 * 
 * 本文档定义了 P0/P1/P2/P3 四大视图的数据结构标准
 * 后端开发请参考此文件实现对应的聚合接口
 */

// ============================================
// 通用类型
// ============================================

/**
 * API 统一响应格式
 * @typedef {Object} ApiResponse
 * @property {number} code - 业务状态码 (200=成功)
 * @property {string} message - 状态描述
 * @property {T} data - 响应数据
 * @property {string} requestId - 请求追踪ID
 * @property {number} timestamp - 响应时间戳
 * @template T
 */

/**
 * 地理位置坐标
 * @typedef {[number, number]} Coordinate - [经度, 纬度]
 */

/**
 * 告警级别
 * @typedef {'high' | 'medium' | 'low' | 'info'} AlertLevel
 */

/**
 * 网络状态
 * @typedef {'excellent' | 'good' | 'normal' | 'poor'} NetworkStatus
 */

// ============================================
// P0 - 宏观溯源视图
// ============================================

/**
 * 迁徙数据项
 * @typedef {Object} MigrationItem
 * @property {string} from - 出发地
 * @property {string} to - 目的地
 * @property {number} value - 人数
 */

/**
 * 迁徙数据
 * @typedef {Object} MigrationData
 * @property {MigrationItem[]} national - 全国迁徙数据
 * @property {MigrationItem[]} jiangsu - 省内迁徙数据
 */

/**
 * 文旅引流指数
 * @typedef {Object} TourismIndex
 * @property {number} current - 当前指数
 * @property {string} unit - 单位
 * @property {string} growth - 增长率 (+/-百分比)
 * @property {number} baseline - 平日基准值
 * @property {string} updateTime - 更新时间 (ISO 8601)
 */

/**
 * 交通枢纽压力数据
 * @typedef {Object} TransportData
 * @property {string} name - 枢纽名称
 * @property {'metro' | 'railway' | 'airport' | 'bus'} type - 枢纽类型
 * @property {number} pressure - 压力指数
 * @property {string} today - 今日客流量
 * @property {string} normal - 平日客流量
 * @property {'high' | 'medium' | 'low'} status - 压力状态
 */

/**
 * 文旅热点数据
 * @typedef {Object} HotSpot
 * @property {string} name - 景点名称
 * @property {string} visitors - 游客数量
 * @property {string} growth - 增长率
 * @property {number} rank - 排名
 */

/**
 * 文旅分析数据
 * @typedef {Object} TourismAnalysis
 * @property {string} totalVisitors - 总游客数
 * @property {number} avgStayDuration - 平均停留时长(小时)
 * @property {HotSpot[]} hotSpots - 热门打卡点 TOP5
 */

/**
 * P0 视图完整数据
 * @typedef {Object} P0ViewData
 * @property {MigrationData} migration - 迁徙数据
 * @property {TourismIndex} tourismIndex - 文旅指数
 * @property {TransportData[]} transport - 交通枢纽压力
 * @property {TourismAnalysis} tourismAnalysis - 文旅分析
 */

// ============================================
// P1 - 全局态势视图
// ============================================

/**
 * 5G-A 资源统计
 * @typedef {Object} ResourceStats
 * @property {{total: number, online: number, offline: number}} stations - 基站统计
 * @property {{total: number, online: number, offline: number}} smartBoards - 智能板统计
 * @property {{total: number, active: number}} carriers3CC - 3CC载波统计
 * @property {{total: number, deployed: number}} emergencyCars - 应急车统计
 */

/**
 * PRB 负荷数据
 * @typedef {Object} PRBLoad
 * @property {number} current - 当前负荷百分比
 * @property {number[]} history - 历史数据(过去N个时间点)
 * @property {number} threshold - 告警阈值
 * @property {'normal' | 'warning' | 'danger'} status - 状态
 */

/**
 * 基站点位
 * @typedef {Object} BaseStation
 * @property {string} id - 站点ID
 * @property {string} name - 站点名称
 * @property {number} lng - 经度
 * @property {number} lat - 纬度
 * @property {'main' | 'sub'} type - 站点类型
 * @property {'online' | 'offline' | 'warning'} status - 运行状态
 * @property {number} [height] - 3D高度(米)
 * @property {Object} [metrics] - 实时指标(可选)
 * @property {number} [metrics.rsrp]
 * @property {number} [metrics.sinr]
 * @property {number} [metrics.load]
 */

/**
 * 智能板位置
 * @typedef {Object} BoardLocation
 * @property {string} id - 智能板ID
 * @property {string} name - 名称
 * @property {number} lng - 经度
 * @property {number} lat - 纬度
 * @property {'online' | 'offline'} status - 状态
 */

/**
 * 应急车位置
 * @typedef {Object} EmergencyVehicle
 * @property {string} id - 车辆ID
 * @property {string} name - 名称
 * @property {number} lng - 经度
 * @property {number} lat - 纬度
 * @property {'standby' | 'deployed' | 'maintenance'} status - 状态
 */

/**
 * 监控区域(防御圈)
 * @typedef {Object} DefenseZone
 * @property {string} id - 区域ID
 * @property {string} name - 区域名称
 * @property {'core' | 'commercial' | 'transit' | 'checkpoint'} type - 区域类型
 * @property {number} height - 3D高度
 * @property {string} color - 颜色值(rgba)
 * @property {Coordinate[]} [coordinates] - 边界坐标(可选)
 */

/**
 * 人流动线
 * @typedef {Object} FlowData
 * @property {string} id - 流动ID
 * @property {string} from - 起点
 * @property {string} to - 终点
 * @property {number} volume - 流量
 * @property {'enter' | 'exit'} type - 类型(进场/散场)
 * @property {Coordinate[]} path - 路径坐标数组
 * @property {string} [time] - 时间段
 */

/**
 * KQI 指标项
 * @typedef {Object} KQIItem
 * @property {string} label - 指标名称
 * @property {string} value - 当前值
 * @property {string} unit - 单位
 * @property {string} trend - 变化趋势 (+/-百分比)
 * @property {number[]} trendData - 趋势图数据
 * @property {boolean} isHigherBetter - 是否越大越好(影响颜色)
 */

/**
 * 运维日志项
 * @typedef {Object} OpLog
 * @property {string} time - 时间 (HH:mm:ss)
 * @property {'success' | 'info' | 'warn' | 'alert' | 'ai'} type - 日志类型
 * @property {string} content - 日志内容
 */

/**
 * P1 全局态势数据
 * @typedef {Object} P1GlobalData
 * @property {ResourceStats} resources - 资源统计
 * @property {PRBLoad} prbLoad - PRB负荷
 * @property {BaseStation[]} baseStations - 基站点位
 * @property {BoardLocation[]} boardLocations - 智能板位置
 * @property {EmergencyVehicle[]} emergencyVehicles - 应急车位置
 * @property {DefenseZone[]} defenseZones - 监控区域
 * @property {string} updateTime - 更新时间
 */

/**
 * P1 视图完整数据
 * @typedef {Object} P1ViewData
 * @property {P1GlobalData} global - 全局数据
 * @property {KQIItem[]} kqi - KQI指标
 * @property {FlowData[]} flow - 人流动线
 * @property {OpLog[]} opLogs - 运维日志
 */

// ============================================
// P2 - 场内微观视图
// ============================================

/**
 * 场馆概况
 * @typedef {Object} VenueOverview
 * @property {number} totalCapacity - 总容量
 * @property {number} currentAttendance - 当前人数
 * @property {number} vipCount - VIP人数
 * @property {NetworkStatus} networkStatus - 网络状态
 */

/**
 * 用户分层
 * @typedef {Object} UserLayer
 * @property {string} label - 层级名称
 * @property {number} value - 人数
 * @property {string} color - 颜色
 * @property {number} percentage - 占比
 */

/**
 * 容量评估
 * @typedef {Object} CapacityAssessment
 * @property {number} currentUsage - 当前使用率
 * @property {number} predictedPeak - 预测峰值
 * @property {'green' | 'yellow' | 'red'} status - 状态
 * @property {number[]} prediction - 预测趋势数据
 */

/**
 * 终端信息
 * @typedef {Object} TerminalInfo
 * @property {number} rank - 排名
 * @property {string} brand - 品牌
 * @property {string} model - 型号
 * @property {number} users - 用户数
 * @property {boolean} is5GA - 是否支持5G-A
 */

/**
 * 终端分析
 * @typedef {Object} TerminalAnalysis
 * @property {number} ueLogoSupportRate - UE Logo支持率
 * @property {TerminalInfo[]} topTerminals - TOP终端排行
 */

/**
 * 体验对比指标
 * @typedef {Object} ExperienceMetrics
 * @property {number} download - 下行速率(Mbps)
 * @property {number} upload - 上行速率(Mbps)
 * @property {number} videoHd - 视频高清率(%)
 * @property {number} liveHd - 直播高清率(%)
 * @property {number} latency - 时延(ms)
 */

/**
 * App KQI
 * @typedef {Object} AppKQI
 * @property {string} name - App名称
 * @property {string} metric - 指标值
 * @property {string} label - 指标标签
 * @property {'good' | 'normal' | 'poor'} status - 状态
 * @property {string} icon - 图标emoji
 */

/**
 * 区域热点
 * @typedef {Object} Hotspot
 * @property {string} id - 热点ID
 * @property {string} name - 名称
 * @property {{top: string, left: string}} position - 位置(百分比)
 * @property {'red' | 'cyan' | 'green'} color - 颜色
 * @property {boolean} isAlert - 是否告警
 * @property {boolean} [hasVideo] - 是否有视频
 */

/**
 * P2 视图完整数据
 * @typedef {Object} P2ViewData
 * @property {VenueOverview} overview - 场馆概况
 * @property {UserLayer[]} userLayers - 用户分层
 * @property {CapacityAssessment} capacityAssessment - 容量评估
 * @property {TerminalAnalysis} terminalAnalysis - 终端分析
 * @property {Object} experienceCompare - 体验对比
 * @property {ExperienceMetrics} experienceCompare.vip - VIP体验
 * @property {ExperienceMetrics} experienceCompare.normal - 普通用户体验
 * @property {AppKQI[]} appKQI - App KQI
 * @property {Hotspot[]} hotspots - 区域热点
 */

// ============================================
// P3 - 评估闭环视图
// ============================================

/**
 * 比赛信息
 * @typedef {Object} MatchInfo
 * @property {string} date - 日期
 * @property {string} home - 主队
 * @property {string} away - 客队
 * @property {string} score - 比分
 * @property {string} venue - 场馆
 */

/**
 * 核心指标
 * @typedef {Object} CoreMetrics
 * @property {number} peakAttendance - 峰值人数
 * @property {number} peakTraffic - 峰值流量(TB)
 * @property {number} packages5GA - 5G-A套餐销量
 */

/**
 * VIP指标
 * @typedef {Object} VIPMetrics
 * @property {number} diamondUsers - 钻白卡用户数
 * @property {number} packagesSold - 套餐销量
 */

/**
 * 上行流量数据点
 * @typedef {Object} UplinkDataPoint
 * @property {string} time - 时间 (HH:mm)
 * @property {number} value - 流量值(Gbps)
 * @property {boolean} [isPeak] - 是否峰值点
 */

/**
 * 智能体贡献项
 * @typedef {Object} AgentContribution
 * @property {string} label - 贡献类型
 * @property {string} value - 数值
 * @property {string} desc - 描述
 * @property {string} trend - 趋势
 * @property {'optimization' | 'prevention' | 'vip' | 'resource'} type - 类型
 */

/**
 * 优化建议
 * @typedef {Object} Suggestion
 * @property {number} id - ID
 * @property {string} title - 标题
 * @property {string} desc - 描述
 * @property {'high' | 'medium' | 'low'} priority - 优先级
 */

/**
 * P3 视图完整数据
 * @typedef {Object} P3ViewData
 * @property {MatchInfo} match - 比赛信息
 * @property {CoreMetrics} coreMetrics - 核心指标
 * @property {VIPMetrics} vipMetrics - VIP指标
 * @property {UplinkDataPoint[]} uplinkTrend - 上行流量趋势
 * @property {AgentContribution[]} agentContributions - 智能体贡献
 * @property {Suggestion[]} suggestions - 优化建议
 * @property {'S' | 'A' | 'B' | 'C'} assuranceLevel - 保障评级
 */

// ============================================
// 告警与实时数据
// ============================================

/**
 * 告警项
 * @typedef {Object} Alert
 * @property {number} id - 告警ID
 * @property {AlertLevel} level - 告警级别
 * @property {string} title - 标题
 * @property {string} time - 相对时间描述
 * @property {number} timestamp - 时间戳
 * @property {string} area - 区域
 * @property {string} detail - 详情
 * @property {boolean} [read] - 是否已读
 */

/**
 * 时间轴数据
 * @typedef {Object} TimelineData
 * @property {string[]} timeSlots - 时间点数组
 * @property {Object} metrics - 指标数据
 * @property {number[]} metrics.crowd - 人流数据
 * @property {number[]} metrics.traffic - 流量数据
 * @property {number[]} metrics.fiveGA - 5G-A流量数据
 */

/**
 * WebSocket 消息格式
 * @typedef {Object} WSMessage
 * @property {'ALERT' | 'ALERT_UPDATE' | 'ALERT_CLEAR' | 'METRICS_UPDATE' | 'PING'} type - 消息类型
 * @property {Alert|Object} payload - 消息数据
 * @property {number} timestamp - 时间戳
 */

// ============================================
// 导出类型（用于 TypeScript 项目）
// ============================================

/**
 * 视图类型
 * @typedef {'p0' | 'p1' | 'p2' | 'p3'} ViewType
 */

/**
 * 指标类型
 * @typedef {'crowd' | 'traffic' | 'fiveGA'} MetricType
 */

/**
 * Dashboard Store 状态
 * @typedef {Object} DashboardState
 * @property {ViewType} currentView - 当前视图
 * @property {string} currentTime - 当前时间
 * @property {boolean} isTimelinePlaying - 播放状态
 * @property {MetricType} selectedMetric - 选中指标
 * @property {Object} loading - 加载状态
 * @property {Object} errors - 错误状态
 * @property {Object} p0Data - P0数据
 * @property {Object} p1Data - P1数据
 * @property {Object} p2Data - P2数据
 * @property {Object} p3Data - P3数据
 * @property {Alert[]} activeAlerts - 活跃告警
 * @property {number} unreadAlertCount - 未读告警数
 */

// 空导出，使文件成为 ES 模块
export {};
