import apiClient from "./client";
import { ApiResponse, Company, CompanyKycRequest, CompanyMode } from "@/types/api";

export async function getCompany(companyId: string) {
  const response = await apiClient.get<ApiResponse<Company>>(`/companies/${companyId}`);
  return response.data;
}

export async function submitKyc(companyId: string, data: CompanyKycRequest) {
  const response = await apiClient.patch<ApiResponse<Company>>(`/companies/${companyId}/kyc`, data);
  return response.data;
}

export async function getCompanyMode(companyId: string) {
  const response = await apiClient.get<ApiResponse<CompanyMode>>(`/companies/${companyId}/mode`);
  return response.data;
}
