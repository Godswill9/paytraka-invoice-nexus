import { SalesInvoice } from "@/types/api";

function numeric(value: number | string | null | undefined) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function calculatedSubtotal(invoice: Pick<SalesInvoice, "line_items">) {
  return (invoice.line_items ?? []).reduce(
    (sum, item) => sum + numeric(item.quantity) * numeric(item.unit_price),
    0,
  );
}

export function salesInvoiceSubtotal(invoice: SalesInvoice) {
  if (invoice.subtotal != null) return numeric(invoice.subtotal);
  return calculatedSubtotal(invoice);
}

export function salesInvoiceTax(invoice: SalesInvoice) {
  if (invoice.tax_amount != null) return numeric(invoice.tax_amount);
  return (invoice.line_items ?? []).reduce((sum, item) => {
    const base = numeric(item.quantity) * numeric(item.unit_price);
    return sum + (base * numeric(item.tax_rate)) / 100;
  }, 0);
}

export function salesInvoiceTotal(invoice: SalesInvoice) {
  if (invoice.total_amount != null) return numeric(invoice.total_amount);
  return Math.max(
    salesInvoiceSubtotal(invoice) + salesInvoiceTax(invoice) - numeric(invoice.discount_amount),
    0,
  );
}

export function salesInvoiceBalance(invoice: SalesInvoice) {
  if (invoice.balance_due != null) return numeric(invoice.balance_due);
  return Math.max(salesInvoiceTotal(invoice) - numeric(invoice.amount_paid), 0);
}
