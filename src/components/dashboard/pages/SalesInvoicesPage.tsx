"use client";

import { Download, Edit3, Eye, Plus, Send, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Company,
  Customer,
  InvoiceLineItem,
  SalesInvoice,
  SalesInvoiceRequest,
} from "@/types/api";
import { CurrencyAmount } from "@/components/ui/CurrencyAmount";
import { Pagination } from "@/components/ui/Pagination";
import { InvoiceDocument } from "@/components/dashboard/InvoiceDocument";
import { useAuth } from "@/hooks/useAuth";
import { useCustomers } from "@/hooks/useCustomers";
import { useCompany } from "@/hooks/useCompany";
import { useFirs } from "@/hooks/useFirs";
import { useInvoices } from "@/hooks/useInvoices";
import { getApiErrorMessage } from "@/lib/api/client";
import { salesInvoiceBalance, salesInvoiceTotal } from "@/lib/invoice-amounts";
import {
  companyComplianceIssues,
  customerComplianceIssues,
  lineItemComplianceIssues,
} from "@/lib/compliance";
import {
  Button,
  Card,
  ComplianceAlert,
  DataTable,
  FilterBar,
  notifyDashboard,
  PageHeader,
  StatusBadge,
  rowActions,
} from "../ui";

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

function shortReference(value?: string) {
  if (!value) return "Not available";
  if (value.length <= 18) return value;
  return `${value.slice(0, 8)}…${value.slice(-6)}`;
}

