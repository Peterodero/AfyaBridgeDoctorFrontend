// src/pages/Patients.jsx
import { useState } from 'react'
import { Search, Plus, Phone, ChevronRight } from 'lucide-react'
import { usePatients } from '../hooks/usePatients'
import Badge from '../components/common/Badge'
import { useNavigate } from 'react-router-dom'

const STATUS_FILTERS = ['All', 'Active', 'Inactive']

function Skeleton() {
  return Array.from({ length: 5 }).map((_, i) => (
    <div key={i} className="grid px-6 border-b border-slate-50 items-center gap-4"
      style={{ gridTemplateColumns: '2fr 0.5fr 1.5fr 1fr 1fr 40px', height: 64 }}>
      {Array.from({ length: 6 }).map((_, j) => (
        <div key={j} className="h-3 bg-slate-100 rounded-full animate-pulse" />
      ))}
    </div>
  ))
}

// Calculate age from date_of_birth "1990-05-12T00:00:00Z"
function calcAge(dob) {
  if (!dob) return '—'
  const diff = Date.now() - new Date(dob).getTime()
  const age  = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))
  return isNaN(age) || age < 0 ? '—' : age
}

export default function Patients() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All')
  const navigate = useNavigate()

  const { data: res, isLoading, isError } = usePatients()

  // Response: { data: { patients: [...] } }
  const patients = res?.data?.patients ?? (Array.isArray(res?.data) ? res.data : [])

  const filtered = patients.filter(p => {
    const name  = p.full_name ?? p.name ?? ''
    const email = p.email ?? ''
    const matchSearch = !search ||
      name.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase())
    const isActive = p.is_active || p.account_status === 'active'
    const matchStatus =
      status === 'All'     ? true :
      status === 'Active'  ? isActive :
      status === 'Inactive'? !isActive : true
    return matchSearch && matchStatus
  })

  // No "critical" status in response — use is_active=false as a proxy for attention needed
  const needsAttention = patients.filter(p => !p.is_active || p.account_status !== 'active')

  const getInitials = (name = '') =>
    name.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="p-8 flex flex-col gap-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight m-0">Patients</h1>
          <p className="text-sm text-slate-500 m-0 mt-1">
            {isLoading ? 'Loading…' : `${patients.length} registered patients`}
          </p>
        </div>
      </div>

      <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 276px' }}>

        <div className="flex flex-col gap-4">
          {/* Filter bar */}
          <div className="card p-4 flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-45">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full h-9 pl-9 pr-4 bg-slate-50 border border-slate-150 rounded-xl text-sm text-slate-600 placeholder:text-slate-300 outline-none font-sans focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
            </div>
            <div className="h-5 w-px bg-slate-150" />
            <div className="flex gap-1.5">
              {STATUS_FILTERS.map(s => (
                <button key={s} onClick={() => setStatus(s)}
                  className="h-9 px-3.5 rounded-xl text-[13px] font-semibold cursor-pointer border-none transition-all"
                  style={status === s
                    ? { background:'linear-gradient(135deg,#137FEC,#13B6EC)', color:'white', boxShadow:'0 4px 12px rgba(19,127,236,0.25)' }
                    : { background:'#F8FAFC', color:'#475569' }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="card overflow-hidden p-0">
            <div className="grid px-6 py-3 bg-slate-50/80"
                 style={{ gridTemplateColumns: '2fr 0.5fr 1fr 1.5fr 1fr 40px' }}>
              {['Patient', 'Age', 'Blood Type', 'Email', 'Status', ''].map((h, i) => (
                <span key={i} className="th text-gray-600">{h}</span>
              ))}
            </div>

            {isLoading ? <Skeleton />
            : isError   ? <p className="text-sm text-danger text-center py-10 m-0">Failed to load patients</p>
            : filtered.length === 0 ? <p className="text-sm text-slate-300 text-center py-10 m-0">No patients found</p>
            : filtered.map((p, i) => {
                const name     = p.full_name ?? p.name ?? 'Patient'
                const age      = p.age ?? calcAge(p.date_of_birth)
                const isActive = p.is_active || p.account_status === 'active'
                return (
                  <div key={p.id}
                  onClick={() => navigate(`/patients/${p.id}`)}
                    className={`grid px-6 items-center hover:bg-blue-50/20 cursor-pointer transition-colors ${i < filtered.length - 1 ? 'border-b border-slate-50' : ''}`}
                    style={{ gridTemplateColumns: '2fr 0.5fr 1fr 1.5fr 1fr 40px', height: 64 }}>

                    {/* Patient */}
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-bold text-white shadow-blue-sm shrink-0"
                        style={{ background:'linear-gradient(135deg,#137FEC,#13B6EC)' }}>
                        {getInitials(name)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 m-0">{name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Phone size={9} className="text-slate-300" />
                          <p className="text-[11px] text-slate-400 m-0">{p.phone_number ?? '—'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Age — calculated from date_of_birth */}
                    <span className="text-sm text-slate-500">{age}</span>

                    {/* Blood type */}
                    <span className="text-[13px] text-slate-500">{p.blood_type ?? '—'}</span>

                    {/* Email */}
                    <span className="text-[13px] text-slate-500 truncate">{p.email ?? '—'}</span>

                    {/* Status — derived from is_active / account_status */}
                    <Badge status={isActive ? 'Active' : 'Inactive'} />

                    <ChevronRight size={14} className="text-slate-200" />
                  </div>
                )
              })
            }
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
              <h3 className="text-sm font-bold text-slate-900 m-0">Needs Attention</h3>
              <span className="ml-auto badge bg-danger-100 text-danger-700">{needsAttention.length}</span>
            </div>
            {isLoading
              ? <p className="text-xs text-slate-300 text-center py-4 m-0">Loading…</p>
              : needsAttention.length === 0
              ? <p className="text-sm text-slate-500 text-center py-4 m-0">All patients are active</p>
              : needsAttention.map(p => {
                  const name = p.full_name ?? p.name ?? 'Patient'
                  return (
                    <div key={p.id} className="p-3 rounded-xl mb-2.5 cursor-pointer hover:opacity-90 transition-opacity"
                      style={{ background: '#FEF6F6' }}>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                          style={{ background:'linear-gradient(135deg,#EF4444,#DC2626)' }}>
                          {getInitials(name)}
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-slate-900 m-0">{name}</p>
                          <p className="text-[11px] text-danger m-0">
                            {p.account_status ?? 'Inactive'}
                          </p>
                        </div>
                      </div>
                      <button className="mt-2.5 w-full h-7 bg-white/60 border-none rounded-lg text-xs font-bold text-danger cursor-pointer hover:bg-white/90 transition-colors">
                        View Chart →
                      </button>
                    </div>
                  )
                })
            }
          </div>

          <div className="card p-5">
            <h3 className="text-sm font-bold text-slate-900 m-0 mb-4">Patient Overview</h3>
            {[
              { label: 'Active',   color: '#22C55E', check: (p) => p.is_active || p.account_status === 'active'  },
              { label: 'Inactive', color: '#EF4444', check: (p) => !p.is_active && p.account_status !== 'active' },
              { label: 'Verified', color: '#137FEC', check: (p) => p.is_verified                                 },
            ].map(({ label, color, check }) => {
              const count = patients.filter(check).length
              const pct   = patients.length ? Math.round((count / patients.length) * 100) : 0
              return (
                <div key={label} className="mb-3">
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs font-semibold text-slate-600">{label}</span>
                    <span className="text-xs font-bold text-slate-900">
                      {count} <span className="text-slate-300 font-normal">({pct}%)</span>
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width:`${pct}%`, background: color }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}