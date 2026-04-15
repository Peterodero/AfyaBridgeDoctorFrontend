// src/components/common/Toast.jsx
import { useEffect } from 'react'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'
import { useUI } from '../../context/UIContext'

const CONFIG = {
  success: { wrap: 'bg-emerald-50 border-emerald-200',  text: 'text-emerald-800', Icon: CheckCircle },
  error:   { wrap: 'bg-danger-50 border-danger-100',    text: 'text-danger-700',  Icon: AlertCircle },
  info:    { wrap: 'bg-blue-50 border-blue-100',        text: 'text-blue-700',    Icon: Info        },
}

export default function Toast() {
  const { toast, clearToast } = useUI()

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(clearToast, 4000)
    return () => clearTimeout(t)
  }, [toast, clearToast])

  if (!toast) return null

  const cfg = CONFIG[toast.type] ?? CONFIG.info
  const { Icon } = cfg

  return (
    <div className={`fixed top-5 right-5 z-[9999] flex items-center gap-3 px-4 py-3.5 border rounded-xl min-w-[300px] max-w-[420px] ${cfg.wrap}`}
      style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
      <Icon size={17} className={`flex-shrink-0 ${cfg.text}`} />
      <span className={`flex-1 text-sm font-semibold ${cfg.text}`}>{toast.message}</span>
      <button onClick={clearToast} className="flex p-0.5 bg-transparent border-none cursor-pointer">
        <X size={15} className={cfg.text} />
      </button>
    </div>
  )
}
