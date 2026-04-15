// src/api/auth.js
import { apiClient } from './client'
import axios from 'axios'

const BACKEND_URL = 'https://afya-bridge.onrender.com/api/admin/auth'

export const authApi = {
  login: (credentials) =>
    apiClient('/doctors/auth/login', {
      method: 'POST',
      body: {
        email:    credentials.email,
        password: credentials.password,
      },
    }),

  register: (formData) =>
    apiClient('/doctors/auth/register', {
      method: 'POST',
      body: {
        role:                          'doctor',
        full_name:                     formData.full_name,
        email:                         formData.email,
        password_hash:                  formData.password,
        phone_number:                  formData.phone_number,
        gender:                        formData.gender ?? 'other',
        specialty:                     formData.specialty,
        hospital:                      formData.hospital ?? '',
        consultation_fee:              formData.consultation_fee ?? 0,
        allow_video_consultations:     formData.allow_video_consultations ?? true,
        allow_in_person_consultations: formData.allow_in_person_consultations ?? true,
        slot_duration:                 formData.slot_duration ?? 30,
        working_hours:                 formData.working_hours ?? [],
        documents:                     formData.documents ?? [],
        verification_status:           'pending_verification',
        account_status:                'active',
      },
    }),

  
  // Step 1: Send OTP to phone number (uses email to find phone)
  sendOTP: (email) => {
    return axios.post(`${BACKEND_URL}/send-otp`, {
      email: email,
    })
  },

  // Step 2: Verify OTP code
  verifyOTP: (email, otpCode) => {
    return axios.post(`${BACKEND_URL}/verify-otp`, {
      email: email,
      otp_code: otpCode,
    })
  },

  // Step 3: Reset password using resetToken
  resetPassword: (resetToken, newPassword) => {
    return axios.post(`${BACKEND_URL}/reset-password`, {
      resetToken: resetToken,
      newPassword: newPassword,
    })
  },
}