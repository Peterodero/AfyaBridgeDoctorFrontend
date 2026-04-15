// src/api/prescriptions.js
import { apiClient } from './client'

export const prescriptionsApi = {
  // POST /doctors/patients/prescriptions
  create: (token, { patientId, items }) =>
    apiClient('/doctors/patients/prescriptions', {
      token,
      method: 'POST',
      body: {
        patient_id: patientId,
        items: items.map((item) => ({
          name:         item.drug,
          dosage:       item.dosage,
          frequency:    item.freq,
          duration:     `${item.duration} ${item.durationUnit}`,
          instructions: item.notes ?? '',
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
