import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const axiosInstance = axios.create({
  baseURL: backendUrl,
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      localStorage.setItem("lastActivity", Date.now().toString());
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
let isHandlingUnauthorized = false;

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized access (401) - broadcasting auth:unauthorized event.");
      localStorage.removeItem("token");
      localStorage.removeItem("lastActivity");
      
      if (!isHandlingUnauthorized) {
        isHandlingUnauthorized = true;
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        setTimeout(() => {
          isHandlingUnauthorized = false;
        }, 1000);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
