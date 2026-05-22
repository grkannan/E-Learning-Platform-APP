// src/utils/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "https://e-learning-platform-api-g41a.onrender.com",
  withCredentials: true,
});

// If the backend uses Django's CSRF, the cookie name is typically `csrftoken`.
// Your current cookie name is misspelled (`csrfoken`) which can break CSRF-protected POSTs.
axiosInstance.defaults.xsrfHeaderName = "X-CSRFToken";
axiosInstance.defaults.xsrfCookieName = "csrftoken";


// Request: Attach token
axiosInstance.interceptors.request.use(
  (config) => {
    const access = localStorage.getItem("access");
    if (access) {
      config.headers.Authorization = `Bearer ${access}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response: Refresh on 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token expired and not already retried
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("refresh")
    ) {
      originalRequest._retry = true;
      try {
        const refresh = localStorage.getItem("refresh");
        const res = await axiosInstance.post(
          "/api/token/refresh/",
          {
            refresh: refresh,
          }
        );


        const newAccess = res.data.access;
        localStorage.setItem("access", newAccess);
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newAccess}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;

        return axiosInstance(originalRequest);
      } catch (err) {
        console.log("Refresh token expired. Logging out.");
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