export function SalesInvoicesPage() {
  const { user } = useAuth();
  const { company } = useCompany(user?.company_id);
  const { customers } = useCustomers();
  const { submit } = useFirs();
  const {
    invoices,
    pagination,
    pager,
    loading,
    error,
    post,
    update,
    remove,
    getInvoice,
  } = useInvoices();
  const [selectedInvoice, setSelectedInvoice] = useState<SalesInvoice | null>(
    null,
  );
  const [editingInvoice, setEditingInvoice] = useState<SalesInvoice | null>(
    null,
  );
  const [submissionResponse, setSubmissionResponse] = useState("");
  const customerById = useMemo(
    () => new Map(customers.map((customer) => [customer.id, customer])),
    [customers],
  );

  async function handlePost(id: string) {
    if (
      !window.confirm(
        "Post this invoice? Posted invoices can be submitted to FIRS.",
      )
    )
      return;
    await post(id);
    notifyDashboard("Invoice posted");
  }

  async function handleFirsSubmit(invoice: SalesInvoice) {
    try {
      const response = await submit({ invoice_id: invoice.id });
      console.log(response);
      setSubmissionResponse(
        typeof response?.message === "string"
          ? response.message
          : JSON.stringify(response?.data ?? response),
      );
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "FIRS submission failed. Please try again.";
      setSubmissionResponse(message);
      // or if you have a toast/alert system:
      // toast.error(message);
    }
  }

  // async function handleFirsSubmit(invoice: SalesInvoice) {
  //   console.log(invoice);
  //   const customerIssues = customerComplianceIssues(
  //     customerById.get(invoice.customer_id),
  //   );
  //   const supplierIssues = companyComplianceIssues(company);
  //   const itemIssues = lineItemComplianceIssues(invoice.line_items ?? []);
  //   const issues = [
  //     ...customerIssues.map((item) => `Customer: ${item}`),
  //     ...supplierIssues.map((item) => `Company: ${item}`),
  //     ...itemIssues,
  //   ];
  //   if (issues.length) {
  //     setSubmissionResponse(
  //       `Submission blocked. Complete: ${issues.join(", ")}.`,
  //     );
  //     return;
  //   }
  //   try {
  //     const response = await submit({ invoice_id: invoice.id });
  //     setSubmissionResponse(
  //       typeof response?.data === "string"
  //         ? response.data
  //         : JSON.stringify(response?.data ?? response),
  //     );
  //     await update(invoice.id, {
  //       status: "sent",
  //     } as Partial<SalesInvoiceRequest>);
  //     notifyDashboard("Invoice successfully sent to FIRS");
  //   } catch (requestError) {
  //     setSubmissionResponse(
  //       getApiErrorMessage(requestError, "FIRS submission failed."),
  //     );
  //   }
  // }

  async function handleView(invoice: SalesInvoice) {
    try {
      const response = await getInvoice(invoice.id);
      setSelectedInvoice(response.data);
    } catch {
      setSelectedInvoice(invoice);
    }
  }

  async function handleEdit(invoice: SalesInvoice) {
    try {
      const response = await getInvoice(invoice.id);
      setEditingInvoice(response.data);
    } catch {
      setEditingInvoice(invoice);
    }
  }

  async function handleUpdateInvoice(
    invoice: SalesInvoice,
    payload: SalesInvoiceRequest,
  ) {
    try {
      await update(invoice.id, payload);
      setEditingInvoice(null);
      notifyDashboard(`${invoice.invoice_number} updated`);
    } catch (requestError) {
      notifyDashboard(
        getApiErrorMessage(requestError, "Unable to update invoice."),
      );
    }
  }

  async function handleDownload(invoice: SalesInvoice) {
    try {
      const response = await getInvoice(invoice.id);
      setSelectedInvoice(response.data);
    } catch {
      setSelectedInvoice(invoice);
    }
    window.setTimeout(() => printInvoicePdf(invoice.invoice_number), 250);
  }

  async function handleDelete(invoice: SalesInvoice) {
    if (
      !window.confirm(
        `Delete ${invoice.invoice_number}? This action cannot be undone.`,
      )
    )
      return;
    await remove(invoice.id);
    notifyDashboard(`${invoice.invoice_number} deleted`);
  }

  return (
    <>
      <PageHeader
        title="Sales Invoices"
        subtitle="Manage customer billing, payment status, and FIRS readiness."
        action={
          <Button href="/dashboard/invoices/create">
            <Plus className="h-4 w-4" /> Create Sales Invoice
          </Button>
        }
      />
      {user?.firs_enabled !== 1 ? (
        <ComplianceAlert
          tone="warning"
          title="FIRS transmission is not enabled"
          text="Add your company FIRS credentials in Settings → Compliance to transmit posted invoices."
        />
      ) : null}
      {submissionResponse ? (
        <ComplianceAlert
          tone="warning"
          title="FIRS submission response"
          text={submissionResponse}
        />
      ) : null}
      {error ? (
        <ComplianceAlert title="Unable to load invoices" text={error} />
      ) : null}
      <FilterBar
        labels={["Date range", "Status", "Customer", "Invoice type"]}
      />
      <DataTable
        title="Recent Invoices"
        columns={[
          "Invoice",
          "Customer",
          "Dates",
          "Amount",
          "Balance Due",
          "Status",
          "Actions",
        ]}
        rows={invoices.map((invoice) => {
          const isPosted =
            invoice.status === "posted" ||
            invoice.status === "sent" ||
            invoice.status === "paid";
          const firsEnabled = user?.firs_enabled === 1;
          const customer = customerById.get(invoice.customer_id);
          const actions = (
            <div className="flex flex-wrap gap-2">
              {!isPosted ? (
                <Button
                  className="min-h-9 px-3"
                  onClick={() => handlePost(invoice.id)}
                >
                  Post
                </Button>
              ) : null}
            </div>
          );
          return {
            Invoice: (
              <div className="min-w-0">
                <b className="text-[#0001B1]">{invoice.invoice_number}</b>
                <p
                  className="mt-1 text-xs text-[#757588]"
                  title={invoice.public_id}
                >
                  Ref: {shortReference(invoice.public_id)}
                </p>
              </div>
            ),
            Customer: (
              <div className="min-w-0">
                <p className="break-words font-semibold">
                  {invoice.customer_name ?? customer?.name ?? "Customer"}
                </p>
                <p
                  className="mt-1 text-xs text-[#757588]"
                  title={invoice.customer_id}
                >
                  ID:{" "}
                  {customer?.public_id
                    ? shortReference(customer.public_id)
                    : shortReference(invoice.customer_id)}
                </p>
              </div>
            ),
            Dates: (
              <div className="text-sm">
                <p>Issued {formatDate(invoice.issue_date)}</p>
                <p className="text-[#757588]">
                  Due {formatDate(invoice.due_date)}
                </p>
              </div>
            ),
            Amount: (
              <b>
                <CurrencyAmount
                  amount={salesInvoiceTotal(invoice)}
                  currency={invoice.currency}
                />
              </b>
            ),
            "Balance Due": (
              <b
                className={
                  salesInvoiceBalance(invoice) > 0
                    ? "text-amber-700"
                    : "text-green-700"
                }
              >
                <CurrencyAmount
                  amount={salesInvoiceBalance(invoice)}
                  currency={invoice.currency}
                />
              </b>
            ),
            Status: <StatusBadge>{invoice.status ?? "draft"}</StatusBadge>,
            Actions: rowActions(actions, invoice.invoice_number, [
              {
                label: "View invoice",
                icon: Eye,
                onSelect: () => void handleView(invoice),
              },
              ...(!isPosted
                ? [
                    {
                      label: "Edit invoice",
                      icon: Edit3,
                      onSelect: () => void handleEdit(invoice),
                    },
                  ]
                : []),
              {
                label: firsEnabled ? "Submit to FIRS" : "FIRS not enabled",
                icon: Send,
                disabled:
                  !firsEnabled || !isPosted || invoice.status === "sent",
                onSelect: () => void handleFirsSubmit(invoice),
              },
              {
                label: "Download PDF",
                icon: Download,
                onSelect: () => void handleDownload(invoice),
              },
              ...(!isPosted
                ? [
                    {
                      label: "Delete invoice",
                      icon: Trash2,
                      tone: "danger" as const,
                      onSelect: () => void handleDelete(invoice),
                    },
                  ]
                : []),
            ]),
          };
        })}
        footer={
          loading
            ? "Loading invoices..."
            : `Showing ${invoices.length} of ${pagination?.total ?? invoices.length} invoices`
        }
        footerActions={
          <Pagination pagination={pagination} onPageChange={pager.setPage} />
        }
        loading={loading}
      />
      {selectedInvoice ? (
        <InvoiceDetailsModal
          invoice={selectedInvoice}
          company={company}
          customer={customerById.get(selectedInvoice.customer_id)}
          logoUrl={user?.logo_url}
          onClose={() => setSelectedInvoice(null)}
          onDownload={() => printInvoicePdf(selectedInvoice.invoice_number)}
        />
      ) : null}
      {editingInvoice ? (
        <InvoiceEditModal
          invoice={editingInvoice}
          onClose={() => setEditingInvoice(null)}
          onSave={handleUpdateInvoice}
        />
      ) : null}
    </>
  );
}

