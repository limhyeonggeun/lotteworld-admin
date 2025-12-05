import axios from "axios";

const isLocalhost =
  typeof window !== "undefined" && window.location.hostname === "localhost";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 
  (isLocalhost
    ? "http://localhost:5040"
    : "https://lotteworld-backend-production.up.railway.app");

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.log("[API ERROR]", {
      method: err?.config?.method,
      url: err?.config?.url,
      baseURL: API_BASE,
      status: err?.response?.status,
      data: err?.response?.data,
    });
    return Promise.reject(err);
  }
);

export default api;