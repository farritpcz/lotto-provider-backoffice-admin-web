/**
 * Provider Admin — จัดการ Operators
 * ⭐ ไม่มีใน standalone — เฉพาะ provider mode
 * CRUD operators + สร้าง API Key/Secret อัตโนมัติ
 */
'use client'
import { useEffect, useState } from 'react'
import { adminApi } from '@/lib/api'

interface Operator {
  id: number; name: string; code: string; api_key: string; wallet_type: string;
  callback_url: string; status: string; created_at: string;
}

export default function OperatorsPage() {
  const [operators, setOperators] = useState<Operator[]>([])
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [walletType, setWalletType] = useState('seamless')
  const [message, setMessage] = useState('')
  const [newKeys, setNewKeys] = useState<{ api_key: string; secret_key: string } | null>(null)

  const load = () => { adminApi.listOperators().then(res => setOperators(res.data.data?.items || res.data.data || [])) }
  useEffect(load, [])

  const handleCreate = async () => {
    if (!name || !code) return
    try {
      const res = await adminApi.createOperator({ name, code, wallet_type: walletType, username: code.toLowerCase(), password: 'changeme123' })
      const op = res.data.data
      setNewKeys({ api_key: op.api_key, secret_key: op.secret_key || '***created***' })
      setMessage(`✅ สร้าง operator "${name}" สำเร็จ`)
      setShowForm(false); setName(''); setCode(''); load()
    } catch { setMessage('❌ สร้างไม่สำเร็จ') }
  }

  const toggleStatus = async (id: number, current: string) => {
    await adminApi.updateOperatorStatus(id, current === 'active' ? 'suspended' : 'active')
    load()
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">จัดการ Operators</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
          + สร้าง Operator
        </button>
      </div>

      {message && <div className="bg-green-900/30 text-green-400 px-4 py-2 rounded-lg mb-4 text-sm">{message}</div>}

      {newKeys && (
        <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-xl p-4 mb-4">
          <h3 className="text-yellow-400 font-semibold mb-2">⚠️ บันทึก Keys นี้ไว้ — จะแสดงครั้งเดียว</h3>
          <div className="bg-gray-900 rounded p-3 font-mono text-sm">
            <div className="text-gray-400">API Key: <span className="text-white">{newKeys.api_key}</span></div>
            <div className="text-gray-400">Secret: <span className="text-white">{newKeys.secret_key}</span></div>
          </div>
          <button onClick={() => setNewKeys(null)} className="mt-2 text-yellow-400 text-sm">ปิด</button>
        </div>
      )}

      {showForm && (
        <div className="bg-gray-800 rounded-xl p-5 mb-6 space-y-3">
          <input placeholder="ชื่อ Operator" value={name} onChange={e => setName(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2" />
          <input placeholder="Code (เช่น WINNER88)" value={code} onChange={e => setCode(e.target.value.toUpperCase())}
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2" />
          <select value={walletType} onChange={e => setWalletType(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2">
            <option value="seamless">Seamless Wallet</option>
            <option value="transfer">Transfer Wallet</option>
          </select>
          <button onClick={handleCreate} className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold">สร้าง</button>
        </div>
      )}

      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-700/50 text-gray-400">
            <tr>
              <th className="px-4 py-3 text-left">Operator</th>
              <th className="px-4 py-3 text-left">API Key</th>
              <th className="px-4 py-3 text-center">Wallet</th>
              <th className="px-4 py-3 text-center">สถานะ</th>
              <th className="px-4 py-3 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {operators.map(op => (
              <tr key={op.id} className="border-t border-gray-700/50">
                <td className="px-4 py-3">
                  <div className="text-white font-semibold">{op.name}</div>
                  <div className="text-gray-500 text-xs">{op.code}</div>
                </td>
                <td className="px-4 py-3 text-gray-400 font-mono text-xs">{op.api_key?.slice(0, 16)}...</td>
                <td className="px-4 py-3 text-center text-gray-300 text-xs">{op.wallet_type}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-1 rounded text-xs ${op.status === 'active' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>{op.status}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => toggleStatus(op.id, op.status)}
                    className={`text-xs px-3 py-1 rounded ${op.status === 'active' ? 'bg-red-600/20 text-red-400' : 'bg-green-600/20 text-green-400'}`}>
                    {op.status === 'active' ? 'ระงับ' : 'เปิดใช้'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
