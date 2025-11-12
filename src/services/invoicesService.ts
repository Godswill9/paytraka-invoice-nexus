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
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  notes?: string;
  createdAt: string;
}

// Mock data storage
let mockInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-2024-001",
    customerId: "1",
    customerName: "Acme Corporation",
    customerEmail: "contact@acme.com",
    customerAddress: "123 Business Street, Lagos, Nigeria",
    date: "2024-01-15",
    dueDate: "2024-02-15",
    items: [
      {
        id: "1",
        productId: "1",
        productName: "Web Development Service",
        quantity: 1,
        unitPrice: 500000,
        taxRate: 7.5,
        total: 537500,
      },
    ],
    subtotal: 500000,
    taxAmount: 37500,
    discount: 0,
    deliveryFee: 0,
    total: 537500,
    status: "paid",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    invoiceNumber: "INV-2024-002",
    customerId: "2",
    customerName: "Global Traders Ltd",
    customerEmail: "info@globaltraders.com",
    customerAddress: "456 Commerce Road, Abuja, Nigeria",
    date: "2024-02-20",
    dueDate: "2024-03-20",
    items: [
      {
        id: "2",
        productId: "2",
        productName: "Mobile App Development",
        quantity: 1,
        unitPrice: 750000,
        taxRate: 7.5,
        total: 806250,
      },
      {
        id: "3",
        productId: "3",
        productName: "Software License",
        quantity: 2,
        unitPrice: 120000,
        taxRate: 7.5,
        total: 258000,
      },
    ],
    subtotal: 990000,
    taxAmount: 74250,
    discount: 50000,
    deliveryFee: 5000,
    total: 1019250,
    status: "sent",
    createdAt: "2024-02-20",
  },
  {
    id: "3",
    invoiceNumber: "INV-2024-003",
    customerId: "3",
    customerName: "Tech Solutions Inc",
    customerEmail: "hello@techsolutions.com",
    customerAddress: "789 Innovation Drive, Port Harcourt, Nigeria",
    date: "2024-03-10",
    dueDate: "2024-03-25",
    items: [
      {
        id: "4",
        productId: "4",
        productName: "Consulting Service",
        quantity: 40,
        unitPrice: 25000,
        taxRate: 7.5,
        total: 1075000,
      },
    ],
    subtotal: 1000000,
    taxAmount: 75000,
    discount: 0,
    deliveryFee: 0,
    total: 1075000,
    status: "overdue",
    createdAt: "2024-03-10",
  },
];

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
export const createInvoice = async (invoice: Omit<Invoice, "id" | "invoiceNumber" | "createdAt">): Promise<Invoice> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const newInvoice: Invoice = {
    ...invoice,
    id: Date.now().toString(),
    invoiceNumber: `INV-2024-${String(mockInvoices.length + 1).padStart(3, "0")}`,
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
export const updateInvoice = async (id: string, invoice: Partial<Invoice>): Promise<Invoice> => {
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
