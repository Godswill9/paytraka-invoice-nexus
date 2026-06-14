import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://paytraka-api.domain-plusltd.com/api";

const browserBaseURL = "/api/proxy";

export const publicApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

const apiClient = axios.create({
  baseURL: typeof window === "undefined" ? API_BASE_URL : browserBaseURL,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => config);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const retryableConfig = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (typeof window !== "undefined" && error.response?.status === 401 && retryableConfig && !retryableConfig._retry) {
      retryableConfig._retry = true;
      try {
        await fetch("/api/auth/session", { method: "DELETE" });
      } finally {
        window.location.href = "/login?session=expired";
      }
    }

    return Promise.reject(error);
  },
);

export function getApiErrorMessage(error: unknown, fallback = "Request failed") {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    return data?.message ?? error.message ?? fallback;
  }
  return error instanceof Error ? error.message : fallback;
}

export default apiClient;
