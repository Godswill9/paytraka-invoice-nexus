"use client";

import { AlertTriangle, Check, ChevronDown, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CurrencyAmount } from "@/components/ui/CurrencyAmount";
import { useCustomers } from "@/hooks/useCustomers";
import { useInvoices } from "@/hooks/useInvoices";
import { useProducts } from "@/hooks/useProducts";
import { getApiErrorMessage } from "@/lib/api/client";
import { salesInvoiceBalance } from "@/lib/invoice-amounts";
import { SalesInvoice } from "@/types/api";
import {
  buildSalesInvoiceRequest,
  validateSalesInvoiceDraft,
} from "@/lib/invoice-form";
import {
  Button,
  Card,
  ComplianceAlert,
  FormShell,
  notifyDashboard,
  PageHeader,
} from "../ui";

type InvoiceItem = {
  id: number;
  productId: string;
  description: string;
  quantity: number;
  rate: number;
  vatRate: number;
  hsnCode?: string;
  productCategory?: string;
};

function lineSubtotal(item: InvoiceItem) {
  return item.quantity * item.rate;
}

function lineVat(item: InvoiceItem) {
  return lineSubtotal(item) * (item.vatRate / 100);
}

function lineTotal(item: InvoiceItem) {
  return lineSubtotal(item) + lineVat(item);
}

function invoiceTotalForOption(invoice: SalesInvoice) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: invoice.currency || "NGN" }).format(salesInvoiceBalance(invoice));
}

