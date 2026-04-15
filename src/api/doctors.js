// src/api/doctors.js (add this method)
import { apiClient } from './client'

export const doctorsApi = {
  // GET /doctors/profile/
  getProfile: (token) =>
    apiClient('/doctors/profile/', {
      token,
      method: 'GET',
    }),

  // PUT /doctors/profile/personal
  updateProfile: (token, data) =>
    apiClient('/doctors/profile/personal', {
      token,
      method: 'PUT',
      body: {
        full_name: data.full_name,
        phone_number: data.phone_number,
        specialty: data.specialty,
        hospital: data.hospital,
        consultation_fee: Number(data.consultation_fee) || 0,
      },
    }),

  // POST /doctors/profile/change-password
  changePassword: (token, { currentPassword, newPassword, confirmPassword }) =>
    apiClient('/doctors/profile/change-password', {
      token,
      method: 'POST',
      body: {
        currentPassword,
        newPassword,
        confirmPassword,
      },
    }),

  // POST /doctors/profile/2fa/enable
  enable2FA: (token, { method, phoneNumber }) =>
    apiClient('/doctors/profile/2fa/enable', {
      token,
      method: 'POST',
      body: {
        method,
        phoneNumber: phoneNumber || undefined,
      },
    }),

  // DELETE /doctors/profile/
  deleteAccount: (token) =>
    apiClient('/doctors/profile/', {
      token,
      method: 'DELETE',
    }),
}