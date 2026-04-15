// src/components/wallet/TransactionHistory.jsx
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const STATUS_COLORS = {
  completed: 'text-emerald-600',
  pending: 'text-amber-600',
  failed: 'text-red-600',
}

const TYPE_COLORS = {
  credit: 'text-emerald-600',
  debit: 'text-red-600',
  deposit: 'text-blue-600',
  withdrawal: 'text-amber-600',
  payment_sent: 'text-red-600',
  payment_to_provider: 'text-orange-600',
}

export default function TransactionHistory({ wallet }) {
  const [expandedId, setExpandedId] = useState(null)

  // Parse base64 encoded transaction history
  const parseBase64 = (str) => {
    try {
      return JSON.parse(atob(str))
    } catch {
      return []
    }
  }

  const transactions = wallet?.transaction_history ? parseBase64(wallet.transaction_history) : []

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    return new Date(dateStr).toLocaleDateString('en-KE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const formatTime = (dateStr) => {
    if (!dateStr) return 'N/A'
    return new Date(dateStr).toLocaleTimeString('en-KE', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getTransactionType = (txn) => {
    return txn.transType || txn.type || 'Unknown'
  }

  const getTransactionAmount = (txn) => {
    return typeof txn.amount === 'string' ? parseFloat(txn.amount) : txn.amount
  }

  return (
    <div className="card overflow-hidden p-0">
      <div className="px-6 py-5 border-b border-slate-100">
        <h3 className="text-lg font-black text-slate-900 m-0">Transaction History</h3>
      </div>

      {transactions.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-slate-400 m-0">No transactions yet</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {transactions.map((txn, i) => {
            const isExpanded = expandedId === i
            const type = getTransactionType(txn)
            const amount = getTransactionAmount(txn)
            const date = txn.date || txn.created_at || ''

            return (
              <div key={i} className="hover:bg-slate-50/50 transition-colors">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : i)}
                  className="w-full px-6 py-4 flex items-center justify-between gap-4 border-none bg-transparent cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 m-0 capitalize">
                      {type.replace(/_/g, ' ')}
                    </p>
                    <p className="text-xs text-slate-400 m-0 mt-1">{formatDate(date)}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p
                        className={`text-sm font-bold m-0 ${
                          amount < 0 ? 'text-red-600' : 'text-emerald-600'
                        }`}
                      >
                        {amount < 0 ? '−' : '+'}KES {Math.abs(amount).toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                      </p>
                    </div>

                    <ChevronDown
                      size={16}
                      className={`text-slate-400 transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-6 pb-4 pt-2 bg-slate-50/30">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-slate-500 m-0 mb-0.5">Type</p>
                        <p className="font-semibold text-slate-900 m-0 capitalize">
                          {type.replace(/_/g, ' ')}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 m-0 mb-0.5">Amount</p>
                        <p className="font-semibold text-slate-900 m-0">
                          KES {Math.abs(amount).toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      {txn.reference && (
                        <div>
                          <p className="text-xs text-slate-500 m-0 mb-0.5">Reference</p>
                          <p className="font-semibold text-slate-900 m-0 text-xs">{txn.reference}</p>
                        </div>
                      )}
                      {txn.phone && (
                        <div>
                          <p className="text-xs text-slate-500 m-0 mb-0.5">Phone</p>
                          <p className="font-semibold text-slate-900 m-0 text-xs">{txn.phone}</p>
                        </div>
                      )}
                      <div className="col-span-2">
                        <p className="text-xs text-slate-500 m-0 mb-0.5">Date & Time</p>
                        <p className="font-semibold text-slate-900 m-0">
                          {formatDate(date)} at {formatTime(date)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}