// src/hooks/useOrders.js
import { useMutation } from "@tanstack/react-query";
import { ordersApi } from "../api/orders";
import { useAuth } from "../context/AuthContext";

export const useCreateOrder = () => {
  const { token } = useAuth();

  return useMutation({
    mutationFn: ({ prescription_id, pharmacy_id, delivery_type }) =>
      ordersApi.createOrder(prescription_id, pharmacy_id, delivery_type, token),
  });
};
