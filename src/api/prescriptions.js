// src/api/prescriptions.js
import { apiClient } from './client'

export const prescriptionsApi = {
  // POST /doctors/patients/prescriptions
  create: (token, { patientId, appointmentId, items, diagnosis, notes, priority }) =>
    apiClient('/doctors/patients/prescriptions', {
      token,
      method: 'POST',
      body: {
        patient_id: patientId,
        appointment_id: appointmentId,  // Add if backend supports it
        diagnosis: diagnosis,
        notes: notes,
        priority: priority,
        items: items.map((item) => ({
          name: item.drug_name || item.name,  // Handle both naming conventions
          dosage: item.dosage,
          quantity: item.quantity,  // Add quantity field
          frequency: item.frequency,
          duration: item.duration,  // Already formatted as "30 Days"
          route: item.route,
          instructions: item.notes || '',
        })),
      },
    }),

  // GET /doctors/patients/:patientId/prescriptions
  getAll: (token, patientId) =>
    apiClient(`/doctors/patients/${patientId}/prescriptions`, { token }),

  // GET /doctors/patients/:patientId/current/prescriptions
  getCurrent: (token, patientId) =>
    apiClient(`/doctors/patients/${patientId}/current/prescriptions`, { token }),
}