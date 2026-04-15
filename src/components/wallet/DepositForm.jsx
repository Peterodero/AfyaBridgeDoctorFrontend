// src/components/wallet/DepositForm.jsx
import { useState } from 'react'
import { Plus, Loader, AlertCircle, CheckCircle } from 'lucide-react'
import { walletApi } from '../../api/wallet'
import { useAuth } from '../../context/AuthContext'

export default function DepositForm({ wallet, onSuccess }) {
  const { doctor: rawDoctor } = useAuth()
  const doctor = rawDoctor?.user || rawDoctor

  const [amount, setAmount] = useState('')
  const [phone, setPhone] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleDeposit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount')
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
      await walletApi.depositMPesa({
        email: doctor.email,
        user_id: doctor.id,
        amount: parseFloat(amount),
        phone: phone,
      })

      setSuccess('M-Pesa prompt sent to your phone. Enter your PIN to complete the transaction.')
      setAmount('')
      setPhone('')

      // Refresh wallet after 3 seconds
      setTimeout(() => {
        onSuccess?.()
      }, 3000)
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Deposit failed'
      setError(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="card p-6 border border-emerald-100/50" style={{ background: 'linear-gradient(135deg, #F0FDF4, #ECFDF5)' }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-100">
          <Plus size={18} className="text-emerald-600" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 m-0">Top Up Wallet</h3>
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

      <form onSubmit={handleDeposit} className="flex flex-col gap-3">
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
              className="flex-1 h-10 px-3 rounded-lg border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-400"
              min="1"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">M-Pesa Phone Number *</label>
          <input
            type="tel"
            placeholder="+254 712 345 678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={isLoading}
            className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-400"
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
              <Plus size={14} />
              Top Up Now
            </>
          )}
        </button>

        <p className="text-xs text-slate-500 m-0 text-center">
          You'll receive an M-Pesa prompt on your phone
        </p>
      </form>
    </div>
  )
}
