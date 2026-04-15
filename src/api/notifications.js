// src/api/notifications.js
import { apiClient } from './client'

export const notificationsApi = {
  // GET /notifications
  getNotifications: (token) =>
    apiClient('/doctors/notifications', {
      token,
      method: 'GET',
    }),

  // GET /notifications/unread/count
  getUnreadCount: (token) =>
    apiClient('/doctors/notifications/unread/count', {
      token,
      method: 'GET',
    }),

  // PATCH /notifications/:id/read
  markAsRead: (token, id) =>
    apiClient(`/doctors/notifications/${id}/read`, {
      token,
      method: 'PATCH',
    }),

  // POST /notifications/read-all
  markAllAsRead: (token) =>
    apiClient('/doctors/notifications/read-all', {
      token,
      method: 'POST',
    }),

  // DELETE /notifications/:id
  deleteNotification: (token, id) =>
    apiClient(`/doctors/notifications/${id}`, {
      token,
      method: 'DELETE',
    }),

  // DELETE /notifications/delete-all
  deleteAllNotifications: (token) =>
    apiClient('/doctors/notifications/delete-all', {
      token,
      method: 'DELETE',
    }),
}