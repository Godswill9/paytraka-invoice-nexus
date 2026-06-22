"use client";

import { Button, ComplianceAlert, FormShell, notifyDashboard, PageHeader } from "../ui";

export function CreateCustomerPage({ supplier = false }: { supplier?: boolean }) {
  const type = supplier ? "Supplier" : "Customer";
  const sections: [string, string[]][] = supplier
    ? [["Supplier Type", ["Business", "Individual", "Government", "Non-profit"]], ["Basic Information", ["Supplier Name", "Contact Person", "Description", "Email Address", "Primary telephone (+country code)", "Secondary telephone (+country code)"]], ["Tax and Compliance Details", ["Supplier TIN", "RC Number / BN Number", "VAT Registered", "VAT Number"]], ["Supplier Address", ["Street name", "City", "State", "LGA", "Country", "Postal zone"]], ["Bank and Payment Details", ["Bank Name", "Account Number", "Account Name", "Preferred Payment Method", "Payment Terms"]], ["Notes & Documents", ["Private Notes", "Upload certificate/contract/KYC documents"]]]
    : [["Customer Type", ["Business", "Individual", "Government", "Non-profit"]], ["Basic Information", ["Customer Name", "Contact Person", "Description", "Email Address", "Primary telephone (+country code)", "Secondary telephone (+country code)"]], ["Tax & Compliance Details", ["Customer TIN", "RC Number / BN Number", "VAT Registered", "VAT Number"]], ["Billing Address", ["Street name", "City", "State", "LGA", "Country", "Postal zone"]], ["Invoice Preferences", ["Payment Terms", "Preferred Currency", "Default invoice note"]], ["Internal Notes & Documents", ["Private notes", "Upload certificate/contract/KYC documents"]]];
  return (
    <>
      <PageHeader breadcrumb={`Dashboard / ${supplier ? "Suppliers" : "Customers"} / Create ${type}`} title={`Create ${type}`} subtitle={`Add ${supplier ? "vendor" : "buyer"} details for invoices, receipts, payment tracking, and e-invoicing validation.`} action={<><Button variant="secondary" href={`/dashboard/${supplier ? "suppliers" : "customers"}`}>Cancel</Button><Button variant="secondary" href="/dashboard/invoices/create">Save and Create Invoice</Button><Button onClick={() => notifyDashboard(`${type} saved`)}>Save {type}</Button></>} />
      <ComplianceAlert title="Tax Identification Missing" text={`${type} TIN improves invoice validation and reduces failed FIRS/NRS submissions.`} />
      <FormShell title={`Create ${type}`} sideTitle="Readiness Checklist" sections={sections} buttons={[`Save ${type}`]} />
    </>
  );
}
