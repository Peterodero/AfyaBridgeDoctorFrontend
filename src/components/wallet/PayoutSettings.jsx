// src/components/wallet/PayoutSettings.jsx
import { useState } from 'react'
import { X, Loader } from 'lucide-react'

export default function PayoutSettings({ onClose, wallet }) {
  const [payoutMethod, setPayoutMethod] = useState(wallet?.payout_method || 'mpesa')
  const [payoutAccount, setPayoutAccount] = useState(wallet?.payout_account || '')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSave = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!payoutAccount) {
      setError(`Please enter your ${payoutMethod === 'mpesa' ? 'M-Pesa number' : 'bank account'}`)
      return
    }

    setIsLoading(true)
    // TODO: Connect to backend endpoint to save payout settings
    // For now, just simulate
    await new Promise(r => setTimeout(r, 1200))
    
    setSuccess(true)
    setIsLoading(false)
    setTimeout(() => onClose?.(), 1500)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-900 m-0">Payout Settings</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors border-none bg-transparent cursor-pointer"
          >
            <X size={18} className="text-slate-400" />
          </button>
        )}
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Payout Method</label>
          <select
            value={payoutMethod}
            onChange={(e) => setPayoutMethod(e.target.value)}
            disabled={isLoading}
            className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-slate-50 cursor-pointer"
          >
            <option value="mpesa">M-Pesa</option>
            <option value="bank">Bank Transfer</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            {payoutMethod === 'mpesa' ? 'M-Pesa Number' : 'Bank Account'}
          </label>
          <input
            type="text"
            placeholder={payoutMethod === 'mpesa' ? '254712345678' : 'Enter account number'}
            value={payoutAccount}
            onChange={(e) => setPayoutAccount(e.target.value)}
            disabled={isLoading}
            className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-slate-50"
          />
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-600 m-0">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
            <p className="text-sm text-emerald-600 m-0">✓ Settings saved successfully!</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="h-10 rounded-lg font-semibold text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          style={{ background: 'linear-gradient(135deg,#137FEC,#13B6EC)' }}
        >
          {isLoading ? (
            <>
              <Loader size={16} className="animate-spin" />
              Saving...
            </>
          ) : (
            'Save Settings'
          )}
        </button>
      </form>
    </div>
  )
}