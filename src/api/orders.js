// src/api/orders.js
import { apiClient } from './client';

export const ordersApi = {
  // POST /orders
  createOrder: (prescription_id, pharmacy_id, delivery_type, token) =>
    apiClient('/doctors/orders', {
      token,
      method: 'POST',
      body: { 
        prescription_id,
        pharmacy_id,
        delivery_type,
      },
    }),
};