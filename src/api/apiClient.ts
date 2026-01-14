import axios from "axios";
import { getRuntimeBranch } from "./authRuntime";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const branchId = getRuntimeBranch() ?? 0;
  // if (branchId !== null && branchId !== undefined) {
    config.headers["X-Branch-Id"] = branchId;
  // }

  return config;
});

export default apiClient;
