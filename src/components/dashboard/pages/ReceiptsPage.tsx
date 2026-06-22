"use client";

import { Banknote, CheckCircle2, Download, Eye, ReceiptText, Search, X } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { CurrencyAmount } from "@/components/ui/CurrencyAmount";
import { Pagination } from "@/components/ui/Pagination";
import { useCustomers } from "@/hooks/useCustomers";
import { useAuth } from "@/hooks/useAuth";
import { useCompany } from "@/hooks/useCompany";
import { useInvoices } from "@/hooks/useInvoices";
import { useReceipts } from "@/hooks/useReceipts";
import { getApiErrorMessage } from "@/lib/api/client";
import { salesInvoiceBalance, salesInvoiceTotal } from "@/lib/invoice-amounts";
import { Receipt, ReceiptRequest, SalesInvoice } from "@/types/api";
import { Button, Card, ComplianceAlert, DataTable, MetricCard, notifyDashboard, PageHeader, StatusBadge } from "../ui";

function formatDate(value?: string) {
  if (!value) return "Not provided";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Africa/Lagos",
  }).format(date);
}

function paymentMethodLabel(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function canReceivePayment(invoice: SalesInvoice) {
  const status = invoice.status?.trim().toLowerCase();
  const paymentStatus = invoice.payment_status?.trim().toLowerCase();
  const isPosted =
    status === "posted" ||
    status === "sent" ||
    status === "partially_paid" ||
    status === "partially paid";
  const isFullyPaid =
    status === "paid" ||
    paymentStatus === "paid" ||
    paymentStatus === "fully_paid" ||
    paymentStatus === "fully paid";

  return isPosted && !isFullyPaid && salesInvoiceBalance(invoice) > 0.005;
}

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function ReceiptsPage() {
  const { user } = useAuth();
  const { company } = useCompany(user?.company_id);
  const { receipts, pagination, pager, loading, error, create, getReceipt } = useReceipts();
  const { invoices, loading: invoicesLoading, refresh: refreshInvoices } = useInvoices();
  const { customers } = useCustomers();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [search, setSearch] = useState("");
  const companyName = company?.company_name || user?.company_name || user?.trading_name || "Company";

  const invoiceById = useMemo(() => new Map(invoices.map((invoice) => [invoice.id, invoice])), [invoices]);
  const receivableInvoices = useMemo(() => invoices.filter(canReceivePayment), [invoices]);
  const customerById = useMemo(() => new Map(customers.map((customer) => [customer.id, customer])), [customers]);
  const totalReceived = receipts.reduce((sum, receipt) => sum + Number(receipt.amount_paid ?? 0), 0);
  const filteredReceipts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return receipts;
    return receipts.filter((receipt) => {
      const invoice = invoiceById.get(receipt.sales_invoice_id);
      const customer = invoice ? customerById.get(invoice.customer_id) : undefined;
      return [
        receipt.id,
        invoice?.invoice_number,
        customer?.name,
        receipt.payment_method,
        receipt.note,
      ].some((value) => value?.toLowerCase().includes(query));
    });
  }, [customerById, invoiceById, receipts, search]);

  async function createReceipt(payload: ReceiptRequest) {
    try {
      await create(payload);
      await refreshInvoices();
      setModalOpen(false);
      notifyDashboard("Receipt saved");
    } catch (requestError) {
      throw new Error(getApiErrorMessage(requestError, "Unable to save receipt."));
    }
  }

  async function viewReceipt(receipt: Receipt) {
    try {
      const response = await getReceipt(receipt.id);
      setSelectedReceipt(response.data);
    } catch {
      setSelectedReceipt(receipt);
    }
  }

  async function downloadReceipt(receipt: Receipt) {
    let record = receipt;
    try {
      const response = await getReceipt(receipt.id);
      record = response.data;
    } catch {
      // The list record still contains enough information for the receipt file.
    }
    const invoice = invoiceById.get(record.sales_invoice_id);
    const customer = invoice ? customerById.get(invoice.customer_id) : undefined;
    const amount = new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: record.currency || invoice?.currency || "NGN",
    }).format(Number(record.amount_paid));
    const documentHtml = `<!doctype html>
<html><head><meta charset="utf-8"><title>Receipt ${escapeHtml(record.id)}</title>
<style>body{font-family:Arial,sans-serif;color:#191c1e;padding:40px;max-width:760px;margin:auto}.brand{color:#1117e8;font-size:28px;font-weight:800}.card{border:1px solid #d7dee8;border-radius:16px;padding:24px;margin-top:24px}.amount{font-size:32px;font-weight:800;color:#1117e8}.row{display:flex;justify-content:space-between;gap:24px;padding:12px 0;border-bottom:1px solid #eef1f5}.row:last-child{border:0}.muted{color:#66728a}.footer{margin-top:28px;font-size:11px;color:#98a0ad;text-align:center}</style>
</head><body><div class="brand">${escapeHtml(companyName)}</div><p class="muted">Payment receipt</p><div class="card"><p class="muted">Amount received</p><div class="amount">${escapeHtml(amount)}</div>
<div class="row"><b>Receipt ID</b><span>${escapeHtml(record.id)}</span></div>
<div class="row"><b>Invoice</b><span>${escapeHtml(invoice?.invoice_number ?? record.sales_invoice_id)}</span></div>
<div class="row"><b>Customer</b><span>${escapeHtml(customer?.name ?? "Customer")}</span></div>
<div class="row"><b>Payment method</b><span>${escapeHtml(paymentMethodLabel(record.payment_method))}</span></div>
<div class="row"><b>Payment date</b><span>${escapeHtml(formatDate(record.payment_date))}</span></div>
<div class="row"><b>Note</b><span>${escapeHtml(record.note || "—")}</span></div></div><p class="footer">This document was generated from PayTraka.</p></body></html>`;
    const url = URL.createObjectURL(new Blob([documentHtml], { type: "text/html;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `receipt-${invoice?.invoice_number ?? record.id}.html`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <PageHeader
        title="Receipts"
        subtitle="Record customer payments and keep a clear transaction history."
        action={<Button onClick={() => setModalOpen(true)}><ReceiptText className="h-4 w-4" /> Record Payment</Button>}
      />
      {modalOpen ? (
        <ReceiptFormDialog
          invoices={receivableInvoices}
          customers={customers}
          loading={invoicesLoading}
          onClose={() => setModalOpen(false)}
          onSave={createReceipt}
        />
      ) : null}
      {error ? <ComplianceAlert title="Unable to load receipts" text={error} /> : null}
      {!invoicesLoading && invoices.length > 0 && receivableInvoices.length === 0 ? (
        <ComplianceAlert
          title="No invoices available for a receipt"
          text="Receipts can only be recorded for posted invoices that still have an outstanding balance."
          tone="warning"
        />
      ) : null}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard label="Total Received" value={<CurrencyAmount amount={totalReceived} />} meta="Payments shown on this page" tone="success" icon={Banknote} />
        <MetricCard label="Receipt Records" value={String(pagination?.total ?? receipts.length)} meta="All recorded receipts" tone="warning" icon={ReceiptText} />
        <MetricCard label="Transactions Shown" value={String(filteredReceipts.length)} meta="Current search and page" icon={CheckCircle2} />
      </div>

      <Card className="mb-4 p-3 sm:p-4">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#757588]" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search receipt, invoice, customer or payment method"
            className="h-11 w-full rounded-xl border border-[#C5C4DA] bg-white pl-11 pr-4 text-sm outline-none focus:border-[#1117E8] focus:ring-4 focus:ring-[#DADEFD]"
          />
        </label>
      </Card>

      <DataTable
        title="Transactions"
        columns={["Receipt", "Invoice & Customer", "Payment", "Date", "Note", "Actions"]}
        rows={filteredReceipts.map((receipt) => {
          const invoice = invoiceById.get(receipt.sales_invoice_id);
          const customer = invoice ? customerById.get(invoice.customer_id) : undefined;
          return {
            Receipt: <div><b className="text-[#0001B1]">{receipt.id}</b><p className="mt-1 text-xs text-[#757588]">{receipt.currency}</p></div>,
            "Invoice & Customer": <div><b>{invoice?.invoice_number ?? receipt.sales_invoice_id}</b><p className="mt-1 text-xs text-[#757588]">{customer?.name ?? "Customer record"}</p></div>,
            Payment: <div><b><CurrencyAmount amount={receipt.amount_paid} currency={receipt.currency} /></b><p className="mt-1"><StatusBadge>{paymentMethodLabel(receipt.payment_method)}</StatusBadge></p></div>,
            Date: formatDate(receipt.payment_date),
            Note: <span className="block max-w-56 truncate" title={receipt.note}>{receipt.note || "—"}</span>,
            Actions: (
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => void viewReceipt(receipt)} aria-label={`View receipt ${receipt.id}`} className="inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-bold text-[#0001B1] hover:bg-[#F1F4F8]"><Eye className="h-4 w-4" /><span className="hidden xl:inline">View</span></button>
                <button type="button" onClick={() => void downloadReceipt(receipt)} aria-label={`Download receipt ${receipt.id}`} className="inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-bold text-[#0001B1] hover:bg-[#F1F4F8]"><Download className="h-4 w-4" /><span className="hidden xl:inline">Download</span></button>
              </div>
            ),
          };
        })}
        footer={loading ? "Loading receipts..." : `Showing ${filteredReceipts.length} of ${pagination?.total ?? receipts.length} receipts`}
        footerActions={<Pagination pagination={pagination} onPageChange={pager.setPage} />}
        loading={loading}
        hideDefaultActions
      />

      {selectedReceipt ? (
        <ReceiptDetailsDialog
          receipt={selectedReceipt}
          invoice={invoiceById.get(selectedReceipt.sales_invoice_id)}
          customerName={customerById.get(invoiceById.get(selectedReceipt.sales_invoice_id)?.customer_id ?? "")?.name}
          onClose={() => setSelectedReceipt(null)}
          onDownload={() => void downloadReceipt(selectedReceipt)}
        />
      ) : null}
    </>
  );
}

