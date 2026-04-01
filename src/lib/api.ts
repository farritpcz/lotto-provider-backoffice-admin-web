/**
 * API Client สำหรับ lotto-provider-backoffice-admin-web (#10)
 *
 * ความสัมพันธ์:
 * - เรียก API ของ: #9 lotto-provider-backoffice-api (port 9081, path /api/v1/admin/*)
 * - คล้ายกับ: standalone-admin-web (#6) — ต่างกันที่มีหน้า operators เพิ่ม
 * - ใช้ Admin JWT token
 */

import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios'

// ⭐ backoffice API port 9081, path /admin/*
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9081/api/v1/admin'

const createApiClient = (): AxiosInstance => {
  const client = axios.create({ baseURL: API_BASE_URL, timeout: 30000, headers: { 'Content-Type': 'application/json' } })
  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('provider_admin_token') : null
    if (token && config.headers) config.headers.Authorization = `Bearer ${token}`
    return config
  })
  client.interceptors.response.use(r => r, err => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('provider_admin_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  })
  return client
}

export const api = createApiClient()

// Provider Admin API — เหมือน standalone-admin (#6) + operators management
export const adminApi = {
  login: (data: { username: string; password: string }) => api.post('/auth/login', data),
  dashboard: () => api.get('/dashboard'),
  // ⭐ เพิ่มจาก standalone: จัดการ operators
  listOperators: (p?: Record<string, unknown>) => api.get('/operators', { params: p }),
  createOperator: (d: Record<string, unknown>) => api.post('/operators', d),
  getOperator: (id: number) => api.get(`/operators/${id}`),
  updateOperator: (id: number, d: Record<string, unknown>) => api.put(`/operators/${id}`, d),
  updateOperatorStatus: (id: number, s: string) => api.put(`/operators/${id}/status`, { status: s }),
  // เหมือน standalone-admin (#6)
  listMembers: (p?: Record<string, unknown>) => api.get('/members', { params: p }),
  listLotteries: () => api.get('/lotteries'),
  createLottery: (d: Record<string, unknown>) => api.post('/lotteries', d),
  listRounds: (p?: Record<string, unknown>) => api.get('/rounds', { params: p }),
  submitResult: (roundId: number, d: Record<string, unknown>) => api.post(`/results/${roundId}`, d),
  listBans: (p?: Record<string, unknown>) => api.get('/bans', { params: p }),
  createBan: (d: Record<string, unknown>) => api.post('/bans', d),
  deleteBan: (id: number) => api.delete(`/bans/${id}`),
  listRates: (p?: Record<string, unknown>) => api.get('/rates', { params: p }),
  listBets: (p?: Record<string, unknown>) => api.get('/bets', { params: p }),
  reportSummary: (p?: Record<string, unknown>) => api.get('/reports/summary', { params: p }),
  reportProfit: (p?: Record<string, unknown>) => api.get('/reports/profit', { params: p }),
  reportByOperator: (p?: Record<string, unknown>) => api.get('/reports/by-operator', { params: p }),
  getSettings: () => api.get('/settings'),
  updateSettings: (d: Record<string, unknown>) => api.put('/settings', d),
}

// =============================================================================
// Aliases — ชื่อเดียวกับ standalone-admin-web (#6) เพื่อ share pages ได้
// =============================================================================
export const adminAuthApi = {
  login: (data: { username: string; password: string }) => api.post('/auth/login', data),
}
export const dashboardApi = { getStats: () => api.get('/dashboard') }
export const memberMgmtApi = {
  list: (p?: Record<string, unknown>) => api.get('/members', { params: p }),
  get: (id: number) => api.get(`/members/${id}`),
  update: (id: number, d: Record<string, unknown>) => api.put(`/members/${id}`, d),
  updateStatus: (id: number, s: string) => api.put(`/members/${id}/status`, { status: s }),
}
export const lotteryMgmtApi = {
  list: () => api.get('/lotteries'),
  create: (d: Record<string, unknown>) => api.post('/lotteries', d),
  update: (id: number, d: Record<string, unknown>) => api.put(`/lotteries/${id}`, d),
}
export const roundMgmtApi = {
  list: (p?: Record<string, unknown>) => api.get('/rounds', { params: p }),
  create: (d: Record<string, unknown>) => api.post('/rounds', d),
  updateStatus: (id: number, s: string) => api.put(`/rounds/${id}/status`, { status: s }),
}
export const betMgmtApi = {
  list: (p?: Record<string, unknown>) => api.get('/bets', { params: p }),
}
export const txMgmtApi = {
  list: (p?: Record<string, unknown>) => api.get('/transactions', { params: p }),
}
export const resultMgmtApi = {
  list: (p?: Record<string, unknown>) => api.get('/results', { params: p }),
  submit: (roundId: number, d: Record<string, unknown>) => api.post(`/results/${roundId}`, d),
}
export const banMgmtApi = {
  list: (p?: Record<string, unknown>) => api.get('/bans', { params: p }),
  create: (d: Record<string, unknown>) => api.post('/bans', d),
  delete: (id: number) => api.delete(`/bans/${id}`),
}
export const rateMgmtApi = {
  list: (p?: Record<string, unknown>) => api.get('/rates', { params: p }),
  update: (id: number, d: Record<string, unknown>) => api.put(`/rates/${id}`, d),
}
export const reportApi = {
  summary: (p?: Record<string, unknown>) => api.get('/reports/summary', { params: p }),
  profit: (p?: Record<string, unknown>) => api.get('/reports/profit', { params: p }),
}
export const settingApi = {
  get: () => api.get('/settings'),
  update: (d: Record<string, unknown>) => api.put('/settings', d),
}
