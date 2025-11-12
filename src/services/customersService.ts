// Mock Customers Service
// Replace these mock functions with real API calls when backend is ready

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  taxId?: string;
  createdAt: string;
}

// Mock data storage
let mockCustomers: Customer[] = [
  {
    id: "1",
    name: "Acme Corporation",
    email: "contact@acme.com",
    phone: "+234 801 234 5678",
    address: "123 Business Street, Lagos, Nigeria",
    taxId: "TAX-001-ACME",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Global Traders Ltd",
    email: "info@globaltraders.com",
    phone: "+234 802 345 6789",
    address: "456 Commerce Road, Abuja, Nigeria",
    taxId: "TAX-002-GLOBAL",
    createdAt: "2024-02-20",
  },
  {
    id: "3",
    name: "Tech Solutions Inc",
    email: "hello@techsolutions.com",
    phone: "+234 803 456 7890",
    address: "789 Innovation Drive, Port Harcourt, Nigeria",
    taxId: "TAX-003-TECH",
    createdAt: "2024-03-10",
  },
];

/**
 * Get all customers
 * TODO: Replace with real API call
 * Example: return fetch('/api/customers').then(res => res.json())
 */
export const getCustomers = async (): Promise<Customer[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [...mockCustomers];
};

/**
 * Add a new customer
 * TODO: Replace with real API call
 * Example: return fetch('/api/customers', { method: 'POST', body: JSON.stringify(customer) })
 */
export const addCustomer = async (customer: Omit<Customer, "id" | "createdAt">): Promise<Customer> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const newCustomer: Customer = {
    ...customer,
    id: Date.now().toString(),
    createdAt: new Date().toISOString().split("T")[0],
  };
  mockCustomers.push(newCustomer);
  return newCustomer;
};

/**
 * Update an existing customer
 * TODO: Replace with real API call
 * Example: return fetch(`/api/customers/${id}`, { method: 'PUT', body: JSON.stringify(customer) })
 */
export const updateCustomer = async (id: string, customer: Partial<Customer>): Promise<Customer> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const index = mockCustomers.findIndex((c) => c.id === id);
  if (index === -1) throw new Error("Customer not found");
  mockCustomers[index] = { ...mockCustomers[index], ...customer };
  return mockCustomers[index];
};

/**
 * Delete a customer
 * TODO: Replace with real API call
 * Example: return fetch(`/api/customers/${id}`, { method: 'DELETE' })
 */
export const deleteCustomer = async (id: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  mockCustomers = mockCustomers.filter((c) => c.id !== id);
};
