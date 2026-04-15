// src/pages/Telemedicine.jsx
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from "react-router-dom"
import { Mic, MicOff, Video, VideoOff, Monitor, Settings, PhoneOff, Clock, Play, FileText, ExternalLink } from 'lucide-react'
import { useStartConsultation, useEndConsultation } from '../hooks/useConsultations'
import { useAppointments } from '../hooks/useAppointments'
import { usePatients } from '../hooks/usePatients'
import { useUI } from '../context/UIContext'

const VITALS = [
  { label:'Blood Pressure', value:'120/80', unit:'mmHg' },
  { label:'Temperature',    value:'37.0',   unit:'°C'   },
  { label:'Heart Rate',     value:'72',     unit:'bpm'  },
  { label:'SpO2',           value:'98',     unit:'%'    },
]

//  Main Page 
export default function Telemedicine() {
  const navigate = useNavigate()
  const { showToast } = useUI()

  const [tab,    setTab]    = useState('notes')
  const [notes,  setNotes]  = useState('')
  const [activeConsultation, setActiveConsultation] = useState(null)
  const [meetingUrl,         setMeetingUrl]         = useState(null)
  const [activeApptId,       setActiveApptId]       = useState(null)
  const [callEnded,          setCallEnded]          = useState(false)

  // Fetch confirmed appointments
  const { data: apptRes, isLoading: apptLoading } = useAppointments()
  const allAppts       = apptRes?.data?.appointments ?? []
  const confirmedAppts = allAppts.filter(a => a.status === 'confirmed')

  // Build patient name map
  const { data: patRes } = usePatients()
  const patients   = patRes?.data?.patients ?? (Array.isArray(patRes?.data) ? patRes.data : [])
  const patientMap = patients.reduce((map, p) => {
    if (p.id) map[p.id] = p.full_name ?? p.name ?? 'Patient'
    return map
  }, {})

  const { mutate: startConsultation, isPending: starting } = useStartConsultation()
  const { mutate: endConsultation,   isPending: ending   } = useEndConsultation()

  // Get doctor name for Jitsi display
  const doctorName = (() => {
    try { return JSON.parse(localStorage.getItem('afya_doctor') ?? '{}').full_name ?? 'Doctor' }
    catch { return 'Doctor' }
  })()

  const getInitials = (name = '') =>
    name.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase()

  const formatTime = (t = '') => {
    if (!t) return '—'
    if (/^\d{2}:\d{2}:\d{2}$/.test(t)) return t.slice(0, 5)
    return t
  }

  const handleStart = (appt) => {
    startConsultation(appt.id, {
      onSuccess: (res) => {
        const data = res?.data ?? res
        setActiveConsultation(data)
        setActiveApptId(appt.id)
        setCallEnded(false)
        
        const url = data?.meetingUrl ?? data?.meeting_url ?? data?.meetingURL
        setMeetingUrl(url)
        
        // Open meeting in new tab
        if (url) {
          window.open(url, '_blank', 'noopener,noreferrer')
        }
        
        showToast(`Consultation started for ${data?.patient?.fullName ?? 'patient'}`, 'success')
      },
      onError: (err) => showToast(err.message ?? 'Failed to start consultation', 'error'),
    })
  }

  const handleEnd = () => {
    const id = activeConsultation?.id ?? activeConsultation?.consultationId
    if (!id) return
    
    endConsultation(id, {
      onSuccess: () => {
        setActiveConsultation(null)
        setMeetingUrl(null)
        setCallEnded(true) 
        showToast('Consultation ended successfully', 'success')
      },
      onError: (err) => showToast(err.message ?? 'Failed to end consultation', 'error'),
    })
  }

  // Handle navigation to prescriptions
  const handleGoToPrescription = () => {
    if (!activeApptId) {
      showToast("No active consultation found", "error")
      return
    }

    const appt = confirmedAppts.find((a) => a.id === activeApptId)

    navigate("/prescriptions", {
      state: {
        appointmentId: activeApptId,
        patientId: appt?.patient_id,
      },
    })
  }

  // Join meeting button handler (opens in new tab)
  const handleJoinMeeting = () => {
    if (meetingUrl) {
      window.open(meetingUrl, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className="flex overflow-hidden" style={{ height: 'calc(100vh - 70px)' }}>

      {/* ── Left panel — confirmed appointments ──── */}
      <div className="w-72 bg-white flex flex-col shrink-0" style={{ boxShadow:'1px 0 0 #E8EDF3' }}>
        <div className="px-5 py-4 border-b border-slate-50">
          <h3 className="text-sm font-bold text-slate-900 m-0">Confirmed Appointments</h3>
          <p className="text-xs text-slate-400 m-0 mt-0.5">
            {apptLoading ? 'Loading…' : `${confirmedAppts.length} ready to start`}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
          {apptLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 rounded-xl bg-slate-50 animate-pulse" />
            ))
          ) : confirmedAppts.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-10 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-3">
                <Video size={20} className="text-slate-300" />
              </div>
              <p className="text-xs text-slate-400 m-0 font-medium">No confirmed appointments</p>
              <p className="text-xs text-slate-300 m-0 mt-1">Confirm appointments first</p>
            </div>
          ) : (
            confirmedAppts.map(appt => {
              const patientName = patientMap[appt.patient_id] ?? 'Patient'
              const isActive    = activeApptId === appt.id

              return (
                <div key={appt.id}
                  className="p-3.5 rounded-xl transition-all"
                  style={isActive
                    ? { background:'linear-gradient(135deg,#137FEC,#13B6EC)' }
                    : { background:'#F8FAFC', border:'1px solid #F1F5F9' }}>

                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0 ${isActive ? 'bg-white/20 text-white' : 'text-white'}`}
                      style={isActive ? {} : { background:'linear-gradient(135deg,#137FEC,#13B6EC)' }}>
                      {getInitials(patientName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold m-0 truncate ${isActive ? 'text-white' : 'text-slate-900'}`}>
                        {patientName}
                      </p>
                      <p className={`text-xs m-0 mt-0.5 truncate ${isActive ? 'text-white/70' : 'text-slate-400'}`}>
                        {appt.reason ?? appt.type?.replace('_',' ') ?? 'Consultation'}
                      </p>
                    </div>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse shrink-0" />
                    )}
                  </div>

                  <div className={`flex items-center gap-1.5 mt-2 ${isActive ? 'text-white/60' : 'text-slate-400'}`}>
                    <Clock size={10} />
                    <span className="text-[11px]">{formatTime(appt.time)}</span>
                    {appt.type && (
                      <>
                        <span className="text-[10px]">·</span>
                        <span className="text-[11px] capitalize">{appt.type.replace('_',' ')}</span>
                      </>
                    )}
                  </div>

                  {!activeConsultation && !callEnded && (
                    <button
                      onClick={() => handleStart(appt)}
                      disabled={starting}
                      className="mt-2.5 w-full h-8 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold border-none cursor-pointer disabled:opacity-60 transition-all"
                      style={{ background:'linear-gradient(135deg,#137FEC,#13B6EC)', color:'white', boxShadow:'0 2px 8px rgba(19,127,236,0.3)' }}>
                      {starting
                        ? <><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />Starting…</>
                        : <><Play size={11} strokeWidth={2.5} /> Start</>}
                    </button>
                  )}

                  {isActive && !callEnded && (
                    <div className="mt-2.5 flex items-center justify-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      <span className="text-[11px] font-bold text-white/80">Call in progress</span>
                    </div>
                  )}

                  {callEnded && activeApptId === appt.id && (
                    <div className="mt-2.5 flex items-center justify-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className="text-[11px] font-bold text-emerald-600">Consultation completed</span>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* ── Video workspace ───────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0" style={{ background:'#0A1628' }}>
        <div className="flex-1 relative overflow-hidden flex items-center justify-center">
          {meetingUrl ? (
            // ── Meeting info with join button ───────────────
            <div className="text-center">
              <div className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6"
                style={{ background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.15)' }}>
                <Video size={40} className="text-white/40" />
              </div>
              <h3 className="text-white text-lg font-semibold mb-2">Meeting Ready</h3>
              <p className="text-white/50 text-sm mb-6">
                Click the button below to join the video consultation
              </p>
              <button
                onClick={handleJoinMeeting}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold hover:shadow-lg transition-all hover:-translate-y-px"
              >
                <ExternalLink size={16} />
                Join Meeting in New Tab
              </button>
              <p className="text-white/30 text-xs mt-4">
                Meeting will open in a new browser tab
              </p>
            </div>
          ) : (
            // ── Idle state ───────────────────────────────
            <div className="text-center">
              <div className="absolute inset-0 opacity-[0.04]"
                style={{ backgroundImage:'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize:'32px 32px' }} />
              {activeConsultation ? (
                <div className="text-center relative z-10">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.15)' }}>
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
                  <p className="text-white/60 text-sm m-0">Creating meeting room…</p>
                </div>
              ) : (
                <div className="text-center relative z-10">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-white/5 border border-white/10">
                    <Video size={32} className="text-white/20" />
                  </div>
                  <p className="text-white/40 text-sm m-0">Select a confirmed appointment to begin</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Vitals strip — only show when no active meeting */}
        {!meetingUrl && (
          <div className="px-6 py-3 flex gap-8 shrink-0"
            style={{ background:'#0F1E35', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
            {VITALS.map(({ label, value, unit }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-1.5 h-6 rounded-full bg-success" />
                <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-[0.5px] m-0">{label}</p>
                  <p className="text-sm font-bold text-white m-0 mt-0.5">
                    {value} <span className="text-xs font-normal text-white/30">{unit}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Documentation panel ───────────────────── */}
      <div className="w-85 bg-white flex flex-col shrink-0" style={{ boxShadow:'-1px 0 0 #E8EDF3' }}>
        <div className="flex border-b border-slate-50 shrink-0">
          {[['notes','Clinical Notes'],['rx','Prescription']].map(([t, label]) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 h-11 border-none bg-transparent cursor-pointer text-[13px] font-sans border-b-2 -mb-px transition-colors
                ${tab === t ? 'font-bold text-primary border-primary' : 'font-medium text-slate-400 border-transparent hover:text-slate-600'}`}>
              {label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {tab === 'notes' ? (
            <div className="flex flex-col gap-4">
              {activeApptId && confirmedAppts.find(a => a.id === activeApptId)?.reason && (
                <div>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-[1.2px] mb-2">Chief Complaint</p>
                  <div className="p-3 rounded-xl text-sm text-slate-600 leading-relaxed"
                    style={{ background:'linear-gradient(135deg,#EBF5FF,#D1E9FF)' }}>
                    {confirmedAppts.find(a => a.id === activeApptId)?.reason}
                  </div>
                </div>
              )}
              <div>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[1.2px] mb-2">Clinical Notes</p>
                <textarea value={notes} onChange={e => setNotes(e.target.value)}
                  placeholder="Enter clinical notes…"
                  className="w-full min-h-30 p-3 bg-slate-50 border border-slate-150 rounded-xl text-sm text-slate-700 placeholder:text-slate-300 outline-none resize-y leading-relaxed font-sans focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[1.2px] mb-2">Quick Orders</p>
                <div className="flex gap-2 flex-wrap">
                  {['ECG','Blood Work','Chest X-Ray','Echocardiogram'].map(lab => (
                    <button key={lab}
                      className="px-3 py-1.5 bg-slate-50 border border-slate-150 rounded-lg text-xs font-semibold text-slate-600 cursor-pointer font-sans hover:bg-primary hover:text-white hover:border-primary transition-all">
                      + {lab}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-3">
                <span className="text-lg font-black text-slate-200">Rx</span>
              </div>
              <p className="text-sm font-semibold text-slate-700 m-0">Use E-Prescriptions page</p>
              <p className="text-xs text-slate-400 m-0 mt-1">for full prescription management</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-50 flex flex-col gap-2 shrink-0">
          {/* End Consultation Button */}
          <button
            onClick={handleEnd}
            disabled={!activeConsultation || ending}
            className="h-11 w-full rounded-xl text-white text-sm font-semibold border-none cursor-pointer disabled:opacity-40 transition-all hover:-translate-y-px disabled:hover:translate-y-0"
            style={{ background:'linear-gradient(135deg,#EF4444,#DC2626)', boxShadow: activeConsultation ? '0 4px 14px rgba(239,68,68,0.35)' : 'none' }}>
            {ending ? 'Ending…' : 'Complete Consultation'}
          </button>
          
          {/* Go to Prescription Button - Enabled when call is ended OR there's an active consultation */}
          <button
            onClick={handleGoToPrescription}
            disabled={!activeApptId}
            className="h-11 w-full rounded-xl text-white text-sm font-semibold border-none cursor-pointer disabled:opacity-40 transition-all hover:-translate-y-px disabled:hover:translate-y-0 flex items-center justify-center gap-2"
            style={{
              background: "linear-gradient(135deg,#0D9488,#0F766E)",
              boxShadow: activeApptId ? "0 4px 14px rgba(13,148,136,0.35)" : "none",
            }}
          >
            <FileText size={16} />
            Go to Prescription
          </button>
          
          <div className="grid grid-cols-2 gap-2">
            <button className="h-9 rounded-xl bg-white border border-slate-150 text-slate-600 text-xs font-semibold cursor-pointer hover:bg-slate-50 transition-colors">Save Draft</button>
            <button className="h-9 rounded-xl bg-white border border-slate-150 text-slate-600 text-xs font-semibold cursor-pointer hover:bg-slate-50 transition-colors">Send Summary</button>
          </div>

          {/* Status indicator for call */}
          {activeApptId && !activeConsultation && callEnded && (
            <p className="text-center text-xs text-emerald-600 mt-2">
              ✓ Consultation completed. You can now write a prescription.
            </p>
          )}
          {activeConsultation && !callEnded && (
            <p className="text-center text-xs text-blue-600 mt-2">
              🔵 Consultation in progress. End the call to enable prescription.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}