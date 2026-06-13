import apiClient from "./client";
import { ApiResponse, Customer, CustomerRequest, PaginatedQuery } from "@/types/api";

export async function createCustomer(data: CustomerRequest) {
  const response = await apiClient.post<ApiResponse<Customer>>("/customers", data);
  return response.data;
}

export async function listCustomers(params: PaginatedQuery) {
  const response = await apiClient.get<ApiResponse<Customer[]>>("/customers", { params });
  return response.data;
}

export async function getCustomer(id: string) {
  const response = await apiClient.get<ApiResponse<Customer>>(`/customers/${id}`);
  return response.data;
}

export async function updateCustomer(id: string, data: Partial<CustomerRequest>) {
  const response = await apiClient.patch<ApiResponse<Customer>>(`/customers/${id}`, data);
  return response.data;
}

export async function deleteCustomer(id: string) {
  const response = await apiClient.delete<ApiResponse<null>>(`/customers/${id}`);
  return response.data;
}

export async function exportCustomers() {
  const response = await apiClient.get<Blob>("/customers/export", { responseType: "blob" });
  return response.data;
}

export async function importCustomers(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await apiClient.post<ApiResponse<Customer[]>>("/customers/import", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}
