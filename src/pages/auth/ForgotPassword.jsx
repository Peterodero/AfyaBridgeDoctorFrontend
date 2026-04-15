// src/pages/auth/ForgotPassword.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react'
import { authApi } from '../../api/auth'

export default function ForgotPassword() {
  const [step, setStep] = useState('email') // 'email' | 'otp' | 'reset' | 'success'
  const [email, setEmail] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [resetToken, setResetToken] = useState('')

  // Step 1: Send OTP to phone
  const handleSendOTP = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }

    setLoading(true)
    try {
      const res = await authApi.sendOTP(email)
      setStep('otp')
      setSuccess('OTP sent to your registered phone number')
      console.log(res)
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to send OTP'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Verify OTP code
  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!otpCode.trim()) {
      setError('Please enter the OTP sent to your phone.')
      return
    }
    if (otpCode.length !== 6) {
      setError('OTP must be 6 digits.')
      return
    }

    setLoading(true)
    try {
      const res = await authApi.verifyOTP(email, otpCode)
      setResetToken(res.data.resetToken)
      setStep('reset')
      setSuccess('')
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Invalid OTP'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Step 3: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!newPassword.trim()) {
      setError('Please enter a new password.')
      return
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (newPassword.length > 15) {
      setError('Password must not exceed 15 characters.')
      return
    }
    if (!/[A-Z]/.test(newPassword)) {
      setError('Password must contain at least one uppercase letter.')
      return
    }
    if (!/[a-z]/.test(newPassword)) {
      setError('Password must contain at least one lowercase letter.')
      return
    }
    if (!/[0-9]/.test(newPassword)) {
      setError('Password must contain at least one number.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const res = await authApi.resetPassword(resetToken, newPassword)
      setStep('success')
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to reset password'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Resend OTP
  const handleResendOTP = async () => {
    setLoading(true)
    setError('')
    try {
      await authApi.sendOTP(email)
      setSuccess('OTP resent to your phone number')
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to resend OTP'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-page flex">

      {/* Left panel */}
      <div className="hidden lg:flex w-130 shrink-0 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0E6CC4 0%, #137FEC 55%, #13B6EC 100%)' }}>
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/6" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-white/6" />
        <div className="absolute top-1/3 right-12 w-24 h-24 rounded-full bg-white/4" />

        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
              <path d="M10 2C8.5 2 7.5 3 7.5 4.5V7H5C3.5 7 2.5 8 2.5 9.5C2.5 11 3.5 12 5 12H7.5V14.5C7.5 16 8.5 17 10 17C11.5 17 12.5 16 12.5 14.5V12H15C16.5 12 17.5 11 17.5 9.5C17.5 8 16.5 7 15 7H12.5V4.5C12.5 3 11.5 2 10 2Z" fill="white" />
            </svg>
          </div>
          <div>
            <p className="text-xl font-black text-white tracking-tight m-0">AfyaBridge</p>
            <p className="text-[10px] font-semibold text-white/60 uppercase tracking-[0.8px] m-0">Doctor Portal</p>
          </div>
        </div>

        <div className="relative z-10">
          <h2 className="text-[40px] font-black text-white leading-[1.1] m-0 mb-4">
            Reset your<br />password
          </h2>
          <p className="text-base text-white/65 leading-relaxed m-0 mb-10">
            We'll send a One-Time Password (OTP) to your registered phone number via SMS. Enter the code to reset your password securely.
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[{ v:'24/7', l:'Support' }, { v:'Secure', l:'Recovery' }, { v:'5 min', l:'Process' }].map(({ v, l }) => (
              <div key={l} className="rounded-2xl p-4 text-center" style={{ background:'rgba(255,255,255,0.12)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.15)' }}>
                <p className="text-2xl font-black text-white m-0">{v}</p>
                <p className="text-[11px] text-white/55 m-0 mt-1">{l}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-white/40 relative z-10 m-0 italic">"Secure password recovery for healthcare professionals."</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-page overflow-y-auto">
        <div className="w-full max-w-110">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-blue-sm"
              style={{ background:'linear-gradient(135deg,#137FEC,#13B6EC)' }}>
              <svg width="19" height="19" viewBox="0 0 20 20" fill="none">
                <path d="M10 2C8.5 2 7.5 3 7.5 4.5V7H5C3.5 7 2.5 8 2.5 9.5C2.5 11 3.5 12 5 12H7.5V14.5C7.5 16 8.5 17 10 17C11.5 17 12.5 16 12.5 14.5V12H15C16.5 12 17.5 11 17.5 9.5C17.5 8 16.5 7 15 7H12.5V4.5C12.5 3 11.5 2 10 2Z" fill="white" />
              </svg>
            </div>
            <p className="text-lg font-black text-slate-900 m-0">AfyaBridge</p>
          </div>

          <div className="bg-white rounded-2xl p-8" style={{ boxShadow:'0 8px 40px rgba(0,0,0,0.08)' }}>
            
            {/* Success State */}
            {step === 'success' && (
              <div className="flex flex-col items-center text-center gap-5">
                <div className="w-16 h-16 rounded-full bg-success-50 flex items-center justify-center">
                  <CheckCircle size={32} className="text-success" />
                </div>
                <div>
                  <h1 className="text-[26px] font-black text-slate-900 tracking-tight m-0">Password reset successfully!</h1>
                  <p className="text-sm text-slate-400 m-0 mt-2 leading-relaxed">
                    Your password has been updated. You can now sign in with your new password.
                  </p>
                </div>

                <Link
                  to="/login"
                  className="w-full h-11 rounded-xl text-white text-sm font-semibold border-none cursor-pointer transition-all no-underline flex items-center justify-center gap-2 mt-2"
                  style={{ background:'linear-gradient(135deg,#137FEC,#13B6EC)', boxShadow:'0 4px 14px rgba(19,127,236,0.35)' }}
                >
                  Back to Sign In
                </Link>
              </div>
            )}

            {/* Step 1: Email Verification */}
            {step === 'email' && (
              <>
                <Link to="/login" className="inline-flex items-center text-primary gap-1.5 text-sm font-semibold no-underline hover:text-slate-600 transition-colors mb-7">
                  <ArrowLeft size={15} /> Back to Sign In
                </Link>

                <div className="mb-7">
                  <h1 className="text-[26px] font-black text-slate-900 tracking-tight m-0">Forgot password?</h1>
                  <p className="text-sm text-slate-400 m-0 mt-1.5">
                    Enter your registered email. We'll send an OTP to your phone.
                  </p>
                </div>

                {error && (
                  <div className="flex items-center gap-3 px-4 py-3 bg-danger-50 rounded-xl mb-5">
                    <AlertCircle size={15} className="text-danger shrink-0" />
                    <p className="text-sm font-medium text-danger-700 m-0">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSendOTP} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.8px]">Email Address</label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="doctor@afyabridge.com"
                        className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-150 rounded-xl text-sm text-slate-700 placeholder:text-slate-300 outline-none font-sans focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                        autoComplete="email"
                        autoFocus
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 rounded-xl text-white text-sm font-semibold border-none cursor-pointer transition-all disabled:opacity-60 mt-1"
                    style={{ background:'linear-gradient(135deg,#137FEC,#13B6EC)', boxShadow:'0 4px 14px rgba(19,127,236,0.35)' }}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending OTP…
                      </span>
                    ) : 'Send OTP'}
                  </button>
                </form>

                <p className="text-sm text-slate-400 text-center mt-6 m-0">
                  Remember your password?{' '}
                  <Link to="/login" className="font-bold text-blue-500  no-underline hover:underline">
                    Sign in
                  </Link>
                </p>
              </>
            )}

            {/* Step 2: Verify OTP */}
            {step === 'otp' && (
              <>
                <div className="mb-7">
                  <h1 className="text-[26px] font-black text-slate-900 tracking-tight m-0">Enter OTP</h1>
                  <p className="text-sm text-slate-400 m-0 mt-1.5">
                    We sent a 6-digit OTP to the phone number linked to <span className="font-semibold text-slate-600">{email}</span>
                  </p>
                </div>

                {error && (
                  <div className="flex items-center gap-3 px-4 py-3 bg-danger-50 rounded-xl mb-5">
                    <AlertCircle size={15} className="text-danger shrink-0" />
                    <p className="text-sm font-medium text-danger-700 m-0">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="flex items-center gap-3 px-4 py-3 bg-success-50 rounded-xl mb-5">
                    <CheckCircle size={15} className="text-success shrink-0" />
                    <p className="text-sm font-medium text-success-700 m-0">{success}</p>
                  </div>
                )}

                <form onSubmit={handleVerifyOTP} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.8px]">OTP Code</label>
                    <input
                      type="text"
                      value={otpCode}
                      onChange={e => setOtpCode(e.target.value)}
                      placeholder="000000"
                      maxLength="6"
                      className="w-full h-11 px-4 bg-slate-50 border border-slate-150 rounded-xl text-sm text-slate-700 placeholder:text-slate-300 outline-none font-mono font-semibold text-center tracking-widest focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                      autoFocus
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 rounded-xl text-white text-sm font-semibold border-none cursor-pointer transition-all disabled:opacity-60 mt-1"
                    style={{ background:'linear-gradient(135deg,#137FEC,#13B6EC)', boxShadow:'0 4px 14px rgba(19,127,236,0.35)' }}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Verifying…
                      </span>
                    ) : 'Verify OTP'}
                  </button>
                </form>

                <p className="text-sm text-slate-400 text-center mt-4 m-0">
                  Didn't receive the OTP?{' '}
                  <button
                    onClick={handleResendOTP}
                    disabled={loading}
                    className="text-primary font-semibold bg-transparent border-none cursor-pointer p-0 text-sm hover:underline disabled:opacity-60"
                  >
                    Resend
                  </button>
                </p>

                <button
                  onClick={() => {
                    setStep('email')
                    setError('')
                    setSuccess('')
                  }}
                  className="w-full text-center text-sm text-primary font-semibold bg-transparent border-none cursor-pointer mt-4 hover:underline"
                >
                  Try different email
                </button>
              </>
            )}

            {/* Step 3: Reset Password */}
            {step === 'reset' && (
              <>
                <div className="mb-7">
                  <h1 className="text-[26px] font-black text-slate-900 tracking-tight m-0">Create new password</h1>
                  <p className="text-sm text-slate-400 m-0 mt-1.5">
                    Enter a strong password to secure your account.
                  </p>
                </div>

                {error && (
                  <div className="flex items-center gap-3 px-4 py-3 bg-danger-50 rounded-xl mb-5">
                    <AlertCircle size={15} className="text-danger shrink-0" />
                    <p className="text-sm font-medium text-danger-700 m-0">{error}</p>
                  </div>
                )}

                <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.8px]">New Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full h-11 pl-4 pr-11 bg-slate-50 border border-slate-150 rounded-xl text-sm text-slate-700 placeholder:text-slate-300 outline-none font-sans focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer text-sm"
                      >
                        {showPassword ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                    <p className="text-xs text-slate-400 m-0 mt-1">
                      Must be 8-15 characters with uppercase, lowercase, and number
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.8px]">Confirm Password</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full h-11 pl-4 pr-4 bg-slate-50 border border-slate-150 rounded-xl text-sm text-slate-700 placeholder:text-slate-300 outline-none font-sans focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 rounded-xl text-white text-sm font-semibold border-none cursor-pointer transition-all disabled:opacity-60 mt-1"
                    style={{ background:'linear-gradient(135deg,#137FEC,#13B6EC)', boxShadow:'0 4px 14px rgba(19,127,236,0.35)' }}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Resetting…
                      </span>
                    ) : 'Reset Password'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}