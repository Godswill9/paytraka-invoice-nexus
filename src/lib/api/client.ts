import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

export const API_BASE_URL = process.env.PAYTRAKA_API_BASE_URL
  ?? process.env.NEXT_PUBLIC_API_BASE_URL
  ?? "https://paytraka-api.domain-plusltd.com/api";

const browserBaseURL = "/api/proxy";

export const publicApiClient = axios.create({
  baseURL: typeof window === "undefined" ? API_BASE_URL : browserBaseURL,
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
    const status = error.response?.status;
    const data = error.response?.data as { message?: string; errors?: Record<string, string[] | string> } | undefined;
    const message = normalizeApiMessage(data?.message);

    if (status === 401 || status === 403) return message ?? "The email or password you entered is incorrect.";
    if (status === 409) return message ?? "An account with this email already exists. Sign in or use another email.";
    if (status === 400 || status === 422) return message ?? firstValidationError(data?.errors) ?? "Some information is missing or invalid. Please review the form and try again.";
    if (status && status >= 500) return "PayTraka is temporarily unavailable. Please try again in a few minutes.";
    if (error.code === "ERR_NETWORK" || error.message === "Network Error" || !error.response) return "We could not reach PayTraka right now. Check your connection and try again.";
    return message ?? fallback;
  }
  if (error instanceof Error) {
    if (/network/i.test(error.message)) return "We could not reach PayTraka right now. Check your connection and try again.";
    return normalizeApiMessage(error.message) ?? fallback;
  }
  return fallback;
}

function normalizeApiMessage(message?: string) {
  if (!message) return undefined;
  if (/network error/i.test(message)) return undefined;
  if (/certificate|stack|trace|ECONN|ENOTFOUND|fetch failed/i.test(message)) return undefined;
  return message;
}

function firstValidationError(errors?: Record<string, string[] | string>) {
  if (!errors) return undefined;
  const [field, value] = Object.entries(errors)[0] ?? [];
  if (!field) return undefined;
  const message = Array.isArray(value) ? value[0] : value;
  return message ? `${field}: ${message}` : undefined;
}

export default apiClient;