function cleanLineItem(item: InvoiceLineItem): InvoiceLineItem {
  return {
    product_id: item.product_id?.trim() || undefined,
    description: item.description.trim(),
    quantity: Number(item.quantity || 0),
    unit_price: Number(item.unit_price || 0),
    tax_rate:
      item.tax_rate == null || Number.isNaN(Number(item.tax_rate))
        ? undefined
        : Number(item.tax_rate),
  };
}

function InvoiceEditModal({
  invoice,
  onClose,
  onSave,
}: {
  invoice: SalesInvoice;
  onClose: () => void;
  onSave: (
    invoice: SalesInvoice,
    payload: SalesInvoiceRequest,
  ) => Promise<void>;
}) {
  const [customerId, setCustomerId] = useState(invoice.customer_id);
  const [invoiceType, setInvoiceType] = useState(invoice.invoice_type);
  const [issueDate, setIssueDate] = useState(invoice.issue_date);
  const [dueDate, setDueDate] = useState(invoice.due_date);
  const [currency, setCurrency] = useState(invoice.currency ?? "NGN");
  const [discountAmount, setDiscountAmount] = useState(
    String(invoice.discount_amount ?? 0),
  );
  const [notes, setNotes] = useState(invoice.notes ?? "");
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>(
    (invoice.line_items ?? []).length
      ? (invoice.line_items ?? []).map((item) => ({ ...item }))
      : [{ description: "", quantity: 1, unit_price: 0, tax_rate: 0 }],
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function updateLineItem(index: number, patch: Partial<InvoiceLineItem>) {
    setLineItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanedItems = lineItems
      .map(cleanLineItem)
      .filter(
        (item) => item.description && item.quantity > 0 && item.unit_price >= 0,
      );
    if (!customerId.trim()) {
      notifyDashboard("Customer is required.");
      return;
    }
    if (!issueDate || !dueDate) {
      notifyDashboard("Issue date and due date are required.");
      return;
    }
    if (!cleanedItems.length) {
      notifyDashboard("Add at least one valid line item.");
      return;
    }
    setSaving(true);
    await onSave(invoice, {
      customer_id: customerId.trim(),
      invoice_type: invoiceType.trim() || "standard",
      issue_date: issueDate,
      due_date: dueDate,
      currency: currency.trim() || "NGN",
      discount_amount: Number(discountAmount || 0),
      notes: notes.trim() || undefined,
      line_items: cleanedItems,
    });
    setSaving(false);
  }

  return (
    <div
      className="fixed inset-0 z-[90] grid place-items-center overflow-y-auto bg-[#191C1E]/45 p-3 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="invoice-edit-title"
      onMouseDown={onClose}
    >
      <Card
        className="max-h-[92vh] w-full max-w-4xl overflow-hidden shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <div className="flex items-start justify-between gap-4 border-b border-[#C5C4DA] bg-[#F7F9FB] p-6">
            <div>
              <h2 id="invoice-edit-title" className="text-2xl font-bold">
                Edit {invoice.invoice_number}
              </h2>
              <p className="mt-1 text-sm text-[#454557]">
                Update invoice details and line items.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close invoice editor"
              className="rounded-lg p-2 text-[#454557] hover:bg-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="max-h-[62vh] space-y-5 overflow-y-auto p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <InvoiceInput
                label="Customer ID"
                value={customerId}
                onChange={setCustomerId}
              />
              <InvoiceInput
                label="Invoice Type"
                value={invoiceType}
                onChange={setInvoiceType}
              />
              <InvoiceInput
                label="Issue Date"
                type="date"
                value={issueDate}
                onChange={setIssueDate}
              />
              <InvoiceInput
                label="Due Date"
                type="date"
                value={dueDate}
                onChange={setDueDate}
              />
              <InvoiceInput
                label="Currency"
                value={currency}
                onChange={setCurrency}
              />
              <InvoiceInput
                label="Discount Amount"
                type="number"
                value={discountAmount}
                onChange={setDiscountAmount}
              />
              <label className="block text-sm font-bold text-[#454557] md:col-span-2">
                Notes
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  rows={4}
                  className="mt-2 w-full resize-none rounded-lg border border-[#C5C4DA] bg-white px-3 py-3 text-[#191C1E] outline-none focus:border-[#1117E8] focus:ring-4 focus:ring-[#DADEFD]"
                />
              </label>
            </div>
            <div className="rounded-xl border border-[#C5C4DA]">
              <div className="flex flex-col gap-3 border-b border-[#C5C4DA] bg-[#F7F9FB] p-4 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="font-bold">Line Items</h3>
                <Button
                  variant="secondary"
                  onClick={() =>
                    setLineItems((current) => [
                      ...current,
                      {
                        description: "",
                        quantity: 1,
                        unit_price: 0,
                        tax_rate: 0,
                      },
                    ])
                  }
                >
                  Add Line Item
                </Button>
              </div>
              <div className="space-y-4 p-4">
                {lineItems.map((item, index) => (
                  <div
                    key={index}
                    className="grid gap-3 rounded-xl bg-[#F1F4F8] p-4 md:grid-cols-[minmax(0,1.5fr)_0.5fr_0.75fr_0.5fr_auto]"
                  >
                    <InvoiceInput
                      label="Description"
                      value={item.description}
                      onChange={(value) =>
                        updateLineItem(index, { description: value })
                      }
                    />
                    <InvoiceInput
                      label="Qty"
                      type="number"
                      value={String(item.quantity)}
                      onChange={(value) =>
                        updateLineItem(index, { quantity: Number(value) })
                      }
                    />
                    <InvoiceInput
                      label="Unit Price"
                      type="number"
                      value={String(item.unit_price)}
                      onChange={(value) =>
                        updateLineItem(index, { unit_price: Number(value) })
                      }
                    />
                    <InvoiceInput
                      label="VAT %"
                      type="number"
                      value={String(item.tax_rate ?? 0)}
                      onChange={(value) =>
                        updateLineItem(index, { tax_rate: Number(value) })
                      }
                    />
                    <Button
                      variant="ghost"
                      className="self-end"
                      onClick={() =>
                        setLineItems((current) =>
                          current.filter((_, itemIndex) => itemIndex !== index),
                        )
                      }
                      disabled={lineItems.length === 1}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 border-t border-[#C5C4DA] bg-white p-6 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Update Invoice"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

function InvoiceInput({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block text-sm font-bold text-[#454557]">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-11 w-full rounded-lg border border-[#C5C4DA] bg-white px-3 text-[#191C1E] outline-none focus:border-[#1117E8] focus:ring-4 focus:ring-[#DADEFD]"
      />
    </label>
  );
}

function InvoiceDetailsModal({
  invoice,
  company,
  customer,
  logoUrl,
  onClose,
  onDownload,
}: {
  invoice: SalesInvoice;
  company: Company | null;
  customer?: Customer;
  logoUrl?: string | null;
  onClose: () => void;
  onDownload: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center overflow-hidden bg-[#191C1E]/55 p-0 backdrop-blur-sm sm:items-center sm:p-4 print:static print:block print:bg-white print:p-0"
      role="dialog"
      aria-modal="true"
      aria-labelledby="invoice-details-title"
      onMouseDown={onClose}
    >
      <div
        className="flex max-h-[96dvh] w-full max-w-6xl flex-col overflow-hidden rounded-t-2xl bg-[#E9EDF2] shadow-2xl sm:rounded-2xl print:max-h-none print:max-w-none print:overflow-visible print:rounded-none print:bg-white print:shadow-none"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-[#C5C4DA] bg-white p-3 sm:p-4 print:hidden">
          <div>
            <h2 id="invoice-details-title" className="font-bold">
              {invoice.invoice_number}
            </h2>
            <p className="text-xs text-[#757588]">Invoice preview</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={onDownload}>
              <Download className="h-4 w-4" /> Download PDF
            </Button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close invoice details"
              className="rounded-lg p-2 text-[#454557] hover:bg-[#F1F4F8]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-2 sm:p-5 print:overflow-visible print:p-0">
          <InvoiceDocument
            invoice={invoice}
            company={company}
            customer={customer}
            logoUrl={logoUrl}
          />
        </div>
      </div>
    </div>
  );
}

function printInvoicePdf(invoiceNumber: string) {
  const invoiceDocument = document.getElementById("sales-invoice-document");
  if (!invoiceDocument) {
    notifyDashboard("Invoice preview is still loading. Please try again.");
    return;
  }

  const frame = document.createElement("iframe");
  frame.setAttribute("aria-hidden", "true");
  frame.style.position = "fixed";
  frame.style.width = "0";
  frame.style.height = "0";
  frame.style.border = "0";
  frame.style.right = "0";
  frame.style.bottom = "0";
  document.body.appendChild(frame);

  const frameDocument = frame.contentDocument;
  if (!frameDocument) {
    frame.remove();
    notifyDashboard("Unable to prepare the invoice PDF.");
    return;
  }

  const styles = Array.from(
    document.head.querySelectorAll('link[rel="stylesheet"], style'),
  )
    .map((node) => node.outerHTML)
    .join("\n");

  frameDocument.open();
  frameDocument.write(`<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${invoiceNumber}-invoice</title>
    ${styles}
    <style>
      @page { size: A4 portrait; margin: 0; }
      html, body { margin: 0 !important; padding: 0 !important; background: #fff !important; }
      #sales-invoice-document {
        width: 100% !important;
        max-width: none !important;
        min-height: 0 !important;
        margin: 0 !important;
        box-shadow: none !important;
      }
    </style>
  </head>
  <body>${invoiceDocument.outerHTML}</body>
</html>`);
  frameDocument.close();

  const print = async () => {
    try {
      await frame.contentWindow?.document.fonts?.ready;
      const images = Array.from(frameDocument.images);
      await Promise.all(
        images.map((image) =>
          image.complete
            ? Promise.resolve()
            : new Promise<void>((resolve) => {
                image.onload = () => resolve();
                image.onerror = () => resolve();
              }),
        ),
      );
      frame.contentWindow?.focus();
      frame.contentWindow?.print();
    } finally {
      window.setTimeout(() => frame.remove(), 1000);
    }
  };

  window.setTimeout(() => void print(), 150);
}
