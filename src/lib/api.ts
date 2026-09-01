import axios from "axios";
import Cookies from "js-cookie";

// Fallback to localhost if the env variable is not set
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = Cookies.get('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // If the error status is 401 and there is no originalRequest._retry flag,
        // it means the token has expired and we need to refresh it
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                // Call refresh endpoint
                // We use base axios to avoid infinite interceptor loops
                const baseUrl = (API_BASE_URL || '').replace(/\/$/, '');
                const response = await axios.post(`${baseUrl}/api/users/refresh`, {}, {
                    withCredentials: true
                });
                
                // If backend returns the token in JSON body
                const newToken = response.data.accessToken || response.data.token;
                if (newToken) {
                    Cookies.set('accessToken', newToken);
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                }
                
                // Retry the original request with the new token
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed (e.g., refresh token expired)
                Cookies.remove('accessToken');
                
                // Only redirect if not already on an auth page, and not on the home page
                const path = window.location.pathname;
                if (!path.includes('/login') && !path.includes('/signup') && path !== '/') {
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);

export default api;
