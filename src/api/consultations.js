// src/api/consultations.js
import { apiClient } from './client'

export const consultationsApi = {
  // GET /consultations/queue
  getQueue: (token) =>
    apiClient('/doctors/consultations/queue', { token }),

  // POST /consultations/start
  start: (token, appointmentId) =>
    apiClient('/doctors/consultations/start', {
      token,
      method: 'POST',
      body: { appointmentId },
    }),

  // POST /consultations/:consultationId/end
  end: (token, consultationId) =>
    apiClient(`/doctors/consultations/${consultationId}/end`, {
      token,
      method: 'POST',
    }),

  // GET /appointments/:id/consultation  (patient polling)
  getByAppointment: (token, appointmentId) =>
    apiClient(`/doctors/appointments/${appointmentId}/consultation`, { token }),
}
