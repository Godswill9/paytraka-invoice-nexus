"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { CurrencyAmount } from "@/components/ui/CurrencyAmount";
import { FirsGate } from "@/components/ui/FirsGate";
import { Pagination } from "@/components/ui/Pagination";
import { useAuth } from "@/hooks/useAuth";
import { useFirs } from "@/hooks/useFirs";
import { useInvoices } from "@/hooks/useInvoices";
import { Button, ComplianceAlert, DashboardFormModal, DataTable, FilterBar, MetricCard, notifyDashboard, PageHeader, StatusBadge, rowActions } from "../ui";

function invoiceTotal(invoice: { line_items?: { quantity: number; unit_price: number; tax_rate?: number }[]; discount_amount?: number }) {
  const subtotal = invoice.line_items?.reduce((sum, item) => {
    const lineBase = Number(item.quantity ?? 0) * Number(item.unit_price ?? 0);
    return sum + lineBase + (lineBase * Number(item.tax_rate ?? 0)) / 100;
  }, 0) ?? 0;
  return Math.max(subtotal - Number(invoice.discount_amount ?? 0), 0);
}

export function SalesInvoicesPage() {
  const { user } = useAuth();
  const { submit } = useFirs();
  const { invoices, pagination, pager, loading, error, post } = useInvoices();
  const [modalOpen, setModalOpen] = useState(false);
  const draftCount = invoices.filter((invoice) => invoice.status === "draft").length;
  const totalOutstanding = invoices.reduce((sum, invoice) => sum + invoiceTotal(invoice), 0);

  async function handlePost(id: string) {
    if (!window.confirm("Post this invoice? Posted invoices can be submitted to FIRS.")) return;
    await post(id);
    notifyDashboard("Invoice posted");
  }

  async function handleFirsSubmit(invoiceId: string) {
    await submit({ invoice_id: invoiceId });
    notifyDashboard("Invoice submitted to FIRS/NRS queue");
  }

  return (
    <>
      <PageHeader title="Sales Invoices" subtitle="Manage your SME billing and FIRS compliance status in real-time." action={<Button onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" /> Create Sales Invoice</Button>} />
      <DashboardFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create Sales Invoice"
        description="Create a quick sales invoice without leaving the invoice list."
        submitLabel="Create Invoice"
        fields={["Customer", "Invoice type", "Issue date", "Due date", "Currency", "Discount amount", "Line item product", "Line item description", "Line item quantity", "Line item unit price", "Line item tax rate", "Notes"]}
        onSubmit={() => notifyDashboard("Use the full invoice form to create this invoice")}
      />
      {draftCount > 0 ? <ComplianceAlert title="Validation Required" text={`${draftCount} draft invoices need review before posting or FIRS submission.`} badge={`${draftCount} Draft`} /> : null}
      {error ? <ComplianceAlert title="Unable to load invoices" text={error} /> : null}
      <div className="mb-6 grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_280px]"><FilterBar /><MetricCard label="Total Outstanding" value={<CurrencyAmount amount={totalOutstanding} />} meta="From loaded API invoices" tone="primary" /></div>
      <DataTable
        title="Recent Invoices"
        columns={["Invoice #", "Public ID", "Customer", "Issue Date", "Due Date", "Total Amount", "Status", "FIRS/NRS", "Actions"]}
        rows={invoices.map((invoice) => {
          const isPosted = invoice.status === "posted" || invoice.status === "sent" || invoice.status === "paid";
          const actions = (
            <div className="flex flex-wrap gap-2">
              {!isPosted ? <Button className="min-h-9 px-3" onClick={() => handlePost(invoice.id)}>Post</Button> : null}
              <FirsGate firsEnabled={user?.firs_enabled ?? 0}>
                <Button variant="secondary" className="min-h-9 px-3" onClick={() => handleFirsSubmit(invoice.id)}>Submit FIRS</Button>
              </FirsGate>
            </div>
          );
          return {
            "Invoice #": <b className="text-[#0001B1]">{invoice.invoice_number}</b>,
            "Public ID": invoice.public_id,
            Customer: invoice.customer_id,
            "Issue Date": invoice.issue_date,
            "Due Date": invoice.due_date,
            "Total Amount": <b><CurrencyAmount amount={invoiceTotal(invoice)} currency={invoice.currency} /></b>,
            Status: <StatusBadge>{invoice.status ?? "draft"}</StatusBadge>,
            "FIRS/NRS": <StatusBadge>{user?.firs_enabled === 1 ? "ready" : "disabled"}</StatusBadge>,
            Actions: rowActions(actions, invoice.invoice_number),
          };
        })}
        footer={loading ? "Loading API records..." : `Showing ${invoices.length} of ${pagination?.total ?? invoices.length} invoices`}
        footerActions={<Pagination pagination={pagination} onPageChange={pager.setPage} />}
      />
    </>
  );
}
