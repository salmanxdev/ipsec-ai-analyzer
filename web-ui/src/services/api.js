// Base API client wrapper for IPsec AI Analyzer
// Connects React frontend client to FastAPI backend at http://localhost:8000/api

const BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const apiClient = {
  async get(endpoint) {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.warn(`[API GET FALLBACK] Backend offline at ${BASE_URL}${endpoint}:`, err);
    }
    return null;
  },

  async post(endpoint, body) {
    try {
      const isFormData = body instanceof FormData;
      const headers = isFormData ? {} : { 'Content-Type': 'application/json' };
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: isFormData ? body : JSON.stringify(body)
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.warn(`[API POST FALLBACK] Backend offline at ${BASE_URL}${endpoint}:`, err);
    }
    return null;
  }
};