function ReceiptFormDialog({
  invoices,
  customers,
  loading,
  onClose,
  onSave,
}: {
  invoices: SalesInvoice[];
  customers: { id: string; name: string }[];
  loading: boolean;
  onClose: () => void;
  onSave: (payload: ReceiptRequest) => Promise<void>;
}) {
  const [invoiceId, setInvoiceId] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const selectedInvoice = invoices.find((invoice) => invoice.id === invoiceId);
  const customer = customers.find((item) => item.id === selectedInvoice?.customer_id);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function selectInvoice(id: string) {
    const invoice = invoices.find((item) => item.id === id);
    setInvoiceId(id);
    setAmount(invoice ? String(salesInvoiceBalance(invoice)) : "");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amountPaid = Number(amount);
    if (!selectedInvoice) return setError("Select an invoice.");
    if (!canReceivePayment(selectedInvoice)) {
      return setError("Receipts can only be recorded for posted invoices with an outstanding balance.");
    }
    if (!Number.isFinite(amountPaid) || amountPaid <= 0) return setError("Amount paid must be greater than zero.");
    const balanceDue = salesInvoiceBalance(selectedInvoice);
    if (amountPaid > balanceDue + 0.005) {
      return setError(`Amount paid cannot exceed the outstanding balance of ${selectedInvoice.currency} ${balanceDue.toLocaleString("en-NG")}.`);
    }
    if (!paymentDate) return setError("Select a payment date.");
    if (!paymentMethod) return setError("Select a payment method.");
    setSaving(true);
    setError("");
    try {
      await onSave({
        sales_invoice_id: selectedInvoice.id,
        amount_paid: amountPaid,
        payment_method: paymentMethod,
        payment_date: paymentDate,
        currency: selectedInvoice.currency,
        note: note.trim() || undefined,
      });
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to save receipt."));
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "mt-2 h-11 w-full rounded-xl border border-[#C5C4DA] bg-white px-3 text-sm outline-none focus:border-[#1117E8] focus:ring-4 focus:ring-[#DADEFD]";

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center overflow-hidden bg-[#191C1E]/45 p-0 backdrop-blur-sm sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="receipt-form-title" onMouseDown={onClose}>
      <Card className="flex max-h-[94dvh] w-full max-w-2xl flex-col overflow-hidden rounded-b-none shadow-2xl sm:rounded-2xl" onMouseDown={(event) => event.stopPropagation()}>
        <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[#C5C4DA] bg-[#F7F9FB] p-4 sm:p-6">
            <div><h2 id="receipt-form-title" className="text-xl font-extrabold sm:text-2xl">Record Payment</h2><p className="mt-1 text-sm text-[#454557]">Link this payment to a sales invoice.</p></div>
            <button type="button" onClick={onClose} aria-label="Close receipt form" className="rounded-lg p-2 text-[#454557] hover:bg-white"><X className="h-5 w-5" /></button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-bold text-[#454557] sm:col-span-2">Invoice <span className="text-red-600">*</span>
                <select value={invoiceId} onChange={(event) => selectInvoice(event.target.value)} disabled={loading} className={inputClass}>
                  <option value="">
                    {loading
                      ? "Loading invoices…"
                      : invoices.length
                        ? "Select a posted invoice"
                        : "No posted invoices with an outstanding balance"}
                  </option>
                  {invoices.map((invoice) => {
                    const invoiceCustomer = customers.find((item) => item.id === invoice.customer_id);
                    return <option key={invoice.id} value={invoice.id}>{invoice.invoice_number} · {invoiceCustomer?.name ?? "Customer"} · Balance {invoice.currency} {salesInvoiceBalance(invoice).toLocaleString()}</option>;
                  })}
                </select>
              </label>
              <label className="text-sm font-bold text-[#454557]">Amount paid <span className="text-red-600">*</span><input type="number" min="0.01" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} className={inputClass} /></label>
              <label className="text-sm font-bold text-[#454557]">Payment method <span className="text-red-600">*</span><select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)} className={inputClass}><option value="bank_transfer">Bank transfer</option><option value="cash">Cash</option><option value="card">Card</option><option value="cheque">Cheque</option><option value="mobile_money">Mobile money</option><option value="other">Other</option></select></label>
              <label className="text-sm font-bold text-[#454557]">Payment date <span className="text-red-600">*</span><input type="date" value={paymentDate} onChange={(event) => setPaymentDate(event.target.value)} className={inputClass} /></label>
              <div className="rounded-xl bg-[#F1F4F8] p-4 text-sm"><p className="font-bold text-[#454557]">Currency</p><p className="mt-2 text-lg font-extrabold text-[#0001B1]">{selectedInvoice?.currency ?? "Select invoice"}</p></div>
              <label className="text-sm font-bold text-[#454557] sm:col-span-2">Note<textarea value={note} onChange={(event) => setNote(event.target.value)} rows={3} placeholder="Optional payment note or reference" className={`${inputClass} h-auto resize-none py-3`} /></label>
            </div>
            {selectedInvoice ? (
              <div className="mt-5 grid gap-3 rounded-xl border border-[#C5C4DA] bg-[#F7F9FB] p-4 sm:grid-cols-3">
                <div><p className="text-xs font-bold uppercase text-[#757588]">Customer</p><p className="mt-1 font-bold">{customer?.name ?? "Customer"}</p></div>
                <div><p className="text-xs font-bold uppercase text-[#757588]">Invoice total</p><p className="mt-1 font-bold"><CurrencyAmount amount={salesInvoiceTotal(selectedInvoice)} currency={selectedInvoice.currency} /></p></div>
                <div><p className="text-xs font-bold uppercase text-[#757588]">Balance due</p><p className="mt-1 font-bold text-amber-700"><CurrencyAmount amount={salesInvoiceBalance(selectedInvoice)} currency={selectedInvoice.currency} /></p></div>
                <div><p className="text-xs font-bold uppercase text-[#757588]">Status</p><p className="mt-1"><StatusBadge>{selectedInvoice.status ?? "draft"}</StatusBadge></p></div>
              </div>
            ) : null}
            {error ? <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p> : null}
          </div>
          <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-[#C5C4DA] bg-white p-4 sm:flex-row sm:justify-end sm:p-6">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={saving || !invoices.length}>{saving ? "Saving…" : "Save Receipt"}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

function ReceiptDetailsDialog({
  receipt,
  invoice,
  customerName,
  onClose,
  onDownload,
}: {
  receipt: Receipt;
  invoice?: SalesInvoice;
  customerName?: string;
  onClose: () => void;
  onDownload: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center overflow-hidden bg-[#191C1E]/45 p-0 backdrop-blur-sm sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="receipt-details-title" onMouseDown={onClose}>
      <Card className="flex max-h-[92dvh] w-full max-w-xl flex-col overflow-hidden rounded-b-none shadow-2xl sm:rounded-2xl" onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-4 border-b border-[#C5C4DA] bg-[#F7F9FB] p-4 sm:p-6">
          <div><p className="text-sm font-bold text-[#0001B1]">PAYMENT RECEIPT</p><h2 id="receipt-details-title" className="mt-1 break-all text-xl font-extrabold sm:text-2xl">{receipt.id}</h2></div>
          <button type="button" onClick={onClose} aria-label="Close receipt details" className="rounded-lg p-2 text-[#454557] hover:bg-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="rounded-2xl bg-[#1117E8] p-5 text-white"><p className="text-sm font-semibold text-white/75">Amount received</p><p className="mt-2 text-3xl font-extrabold"><CurrencyAmount amount={receipt.amount_paid} currency={receipt.currency} /></p></div>
          <dl className="mt-5 divide-y divide-[#DCE0E8] rounded-xl border border-[#C5C4DA] px-4">
            {[
              ["Invoice", invoice?.invoice_number ?? receipt.sales_invoice_id],
              ["Customer", customerName ?? "Customer"],
              ["Payment method", paymentMethodLabel(receipt.payment_method)],
              ["Payment date", formatDate(receipt.payment_date)],
              ["Currency", receipt.currency],
              ["Note", receipt.note || "—"],
            ].map(([label, value]) => <div key={label} className="flex flex-col gap-1 py-3 sm:flex-row sm:justify-between sm:gap-6"><dt className="text-sm font-semibold text-[#757588]">{label}</dt><dd className="break-words text-sm font-bold sm:max-w-[65%] sm:text-right">{value}</dd></div>)}
          </dl>
        </div>
        <div className="flex flex-col-reverse gap-3 border-t border-[#C5C4DA] p-4 sm:flex-row sm:justify-end sm:p-6"><Button variant="secondary" onClick={onClose}>Close</Button><Button onClick={onDownload}><Download className="h-4 w-4" /> Download Receipt</Button></div>
      </Card>
    </div>
  );
}
