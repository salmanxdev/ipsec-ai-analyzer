// Base API client wrapper for IPsec AI Analyzer
// Cleanly abstracts API requests so the backend can be attached seamlessly later.

const BASE_URL = import.meta.env?.VITE_API_BASE_URL || '/api';

export const apiClient = {
  async get(endpoint) {
    console.log(`[API CLIENT GET] ${BASE_URL}${endpoint}`);
    // Simulated backend delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { status: 200, ok: true };
  },

  async post(endpoint, body) {
    console.log(`[API CLIENT POST] ${BASE_URL}${endpoint}`, body);
    await new Promise((resolve) => setTimeout(resolve, 400));
    return { status: 200, ok: true };
  }
};
