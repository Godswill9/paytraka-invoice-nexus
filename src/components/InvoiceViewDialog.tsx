import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Invoice } from "@/services/invoicesService";
import { formatCurrency } from "@/utils/currency";
import { Download, Printer } from "lucide-react";
import { generateInvoicePDF } from "@/utils/pdfGenerator";
import { useEffect, useState } from "react";
import { getSettings, type BusinessSettings } from "@/services/settingsService";

interface InvoiceViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice | null;
}

export function InvoiceViewDialog({ open, onOpenChange, invoice }: InvoiceViewDialogProps) {
  const [settings, setSettings] = useState<BusinessSettings | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      const data = await getSettings();
      setSettings(data);
    };
    loadSettings();
  }, []);

  if (!invoice) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Invoice #{invoice.invoiceNumber}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-6 bg-card">
          {/* Header with Logo */}
          <div className="flex justify-between items-start">
            <div>
              {settings?.logo && (
                <img src={settings.logo} alt="Business Logo" className="h-16 w-auto mb-4" />
              )}
              <h2 className="text-2xl font-bold">{settings?.businessName || 'Business Name'}</h2>
              <p className="text-sm text-muted-foreground">{settings?.email}</p>
              <p className="text-sm text-muted-foreground">{settings?.phone}</p>
              <p className="text-sm text-muted-foreground">{settings?.address}</p>
            </div>
            <div className="text-right">
              <h3 className="text-xl font-bold text-primary">INVOICE</h3>
              <p className="text-sm">#{invoice.invoiceNumber}</p>
              <p className="text-xs text-muted-foreground">Date: {invoice.date}</p>
              <p className="text-xs text-muted-foreground">Due: {invoice.dueDate}</p>
            </div>
          </div>

          <Separator />

          {/* Customer Details */}
          <div>
            <h4 className="font-semibold mb-2">Bill To:</h4>
            <p className="font-medium">{invoice.customerName}</p>
          </div>

          {/* Line Items */}
          <div>
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-2">Item</th>
                  <th className="text-right p-2">Qty</th>
                  <th className="text-right p-2">Price</th>
                  <th className="text-right p-2">Tax</th>
                  <th className="text-right p-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{item.productName}</td>
                    <td className="text-right p-2">{item.quantity}</td>
                    <td className="text-right p-2">{formatCurrency(item.unitPrice)}</td>
                    <td className="text-right p-2">{item.taxRate}%</td>
                    <td className="text-right p-2">{formatCurrency(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>{formatCurrency(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax:</span>
                <span>{formatCurrency(invoice.taxAmount)}</span>
              </div>
              {invoice.discount > 0 && (
                <div className="flex justify-between text-sm text-success">
                  <span>Discount:</span>
                  <span>-{formatCurrency(invoice.discount)}</span>
                </div>
              )}
              {invoice.deliveryFee > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Delivery Fee:</span>
                  <span>{formatCurrency(invoice.deliveryFee)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>{formatCurrency(invoice.total)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Notes:</h4>
              <p className="text-sm text-muted-foreground">{invoice.notes}</p>
            </div>
          )}

          {/* FIRS Footer */}
          <div className="flex items-center justify-center gap-2 p-4 bg-accent rounded-lg mt-6">
            <img src="https://einvoice.firs.gov.ng/favicon.png" alt="FIRS" className="h-6 w-6" />
            <span className="text-sm font-medium">FIRS Compliant</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end mt-4">
            <Button variant="outline" onClick={() => generateInvoicePDF(invoice)}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
