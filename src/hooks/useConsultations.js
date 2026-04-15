// src/hooks/useConsultations.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext'
import { consultationsApi } from '../api/consultations'

export function useConsultationQueue() {
  const { token } = useAuth()
  return useQuery({
    queryKey:        ['consultations', 'queue'],
    queryFn:         () => consultationsApi.getQueue(token),
    enabled:         !!token,
    refetchInterval: 30000, // poll every 30 seconds
  })
}

export function useStartConsultation() {
  const { token } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (appointmentId) => consultationsApi.start(token, appointmentId),
    onSuccess:  () => {
      queryClient.invalidateQueries({ queryKey: ['consultations'] })
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
    },
  })
}

export function useEndConsultation() {
  const { token } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (consultationId) => consultationsApi.end(token, consultationId),
    onSuccess:  () => {
      queryClient.invalidateQueries({ queryKey: ['consultations'] })
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
    },
  })
}
