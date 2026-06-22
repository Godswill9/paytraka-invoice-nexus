import apiClient from "./client";
import { ApiResponse, PaginatedQuery, PurchaseInvoice } from "@/types/api";

export async function listPurchaseInvoices(params: PaginatedQuery) {
  const response = await apiClient.get<ApiResponse<PurchaseInvoice[]>>("/purchase-invoices", { params });
  return response.data;
}
