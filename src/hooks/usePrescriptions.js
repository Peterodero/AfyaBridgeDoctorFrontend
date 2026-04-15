// src/hooks/usePrescriptions.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext'
import { prescriptionsApi } from '../api/prescriptions'

export function useAllPrescriptions(patientId) {
  const { token } = useAuth()
  return useQuery({
    queryKey: ['prescriptions', 'all', patientId],
    queryFn:  () => prescriptionsApi.getAll(token, patientId),
    enabled:  !!token && !!patientId,
  })
}

export function useCurrentPrescriptions(patientId) {
  const { token } = useAuth()
  return useQuery({
    queryKey: ['prescriptions', 'current', patientId],
    queryFn:  () => prescriptionsApi.getCurrent(token, patientId),
    enabled:  !!token && !!patientId,
  })
}

export function useCreatePrescription() {
  const { token } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ patientId, items }) =>
      prescriptionsApi.create(token, { patientId, items }),
    onSuccess: (_res, variables) =>
      queryClient.invalidateQueries({ queryKey: ['prescriptions', 'all', variables.patientId] }),
  })
}
