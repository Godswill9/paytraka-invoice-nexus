// Mock Invoices Service
// Replace these mock functions with real API calls when backend is ready

export interface InvoiceItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  discount: number;
  deliveryFee: number;
  total: number;
  status: "sent" | "paid";
  // status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  notes?: string;
  createdAt: string;
}

// Mock data storage
export let mockInvoices: Invoice[] = [];

/**
 * Get all invoices
 * TODO: Replace with real API call
 * Example: return fetch('/api/invoices').then(res => res.json())
 */
export const getInvoices = async (): Promise<Invoice[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [...mockInvoices];
};

/**
 * Create a new invoice
 * TODO: Replace with real API call
 * Example: return fetch('/api/invoices', { method: 'POST', body: JSON.stringify(invoice) })
 */
export const createInvoice = async (
  invoice: Omit<Invoice, "id" | "invoiceNumber" | "createdAt">
): Promise<Invoice> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const newInvoice: Invoice = {
    ...invoice,
    id: Date.now().toString(),
    invoiceNumber: `INV-2024-${String(mockInvoices.length + 1).padStart(
      3,
      "0"
    )}`,
    createdAt: new Date().toISOString().split("T")[0],
  };
  mockInvoices.push(newInvoice);
  return newInvoice;
};

/**
 * Update an existing invoice
 * TODO: Replace with real API call
 * Example: return fetch(`/api/invoices/${id}`, { method: 'PUT', body: JSON.stringify(invoice) })
 */
export const updateInvoice = async (
  id: string,
  invoice: Partial<Invoice>
): Promise<Invoice> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const index = mockInvoices.findIndex((inv) => inv.id === id);
  if (index === -1) throw new Error("Invoice not found");
  mockInvoices[index] = { ...mockInvoices[index], ...invoice };
  return mockInvoices[index];
};

/**
 * Delete an invoice
 * TODO: Replace with real API call
 * Example: return fetch(`/api/invoices/${id}`, { method: 'DELETE' })
 */
export const deleteInvoice = async (id: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  mockInvoices = mockInvoices.filter((inv) => inv.id !== id);
};
