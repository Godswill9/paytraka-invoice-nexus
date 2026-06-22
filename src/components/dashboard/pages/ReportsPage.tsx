"use client";

import { BarChart3, Download, FileText, Hourglass, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { CurrencyAmount } from "@/components/ui/CurrencyAmount";
import { useAuth } from "@/hooks/useAuth";
import { useCompany } from "@/hooks/useCompany";
import { useCustomers } from "@/hooks/useCustomers";
import { useInvoices } from "@/hooks/useInvoices";
import { usePurchaseInvoices } from "@/hooks/usePurchaseInvoices";
import { downloadCsv } from "@/lib/csv";
import { salesInvoiceBalance, salesInvoiceTax, salesInvoiceTotal } from "@/lib/invoice-amounts";
import { PurchaseInvoice } from "@/types/api";
import { Button, Card, ComplianceAlert, MetricCard, PageHeader, StatusBadge } from "../ui";

type Timeframe = "this_month" | "last_month" | "quarter" | "year";

function purchaseTotal(invoice: PurchaseInvoice) {
  if (invoice.total_amount != null) return Number(invoice.total_amount);
  if (invoice.amount != null) return Number(invoice.amount);
  return (invoice.line_items ?? []).reduce((sum, item) => {
    const base = Number(item.quantity) * Number(item.unit_price);
    return sum + base + (base * Number(item.tax_rate ?? 0)) / 100;
  }, 0);
}

function purchaseVat(invoice: PurchaseInvoice) {
  if (invoice.tax_amount != null) return Number(invoice.tax_amount);
  return (invoice.line_items ?? []).reduce((sum, item) => {
    const base = Number(item.quantity) * Number(item.unit_price);
    return sum + (base * Number(item.tax_rate ?? 0)) / 100;
  }, 0);
}

function recordDate(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function timeframeRange(timeframe: Timeframe) {
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  if (timeframe === "this_month") return { start: new Date(now.getFullYear(), now.getMonth(), 1), end, label: now.toLocaleDateString("en-NG", { month: "long", year: "numeric" }) };
  if (timeframe === "last_month") {
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return { start, end: new Date(now.getFullYear(), now.getMonth(), 1), label: start.toLocaleDateString("en-NG", { month: "long", year: "numeric" }) };
  }
  if (timeframe === "quarter") {
    const quarterStart = Math.floor(now.getMonth() / 3) * 3;
    return { start: new Date(now.getFullYear(), quarterStart, 1), end: new Date(now.getFullYear(), quarterStart + 3, 1), label: `Q${Math.floor(now.getMonth() / 3) + 1} ${now.getFullYear()}` };
  }
  return { start: new Date(now.getFullYear(), 0, 1), end: new Date(now.getFullYear() + 1, 0, 1), label: String(now.getFullYear()) };
}

function inRange(date: Date | null, start: Date, end: Date) {
  return Boolean(date && date >= start && date < end);
}

export function ReportsPage() {
  const { user } = useAuth();
  const { company } = useCompany(user?.company_id);
  const { invoices: sales, loading: salesLoading, error: salesError } = useInvoices();
  const { invoices: purchases, loading: purchasesLoading, error: purchasesError } = usePurchaseInvoices();
  const { customers } = useCustomers();
  const [timeframe, setTimeframe] = useState<Timeframe>("this_month");
  const range = useMemo(() => timeframeRange(timeframe), [timeframe]);
  const companyName = company?.company_name || user?.company_name || user?.trading_name || "Company";

  const periodSales = useMemo(() => sales.filter((invoice) => inRange(recordDate(invoice.issue_date), range.start, range.end)), [range, sales]);
  const periodPurchases = useMemo(() => purchases.filter((invoice) => inRange(recordDate(invoice.invoice_date ?? invoice.issue_date), range.start, range.end)), [purchases, range]);
  const outputVat = periodSales.reduce((sum, invoice) => sum + salesInvoiceTax(invoice), 0);
  const inputVat = periodPurchases.reduce((sum, invoice) => sum + purchaseVat(invoice), 0);
  const netVat = Math.max(outputVat - inputVat, 0);
  const salesRevenue = periodSales.reduce((sum, invoice) => sum + salesInvoiceTotal(invoice), 0);
  const outstandingBalance = periodSales.reduce((sum, invoice) => sum + salesInvoiceBalance(invoice), 0);
  const purchaseSpend = periodPurchases.reduce((sum, invoice) => sum + purchaseTotal(invoice), 0);
  const postedSales = periodSales.filter((invoice) => ["posted", "sent", "paid"].includes(invoice.status?.toLowerCase() ?? "")).length;
  const completeCustomers = customers.filter((customer) => customer.tax_identification_number).length;
  const complianceChecks = [
    { label: "Sales invoices posted", ready: periodSales.length === 0 || postedSales === periodSales.length, detail: `${postedSales}/${periodSales.length}` },
    { label: "Purchases categorized", ready: periodPurchases.every((invoice) => (invoice.line_items ?? []).every((item) => item.product_category || item.product_id)), detail: `${periodPurchases.length} records` },
    { label: "Customer TIN coverage", ready: customers.length === 0 || completeCustomers === customers.length, detail: `${completeCustomers}/${customers.length}` },
    { label: "Company tax identity", ready: Boolean(company?.tax_identification_number || user?.tax_identification_number), detail: company?.tax_identification_number || user?.tax_identification_number ? "Present" : "Missing" },
  ];
  const compliancePercent = Math.round((complianceChecks.filter((check) => check.ready).length / complianceChecks.length) * 100);

  const categories = useMemo(() => {
    const totals = new Map<string, number>();
    periodSales.forEach((invoice) => (invoice.line_items ?? []).forEach((item) => {
      const category = item.product_category || "Uncategorized";
      totals.set(category, (totals.get(category) ?? 0) + Number(item.quantity) * Number(item.unit_price));
    }));
    return [...totals.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [periodSales]);

  function exportReport(kind: "summary" | "sales" | "tax" | "balances" | "aging") {
    if (kind === "sales") {
      downloadCsv(`${companyName}-${range.label}-sales.csv`, periodSales.map((invoice) => ({
        company_name: companyName, timeframe: range.label, invoice_number: invoice.invoice_number, issue_date: invoice.issue_date,
        due_date: invoice.due_date, customer_id: invoice.customer_id, currency: invoice.currency, status: invoice.status, amount: salesInvoiceTotal(invoice), balance_due: salesInvoiceBalance(invoice), output_vat: salesInvoiceTax(invoice),
        generated_from: "PayTraka",
      })));
      return;
    }
    if (kind === "tax" || kind === "summary") {
      downloadCsv(`${companyName}-${range.label}-vat-summary.csv`, [{
        company_name: companyName, timeframe: range.label, sales_revenue: salesRevenue, purchase_spend: purchaseSpend,
        outstanding_balance: outstandingBalance, output_vat: outputVat, input_vat: inputVat, net_vat_payable: netVat, compliance_status: `${compliancePercent}%`,
        generated_from: "PayTraka",
      }]);
      return;
    }
    const today = new Date();
    downloadCsv(`${companyName}-${range.label}-${kind}.csv`, periodSales.map((invoice) => {
      const customer = customers.find((item) => item.id === invoice.customer_id);
      const due = recordDate(invoice.due_date);
      const daysOverdue = due ? Math.max(Math.floor((today.getTime() - due.getTime()) / 86400000), 0) : 0;
      return {
        company_name: companyName, timeframe: range.label, invoice_number: invoice.invoice_number, customer: customer?.name || invoice.customer_id,
        amount: salesInvoiceTotal(invoice), balance_due: salesInvoiceBalance(invoice), currency: invoice.currency, status: invoice.status, due_date: invoice.due_date,
        days_overdue: kind === "aging" ? daysOverdue : undefined, generated_from: "PayTraka",
      };
    }));
  }

  const reportCards = [
    ["Sales Report", "Revenue and invoice values for the selected timeframe.", BarChart3, "sales" as const],
    ["Tax/VAT Report", "Output VAT, input VAT, and net VAT payable.", FileText, "tax" as const],
    ["Customer Balance Report", "Customer invoice balances and payment status.", Users, "balances" as const],
    ["Invoice Aging Report", "Due dates and overdue days for customer invoices.", Hourglass, "aging" as const],
  ] as const;

  return (
    <>
      <PageHeader
        title="Financial Reports"
        subtitle={`Real sales, purchase, and tax values for ${range.label}.`}
        action={<>
          <select value={timeframe} onChange={(event) => setTimeframe(event.target.value as Timeframe)} className="h-11 rounded-xl border border-[#C5C4DA] bg-white px-4 text-sm font-bold text-[#191C1E] outline-none focus:border-[#1117E8]">
            <option value="this_month">This month</option><option value="last_month">Last month</option><option value="quarter">This quarter</option><option value="year">This year</option>
          </select>
          <Button variant="secondary" onClick={() => exportReport("summary")}><Download className="h-4 w-4" /> Export Summary</Button>
        </>}
      />
      {salesError || purchasesError ? <ComplianceAlert tone="warning" title="Some report data could not be loaded" text={salesError || purchasesError} /> : null}
      <div className="mb-6 grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        <MetricCard label="Sales Revenue" value={<CurrencyAmount amount={salesRevenue} />} meta={`${periodSales.length} invoices`} />
        <MetricCard label="Outstanding Balance" value={<CurrencyAmount amount={outstandingBalance} />} meta="Balance due in timeframe" tone="warning" />
        <MetricCard label="Purchase Spend" value={<CurrencyAmount amount={purchaseSpend} />} meta={`${periodPurchases.length} purchases`} />
        <MetricCard label="Output VAT" value={<CurrencyAmount amount={outputVat} />} meta="From sales line items" />
        <MetricCard label="Net VAT Payable" value={<CurrencyAmount amount={netVat} />} tone="primary" meta={`Input VAT: ${new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(inputVat)}`} />
      </div>

      <div className="mb-6 grid min-w-0 gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {reportCards.map(([title, description, Icon, kind]) => (
          <Card key={title} className="flex flex-col p-5">
            <span className="inline-flex w-fit rounded-xl bg-[#DADEFD] p-3 text-[#0001B1]"><Icon className="h-5 w-5" /></span>
            <h2 className="mt-4 text-lg font-bold">{title}</h2>
            <p className="mt-2 flex-1 text-sm leading-6 text-[#454557]">{description}</p>
            <Button variant="secondary" className="mt-5 w-full" onClick={() => exportReport(kind)}><Download className="h-4 w-4" /> Export {range.label}</Button>
          </Card>
        ))}
      </div>

      <div className="grid min-w-0 gap-6 2xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="p-5 sm:p-6">
          <h2 className="text-xl font-bold">Sales by Product Category</h2>
          <p className="mt-1 text-sm text-[#757588]">{range.label}</p>
          <div className="mt-6 space-y-5">
            {categories.length ? categories.map(([label, value]) => {
              const percentage = salesRevenue ? Math.round((value / salesRevenue) * 100) : 0;
              return <div key={label}><div className="flex flex-col gap-1 text-sm font-semibold sm:flex-row sm:justify-between sm:gap-3"><span className="break-words">{label}</span><span className="shrink-0"><CurrencyAmount amount={value} /> · {percentage}%</span></div><div className="mt-2 h-2.5 rounded-full bg-[#E5E7EB]"><div className="h-full rounded-full bg-[#1117E8]" style={{ width: `${Math.min(percentage, 100)}%` }} /></div></div>;
            }) : <p className="rounded-xl bg-[#F7F9FB] p-6 text-center text-sm text-[#757588]">No categorized sales in this timeframe.</p>}
          </div>
        </Card>
        <Card className="p-5 sm:p-6">
          <h2 className="text-xl font-bold">Compliance Status</h2>
          <div className="mt-5 h-2.5 rounded-full bg-[#E5E7EB]"><div className="h-full rounded-full bg-green-600 transition-all" style={{ width: `${compliancePercent}%` }} /></div>
          <p className="mt-3 font-bold text-green-700">{compliancePercent}% Ready</p>
          <div className="mt-6 space-y-4">
            {complianceChecks.map((check) => <div key={check.label} className="flex items-center justify-between gap-3"><div><p className="text-sm font-semibold">{check.label}</p><p className="text-xs text-[#757588]">{check.detail}</p></div><StatusBadge tone={check.ready ? "success" : "warning"}>{check.ready ? "Ready" : "Review"}</StatusBadge></div>)}
          </div>
          {(salesLoading || purchasesLoading) ? <p className="mt-5 text-sm font-semibold text-[#757588]">Refreshing report data…</p> : null}
        </Card>
      </div>
    </>
  );
}
