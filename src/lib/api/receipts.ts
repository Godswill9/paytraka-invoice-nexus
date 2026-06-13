import apiClient from "./client";
import { ApiResponse, PaginatedQuery, Receipt, ReceiptRequest } from "@/types/api";

export async function createReceipt(data: ReceiptRequest) {
  const response = await apiClient.post<ApiResponse<Receipt>>("/receipts", data);
  return response.data;
}

export async function listReceipts(params: Omit<PaginatedQuery, "search">) {
  const response = await apiClient.get<ApiResponse<Receipt[]>>("/receipts", { params });
  return response.data;
}

export async function getReceipt(id: string) {
  const response = await apiClient.get<ApiResponse<Receipt>>(`/receipts/${id}`);
  return response.data;
}

export async function getReceiptsByInvoice(invoiceId: string) {
  const response = await apiClient.get<ApiResponse<Receipt[]>>(`/receipts/invoice/${invoiceId}`);
  return response.data;
}
