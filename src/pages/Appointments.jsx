// src/pages/Appointments.jsx
import { useState } from 'react'
import { Search, Plus, CalendarDays, Clock, ChevronRight, X, Calendar } from 'lucide-react'
import {
  useAppointments,
  useAppointment,
  useUpdateAppointmentStatus,
  useCancelAppointment,
  useRescheduleAppointment,
} from '../hooks/useAppointments'
import { usePatients } from '../hooks/usePatients'
import { useUI } from '../context/UIContext'
import Badge from '../components/common/Badge'

const STATUS_FILTERS = [
  { label: 'All',       value: 'all'       },
  { label: 'Pending',   value: 'pending'   },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
]

// ── Appointment Detail Modal ─────────────────────────────
function AppointmentDetailModal({ appointmentId, patientName, onClose, onReschedule }) {
  const { data: res, isLoading } = useAppointment(appointmentId)
  const appt = res?.data ?? res ?? null

  const formatTime = (t = '') => {
    if (!t) return '—'
    if (/^\d{2}:\d{2}:\d{2}$/.test(t)) return t.slice(0, 5)
    return t
  }

  const formatDate = (d = '') => {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('en-KE', { weekday:'long', year:'numeric', month:'long', day:'numeric' })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background:'rgba(15,23,42,0.5)', backdropFilter:'blur(4px)' }}>
      <div className="bg-white rounded-2xl w-full max-w-125 overflow-hidden"
        style={{ boxShadow:'0 20px 40px rgba(0,0,0,0.15)' }}>

        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900 m-0">Appointment Details</h3>
          <button onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors border-none cursor-pointer bg-transparent">
            <X size={16} className="text-slate-400" />
          </button>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex flex-col gap-3">
              {[1,2,3,4].map(i => <div key={i} className="h-4 bg-slate-100 rounded-full animate-pulse" />)}
            </div>
          ) : !appt ? (
            <p className="text-sm text-slate-400 text-center py-4">Failed to load appointment</p>
          ) : (
            <div className="flex flex-col gap-0">
              {[
                { label: 'Patient',   value: patientName },
                { label: 'Date',      value: formatDate(appt.date) },
                { label: 'Time',      value: formatTime(appt.time) },
                { label: 'Duration',  value: appt.duration ? `${appt.duration} minutes` : '—' },
                { label: 'Type',      value: appt.type?.replace('_', ' ') ?? '—' },
                { label: 'Status',    value: <Badge status={appt.status} /> },
                { label: 'Priority',  value: <span className="capitalize text-sm text-slate-700">{appt.priority ?? '—'}</span> },
                { label: 'Reason',    value: appt.reason ?? '—' },
                { label: 'Charges',   value: appt.charges ? `KES ${appt.charges}` : '—' },
                ...(appt.meeting_url ? [{ label: 'Meeting URL', value:
                  <a href={appt.meeting_url} target="_blank" rel="noreferrer"
                    className="text-primary text-sm font-semibold hover:underline">
                    Join Meeting
                  </a>
                }] : []),
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-[0.6px]">{label}</span>
                  <span className="text-sm font-semibold text-slate-700 text-right">{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {appt && !['completed','cancelled'].includes(appt.status) && (
          <div className="px-6 pb-6 flex gap-3">
            <button onClick={() => { onClose(); onReschedule(appt) }}
              className="flex-1 h-10 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-semibold cursor-pointer hover:bg-slate-50 transition-colors">
              Reschedule
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Reschedule Modal ─────────────────────────────────────
function RescheduleModal({ appointment, patientName, onClose }) {
  const { showToast } = useUI()
  const { mutate: reschedule, isPending } = useRescheduleAppointment()

  const [newDate, setNewDate] = useState('')
  const [newTime, setNewTime] = useState('')
  const [reason,  setReason]  = useState('')

  const inp = "w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 outline-none font-sans focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"

  const handleSubmit = () => {
    if (!newDate || !newTime) {
      showToast('Please select a new date and time', 'error'); return
    }
    reschedule({ id: appointment.id, newDate, newTime, reason }, {
      onSuccess: () => {
        showToast('Appointment rescheduled successfully', 'success')
        onClose()
      },
      onError: (err) => showToast(err.message ?? 'Failed to reschedule', 'error'),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background:'rgba(15,23,42,0.5)', backdropFilter:'blur(4px)' }}>
      <div className="bg-white rounded-2xl w-full max-w-110 overflow-hidden"
        style={{ boxShadow:'0 20px 40px rgba(0,0,0,0.15)' }}>

        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 m-0">Reschedule Appointment</h3>
            <p className="text-xs text-slate-400 m-0 mt-0.5">{patientName}</p>
          </div>
          <button onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors border-none cursor-pointer bg-transparent">
            <X size={16} className="text-slate-400" />
          </button>
        </div>

        <div className="mx-6 mt-5 px-4 py-3 rounded-xl bg-slate-50 border border-slate-100">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.6px] m-0 mb-1">Current Schedule</p>
          <p className="text-sm font-semibold text-slate-700 m-0">
            {appointment.date
              ? new Date(appointment.date).toLocaleDateString('en-KE', { month:'short', day:'numeric', year:'numeric' })
              : '—'} at {appointment.time?.slice(0, 5) ?? '—'}
          </p>
        </div>

        <div className="p-6 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.8px] block mb-1.5">
                New Date *
              </label>
              <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={inp} />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.8px] block mb-1.5">
                New Time *
              </label>
              <input type="time" value={newTime} onChange={e => setNewTime(e.target.value)}
                className={inp} />
            </div>
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.8px] block mb-1.5">
              Reason for Reschedule
            </label>
            <textarea value={reason} onChange={e => setReason(e.target.value)}
              placeholder="e.g. Doctor unavailable, Patient request..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder:text-slate-300 outline-none resize-none h-20 leading-relaxed font-sans focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
          </div>
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onClose}
            className="flex-1 h-10 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-semibold cursor-pointer hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={isPending}
            className="flex-1 h-10 rounded-xl text-white text-sm font-semibold border-none cursor-pointer disabled:opacity-60 transition-all hover:-translate-y-px"
            style={{ background:'linear-gradient(135deg,#137FEC,#13B6EC)', boxShadow:'0 4px 14px rgba(19,127,236,0.35)' }}>
            {isPending ? 'Rescheduling...' : 'Confirm Reschedule'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Skeleton ─────────────────────────────────────────────
function Skeleton() {
  return Array.from({ length: 5 }).map((_, i) => (
    <div key={i} className="grid px-6 border-b border-slate-50 items-center gap-4"
      style={{ gridTemplateColumns: '2.5fr 1fr 1fr 1.2fr 1fr 180px', height: 66 }}>
      {Array.from({ length: 6 }).map((_, j) => (
        <div key={j} className="h-3 bg-slate-100 rounded-full animate-pulse" />
      ))}
    </div>
  ))
}

// ── Main Page ─────────────────────────────────────────────
export default function Appointments() {
  const { showToast } = useUI()
  const [statusFilter,   setStatusFilter]   = useState('all')
  const [search,         setSearch]         = useState('')
  const [dateFilter,     setDateFilter]     = useState('')
  const [selectedApptId, setSelectedApptId] = useState(null)
  const [rescheduleAppt, setRescheduleAppt] = useState(null)

  const { data: res, isLoading, isError } = useAppointments()
  const { mutate: updateStatus } = useUpdateAppointmentStatus()
  const { mutate: cancel }       = useCancelAppointment()

  const { data: patRes } = usePatients()
  const patients   = patRes?.data?.patients ?? (Array.isArray(patRes?.data) ? patRes.data : [])
  const patientMap = patients.reduce((map, p) => {
    if (p.id) map[p.id] = p.full_name ?? p.name ?? 'Patient'
    return map
  }, {})

  const all     = res?.data?.appointments ?? []
  const summary = res?.data?.summary      ?? {}

  const filtered = all.filter(a => {
    const matchStatus = statusFilter === 'all' || a.status === statusFilter
    const matchDate   = !dateFilter || a.date?.startsWith(dateFilter)
    const matchSearch = !search || (patientMap[a.patient_id] ?? '').toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchDate && matchSearch
  })

  const getInitials = (name = '') =>
    name.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase()

  const formatTime = (t = '') => {
    if (!t) return '—'
    if (/^\d{2}:\d{2}:\d{2}$/.test(t)) return t.slice(0, 5)
    return t
  }

  const formatDate = (d = '') => {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('en-KE', { month:'short', day:'numeric', year:'numeric' })
  }

  const handleConfirm = (id) =>
    updateStatus({ id, status: 'confirmed' }, {
      onSuccess: () => showToast('Appointment confirmed', 'success'),
      onError:   (err) => showToast(err.message, 'error'),
    })

  const handleComplete = (id) =>
    updateStatus({ id, status: 'completed' }, {
      onSuccess: () => showToast('Appointment marked as completed', 'success'),
      onError:   (err) => showToast(err.message, 'error'),
    })

  const handleCancel = (id) =>
    cancel(id, {
      onSuccess: () => showToast('Appointment cancelled', 'success'),
      onError:   (err) => showToast(err.message, 'error'),
    })

  return (
    <div className="p-8 flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight m-0">Appointments</h1>
          <p className="text-sm text-slate-400 m-0 mt-1">
            {isLoading ? 'Loading…' : `${filtered.length} appointment${filtered.length !== 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label:'Total',     count: isLoading ? '—' : String(summary.total     ?? all.length), color:'text-primary'    },
          { label:'Pending',   count: isLoading ? '—' : String(summary.pending   ?? 0),          color:'text-amber-600'  },
          { label:'Confirmed', count: isLoading ? '—' : String(summary.confirmed ?? 0),          color:'text-blue-600'   },
          { label:'Completed', count: isLoading ? '—' : String(all.filter(a => a.status === 'completed').length), color:'text-emerald-600' },
        ].map(({ label, count, color }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-100 px-5 py-4 flex items-center gap-4 shadow-sm">
            <span className={`text-2xl font-black ${color}`}>{count}</span>
            <span className="text-sm text-slate-500 font-medium">{label}</span>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3 flex-wrap shadow-sm">
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search patients..."
            className="h-9 pl-9 pr-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 placeholder:text-slate-300 outline-none font-sans w-52 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
        </div>
        <div className="relative">
          <CalendarDays size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
          <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)}
            className="h-9 pl-8 pr-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 outline-none font-sans focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
        </div>
        {dateFilter && (
          <button onClick={() => setDateFilter('')}
            className="text-xs font-semibold text-slate-400 hover:text-red-500 bg-transparent border-none cursor-pointer transition-colors">
            Clear
          </button>
        )}
        <div className="h-5 w-px bg-slate-200" />
        <div className="flex gap-1.5 flex-wrap">
          {STATUS_FILTERS.map(f => (
            <button key={f.value} onClick={() => setStatusFilter(f.value)}
              className={`h-9 px-3.5 rounded-lg text-[13px] font-semibold cursor-pointer border-none transition-all ${
                statusFilter === f.value ? 'text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
              style={statusFilter === f.value ? { background:'linear-gradient(135deg,#137FEC,#13B6EC)' } : {}}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm overflow-x-auto">
        <div className="min-w-200">
          {/* Table Header */}
          <div className="grid px-6 py-3 bg-slate-50 border-b border-slate-100"
               style={{ gridTemplateColumns: '2.5fr 1fr 1fr 1.2fr 1fr 200px' }}>
            {['Patient', 'Type', 'Date', 'Time', 'Status', 'Actions'].map((h, i) => (
              <span key={i} className="text-xs font-bold text-slate-400 uppercase tracking-wider">{h}</span>
            ))}
          </div>

          {/* Table Body */}
          {isLoading ? <Skeleton />
          : isError ? (
            <div className="py-12 text-center">
              <p className="text-sm text-red-500 m-0">Failed to load appointments</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-slate-400 m-0">
                {statusFilter !== 'all' ? `No ${statusFilter} appointments found` : 'No appointments found'}
              </p>
            </div>
          ) : (
            filtered.map((appt, i) => {
              const patientName = patientMap[appt.patient_id] ?? 'Patient'
              const canCancel   = !['cancelled', 'completed'].includes(appt.status)
              const canConfirm  = appt.status === 'pending'
              const canComplete = appt.status === 'confirmed'

              return (
                <div key={appt.id}
                  className={`grid px-6 items-center hover:bg-slate-50 transition-colors ${
                    i < filtered.length - 1 ? 'border-b border-slate-50' : ''
                  }`}
                  style={{ gridTemplateColumns: '2.5fr 1fr 1fr 1.2fr 1fr 200px', minHeight: '66px' }}>

                  {/* Patient */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{ background:'linear-gradient(135deg,#137FEC,#13B6EC)' }}>
                      {getInitials(patientName)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 m-0">{patientName}</p>
                      {appt.reason && (
                        <p className="text-xs text-slate-400 m-0 truncate max-w-40">{appt.reason}</p>
                      )}
                    </div>
                  </div>

                  {/* Type */}
                  <span className="text-sm text-slate-600 capitalize">
                    {appt.type?.replace('_', ' ') ?? '—'}
                  </span>

                  {/* Date */}
                  <span className="text-sm text-slate-600">{formatDate(appt.date)}</span>

                  {/* Time */}
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} className="text-slate-400" />
                    <span className="text-sm font-medium text-slate-700">{formatTime(appt.time)}</span>
                  </div>

                  {/* Status */}
                  <Badge status={appt.status} />

                  {/* Actions */}
                  <div className="flex flex-wrap gap-1.5">
                    {/* View — always visible */}
                    <button
                      onClick={() => setSelectedApptId(appt.id)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors border-none cursor-pointer whitespace-nowrap">
                      View
                    </button>

                    {/* Confirm — only for pending */}
                    {canConfirm && (
                      <button
                        onClick={() => handleConfirm(appt.id)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors border-none cursor-pointer whitespace-nowrap">
                        Confirm
                      </button>
                    )}

                    {/* Done — only for confirmed */}
                    {canComplete && (
                      <button
                        onClick={() => handleComplete(appt.id)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors border-none cursor-pointer whitespace-nowrap">
                        Done
                      </button>
                    )}

                    {/* Cancel — for pending and confirmed */}
                    {canCancel && (
                      <button
                        onClick={() => handleCancel(appt.id)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-700 hover:bg-red-100 transition-colors border-none cursor-pointer whitespace-nowrap">
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Appointment Detail Modal */}
      {selectedApptId && (
        <AppointmentDetailModal
          appointmentId={selectedApptId}
          patientName={patientMap[all.find(a => a.id === selectedApptId)?.patient_id] ?? 'Patient'}
          onClose={() => setSelectedApptId(null)}
          onReschedule={(appt) => { setSelectedApptId(null); setRescheduleAppt(appt) }}
        />
      )}

      {/* Reschedule Modal */}
      {rescheduleAppt && (
        <RescheduleModal
          appointment={rescheduleAppt}
          patientName={patientMap[rescheduleAppt.patient_id] ?? 'Patient'}
          onClose={() => setRescheduleAppt(null)}
        />
      )}
    </div>
  )
}