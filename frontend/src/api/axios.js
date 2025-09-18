import axios from 'axios';
import store from '../redux/store.js';
import { setAuth, clearAuth } from '../redux/slices/authSlice.js';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// request: attach access token from redux
api.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.auth?.accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (err) => Promise.reject(err));

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(p => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    // If 401 and not previously retried, attempt refresh
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // queue the request while refreshing
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = 'Bearer ' + token;
          return api(originalRequest);
        }).catch(err => Promise.reject(err));
      }

      isRefreshing = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        store.dispatch(clearAuth());
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(`${API_BASE}/auth/refresh`, { token: refreshToken }, { withCredentials: true });
        const newAccess = data.data.accessToken;
        const state = store.getState();
        const user = state.auth.user;
        store.dispatch(setAuth({ user, accessToken: newAccess }));
        processQueue(null, newAccess);
        originalRequest.headers.Authorization = 'Bearer ' + newAccess;
        return api(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        store.dispatch(clearAuth());
        localStorage.removeItem('refreshToken');
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
