// src/api/pharmacies.js
import { apiClient } from './client';

export const pharmaciesApi = {
  // GET /pharmacies/search
  getPharmacies: (token, county = null) => {
    const endpoint = county 
      ? `/doctors/pharmacies/search?county=${encodeURIComponent(county)}`
      : '/doctors/pharmacies/search';
    
    return apiClient(endpoint, {
      token,
      method: 'GET',
    });
  },
};