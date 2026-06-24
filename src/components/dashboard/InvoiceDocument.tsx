import { Globe2, Mail, Phone } from "lucide-react";
import { Company, Customer, SalesInvoice } from "@/types/api";
import {
  salesInvoiceBalance,
  salesInvoiceSubtotal,
  salesInvoiceTax,
  salesInvoiceTotal,
} from "@/lib/invoice-amounts";

function money(value: number, currency: string) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: currency || "NGN",
    minimumFractionDigits: 2,
  }).format(value);
}

function date(value?: string) {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Africa/Lagos",
  }).format(parsed);
}

export function InvoiceDocument({
  invoice,
  company,
  customer,
  logoUrl,
}: {
  invoice: SalesInvoice;
  company?: Company | null;
  customer?: Customer;
  logoUrl?: string | null;
}) {
  const companyName =
    invoice.company_name || company?.company_name || "Company";
  const customerName = invoice.customer_name || customer?.name || "Customer";
  const currency = invoice.currency || "NGN";
  const subtotal = salesInvoiceSubtotal(invoice);
  const discount = Number(invoice.discount_amount ?? 0);
  const tax = salesInvoiceTax(invoice);
  const total = salesInvoiceTotal(invoice);
  const balance = salesInvoiceBalance(invoice);
  const irn = invoice.irn;

  return (
    <article
      id="sales-invoice-document"
      className="mx-auto min-h-[900px] w-full max-w-[900px] overflow-hidden bg-white px-5 py-8 text-[#081A33] shadow-[0_24px_70px_rgba(15,23,42,0.18)] sm:px-9 sm:py-10 lg:min-h-[1080px] lg:px-14 lg:py-12 print:min-h-0 print:max-w-none print:shadow-none"
    >
      <header className="grid gap-8 sm:grid-cols-[minmax(0,1fr)_220px] sm:items-start">
        <div>
          <h1 className="text-4xl font-black tracking-[0.03em] sm:text-5xl">
            INVOICE
          </h1>
          <div className="mt-4 space-y-1 text-xs font-semibold sm:text-sm">
            <p>
              <b>Invoice No:</b> {invoice.invoice_number}
            </p>
            <p>
              <b>Date:</b> {date(invoice.issue_date)}
            </p>
            <p>
              <b>Due Date:</b> {date(invoice.due_date)}
            </p>
            <p>
              {irn && (
                <span>
                  <b>IRN:</b> {irn}
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="flex min-h-20 items-center justify-start sm:justify-end">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={`${companyName} letterhead`}
              className="max-h-20 max-w-[190px] object-contain"
            />
          ) : (
            <div className="text-left sm:text-right">
              <p className="text-xl font-black uppercase leading-tight">
                {companyName}
              </p>
              {/* <p className="mt-1 text-xs font-semibold text-[#66728A]">
                Company Letterhead
              </p> */}
            </div>
          )}
        </div>
      </header>

      <section className="mt-14 grid gap-8 text-sm sm:grid-cols-2 lg:mt-20">
        <div>
          <p className="text-xs font-black uppercase tracking-wide">From:</p>
          <h2 className="mt-2 font-black uppercase">{companyName}</h2>
          {company?.tax_identification_number ? (
            <p className="mt-1">TIN: {company.tax_identification_number}</p>
          ) : null}
          <p className="mt-1 font-semibold">Postage Address:</p>
          <p className="mt-1 max-w-xs leading-6">
            {[
              company?.street_name || company?.address,
              company?.city,
              company?.lga,
              company?.state,
              company?.postal_code,
              company?.country,
            ]
              .filter(Boolean)
              .join(", ") || "Company address not provided"}
          </p>
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-wide">
            Issued To:
          </p>
          <h2 className="mt-2 font-black">{customerName}</h2>
          {customer?.tax_identification_number ? (
            <p className="mt-1">TIN: {customer.tax_identification_number}</p>
          ) : null}
          <p className="mt-1 font-semibold">Postage Address:</p>
          <p className="mt-1 leading-6">
            {[
              customer?.street_name || customer?.billing_address,
              customer?.city,
              customer?.lga,
              customer?.state,
              customer?.postal_code,
              customer?.country,
            ]
              .filter(Boolean)
              .join(", ") || "Customer address not provided"}
          </p>
        </div>
      </section>

      <section className="mt-12 overflow-x-auto lg:mt-16">
        <table className="w-full min-w-[690px] border-collapse text-left text-[11px] sm:text-xs">
          <thead className="bg-[#075CBD] text-white">
            <tr>
              <th className="px-3 py-4 font-black">DESCRIPTION</th>
              <th className="px-3 py-4 text-center font-black">QUANTITY</th>
              <th className="px-3 py-4 text-right font-black">
                EXCL.
                <br />
                PRICE
              </th>
              <th className="px-3 py-4 text-right font-black">DISC %</th>
              <th className="px-3 py-4 text-right font-black">VAT %</th>
              <th className="px-3 py-4 text-right font-black">
                EXCL.
                <br />
                TOTAL
              </th>
              <th className="px-3 py-4 text-right font-black">
                INCL.
                <br />
                TOTAL
              </th>
            </tr>
          </thead>
          <tbody>
            {(invoice.line_items ?? []).length ? (
              (invoice.line_items ?? []).map((item, index) => {
                const base = Number(item.quantity) * Number(item.unit_price);
                const inclusive =
                  base + (base * Number(item.tax_rate ?? 0)) / 100;
                return (
                  <tr
                    key={`${item.description}-${index}`}
                    className="border-b border-[#DCE0E8]"
                  >
                    <td className="px-3 py-4 font-bold">{item.description}</td>
                    <td className="px-3 py-4 text-center">{item.quantity}</td>
                    <td className="px-3 py-4 text-right">
                      {money(Number(item.unit_price), currency)}
                    </td>
                    <td className="px-3 py-4 text-right">0.00%</td>
                    <td className="px-3 py-4 text-right">
                      {Number(item.tax_rate ?? 0).toFixed(2)}%
                    </td>
                    <td className="px-3 py-4 text-right">
                      {money(base, currency)}
                    </td>
                    <td className="px-3 py-4 text-right font-bold">
                      {money(inclusive, currency)}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr className="border-b border-[#DCE0E8]">
                <td className="px-3 py-5 text-[#66728A]" colSpan={7}>
                  Line-item details are unavailable in this invoice response.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section className="mt-8 ml-auto w-full max-w-xs space-y-4 text-xs sm:text-sm">
        <div className="flex justify-between gap-4">
          <span>Total Discount:</span>
          <b>{money(discount, currency)}</b>
        </div>
        <div className="flex justify-between gap-4">
          <span>Total Exclusive:</span>
          <b>{money(subtotal, currency)}</b>
        </div>
        <div className="flex justify-between gap-4">
          <span>Total VAT:</span>
          <b>{money(tax, currency)}</b>
        </div>
        <div className="flex justify-between gap-4 border-t border-[#DCE0E8] pt-3">
          <span>Balance Due:</span>
          <b>{money(balance, currency)}</b>
        </div>
      </section>

      <section className="mt-10 flex items-center justify-between gap-5 bg-[#EEEAE2] px-5 py-5 text-sm font-black sm:text-base">
        <span>SUBTOTAL</span>
        <span>TOTAL: {money(total, currency)}</span>
      </section>

      <div className="min-h-36 lg:min-h-52" />

      <footer>
        {invoice.notes ? (
          <p className="mb-6 text-xs text-[#66728A]">{invoice.notes}</p>
        ) : null}
        <div className="relative overflow-hidden border-t-[3px] border-[#075CBD] pt-5">
          <div className="flex flex-col gap-3 pr-0 text-[9px] text-[#66728A] sm:flex-row sm:items-center sm:gap-4 sm:pr-36">
            {company?.business_phone ? (
              <span className="inline-flex items-center gap-1">
                <Phone className="h-3 w-3 text-red-700" />{" "}
                {company.business_phone}
              </span>
            ) : null}
            {company?.business_email ? (
              <span className="inline-flex items-center gap-1">
                <Mail className="h-3 w-3" /> {company.business_email}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1">
              <Globe2 className="h-3 w-3 text-cyan-600" /> Generated from
              PayTraka
            </span>
          </div>
          <div className="mt-5 h-14 bg-[#075CBD] sm:absolute sm:-bottom-5 sm:right-0 sm:mt-0 sm:w-32">
            <div className="h-full w-14 -skew-x-[40deg] bg-amber-400" />
          </div>
        </div>
      </footer>
    </article>
  );
}
