// Mock Products/Services Service
// Replace these mock functions with real API calls when backend is ready

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  type: "product" | "service";
  sku?: string;
  taxRate: number;
  createdAt: string;
}

// Mock data storage
let mockProducts: Product[] = [
  {
    id: "1",
    name: "Web Development Service",
    description: "Full-stack web application development",
    price: 500000,
    type: "service",
    taxRate: 7.5,
    createdAt: "2024-01-10",
  },
  {
    id: "2",
    name: "Mobile App Development",
    description: "iOS and Android app development",
    price: 750000,
    type: "service",
    taxRate: 7.5,
    createdAt: "2024-01-15",
  },
  {
    id: "3",
    name: "Software License",
    description: "Annual software license subscription",
    price: 120000,
    type: "product",
    sku: "SW-LIC-001",
    taxRate: 7.5,
    createdAt: "2024-02-01",
  },
  {
    id: "4",
    name: "Consulting Service",
    description: "Business and technical consulting per hour",
    price: 25000,
    type: "service",
    taxRate: 7.5,
    createdAt: "2024-02-15",
  },
];

/**
 * Get all products/services
 * TODO: Replace with real API call
 * Example: return fetch('/api/products').then(res => res.json())
 */
export const getProducts = async (): Promise<Product[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [...mockProducts];
};

/**
 * Add a new product/service
 * TODO: Replace with real API call
 * Example: return fetch('/api/products', { method: 'POST', body: JSON.stringify(product) })
 */
export const addProduct = async (product: Omit<Product, "id" | "createdAt">): Promise<Product> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const newProduct: Product = {
    ...product,
    id: Date.now().toString(),
    createdAt: new Date().toISOString().split("T")[0],
  };
  mockProducts.push(newProduct);
  return newProduct;
};

/**
 * Update an existing product/service
 * TODO: Replace with real API call
 * Example: return fetch(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(product) })
 */
export const updateProduct = async (id: string, product: Partial<Product>): Promise<Product> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const index = mockProducts.findIndex((p) => p.id === id);
  if (index === -1) throw new Error("Product not found");
  mockProducts[index] = { ...mockProducts[index], ...product };
  return mockProducts[index];
};

/**
 * Delete a product/service
 * TODO: Replace with real API call
 * Example: return fetch(`/api/products/${id}`, { method: 'DELETE' })
 */
export const deleteProduct = async (id: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  mockProducts = mockProducts.filter((p) => p.id !== id);
};
