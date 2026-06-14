"use client";

import { Banknote, CheckCircle2, Download, Eye, ReceiptText } from "lucide-react";
import { useState } from "react";
import { CurrencyAmount } from "@/components/ui/CurrencyAmount";
import { Pagination } from "@/components/ui/Pagination";
import { useReceipts } from "@/hooks/useReceipts";
import { BottomInsight, Button, ComplianceAlert, DashboardFormModal, DataTable, MetricCard, notifyDashboard, PageHeader, StatusBadge, rowActions } from "../ui";

export function ReceiptsPage() {
  const { receipts, pagination, pager, loading, error } = useReceipts();
  const [modalOpen, setModalOpen] = useState(false);
  const totalReceived = receipts.reduce((sum, receipt) => sum + Number(receipt.amount_paid ?? 0), 0);

  return (
    <>
      <PageHeader title="Receipts" subtitle="Track incoming payments and reconcile audit trails." action={<Button onClick={() => setModalOpen(true)}><ReceiptText className="h-4 w-4" /> Add Receipt</Button>} />
      <DashboardFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Record Payment"
        description="Record a customer payment and link it to an invoice."
        submitLabel="Save Receipt"
        fields={["Sales invoice", "Amount paid", "Payment method", "Payment date", "Currency", "Note"]}
        onSubmit={() => notifyDashboard("Use the full API form to save this receipt")}
        successMessage="Receipt saved"
      />
      {error ? <ComplianceAlert title="Unable to load receipts" text={error} /> : null}
      <div className="mb-6 grid gap-5 md:grid-cols-3">
        <MetricCard label="Total Received This Page" value={<CurrencyAmount amount={totalReceived} />} meta="From loaded API receipts" tone="success" icon={Banknote} />
        <MetricCard label="Receipt Records" value={String(pagination?.total ?? receipts.length)} meta="Total API records" tone="warning" icon={ReceiptText} />
        <MetricCard label="Receipts Issued" value={String(receipts.length)} meta="Loaded on this page" icon={CheckCircle2} />
      </div>
      <DataTable
        title="Recent Transactions"
        columns={["Receipt ID", "Linked Invoice", "Amount", "Payment Method", "Date", "Currency", "Note", "Actions"]}
        rows={receipts.map((receipt) => ({
          "Receipt ID": <b className="text-[#0001B1]">{receipt.id}</b>,
          "Linked Invoice": receipt.sales_invoice_id,
          Amount: <b><CurrencyAmount amount={receipt.amount_paid} currency={receipt.currency} /></b>,
          "Payment Method": <StatusBadge>{receipt.payment_method}</StatusBadge>,
          Date: receipt.payment_date,
          Currency: receipt.currency,
          Note: receipt.note ?? "-",
          Actions: rowActions(
            <>
              <button type="button" onClick={() => notifyDashboard(`${receipt.id} preview opened`)} aria-label={`View ${receipt.id}`} className="rounded p-1 text-[#454557]"><Eye className="h-4 w-4" /></button>
              <button type="button" onClick={() => notifyDashboard(`${receipt.id} PDF downloaded`)} aria-label={`Download ${receipt.id}`} className="rounded p-1 text-[#454557]"><Download className="h-4 w-4" /></button>
            </>,
            receipt.id,
          ),
        }))}
        footer={loading ? "Loading API records..." : `Showing ${receipts.length} of ${pagination?.total ?? receipts.length} receipts`}
        footerActions={<Pagination pagination={pagination} onPageChange={pager.setPage} />}
      />
      <BottomInsight title="Payment Reconciliation Health" asideTitle="Tax Compliance Tip" />
    </>
  );
}
