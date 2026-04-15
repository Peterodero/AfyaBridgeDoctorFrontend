// src/components/layout/Navbar.jsx
import { Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { doctor } = useAuth()

  const name     = doctor?.full_name ?? doctor?.name ?? 'Doctor'
  const specialty = doctor?.specialty ?? ''
  const initials = name.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <header className="h-17.5 bg-white flex items-center justify-between px-8 shrink-0 sticky top-0 z-50"
      style={{ boxShadow: '0 1px 0 #E8EDF3' }}>

      {/* Search */}
      <div className="relative w-100">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input placeholder="Search patients, appointments..."
          className="w-full h-10 bg-slate-50 rounded-xl pl-10 pr-4 text-sm text-slate-600 placeholder:text-slate-400 outline-none font-sans border border-slate-300 focus:ring-1 focus:bg-white transition-all" />
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Bell */}
        <Link to="/notifications" className="no-underline relative">
          <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors cursor-pointer">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </div>
          <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full border-2 border-white" />
        </Link>

        <div className="w-px h-7 bg-slate-150" />

        {/* Doctor profile */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right">
            <p className="text-[13px] font-bold text-slate-900 m-0 leading-tight">{name}</p>
            <p className="text-[11px] text-slate-400 m-0 mt-0.5">{specialty}</p>
          </div>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-blue-sm group-hover:shadow-blue transition-all"
            style={{ background: 'linear-gradient(135deg, #137FEC, #13B6EC)' }}>
            {initials}
          </div>
        </div>
      </div>
    </header>
  )
}
