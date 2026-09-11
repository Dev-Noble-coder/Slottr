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
                
                // Only redirect to login for protected routes that require authentication
                const path = window.location.pathname;
                const isProtectedRoute = path.startsWith('/provider') || path.startsWith('/admin') || path.startsWith('/user');
                const isAuthPage = path.includes('/login') || path.includes('/signup') || path.includes('/forgot-password') || path.includes('/reset-password') || path.includes('/accept-invitation');

                if (isProtectedRoute && !isAuthPage) {
                    const loginPath = path.startsWith('/provider') 
                        ? '/provider-login' 
                        : (path.startsWith('/admin') ? '/admin/login' : '/login');
                    window.location.href = loginPath;
                }
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);

export default api;
