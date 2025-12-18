import axios, { InternalAxiosRequestConfig } from "axios";

interface RetryAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const axiosInstance = axios.create({
  // withCredentials:true,
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

/* ============================
   REQUEST INTERCEPTOR
============================ */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); // ✅ FIX
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ============================
   RESPONSE INTERCEPTOR
============================ */
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryAxiosRequestConfig;

    if (!error.response) {
      return Promise.reject(new Error("No response from server"));
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshRes = await axiosInstance.get("/auth/refresh");

        const newToken = refreshRes.data?.accessToken;
        if (newToken) {
          localStorage.setItem("accessToken", newToken); // ✅ FIX
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return axiosInstance(originalRequest);
        }
      } catch {
        // 🔥 Token truly expired
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");

        return Promise.reject(
          new Error("Session expired. Please log in again.")
        );
      }
    }

    const status = error.response.status;
    const message = error.response.data?.message || "Something went wrong";
    return Promise.reject(new Error(`Error ${status}: ${message}`));
  }
);

export default axiosInstance;
