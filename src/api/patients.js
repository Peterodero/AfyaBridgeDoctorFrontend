// src/api/patients.js
import { apiClient } from './client'

export const patientsApi = {
  // GET /doctors/patients
  getAll: (token) =>
    apiClient('/doctors/patients', { token }),

  // GET /doctors/patients/:patientId
  getById: (token, patientId) =>
    apiClient(`/doctors/patients/${patientId}`, { token }),

  // GET /doctors/search?q=...&type=patients
  search: (token, searchTerm) =>
    apiClient(`/doctors/search?q=${encodeURIComponent(searchTerm)}&type=patients`, { token }),

  // GET /doctors/patients/:patientId/vitals
  getVitals: (token, patientId) =>
    apiClient(`/doctors/patients/${patientId}/vitals`, { token }),

  // POST /doctors/patients/vitals
  addVitals: (token, vitalsData) =>
    apiClient('/doctors/patients/vitals', {
      token,
      method: 'POST',
      body: {
        patientId:              vitalsData.patientId,
        heartRate:              vitalsData.heartRate,
        bloodPressureSystolic:  vitalsData.bloodPressureSystolic,
        bloodPressureDiastolic: vitalsData.bloodPressureDiastolic,
        bloodGlucose:           vitalsData.bloodGlucose,
      },
    }),
}
