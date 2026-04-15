// src/pages/PatientProfile.jsx
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Phone, Mail, Heart, Activity, Thermometer, Droplets, Plus, X } from 'lucide-react'
import { usePatient, usePatientVitals, useAddVitals } from '../hooks/usePatients'
import { useUI } from '../context/UIContext'

function calcAge(dob) {
  if (!dob) return '—'
  const age = Math.floor((Date.now() - new Date(dob).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
  return isNaN(age) || age < 0 ? '—' : age
}

// ── Add Vitals Modal ─────────────────────────────────────
function AddVitalsModal({ patientId, onClose }) {
  const { showToast } = useUI()
  const { mutate: addVitals, isPending } = useAddVitals()

  const [heartRate,  setHeartRate]  = useState('')
  const [systolic,   setSystolic]   = useState('')
  const [diastolic,  setDiastolic]  = useState('')
  const [glucose,    setGlucose]    = useState('')

  const inp = "w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 outline-none font-sans focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"

  const handleSubmit = () => {
    if (!heartRate || !systolic || !diastolic) {
      showToast('Heart rate and blood pressure are required', 'error'); return
    }
    addVitals({
      patientId,
      heartRate:              Number(heartRate),
      bloodPressureSystolic:  Number(systolic),
      bloodPressureDiastolic: Number(diastolic),
      bloodGlucose:           glucose ? Number(glucose) : undefined,
    }, {
      onSuccess: () => { showToast('Vitals recorded successfully', 'success'); onClose() },
      onError:   (err) => showToast(err.message ?? 'Failed to add vitals', 'error'),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-white rounded-2xl w-full max-w-110 overflow-hidden"
        style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900 m-0">Record Vitals</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors border-none cursor-pointer bg-transparent">
            <X size={16} className="text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.8px] block mb-1.5">
                Heart Rate (bpm) *
              </label>
              <input type="number" value={heartRate} onChange={e => setHeartRate(e.target.value)}
                placeholder="e.g. 72" className={inp} />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.8px] block mb-1.5">
                Blood Glucose (mg/dL)
              </label>
              <input type="number" value={glucose} onChange={e => setGlucose(e.target.value)}
                placeholder="e.g. 95" className={inp} />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.8px] block mb-1.5">
              Blood Pressure (mmHg) *
            </label>
            <div className="flex items-center gap-2">
              <input type="number" value={systolic} onChange={e => setSystolic(e.target.value)}
                placeholder="Systolic" className={inp} />
              <span className="text-slate-300 font-bold shrink-0">/</span>
              <input type="number" value={diastolic} onChange={e => setDiastolic(e.target.value)}
                placeholder="Diastolic" className={inp} />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onClose}
            className="flex-1 h-10 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-semibold cursor-pointer hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={isPending}
            className="flex-1 h-10 rounded-xl text-white text-sm font-semibold border-none cursor-pointer disabled:opacity-60 transition-all hover:-translate-y-px"
            style={{ background: 'linear-gradient(135deg,#137FEC,#13B6EC)', boxShadow: '0 4px 14px rgba(19,127,236,0.35)' }}>
            {isPending
              ? <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving…
                </span>
              : 'Save Vitals'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ────────────────────────────────────────────
export default function PatientProfile() {
  const { patientId } = useParams()
  const navigate      = useNavigate()
  const [showVitals,  setShowVitals] = useState(false)

  const { data: patRes,    isLoading: patLoading    } = usePatient(patientId)
  const { data: vitalsRes, isLoading: vitalsLoading } = usePatientVitals(patientId)

  const patient = patRes?.data ?? patRes ?? null
  const vitals  = vitalsRes?.data ?? (Array.isArray(vitalsRes) ? vitalsRes : [])
  const latest  = Array.isArray(vitals) ? vitals[0] : vitals

  if (patLoading) {
    return (
      <div className="p-8 flex flex-col gap-6">
        <div className="h-8 w-48 bg-slate-100 rounded-full animate-pulse" />
        <div className="grid grid-cols-3 gap-5">
          {[1,2,3].map(i => <div key={i} className="card p-6 h-32 animate-pulse bg-slate-50" />)}
        </div>
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-400 text-sm">Patient not found</p>
        <button onClick={() => navigate('/patients')}
          className="mt-4 text-primary text-sm font-semibold bg-transparent border-none cursor-pointer hover:underline">
          ← Back to Patients
        </button>
      </div>
    )
  }

  const name     = patient.full_name ?? patient.name ?? 'Patient'
  const initials = name.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const age      = patient.age ?? calcAge(patient.date_of_birth)

  const allergies  = Array.isArray(patient.allergies)
    ? patient.allergies.map(a => a.allergen).join(', ') || 'None'
    : patient.allergies || 'None'

  const conditions = Array.isArray(patient.conditions)
    ? patient.conditions.map(c => c.name ?? c.condition ?? c).filter(Boolean).join(', ') || 'None'
    : patient.conditions || 'None'

  return (
    <div className="p-8 flex flex-col gap-6">

      {/* Back + header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/patients')}
          className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 bg-transparent border-none cursor-pointer transition-colors p-0">
          <ArrowLeft size={16} /> Back to Patients
        </button>
      </div>

      {/* Profile hero */}
      <div className="card p-6 flex items-start gap-6">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black text-white shrink-0"
          style={{ background: 'linear-gradient(135deg,#137FEC,#13B6EC)', boxShadow: '0 8px 20px rgba(19,127,236,0.25)' }}>
          {initials}
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-black text-slate-900 m-0">{name}</h1>
              <div className="flex items-center gap-4 mt-1.5">
                {age !== '—' && <span className="text-sm text-slate-400">Age {age}</span>}
                {patient.gender && <span className="text-sm text-slate-400 capitalize">{patient.gender}</span>}
                {patient.blood_type && (
                  <span className="badge bg-primary-100 text-primary">{patient.blood_type}</span>
                )}
                <span className={`badge ${patient.is_active ? 'bg-success-50 text-success-700' : 'bg-slate-100 text-slate-500'}`}>
                  {patient.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <button onClick={() => setShowVitals(true)}
              className="flex items-center gap-2 h-10 px-4 rounded-xl text-white text-sm font-semibold border-none cursor-pointer transition-all hover:-translate-y-px"
              style={{ background: 'linear-gradient(135deg,#137FEC,#13B6EC)', boxShadow: '0 4px 14px rgba(19,127,236,0.35)' }}>
              <Plus size={14} /> Record Vitals
            </button>
          </div>
          <div className="flex items-center gap-5 mt-4">
            {patient.phone_number && (
              <div className="flex items-center gap-1.5 text-sm text-slate-500">
                <Phone size={13} className="text-slate-300" />
                {patient.phone_number}
              </div>
            )}
            {patient.email && (
              <div className="flex items-center gap-1.5 text-sm text-slate-500">
                <Mail size={13} className="text-slate-300" />
                {patient.email}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Latest vitals strip */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Heart Rate',     value: latest?.heartRate      ? `${latest.heartRate} bpm`   : '—', icon: Heart,       color: 'text-red-500',    bg: 'bg-red-50'    },
          { label: 'Blood Pressure', value: latest?.bloodPressureSystolic ? `${latest.bloodPressureSystolic}/${latest.bloodPressureDiastolic} mmHg` : '—', icon: Activity, color: 'text-primary', bg: 'bg-primary-50' },
          { label: 'Blood Glucose',  value: latest?.bloodGlucose   ? `${latest.bloodGlucose} mg/dL` : '—', icon: Droplets, color: 'text-amber-600', bg: 'bg-amber-50'  },
          { label: 'Temperature',    value: latest?.temperature    ? `${latest.temperature} °C`  : '—', icon: Thermometer, color: 'text-teal',      bg: 'bg-teal-50'   },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card p-5">
            <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
              <Icon size={17} className={color} />
            </div>
            <p className="text-lg font-black text-slate-900 m-0">{vitalsLoading ? '…' : value}</p>
            <p className="text-xs text-slate-400 m-0 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Details grid */}
      <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 1fr' }}>

        {/* Medical info */}
        <div className="card p-6">
          <h3 className="text-sm font-bold text-slate-900 m-0 mb-4">Medical Information</h3>
          {[
            { label: 'Conditions',  value: conditions },
            { label: 'Allergies',   value: allergies  },
            { label: 'Blood Type',  value: patient.blood_type ?? '—' },
            { label: 'Date of Birth', value: patient.date_of_birth
                ? new Date(patient.date_of_birth).toLocaleDateString('en-KE', { year:'numeric', month:'long', day:'numeric' })
                : '—' },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between py-3 border-b border-slate-50 last:border-0">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-[0.6px]">{label}</span>
              <span className="text-sm font-semibold text-slate-700 text-right max-w-50">{value}</span>
            </div>
          ))}
        </div>

        {/* Contact + account info */}
        <div className="card p-6">
          <h3 className="text-sm font-bold text-slate-900 m-0 mb-4">Account Details</h3>
          {[
            { label: 'Email',          value: patient.email       ?? '—' },
            { label: 'Phone',          value: patient.phone_number ?? '—' },
            { label: 'Gender',         value: patient.gender       ?? '—' },
            { label: 'Member Since',   value: patient.created_at
                ? new Date(patient.created_at).toLocaleDateString('en-KE', { year:'numeric', month:'long', day:'numeric' })
                : '—' },
            { label: 'Last Login',     value: patient.last_login
                ? new Date(patient.last_login).toLocaleDateString('en-KE', { year:'numeric', month:'short', day:'numeric' })
                : '—' },
            { label: 'Verified',       value: patient.is_verified ? 'Yes' : 'No' },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between py-3 border-b border-slate-50 last:border-0">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-[0.6px]">{label}</span>
              <span className="text-sm font-semibold text-slate-700">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Vitals history */}
      {Array.isArray(vitals) && vitals.length > 1 && (
        <div className="card overflow-hidden p-0">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 m-0">Vitals History</h3>
          </div>
          <div className="grid px-6 py-3 bg-slate-50/80"
            style={{ gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr' }}>
            {['Date', 'Heart Rate', 'Blood Pressure', 'Glucose', 'Temp'].map(h => (
              <span key={h} className="th">{h}</span>
            ))}
          </div>
          {vitals.map((v, i) => (
            <div key={v.id ?? i}
              className={`grid px-6 items-center ${i < vitals.length - 1 ? 'border-b border-slate-50' : ''}`}
              style={{ gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr', height: 52 }}>
              <span className="text-xs text-slate-400">
                {v.created_at ? new Date(v.created_at).toLocaleDateString('en-KE', { month:'short', day:'numeric', year:'numeric' }) : '—'}
              </span>
              <span className="text-sm text-slate-700">{v.heartRate ? `${v.heartRate} bpm` : '—'}</span>
              <span className="text-sm text-slate-700">
                {v.bloodPressureSystolic ? `${v.bloodPressureSystolic}/${v.bloodPressureDiastolic}` : '—'}
              </span>
              <span className="text-sm text-slate-700">{v.bloodGlucose ? `${v.bloodGlucose} mg/dL` : '—'}</span>
              <span className="text-sm text-slate-700">{v.temperature ? `${v.temperature} °C` : '—'}</span>
            </div>
          ))}
        </div>
      )}

      {showVitals && (
        <AddVitalsModal patientId={patientId} onClose={() => setShowVitals(false)} />
      )}
    </div>
  )
}