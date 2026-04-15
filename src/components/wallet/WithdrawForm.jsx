// src/components/wallet/WithdrawForm.jsx
import { useState } from 'react'
import { Minus, Loader, AlertCircle, CheckCircle } from 'lucide-react'
import { walletApi } from '../../api/wallet'
import { useAuth } from '../../context/AuthContext'

export default function WithdrawForm({ wallet, onSuccess }) {
  const { doctor: rawDoctor } = useAuth()
  const doctor = rawDoctor?.user || rawDoctor

  const [amount, setAmount] = useState('')
  const [phone, setPhone] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const balance = wallet?.balance ? parseFloat(wallet.balance) : 0

  const handleWithdraw = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const withdrawAmount = parseFloat(amount)

    if (!amount || withdrawAmount <= 0) {
      setError('Please enter a valid amount')
      return
    }

    if (withdrawAmount > balance) {
      setError(`Insufficient balance. You have KES ${balance.toLocaleString()}`)
      return
    }

    if (!phone.trim()) {
      setError('Please enter your M-Pesa phone number')
      return
    }

    if (!doctor?.id) {
      setError('Doctor ID not found')
      return
    }

    setIsLoading(true)
    try {
      await walletApi.withdraw({
        user_id: doctor.id,
        amount: withdrawAmount,
        phone: phone,
      })

      setSuccess('Withdrawal request submitted. You will receive the amount within 1-2 business days.')
      setAmount('')
      setPhone('')

      // Refresh wallet after 3 seconds
      setTimeout(() => {
        onSuccess?.()
      }, 3000)
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Withdrawal failed'
      setError(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="card p-6 border border-orange-100/50">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
          <Minus size={18} className="text-orange-600" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 m-0">Request Withdrawal</h3>
      </div>

      {error && (
        <div className="flex items-center gap-2 px-3 py-2 bg-red-50 rounded-lg mb-4 border border-red-200">
          <AlertCircle size={14} className="text-red-600 shrink-0" />
          <p className="text-xs text-red-600 m-0">{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg mb-4 border border-green-200">
          <CheckCircle size={14} className="text-green-600 shrink-0" />
          <p className="text-xs text-green-600 m-0">{success}</p>
        </div>
      )}

      <form onSubmit={handleWithdraw} className="flex flex-col gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Amount (KES) *</label>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-500">KES</span>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isLoading}
              max={balance}
              className="flex-1 h-10 px-3 rounded-lg border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-400"
              min="1"
            />
          </div>
          <p className="text-xs text-slate-400 m-0 mt-1">
            Available: KES {balance.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">M-Pesa Phone Number *</label>
          <input
            type="tel"
            placeholder="+254 712 345 678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={isLoading}
            className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-400"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="h-10 rounded-lg font-semibold text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          style={{ background: 'linear-gradient(135deg,#10B981,#059669)' }}
        >
          {isLoading ? (
            <>
              <Loader size={14} className="animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Minus size={14} />
              Withdraw
            </>
          )}
        </button>

        <p className="text-xs text-slate-500 m-0 text-center">
          Withdrawals are processed within 1-2 business days
        </p>
      </form>
    </div>
  )
}