function SalesInvoiceBuilder() {
  const customersState = useCustomers();
  const {
    customers,
    loading: customersLoading,
    error: customersError,
  } = customersState;
  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useProducts();
  const { create, invoices, loading: invoicesLoading } = useInvoices();
  const [customerId, setCustomerId] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [customerOpen, setCustomerOpen] = useState(false);
  const [invoiceType, setInvoiceType] = useState("standard_invoice");
  const [currency, setCurrency] = useState("NGN");
  const [referenceInvoiceId, setReferenceInvoiceId] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [notes, setNotes] = useState("Thank you for your business.");
  const [lineItems, setLineItems] = useState<InvoiceItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const productById = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products],
  );
  const filteredCustomers = useMemo(() => {
    const search = customerSearch.trim().toLowerCase();
    if (!search) return customers;
    return customers.filter((customer) =>
      [
        customer.name,
        customer.email,
        customer.phone1,
        customer.tax_identification_number,
      ].some((value) => value?.toLowerCase().includes(search)),
    );
  }, [customerSearch, customers]);
  const selectedCustomer = customers.find(
    (customer) => customer.id === customerId,
  );
  const referenceInvoices = useMemo(
    () => invoices.filter((invoice) => {
      const status = invoice.status?.toLowerCase();
      const matchesCustomer = !customerId || invoice.customer_id === customerId;
      return matchesCustomer && (status === "posted" || status === "sent");
    }),
    [customerId, invoices],
  );
  const subtotal = lineItems.reduce((sum, item) => sum + lineSubtotal(item), 0);
  const vat = lineItems.reduce((sum, item) => sum + lineVat(item), 0);
  const total = Math.max(
    lineItems.reduce((sum, item) => sum + lineTotal(item), 0) - discountAmount,
    0,
  );

  const draft = useMemo(
    () => ({
      customerId,
      invoiceType,
      issueDate,
      dueDate,
      currency,
      notes,
      discountAmount,
      lineItems,
      referenceInvoiceId,
    }),
    [
      currency,
      customerId,
      discountAmount,
      dueDate,
      invoiceType,
      issueDate,
      lineItems,
      notes,
      referenceInvoiceId,
    ],
  );
  const validationErrors = useMemo(
    () => validateSalesInvoiceDraft(draft),
    [draft],
  );
  const canCreate = validationErrors.length === 0 && !saving;

  useEffect(() => {
    const today = new Date();
    const due = new Date(today);
    due.setDate(due.getDate() + 14);
    setIssueDate(today.toISOString().slice(0, 10));
    setDueDate(due.toISOString().slice(0, 10));
  }, []);

  useEffect(() => {
    setCurrency(selectedCustomer?.preferred_currency || "NGN");
  }, [selectedCustomer]);

  function updateItem(id: number, updates: Partial<InvoiceItem>) {
    setLineItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    );
  }

  function chooseProduct(id: number, productId: string) {
    const product = productById.get(productId);
    updateItem(id, {
      productId,
      description: product?.description ?? product?.name ?? "",
      rate: Number(product?.unit_price ?? 0),
      vatRate: Number(product?.tax_rate ?? 0),
      hsnCode: product?.hsn_code,
      productCategory: product?.category_id,
    });
  }

  function addItem() {
    const product = products[0];
    setLineItems((current) => [
      ...current,
      {
        id: Date.now() + Math.random(),
        productId: product?.id ?? "",
        description: product?.description ?? product?.name ?? "",
        quantity: 1,
        rate: Number(product?.unit_price ?? 0),
        vatRate: Number(product?.tax_rate ?? 0),
        hsnCode: product?.hsn_code,
        productCategory: product?.category_id,
      },
    ]);
  }

  function removeItem(id: number) {
    setLineItems((current) => current.filter((item) => item.id !== id));
  }

  async function saveInvoice() {
    if (validationErrors.length) {
      setFormError(validationErrors[0]);
      notifyDashboard(validationErrors[0]);
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      const response = await create(buildSalesInvoiceRequest(draft));
      notifyDashboard(`${response.data.invoice_number} created`);
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        "Unable to create invoice. Review the customer and line items, then try again.",
      );
      setFormError(message);
      notifyDashboard(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Create Sales Invoice"
        subtitle="Select a customer, add products or services, calculate VAT, and prepare the invoice."
        breadcrumb="Dashboard / Invoices / Create Invoice"
        action={
          <>
            <Button variant="secondary" href="/dashboard/invoices/sales">
              Cancel
            </Button>
            <Button onClick={saveInvoice} disabled={!canCreate}>
              {saving ? "Creating..." : "Create Invoice"}
            </Button>
          </>
        }
      />
      {customersError || productsError ? (
        <ComplianceAlert
          title="Unable to load data"
          text={customersError || productsError}
        />
      ) : null}
      {/* {formError ? (
        <ComplianceAlert
          title="Invoice cannot be created yet"
          text={formError}
          tone="warning"
        />
      ) : null} */}

      <div className="space-y-6">
        <Card className="p-4 sm:p-6">
          <h2 className="text-xl font-bold">Customer & Invoice Details</h2>
          <p className="mt-1 text-sm text-[#757588]">
            <span className="font-bold text-red-600">*</span> Required fields
            must be completed before the invoice can be created.
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="relative block text-sm font-bold text-[#454557] md:col-span-2">
              Customer <span className="text-red-600">*</span>
              <div className="relative mt-2">
                <input
                  value={customerSearch}
                  onFocus={() => setCustomerOpen(true)}
                  onClick={() => setCustomerOpen(true)}
                  onBlur={() => window.setTimeout(() => setCustomerOpen(false), 150)}
                  onChange={(event) => {
                    setCustomerSearch(event.target.value);
                    setCustomerId("");
                    setCustomerOpen(true);
                  }}
                  placeholder="Click or type to find a customer"
                  autoComplete="off"
                  role="combobox"
                  aria-expanded={customerOpen}
                  className="h-12 w-full rounded-xl border border-[#C5C4DA] bg-white px-4 pr-11 text-sm outline-none focus:border-[#1117E8] focus:ring-4 focus:ring-[#DADEFD]"
                />
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#757588]" />
                {customerOpen ? (
                  <div className="absolute z-30 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-[#C5C4DA] bg-white p-1.5 shadow-2xl">
                    {customersLoading ? <p className="px-3 py-4 text-sm text-[#757588]">Loading customers…</p> : filteredCustomers.length ? filteredCustomers.map((customer) => (
                      <button
                        key={customer.id}
                        type="button"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => {
                          setCustomerId(customer.id);
                          setCustomerSearch(customer.name);
                          setCustomerOpen(false);
                        }}
                        className="flex w-full items-center justify-between gap-4 rounded-lg px-3 py-3 text-left hover:bg-[#F1F4F8]"
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-bold text-[#191C1E]">{customer.name}</span>
                          <span className="block truncate text-xs font-medium text-[#757588]">{customer.email || customer.phone1 || "No contact details"} · {customer.preferred_currency || "NGN"}</span>
                        </span>
                        {customer.id === customerId ? <Check className="h-4 w-4 shrink-0 text-[#1117E8]" /> : null}
                      </button>
                    )) : <p className="px-3 py-4 text-sm text-[#757588]">No matching customers found.</p>}
                  </div>
                ) : null}
              </div>
            </label>
            <label className="block text-sm font-bold text-[#454557]">
              Invoice Type <span className="text-red-600">*</span>
              <select
                value={invoiceType}
                onChange={(event) => setInvoiceType(event.target.value)}
                className="mt-2 h-11 w-full rounded-lg border border-[#C5C4DA] bg-white px-3 text-sm outline-none focus:border-[#1117E8] focus:ring-4 focus:ring-[#DADEFD]"
              >
                <option value="standard_invoice">Standard invoice</option>
                <option value="credit_note">Credit note</option>
                <option value="debit_note">Debit note</option>
              </select>
            </label>
            <label className="block text-sm font-bold text-[#454557]">
              Issue Date <span className="text-red-600">*</span>
              <input
                type="date"
                value={issueDate}
                onChange={(event) => setIssueDate(event.target.value)}
                className="mt-2 h-11 w-full rounded-lg border border-[#C5C4DA] bg-white px-3 text-sm outline-none focus:border-[#1117E8] focus:ring-4 focus:ring-[#DADEFD]"
              />
            </label>
            <label className="block text-sm font-bold text-[#454557]">
              Due Date <span className="text-red-600">*</span>
              <input
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                className="mt-2 h-11 w-full rounded-lg border border-[#C5C4DA] bg-white px-3 text-sm outline-none focus:border-[#1117E8] focus:ring-4 focus:ring-[#DADEFD]"
              />
            </label>
            <div className="rounded-lg bg-[#F1F4F8] p-3 text-sm">
              <span className="font-bold">Currency:</span> {currency} (from selected customer)
            </div>
            {invoiceType === "credit_note" || invoiceType === "debit_note" ? (
              <label className="block text-sm font-bold text-[#454557] md:col-span-2">
                Referenced Invoice <span className="text-red-600">*</span>
                <select value={referenceInvoiceId} onChange={(event) => setReferenceInvoiceId(event.target.value)} disabled={invoicesLoading} className="mt-2 h-12 w-full rounded-xl border border-[#C5C4DA] bg-white px-4 text-sm outline-none focus:border-[#1117E8] focus:ring-4 focus:ring-[#DADEFD]">
                  <option value="">{invoicesLoading ? "Loading posted invoices…" : "Select a posted, unpaid invoice"}</option>
                  {referenceInvoices.map((invoice) => <option key={invoice.id} value={invoice.id}>{invoice.invoice_number} · {invoice.currency} {invoiceTotalForOption(invoice)}</option>)}
                </select>
                {!invoicesLoading && !referenceInvoices.length ? <p className="mt-2 text-xs font-semibold text-amber-700">No posted, unpaid invoices are available.</p> : null}
              </label>
            ) : null}
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-[#C5C4DA] bg-[#F7F9FB] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold">Line Items</h2>
              <p className="mt-1 text-sm text-[#454557]">
                Choose products/services from your catalog, then adjust
                quantity, rate, VAT, and totals.
              </p>
            </div>
            <Button variant="secondary" onClick={addItem}>
              <Plus className="h-4 w-4" /> Add Item
            </Button>
          </div>
          <div className="divide-y divide-[#DCE0E8]">
            {!lineItems.length ? (
              <div className="px-4 py-10 text-center sm:px-6">
                <p className="font-bold text-[#191C1E]">No line items yet</p>
                <p className="mt-1 text-sm text-[#757588]">
                  Add at least one product or service with a description,
                  quantity, and unit price.
                </p>
                <Button variant="secondary" onClick={addItem} className="mt-4">
                  <Plus className="h-4 w-4" /> Add first item
                </Button>
              </div>
            ) : null}
            {lineItems.map((item) => (
              <div
                key={item.id}
                className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-[minmax(170px,1fr)_minmax(200px,1.3fr)_75px_110px_80px_130px] lg:items-end xl:grid-cols-[minmax(180px,1fr)_minmax(220px,1.4fr)_75px_115px_80px_135px_auto]"
              >
                <label className="text-sm font-bold text-[#454557]">
                  Product / Service
                  <select
                    value={item.productId}
                    onChange={(event) =>
                      chooseProduct(item.id, event.target.value)
                    }
                    disabled={productsLoading}
                    className="mt-2 h-10 w-full rounded-lg border border-[#C5C4DA] bg-white px-3 text-sm font-semibold outline-none focus:border-[#1117E8]"
                  >
                    <option value="">Select item</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm font-bold text-[#454557]">
                  Description <span className="text-red-600">*</span>
                  <input
                    value={item.description}
                    onChange={(event) =>
                      updateItem(item.id, { description: event.target.value })
                    }
                    className="mt-2 h-10 w-full rounded-lg border border-[#C5C4DA] px-3 text-sm outline-none focus:border-[#1117E8]"
                  />
                </label>
                <label className="text-sm font-bold text-[#454557]">
                  Qty <span className="text-red-600">*</span>
                  <input
                    aria-label={`Quantity for ${item.description}`}
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(event) =>
                      updateItem(item.id, {
                        quantity: Number(event.target.value) || 1,
                      })
                    }
                    className="mt-2 h-10 w-full rounded-lg border border-[#C5C4DA] px-3 text-sm outline-none focus:border-[#1117E8]"
                  />
                </label>
                <label className="text-sm font-bold text-[#454557]">
                  Rate ({currency}) <span className="text-red-600">*</span>
                  <input
                    aria-label={`Rate for ${item.description}`}
                    type="number"
                    min="0"
                    value={item.rate}
                    onChange={(event) =>
                      updateItem(item.id, {
                        rate: Number(event.target.value) || 0,
                      })
                    }
                    className="mt-2 h-10 w-full rounded-lg border border-[#C5C4DA] px-3 text-sm outline-none focus:border-[#1117E8]"
                  />
                </label>
                <label className="text-sm font-bold text-[#454557]">
                  VAT %
                  <input
                    aria-label={`VAT for ${item.description}`}
                    type="number"
                    min="0"
                    value={item.vatRate}
                    onChange={(event) =>
                      updateItem(item.id, {
                        vatRate: Number(event.target.value) || 0,
                      })
                    }
                    className="mt-2 h-10 w-full rounded-lg border border-[#C5C4DA] px-3 text-sm outline-none focus:border-[#1117E8]"
                  />
                </label>
                <div className="rounded-xl bg-[#F1F4F8] p-3 text-sm">
                  <p className="font-semibold text-[#454557]">Line Total</p>
                  <p className="mt-1 text-lg font-extrabold text-[#0001B1]">
                    <CurrencyAmount amount={lineTotal(item)} currency={currency} />
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  aria-label={`Remove ${item.description || "invoice item"}`}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-red-200 px-3 text-sm font-bold text-red-600 hover:bg-red-50 sm:col-span-2 lg:col-span-6 xl:col-span-1"
                >
                  <Trash2 className="h-4 w-4" /> <span className="xl:sr-only">Remove</span>
                </button>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <Card className="p-4 sm:p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-bold text-[#454557]">
                Discount Amount
                <input
                  type="number"
                  min="0"
                  value={discountAmount}
                  onChange={(event) =>
                    setDiscountAmount(Number(event.target.value) || 0)
                  }
                  className="mt-2 h-11 w-full rounded-lg border border-[#C5C4DA] bg-white px-3 text-sm outline-none focus:border-[#1117E8] focus:ring-4 focus:ring-[#DADEFD]"
                />
              </label>
              <label className="block text-sm font-bold text-[#454557] md:col-span-2">
                Invoice Notes
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  rows={2}
                  className="mt-2 w-full resize-none rounded-lg border border-[#C5C4DA] bg-white px-3 py-3 text-sm outline-none focus:border-[#1117E8] focus:ring-4 focus:ring-[#DADEFD]"
                />
              </label>
            </div>
          </Card>

          <aside className="xl:sticky xl:top-24 xl:self-start">
            <Card className="p-4 sm:p-6">
              <h2 className="text-xl font-bold">Invoice Summary</h2>
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-[#454557]">Customer</span>
                  <b className="text-right">
                    {selectedCustomer?.name ?? "Select customer"}
                  </b>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-[#454557]">Currency</span>
                  <b>{currency}</b>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-[#454557]">Subtotal</span>
                  <b>
                    <CurrencyAmount amount={subtotal} currency={currency} />
                  </b>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-[#454557]">Discount</span>
                  <b>
                    -<CurrencyAmount amount={discountAmount} currency={currency} />
                  </b>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-[#454557]">VAT</span>
                  <b>
                    <CurrencyAmount amount={vat} currency={currency} />
                  </b>
                </div>
                <div className="flex justify-between gap-3 border-t border-[#C5C4DA] pt-4 text-2xl font-extrabold text-[#0001B1]">
                  <span>Total</span>
                  <span>
                    <CurrencyAmount amount={total} currency={currency} />
                  </span>
                </div>
              </div>
              <div className="mt-6 grid gap-3">
                <Button variant="secondary" href="/dashboard/invoices/sales">
                  Cancel
                </Button>
                <Button onClick={saveInvoice} disabled={!canCreate}>
                  {saving ? "Creating..." : "Create Invoice"}
                </Button>
                {!canCreate && !saving ? (
                  <p className="text-center text-xs font-semibold text-[#757588]">
                    {validationErrors[0]}
                  </p>
                ) : null}
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </>
  );
}

export function CreateInvoicePage({
  purchase = false,
}: {
  purchase?: boolean;
}) {
  if (!purchase) return <SalesInvoiceBuilder />;

  const sections: [string, string[]][] = [
    [
      "Supplier Information",
      [
        "Select Supplier",
        "Supplier Email",
        "Phone Number",
        "TIN (Tax Identification Number)",
      ],
    ],
    [
      "Invoice Details",
      [
        "Supplier Invoice #",
        "PayTraka Ref #",
        "Category",
        "Invoice Date",
        "Due Date",
        "Currency",
      ],
    ],
    [
      "Purchase Items",
      ["Product/Service", "Quantity", "Unit Cost", "VAT Rate"],
    ],
    [
      "Tax & Deductions",
      ["Apply 7.5% VAT", "Withholding Tax", "Shipping/Delivery Fee"],
    ],
    ["Payment Info", ["Amount Paid", "Payment Method", "Bank Account"]],
    ["Documentation", ["Upload purchase invoice"]],
    ["Internal Notes", ["Private Notes"]],
  ];

  return (
    <>
      <PageHeader
        title="Create Purchase Invoice"
        subtitle="Record supplier invoices, expenses, VAT, payment terms, and purchase documentation."
        breadcrumb="Dashboard / Invoices / Create Purchase Invoice"
        action={
          <>
            <Button variant="secondary" href="/dashboard/invoices/purchase">
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={() => notifyDashboard("Purchase invoice draft saved")}
            >
              Save as Draft
            </Button>
            <Button onClick={() => notifyDashboard("Purchase invoice saved")}>
              Save Purchase Invoice
            </Button>
          </>
        }
      />
      <ComplianceAlert
        title="Supplier TIN is missing"
        text="You can save this invoice, but VAT and audit reports may need manual review to ensure FIRS compliance."
        action={<AlertTriangle className="h-5 w-5" />}
      />
      <FormShell
        title="Create Purchase Invoice"
        sideTitle="Purchase Summary"
        sections={sections}
        buttons={[
          "Cancel",
          "Save as Draft",
          "Save and Record Payment",
          "Save Purchase Invoice",
        ]}
      />
    </>
  );
}
