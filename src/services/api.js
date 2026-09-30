import axios from "axios";
import { getToken, clearSession } from "./session";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const isLoginRequest = error.config?.url === "/login";
    // 401 pada endpoint lain berarti sesi habis. Untuk /login berarti kredensial salah,
    // jadi jangan redirect agar pesan error tetap tampil di form.
    if (error.response?.status === 401 && !isLoginRequest) {
      clearSession();
      if (window.location.pathname !== "/login")
        window.location.assign("/login?expired=1");
    }
    return Promise.reject(error);
  },
);

export function getErrorMessage(
  error,
  fallback = "Terjadi kesalahan, coba lagi",
) {
  if (!error.response)
    return "Tidak dapat terhubung ke server. Pastikan backend berjalan.";
  const data = error.response.data;
  const firstFieldError = data?.errors && Object.values(data.errors)[0];
  return firstFieldError || data?.message || fallback;
}

export const getFieldErrors = (error) => error.response?.data?.errors || {};

// Buang parameter kosong agar query string tetap bersih.
export const clean = (params = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== "" && v !== null && v !== undefined,
    ),
  );

export default api;
