// src/hooks/usePharmacies.js
import { useQuery } from '@tanstack/react-query';
import { pharmaciesApi } from '../api/pharmacies';
import { useAuth } from '../context/AuthContext';

export const usePharmacies = (county = null) => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ['pharmacies', county],
    queryFn: () => pharmaciesApi.getPharmacies(token, county),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });
};