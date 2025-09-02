const isDevelopment = import.meta.env.DEV;

const LOCAL_IP = import.meta.env.VITE_LOCAL_IP;
const LOCAL_PORT = import.meta.env.VITE_API_PORT;

// API Configuration
export const API_CONFIG = {
  DEVELOPMENT_URL: `http://${LOCAL_IP}:${LOCAL_PORT}`,

  PRODUCTION_URL: import.meta.env.VITE_API_URL,

  // Current base URL based on environment
  get BASE_URL() {
    return isDevelopment ? this.DEVELOPMENT_URL : this.PRODUCTION_URL;
  },
};

export const BASE_URL = API_CONFIG.BASE_URL;

// Helper functions
export const getApiUrl = (endpoint: string = '') => {
  return `${BASE_URL}${endpoint}`;
};

if (isDevelopment) {
  console.log('API Configuration:', {
    environment: process.env.NODE_ENV || 'development',
    baseUrl: BASE_URL,
  });
}
