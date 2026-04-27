// src/components/wallet/WalletBalance.jsx
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react'

export default function WalletBalance({ wallet }) {
  const balance = wallet?.balance ? parseFloat(wallet.balance) : 0
  const currency = wallet?.currency || 'KES'

  // Parse base64 encoded data
  const parseBase64 = (str) => {
    try {
      return JSON.parse(atob(str))
    } catch {
      return null
    }
  }

  // ✅ FIX: Safely parse transaction history with null/undefined check
  let transactionHistory = []
  if (wallet?.transaction_history) {
    const parsed = parseBase64(wallet.transaction_history)
    transactionHistory = Array.isArray(parsed) ? parsed : []
  }
  
  // Calculate totals from transaction history
  let totalCredit = 0  // Money earned (deposits)
  let totalDebit = 0   // Money spent/withdrawn
  let pendingAmount = 0

  // ✅ Safe to use forEach now - transactionHistory is always an array
  transactionHistory.forEach((txn) => {
    const amount = typeof txn.amount === 'string' ? parseFloat(txn.amount) : txn.amount
    const type = txn.transType || txn.type || ''

    // Count credits (earnings)
    if (type.toLowerCase() === 'credit' || type.toLowerCase() === 'deposit') {
      totalCredit += Math.abs(amount)
    }

    // Count debits (withdrawals)
    if (type.toLowerCase() === 'debit' || type.toLowerCase() === 'withdrawal' || amount < 0) {
      totalDebit += Math.abs(amount)
    }
  })

  // ✅ Safely parse recent payouts with null/undefined check
  let recentPayouts = []
  if (wallet?.recent_payouts) {
    const parsed = parseBase64(wallet.recent_payouts)
    recentPayouts = Array.isArray(parsed) ? parsed : []
  }
  
  const pendingPayouts = recentPayouts.filter(p => p.status === 'pending').reduce((sum, p) => sum + (p.amount || 0), 0)

  // Total earned = all credits
  const totalEarned = totalCredit

  // Total withdrawn = all debits
  const totalWithdrawn = totalDebit

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Current Balance */}
      <div className="card p-6 border-l-4" style={{ borderColor: '#137FEC' }}>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Available Balance</span>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#137FEC,#13B6EC)' }}>
            <DollarSign size={18} className="text-white" />
          </div>
        </div>
        <p className="text-3xl font-black text-slate-900 m-0">
          {currency} {balance.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <p className="text-xs text-slate-400 m-0 mt-2">Current wallet balance</p>
      </div>

      {/* Total Earned */}
      <div className="card p-6 border-l-4" style={{ borderColor: '#10B981' }}>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Earned</span>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-100">
            <TrendingUp size={18} className="text-emerald-600" />
          </div>
        </div>
        <p className="text-3xl font-black text-slate-900 m-0">
          {currency} {totalEarned.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <p className="text-xs text-slate-400 m-0 mt-2">From consultations & deposits</p>
      </div>

      {/* Total Withdrawn */}
      <div className="card p-6 border-l-4" style={{ borderColor: '#F59E0B' }}>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Withdrawn</span>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-100">
            <TrendingDown size={18} className="text-amber-600" />
          </div>
        </div>
        <p className="text-3xl font-black text-slate-900 m-0">
          {currency} {totalWithdrawn.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <p className="text-xs text-slate-400 m-0 mt-2">All withdrawals & payouts</p>
      </div>

      {/* Pending Payouts */}
      <div className="card p-6 border-l-4" style={{ borderColor: '#EF4444' }}>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending</span>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-100">
            <DollarSign size={18} className="text-red-600" />
          </div>
        </div>
        <p className="text-3xl font-black text-slate-900 m-0">
          {currency} {pendingPayouts.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <p className="text-xs text-slate-400 m-0 mt-2">Awaiting processing</p>
      </div>
    </div>
  )
}