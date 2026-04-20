/**
 * Admin Dashboard — provider-backoffice-admin-web (#10)
 *
 * แสดง:
 *  - Stat cards 6 ใบ (operators/members/bets/amount/profit/open rounds)
 *  - กราฟ 7 วันย้อนหลัง (recharts BarChart — bet vs win vs profit)
 *  - ตาราง bets ล่าสุด 10 รายการ
 *
 * ข้อมูล: GET /admin/dashboard + GET /admin/bets?per_page=10 (ดู lib/api.ts)
 * Backend: lotto-provider-backoffice-api admin_dashboard.md
 */
'use client'

import { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { adminApi } from '@/lib/api'

// =============================================================================
// Types — data จาก backend
// =============================================================================

interface ChartPoint {
  date: string
  bet_amount: number
  win_amount: number
  profit: number
}

interface DashboardStats {
  total_operators: number
  active_operators: number
  total_members: number
  total_bets_today: number
  total_amount_today: number
  total_win_today: number
  profit_today: number
  open_rounds: number
  chart_7d: ChartPoint[]
}

interface BetRow {
  id: number
  member_id: number
  operator_id: number
  number: string
  amount: number
  rate: number
  win_amount: number
  status: string
  created_at: string
}

// =============================================================================
// Helpers
// =============================================================================

const fmtMoney = (n: number) =>
  `฿${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`

const statusColor: Record<string, string> = {
  pending: 'text-yellow-400',
  won: 'text-green-400',
  lost: 'text-red-400',
  cancelled: 'text-gray-500',
}

// =============================================================================
// Page
// =============================================================================

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [bets, setBets] = useState<BetRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    Promise.all([
      adminApi.dashboard(),
      adminApi.listBets({ per_page: 10, order: 'desc' }),
    ])
      .then(([dRes, bRes]) => {
        if (cancelled) return
        setStats(dRes.data?.data ?? dRes.data)
        setBets(bRes.data?.data?.items ?? bRes.data?.items ?? [])
      })
      .catch(err => {
        if (!cancelled) setError(err?.message ?? 'load failed')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const s = stats

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>

      {error && (
        <div className="mb-4 px-4 py-2 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatCard label="Operators ทั้งหมด" value={s?.total_operators ?? 0} color="blue" loading={loading} />
        <StatCard label="Operators Active" value={s?.active_operators ?? 0} color="green" loading={loading} />
        <StatCard label="สมาชิกทั้งหมด" value={s?.total_members ?? 0} color="cyan" loading={loading} />
        <StatCard label="Bets วันนี้" value={s?.total_bets_today ?? 0} color="purple" loading={loading} />
        <StatCard label="ยอดแทงวันนี้" value={fmtMoney(s?.total_amount_today ?? 0)} color="yellow" loading={loading} />
        <StatCard label="กำไรวันนี้" value={fmtMoney(s?.profit_today ?? 0)} color={(s?.profit_today ?? 0) >= 0 ? 'green' : 'red'} loading={loading} />
      </div>

      {/* Chart */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold">กราฟยอดแทง 7 วันย้อนหลัง</h2>
          <span className="text-xs text-gray-400">
            รอบที่เปิดอยู่: {s?.open_rounds ?? 0}
          </span>
        </div>

        <div style={{ width: '100%', height: 280 }}>
          {loading || !s ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              กำลังโหลด...
            </div>
          ) : (
            <ResponsiveContainer>
              <BarChart data={s.chart_7d}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="date"
                  stroke="#9ca3af"
                  tick={{ fontSize: 11 }}
                  tickFormatter={v => v?.slice(5)}
                />
                <YAxis
                  stroke="#9ca3af"
                  tick={{ fontSize: 11 }}
                  tickFormatter={v => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    background: '#111827',
                    border: '1px solid #374151',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(v) => fmtMoney(Number(v ?? 0))}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="bet_amount" fill="#3b82f6" name="ยอดแทง" />
                <Bar dataKey="win_amount" fill="#ef4444" name="ยอดชนะ" />
                <Bar dataKey="profit" fill="#10b981" name="กำไร" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent bets */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-white font-semibold mb-4">การแทงล่าสุด (10 รายการ)</h2>
        {loading ? (
          <div className="text-gray-500 text-sm">กำลังโหลด...</div>
        ) : bets.length === 0 ? (
          <div className="text-gray-500 text-sm">ยังไม่มีรายการ</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-700">
                  <th className="py-2 px-2">#</th>
                  <th className="py-2 px-2">Member</th>
                  <th className="py-2 px-2">Operator</th>
                  <th className="py-2 px-2">เลข</th>
                  <th className="py-2 px-2 text-right">ยอดแทง</th>
                  <th className="py-2 px-2 text-right">เรต</th>
                  <th className="py-2 px-2 text-right">ชนะ</th>
                  <th className="py-2 px-2">สถานะ</th>
                  <th className="py-2 px-2">เวลา</th>
                </tr>
              </thead>
              <tbody>
                {bets.map(b => (
                  <tr key={b.id} className="border-b border-gray-700/50 text-gray-200">
                    <td className="py-2 px-2 font-mono text-xs text-gray-500">{b.id}</td>
                    <td className="py-2 px-2">#{b.member_id}</td>
                    <td className="py-2 px-2">#{b.operator_id}</td>
                    <td className="py-2 px-2 font-mono">{b.number}</td>
                    <td className="py-2 px-2 text-right font-mono">{fmtMoney(b.amount)}</td>
                    <td className="py-2 px-2 text-right text-gray-400">{b.rate?.toFixed(0)}x</td>
                    <td className="py-2 px-2 text-right font-mono text-green-400">
                      {b.win_amount > 0 ? fmtMoney(b.win_amount) : '—'}
                    </td>
                    <td className={`py-2 px-2 font-medium ${statusColor[b.status] ?? 'text-gray-400'}`}>
                      {b.status}
                    </td>
                    <td className="py-2 px-2 text-xs text-gray-500">
                      {new Date(b.created_at).toLocaleString('th-TH', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// =============================================================================
// StatCard — gradient tile
// =============================================================================

function StatCard({
  label,
  value,
  color,
  loading,
}: {
  label: string
  value: string | number
  color: string
  loading?: boolean
}) {
  const colorMap: Record<string, string> = {
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400',
    green: 'from-green-500/20 to-green-600/10 border-green-500/30 text-green-400',
    purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400',
    yellow: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30 text-yellow-400',
    cyan: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 text-cyan-400',
    red: 'from-red-500/20 to-red-600/10 border-red-500/30 text-red-400',
  }
  const cls = colorMap[color] || colorMap.blue
  const valueTone = cls.split(' ').pop() ?? ''

  return (
    <div className={`bg-gradient-to-br ${cls} border rounded-xl p-4`}>
      <p className="text-gray-400 text-xs">{label}</p>
      <p className={`text-xl font-bold mt-1 ${valueTone}`}>
        {loading ? '...' : value}
      </p>
    </div>
  )
}
