import apiClient from "./client";
import { ApiResponse, PaginatedQuery, Product, ProductCategory, ProductCategoryRequest, ProductRequest } from "@/types/api";

export async function createCategory(data: ProductCategoryRequest) {
  const response = await apiClient.post<ApiResponse<ProductCategory>>("/products/categories", data);
  return response.data;
}

export async function listCategories() {
  const response = await apiClient.get<ApiResponse<ProductCategory[]>>("/products/categories");
  return response.data;
}

export async function updateCategory(id: string, data: Partial<ProductCategoryRequest>) {
  const response = await apiClient.patch<ApiResponse<ProductCategory>>(`/products/categories/${id}`, data);
  return response.data;
}

export async function deleteCategory(id: string) {
  const response = await apiClient.delete<ApiResponse<null>>(`/products/categories/${id}`);
  return response.data;
}

export async function createProduct(data: ProductRequest) {
  const response = await apiClient.post<ApiResponse<Product>>("/products", data);
  return response.data;
}

export async function listProducts(params: PaginatedQuery) {
  const response = await apiClient.get<ApiResponse<Product[]>>("/products", { params });
  return response.data;
}

export async function getProduct(id: string) {
  const response = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
  return response.data;
}

export async function updateProduct(id: string, data: Partial<ProductRequest>) {
  const response = await apiClient.patch<ApiResponse<Product>>(`/products/${id}`, data);
  return response.data;
}

export async function deleteProduct(id: string) {
  const response = await apiClient.delete<ApiResponse<null>>(`/products/${id}`);
  return response.data;
}
