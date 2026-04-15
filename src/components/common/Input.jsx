// src/components/common/Input.jsx
import { Search } from 'lucide-react'

/* ── Text input with optional label + leading icon ─── */
export function Input({ label, icon: Icon, className = '', wrapClass = '', ...props }) {
  return (
    <div className={`flex flex-col gap-2 ${wrapClass}`}>
      {label && (
        <label className="text-[13px] font-semibold text-slate-500">{label}</label>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none"
          />
        )}
        <input
          {...props}
          className={`input ${Icon ? 'pl-9' : ''} ${className}`}
        />
      </div>
    </div>
  )
}

/* ── Search input convenience wrapper ───────────────── */
export function SearchInput({ className = '', wrapClass = '', ...props }) {
  return (
    <div className={`relative ${wrapClass}`}>
      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
      <input {...props} className={`input pl-9 ${className}`} />
    </div>
  )
}

/* ── Textarea ────────────────────────────────────────── */
export function Textarea({ label, className = '', wrapClass = '', ...props }) {
  return (
    <div className={`flex flex-col gap-2 ${wrapClass}`}>
      {label && (
        <label className="text-[13px] font-semibold text-slate-500">{label}</label>
      )}
      <textarea
        {...props}
        className={`
          w-full px-3.5 py-3 bg-slate-50 border border-slate-150 rounded-md
          text-sm text-slate-600 placeholder:text-slate-300 outline-none resize-vertical
          focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors
          leading-relaxed ${className}
        `}
      />
    </div>
  )
}

/* ── Select ─────────────────────────────────────────── */
export function Select({ label, children, className = '', wrapClass = '', ...props }) {
  return (
    <div className={`flex flex-col gap-2 ${wrapClass}`}>
      {label && (
        <label className="text-[13px] font-semibold text-slate-500">{label}</label>
      )}
      <select {...props} className={`input cursor-pointer ${className}`}>
        {children}
      </select>
    </div>
  )
}
