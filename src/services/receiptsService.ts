// Mock Receipts Service
// Replace these mock functions with real API calls when backend is ready

export interface Receipt {
  id: string;
  receiptNumber: string;
  invoiceId: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  amount: number;
  paymentMethod: "cash" | "bank_transfer" | "card" | "mobile_money";
  paymentDate: string;
  notes?: string;
  createdAt: string;
}

// Mock data storage
let mockReceipts: Receipt[] = [
  {
    id: "1",
    receiptNumber: "RCP-2024-001",
    invoiceId: "1",
    invoiceNumber: "INV-2024-001",
    customerId: "1",
    customerName: "Acme Corporation",
    amount: 537500,
    paymentMethod: "bank_transfer",
    paymentDate: "2024-01-20",
    notes: "Payment received in full",
    createdAt: "2024-01-20",
  },
  {
    id: "2",
    receiptNumber: "RCP-2024-002",
    invoiceId: "2",
    invoiceNumber: "INV-2024-002",
    customerId: "2",
    customerName: "Global Traders Ltd",
    amount: 500000,
    paymentMethod: "card",
    paymentDate: "2024-02-25",
    notes: "Partial payment",
    createdAt: "2024-02-25",
  },
];

/**
 * Get all receipts
 * TODO: Replace with real API call
 * Example: return fetch('/api/receipts').then(res => res.json())
 */
export const getReceipts = async (): Promise<Receipt[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [...mockReceipts];
};

/**
 * Create a new receipt
 * TODO: Replace with real API call
 * Example: return fetch('/api/receipts', { method: 'POST', body: JSON.stringify(receipt) })
 */
export const createReceipt = async (receipt: Omit<Receipt, "id" | "receiptNumber" | "createdAt">): Promise<Receipt> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const newReceipt: Receipt = {
    ...receipt,
    id: Date.now().toString(),
    receiptNumber: `RCP-2024-${String(mockReceipts.length + 1).padStart(3, "0")}`,
    createdAt: new Date().toISOString().split("T")[0],
  };
  mockReceipts.push(newReceipt);
  return newReceipt;
};
