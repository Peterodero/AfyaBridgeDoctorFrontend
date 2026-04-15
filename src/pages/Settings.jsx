// src/pages/Settings.jsx
import { useState, useEffect } from 'react'
import { 
  Camera, ChevronRight, AlertTriangle, Shield, Bell, Clock, Loader2, X, Check, 
  Edit2, Save, RefreshCw, User, Stethoscope, Phone, Hospital, Mail, Video, Users, Eye, 
  Loader
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useUI } from '../context/UIContext'
import { doctorsApi } from '../api/doctors'
import Toggle from '../components/common/Toggle'

const inp = "w-full h-10 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none font-sans focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary/10 transition-all"

function Section({ title, children }) {
  return (
    <div className="card overflow-hidden p-0">
      <div className="px-6 py-4" style={{ background: 'linear-gradient(135deg,#F8FAFC,#F0F4F8)' }}>
        <h3 className="text-sm font-bold text-slate-800 m-0">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

// Password Change Modal
function ChangePasswordModal({ isOpen, onClose, onSuccess }) {
  const { token } = useAuth()
  const { showToast } = useUI()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast('Please fill in all fields', 'error')
      return
    }
    
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error')
      return
    }
    
    if (newPassword.length < 8) {
      showToast('Password must be at least 8 characters', 'error')
      return
    }
    
    setLoading(true)
    try {
      await doctorsApi.changePassword(token, {
        currentPassword,
        newPassword,
        confirmPassword
      })
      showToast('Password changed successfully', 'success')
      onSuccess()
      onClose()
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      showToast(err.message || 'Failed to change password', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Change Password</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={18} className="text-gray-400" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={`${inp} pr-10`}
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrent ? <X size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`${inp} pr-10`}
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNew ? <X size={14} /> : <Eye size={14} />}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">Must be at least 8 characters</p>
          </div>
          
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`${inp} pr-10`}
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirm ? <X size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-10 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 h-10 rounded-xl bg-linear-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold hover:shadow-lg transition-all disabled:opacity-60"
            >
              {loading ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// 2FA Enable Modal
function Enable2FAModal({ isOpen, onClose, onSuccess }) {
  const { token } = useAuth()
  const { showToast } = useUI()
  const [method, setMethod] = useState('sms')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (method === 'sms' && !phoneNumber) {
      showToast('Phone number is required', 'error')
      return
    }
    
    setLoading(true)
    try {
      await doctorsApi.enable2FA(token, {
        method,
        phoneNumber: method === 'sms' ? phoneNumber : undefined
      })
      showToast('Two-factor authentication enabled successfully', 'success')
      onSuccess()
      onClose()
      setPhoneNumber('')
    } catch (err) {
      showToast(err.message || 'Failed to enable 2FA', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Enable Two-Factor Authentication</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={18} className="text-gray-400" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">
              Authentication Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMethod('sms')}
                className={`p-3 rounded-xl border-2 transition-all ${
                  method === 'sms' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <span className="text-lg block mb-1">📱</span>
                  <span className="text-sm font-medium">SMS</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setMethod('authenticator')}
                className={`p-3 rounded-xl border-2 transition-all ${
                  method === 'authenticator' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <span className="text-lg block mb-1">🔐</span>
                  <span className="text-sm font-medium">Authenticator App</span>
                </div>
              </button>
            </div>
          </div>
          
          {method === 'sms' && (
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className={inp}
                placeholder="+254700100005"
              />
              <p className="text-xs text-gray-400 mt-1">You'll receive verification codes via SMS</p>
            </div>
          )}
          
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-10 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 h-10 rounded-xl bg-linear-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold hover:shadow-lg transition-all disabled:opacity-60"
            >
              {loading ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Enable 2FA'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Delete Account Confirmation Modal
function DeleteAccountModal({ isOpen, onClose, onConfirm }) {
  const [confirmText, setConfirmText] = useState('')
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-red-100 bg-red-50">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className="text-red-600" />
            <h3 className="text-lg font-bold text-red-900">Delete Account</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-red-100 rounded-lg transition-colors">
            <X size={18} className="text-red-400" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="bg-red-50 p-4 rounded-xl border border-red-100">
            <p className="text-sm text-red-800 font-medium mb-2">⚠️ This action cannot be undone!</p>
            <p className="text-xs text-red-600">
              Your account, all patient data, appointments, and records will be permanently deleted.
            </p>
          </div>
          
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">
              Type "DELETE" to confirm
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className={inp}
              placeholder="DELETE"
            />
          </div>
          
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 h-10 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={confirmText !== 'DELETE'}
              className="flex-1 h-10 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Editable Field Component
function EditableField({ label, value, onSave, type = 'text', placeholder, required, icon: Icon }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const [loading, setLoading] = useState(false)
  const { showToast } = useUI()

  const handleSave = async () => {
    if (required && !editValue.trim()) {
      showToast(`${label} is required`, 'error')
      return
    }
    
    setLoading(true)
    try {
      await onSave(editValue)
      setIsEditing(false)
      showToast(`${label} updated successfully`, 'success')
    } catch (err) {
      showToast(err.message || `Failed to update ${label}`, 'error')
      setEditValue(value)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setEditValue(value)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="flex flex-col gap-2">
        <div className="relative">
          {Icon && <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />}
          <input
            type={type}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            placeholder={placeholder}
            className={`${inp} ${Icon ? 'pl-10' : ''} pr-24`}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
            <button
              onClick={handleSave}
              disabled={loading}
              className="p-1.5 rounded-lg bg-green-500 hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 size={14} className="animate-spin text-white" /> : <Check size={14} className="text-white" />}
            </button>
            <button
              onClick={handleCancel}
              className="p-1.5 rounded-lg bg-gray-300 hover:bg-gray-400 transition-colors"
            >
              <X size={14} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-medium text-slate-700 mt-0.5">{value || '—'}</p>
      </div>
      <button
        onClick={() => setIsEditing(true)}
        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
      >
        <Edit2 size={12} className="text-slate-500" />
      </button>
    </div>
  )
}

export default function Settings() {
  const { doctor, token, updateDoctor, logout } = useAuth()
  const { showToast } = useUI()

  // ── Profile data state ─────────────────────────────────
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // ── Modal states ────────────────────────────────────
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [show2FAModal, setShow2FAModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // ── Local UI states ─────────────────────────────────
  const [tele, setTele] = useState(true)
  const [emailN, setEmailN] = useState(true)
  const [sms, setSms] = useState(false)
  const [push, setPush] = useState(true)
  const [savingProfile, setSavingProfile] = useState(false)

  // Fetch profile data on mount
  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const data = await doctorsApi.getProfile(token)
      setProfile(data.data)
      // Update local UI with fetched data
      setTele(data.data.allow_video_consultations ?? true)
    } catch (err) {
      showToast('Failed to load profile data', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateField = async (field, value) => {
    const updateData = {
      full_name: profile.full_name,
      phone_number: profile.phone_number,
      specialty: profile.specialty,
      hospital: profile.hospital,
      consultation_fee: profile.consultation_fee,
    }
    
    // Update the specific field
    if (field === 'full_name') updateData.full_name = value
    if (field === 'phone_number') updateData.phone_number = value
    if (field === 'specialty') updateData.specialty = value
    if (field === 'hospital') updateData.hospital = value
    if (field === 'consultation_fee') updateData.consultation_fee = Number(value)
    
    await doctorsApi.updateProfile(token, updateData)
    
    // Update local state
    setProfile(prev => ({ ...prev, [field]: value }))
    
    // Update AuthContext
    updateDoctor({
      full_name: updateData.full_name,
      name: updateData.full_name,
      phone_number: updateData.phone_number,
      specialty: updateData.specialty,
      hospital: updateData.hospital,
      consultation_fee: updateData.consultation_fee,
    })
  }

  const handleUpdateConsultationTypes = async (field, value) => {
    setSavingProfile(true)
    try {
      // You would need an endpoint for this
      // For now, just update local state
      if (field === 'allow_video_consultations') {
        setTele(value)
      }
      showToast('Consultation preferences updated', 'success')
    } catch (err) {
      showToast(err.message || 'Failed to update', 'error')
    } finally {
      setSavingProfile(false)
    }
  }

  const initials = profile?.full_name?.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'DR'

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader size={32} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-slate-500">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        {/* Modals */}
        <ChangePasswordModal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          onSuccess={() => {}}
        />
        <Enable2FAModal
          isOpen={show2FAModal}
          onClose={() => setShow2FAModal(false)}
          onSuccess={() => setProfile(prev => ({ ...prev, two_factor_enabled: true }))}
        />
        <DeleteAccountModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={async () => {
            await doctorsApi.deleteAccount(token)
            showToast('Account deleted successfully', 'success')
            logout()
          }}
        />

        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight m-0">Settings</h1>
          <p className="text-sm text-slate-400 m-0 mt-1">Manage your account, preferences and security</p>
        </div>

        {/* Profile card */}
        <div className="card p-6">
          <div className="flex items-center gap-6 mb-7">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black text-white"
                style={{ background: 'linear-gradient(135deg,#137FEC,#13B6EC)', boxShadow: '0 8px 20px rgba(19,127,236,0.25)' }}>
                {initials}
              </div>
              <button className="absolute -bottom-1.5 -right-1.5 w-8 h-8 rounded-xl flex items-center justify-center border-2 border-white cursor-pointer"
                style={{ background: 'linear-gradient(135deg,#137FEC,#13B6EC)' }}>
                <Camera size={13} className="text-white" />
              </button>
            </div>
            <div>
              <p className="text-lg font-black text-slate-900 m-0">{profile?.full_name || 'Doctor'}</p>
              <p className="text-sm text-slate-400 m-0 mt-0.5">{profile?.specialty || 'Specialist'}</p>
              {profile?.hospital && <p className="text-xs text-slate-400 m-0 mt-0.5">{profile.hospital}</p>}
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="badge bg-primary-100 text-primary">Verified Doctor</span>
                <span className={`badge ${profile?.is_active ? 'bg-success-50 text-success-700' : 'bg-gray-100 text-gray-600'}`}>
                  {profile?.is_active ? 'Active' : 'Inactive'}
                </span>
                {profile?.two_factor_enabled && (
                  <span className="badge bg-blue-50 text-blue-600">2FA Enabled</span>
                )}
                {profile?.verification_status === 'verified' && (
                  <span className="badge bg-green-50 text-green-600">Verified</span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EditableField
              label="Full Name"
              value={profile?.full_name || ''}
              onSave={(val) => handleUpdateField('full_name', val)}
              placeholder="Dr. David Mwangi"
              required
              icon={User}
            />
            
            <EditableField
              label="Specialty"
              value={profile?.specialty || ''}
              onSave={(val) => handleUpdateField('specialty', val)}
              placeholder="Cardiology"
              required
              icon={Stethoscope}
            />
            
            <EditableField
              label="Phone Number"
              value={profile?.phone_number || ''}
              onSave={(val) => handleUpdateField('phone_number', val)}
              placeholder="+254700000000"
              required
              icon={Phone}
            />
            
            <EditableField
              label="Hospital / Clinic"
              value={profile?.hospital || ''}
              onSave={(val) => handleUpdateField('hospital', val)}
              placeholder="Nairobi General Hospital"
              icon={Hospital}
            />
            
            <EditableField
              label="Consultation Fee (KES)"
              value={profile?.consultation_fee?.toString() || ''}
              onSave={(val) => handleUpdateField('consultation_fee', val)}
              type="number"
              placeholder="2500"
              required
            />
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Email Address</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
                <input
                  type="email"
                  value={profile?.email || ''}
                  disabled
                  className={`${inp} pl-10 bg-slate-100 cursor-not-allowed text-slate-500`}
                />
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Email cannot be changed</p>
            </div>
          </div>
        </div>

        {/* Consultation settings */}
        <Section title="Consultation Settings">
          <div className="flex justify-between items-center pb-5 mb-5 border-b border-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                <Video size={16} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 m-0">Video Consultations</p>
                <p className="text-xs text-slate-400 m-0 mt-0.5">Accept online video consultations</p>
              </div>
            </div>
            <Toggle 
              on={profile?.allow_video_consultations ?? true} 
              onToggle={(val) => handleUpdateConsultationTypes('allow_video_consultations', val)} 
            />
          </div>
          
          <div className="flex justify-between items-center pb-5 mb-5 border-b border-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                <Users size={16} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 m-0">In-Person Consultations</p>
                <p className="text-xs text-slate-400 m-0 mt-0.5">Accept physical consultations</p>
              </div>
            </div>
            <Toggle 
              on={profile?.allow_in_person_consultations ?? true} 
              onToggle={(val) => handleUpdateConsultationTypes('allow_in_person_consultations', val)} 
            />
          </div>
          
          <div>
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.8px] mb-3">Working Hours</p>
            <div className="flex flex-col gap-2">
              {profile?.working_hours && profile.working_hours.length > 0 ? (
                profile.working_hours.map((wh, idx) => (
                  <div key={idx}
                    className="flex justify-between items-center px-4 py-3 rounded-xl"
                    style={{ background: 'linear-gradient(135deg,#EBF5FF,#D1E9FF)' }}
                  >
                    <span className="text-sm font-semibold text-slate-700">{wh.day}</span>
                    <span className="text-sm font-semibold text-primary">
                      {wh.open} – {wh.close}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-400 text-center py-4">No working hours set</p>
              )}
            </div>
          </div>
          
          {profile?.slot_duration && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Slot Duration</p>
              <div className="px-4 py-3 rounded-xl bg-slate-50">
                <span className="text-sm font-semibold text-slate-700">
                  {profile.slot_duration} minutes per appointment
                </span>
              </div>
            </div>
          )}
        </Section>

        {/* Notifications */}
        <Section title="Notifications">
          {[
            { icon: Bell, label: 'Email Notifications', desc: 'Appointment reminders and updates', val: emailN, toggle: () => setEmailN(!emailN) },
            { icon: Bell, label: 'SMS Alerts', desc: 'Text alerts for critical updates', val: sms, toggle: () => setSms(!sms) },
            { icon: Bell, label: 'Push Notifications', desc: 'Real-time app notifications', val: push, toggle: () => setPush(!push) },
          ].map(({ icon: Icon, label, desc, val, toggle }, i, arr) => (
            <div key={label}
              className={`flex justify-between items-center py-4 ${i < arr.length - 1 ? 'border-b border-slate-50' : ''}`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${val ? 'bg-primary-100' : 'bg-slate-100'}`}>
                  <Icon size={14} className={val ? 'text-primary' : 'text-slate-400'} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 m-0">{label}</p>
                  <p className="text-xs text-slate-400 m-0 mt-0.5">{desc}</p>
                </div>
              </div>
              <Toggle on={val} onToggle={toggle} />
            </div>
          ))}
        </Section>

        {/* Security */}
        <Section title="Security">
          <div
            onClick={() => setShowPasswordModal(true)}
            className="flex justify-between items-center py-4 cursor-pointer hover:bg-slate-50 -mx-2 px-2 rounded-xl transition-colors border-b border-slate-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                <Shield size={14} className="text-slate-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 m-0">Change Password</p>
                <p className="text-xs text-slate-400 m-0 mt-0.5">Update your account password</p>
              </div>
            </div>
            <ChevronRight size={15} className="text-slate-200" />
          </div>

          <div
            onClick={() => setShow2FAModal(true)}
            className="flex justify-between items-center py-4 cursor-pointer hover:bg-slate-50 -mx-2 px-2 rounded-xl transition-colors border-b border-slate-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                <Shield size={14} className="text-slate-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 m-0">Two-Factor Authentication</p>
                <p className="text-xs text-slate-400 m-0 mt-0.5">Add an extra layer of security</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              {profile?.two_factor_enabled ? (
                <span className="badge bg-green-50 text-green-700 flex items-center gap-1">
                  <Check size={12} /> Enabled
                </span>
              ) : (
                <span className="badge bg-warning-50 text-warning-700">Not Set</span>
              )}
              <ChevronRight size={15} className="text-slate-200" />
            </div>
          </div>

          <div
            onClick={() => setShowDeleteModal(true)}
            className="flex justify-between items-center py-4 cursor-pointer hover:bg-red-50 -mx-2 px-2 rounded-xl transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                <AlertTriangle size={14} className="text-red-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-red-900 m-0">Delete Account</p>
                <p className="text-xs text-red-500 m-0 mt-0.5">Permanently delete your account and all data</p>
              </div>
            </div>
            <ChevronRight size={15} className="text-red-200" />
          </div>
        </Section>
      </div>
    </div>
  )
}