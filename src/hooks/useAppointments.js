// src/hooks/useAppointments.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext'
import { appointmentsApi } from '../api/appointments'

// Fetches ALL appointments once — filtering happens client-side
export function useAppointments() {
  const { token } = useAuth()
  return useQuery({
    queryKey: ['appointments'],
    queryFn:  () => appointmentsApi.getAll(token),
    enabled:  !!token,
  })
}

export function useAppointment(id) {
  const { token } = useAuth()
  return useQuery({
    queryKey: ['appointments', id],
    queryFn:  () => appointmentsApi.getById(token, id),
    enabled:  !!token && !!id,
  })
}

export function useUpdateAppointmentStatus() {
  const { token } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }) => appointmentsApi.updateStatus(token, { id, status }),
    onSuccess:  () => queryClient.invalidateQueries({ queryKey: ['appointments'] }),
  })
}

export function useRescheduleAppointment() {
  const { token } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => appointmentsApi.reschedule(token, data),
    onSuccess:  () => queryClient.invalidateQueries({ queryKey: ['appointments'] }),
  })
}

export function useCancelAppointment() {
  const { token } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => appointmentsApi.cancel(token, id),
    onSuccess:  () => queryClient.invalidateQueries({ queryKey: ['appointments'] }),
  })
}