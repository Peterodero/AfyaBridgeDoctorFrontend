

// src/api/appointments.js
import { apiClient } from './client'

export const appointmentsApi = {

  // GET /appointments — fetches all, filter client-side
  getAll: (token) =>
    apiClient('/doctors/appointments', { token }),

  // GET /appointments/:id
  getById: (token, id) =>
    apiClient(`/doctors/appointments/${id}`, { token }),

  // PATCH /appointments/:id/status
  updateStatus: (token, { id, status }) =>
    apiClient(`/doctors/appointments/${id}/status`, {
      token,
      method: 'PATCH',
      body: { status },
    }),

  // POST /appointments/:id/reschedule
  reschedule: (token, { id, newDate, newTime, reason }) =>
    apiClient(`/doctors/appointments/${id}/reschedule`, {
      token,
      method: 'POST',
      body: { newDate, newTime, reason },
    }),

  // POST /appointments/:id/cancel
  cancel: (token, id) =>
    apiClient(`/doctors/appointments/${id}/cancel`, {
      token,
      method: 'POST',
    }),
}