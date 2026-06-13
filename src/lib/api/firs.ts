import apiClient from "./client";
import { ApiResponse, FirsHealth, FirsPaymentStatusRequest, FirsQrCode, FirsSubmitRequest, SalesInvoice } from "@/types/api";

export async function submitToFirs(data: FirsSubmitRequest) {
  const response = await apiClient.post<ApiResponse<SalesInvoice>>("/firs/submit", data);
  return response.data;
}

export async function updateFirsPaymentStatus(data: FirsPaymentStatusRequest) {
  const response = await apiClient.post<ApiResponse<SalesInvoice>>("/firs/payment-status", data);
  return response.data;
}

export async function getFirsQrCode(invoiceId: string) {
  const response = await apiClient.get<ApiResponse<FirsQrCode>>(`/firs/invoices/${invoiceId}/qr`);
  return response.data;
}

export async function checkFirsHealth() {
  const response = await apiClient.get<ApiResponse<FirsHealth>>("/firs/health");
  return response.data;
}
