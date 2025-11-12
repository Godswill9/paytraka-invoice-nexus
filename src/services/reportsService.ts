// Mock Reports Service
// Replace these mock functions with real API calls when backend is ready

export interface RevenueSummary {
  totalRevenue: number;
  paidRevenue: number;
  unpaidRevenue: number;
  overdueRevenue: number;
  monthlyRevenue: { month: string; revenue: number }[];
}

export interface InvoiceStatusSummary {
  total: number;
  paid: number;
  sent: number;
  overdue: number;
  draft: number;
  cancelled: number;
}

export interface TopCustomer {
  customerId: string;
  customerName: string;
  totalRevenue: number;
  invoiceCount: number;
}

/**
 * Get revenue summary
 * TODO: Replace with real API call
 * Example: return fetch('/api/reports/revenue').then(res => res.json())
 */
export const getRevenueSummary = async (): Promise<RevenueSummary> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return {
    totalRevenue: 2631750,
    paidRevenue: 537500,
    unpaidRevenue: 2094250,
    overdueRevenue: 1075000,
    monthlyRevenue: [
      { month: "Jan", revenue: 537500 },
      { month: "Feb", revenue: 1019250 },
      { month: "Mar", revenue: 1075000 },
      { month: "Apr", revenue: 0 },
      { month: "May", revenue: 0 },
      { month: "Jun", revenue: 0 },
    ],
  };
};

/**
 * Get invoice status summary
 * TODO: Replace with real API call
 * Example: return fetch('/api/reports/invoice-status').then(res => res.json())
 */
export const getInvoiceStatusSummary = async (): Promise<InvoiceStatusSummary> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return {
    total: 3,
    paid: 1,
    sent: 1,
    overdue: 1,
    draft: 0,
    cancelled: 0,
  };
};

/**
 * Get top customers
 * TODO: Replace with real API call
 * Example: return fetch('/api/reports/top-customers').then(res => res.json())
 */
export const getTopCustomers = async (): Promise<TopCustomer[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [
    {
      customerId: "3",
      customerName: "Tech Solutions Inc",
      totalRevenue: 1075000,
      invoiceCount: 1,
    },
    {
      customerId: "2",
      customerName: "Global Traders Ltd",
      totalRevenue: 1019250,
      invoiceCount: 1,
    },
    {
      customerId: "1",
      customerName: "Acme Corporation",
      totalRevenue: 537500,
      invoiceCount: 1,
    },
  ];
};
