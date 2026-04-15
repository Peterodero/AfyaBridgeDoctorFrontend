// src/hooks/usePatients.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext'
import { patientsApi } from '../api/patients'

export function usePatients() {
  const { token } = useAuth()
  return useQuery({
    queryKey: ['patients'],
    queryFn:  () => patientsApi.getAll(token),
    enabled:  !!token,
  })
}

export function usePatient(patientId) {
  const { token } = useAuth()
  return useQuery({
    queryKey: ['patients', patientId],
    queryFn:  () => patientsApi.getById(token, patientId),
    enabled:  !!token && !!patientId,
  })
}

export function useSearchPatients(searchTerm) {
  const { token } = useAuth()
  return useQuery({
    queryKey: ['patients', 'search', searchTerm],
    queryFn:  () => patientsApi.search(token, searchTerm),
    enabled:  !!token && searchTerm.length > 1,
  })
}

export function usePatientVitals(patientId) {
  const { token } = useAuth()
  return useQuery({
    queryKey: ['vitals', patientId],
    queryFn:  () => patientsApi.getVitals(token, patientId),
    enabled:  !!token && !!patientId,
  })
}

export function useAddVitals() {
  const { token } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (vitalsData) => patientsApi.addVitals(token, vitalsData),
    onSuccess:  (_res, variables) =>
      queryClient.invalidateQueries({ queryKey: ['vitals', variables.patientId] }),
  })
}
