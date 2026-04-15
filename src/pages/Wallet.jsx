// src/pages/Wallet.jsx
import { useState, useEffect } from 'react'
import { Loader, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { walletApi } from '../api/wallet'
import WalletBalance from '../components/wallet/WalletBallance'
import DepositForm from '../components/wallet/DepositForm'
import WithdrawForm from '../components/wallet/WithdrawForm'
import PayoutSettings from '../components/wallet/PayoutSettings'
import TransactionHistory from '../components/wallet/TransactionHistory'

export default function Wallet() {
  const { doctor: rawDoctor } = useAuth()
  const doctor = rawDoctor?.user || rawDoctor

  const [wallet, setWallet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showPayoutSettings, setShowPayoutSettings] = useState(false)
  const [walletRefresh, setWalletRefresh] = useState(0)

  useEffect(() => {
    const fetchWallet = async () => {
      const doctorId = doctor?.id

      if (!doctorId) {
        setError('Doctor ID not found. Please log in again.')
        setLoading(false)
        return
      }

      setLoading(true)
      setError('')
      try {
        const res = await walletApi.getWallet(doctorId)
        setWallet(res.data)
      } catch (err) {
        const errorMsg = err.response?.data?.error || err.message || 'Failed to load wallet'
        setError(errorMsg)
        console.error('Wallet error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchWallet()
  }, [doctor, walletRefresh])

  const handleRefresh = () => setWalletRefresh(prev => prev + 1)

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader size={32} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-slate-600">Loading wallet...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 flex flex-col gap-8 max-w-1200 mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight m-0">Wallet</h1>
          <p className="text-sm text-slate-400 m-0 mt-1">Manage your earnings and withdrawals</p>
        </div>
        {/* <button
          onClick={() => setShowPayoutSettings(!showPayoutSettings)}
          className="flex items-center gap-2 h-10 px-4 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
        >
          <Settings size={16} className="text-slate-600" />
          <span className="text-sm font-medium text-slate-700">Payout Settings</span>
        </button> */}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-3 px-4 py-3 bg-danger-50 rounded-xl border border-danger-200">
          <AlertCircle size={15} className="text-danger shrink-0" />
          <p className="text-sm font-medium text-danger-700 m-0">{error}</p>
        </div>
      )}

      {/* Main Balance Card */}
      {wallet && <WalletBalance wallet={wallet} />}

      {/* Quick Actions — DepositForm and WithdrawForm now get doctor from context internally */}
      {doctor?.id && (
        <div className="grid grid-cols-2 gap-6">
          <DepositForm wallet={wallet} onSuccess={handleRefresh} />
          <WithdrawForm wallet={wallet} onSuccess={handleRefresh} />
        </div>
      )}

      {/* Payout Settings Modal */}
      {showPayoutSettings && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <PayoutSettings onClose={() => setShowPayoutSettings(false)} wallet={wallet} />
          </div>
        </div>
      )}

      {/* Transaction History */}
      {wallet && <TransactionHistory wallet={wallet} />}
    </div>
  )
}
