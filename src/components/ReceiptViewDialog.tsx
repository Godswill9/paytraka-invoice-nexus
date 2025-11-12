import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Receipt } from "@/services/receiptsService";
import { formatCurrency } from "@/utils/currency";
import { Download, Printer } from "lucide-react";
import { generateReceiptPDF } from "@/utils/pdfGenerator";
import { useEffect, useState } from "react";
import { getSettings, type BusinessSettings } from "@/services/settingsService";

interface ReceiptViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receipt: Receipt | null;
}

export function ReceiptViewDialog({ open, onOpenChange, receipt }: ReceiptViewDialogProps) {
  const [settings, setSettings] = useState<BusinessSettings | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      const data = await getSettings();
      setSettings(data);
    };
    loadSettings();
  }, []);

  if (!receipt) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Receipt #{receipt.receiptNumber}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-6 bg-card">
          {/* Header with Logo */}
          <div className="text-center">
            {settings?.logo && (
              <img src={settings.logo} alt="Business Logo" className="h-16 w-auto mx-auto mb-4" />
            )}
            <h2 className="text-2xl font-bold">{settings?.businessName || 'Business Name'}</h2>
            <p className="text-sm text-muted-foreground">{settings?.email}</p>
            <p className="text-sm text-muted-foreground">{settings?.phone}</p>
            <p className="text-sm text-muted-foreground">{settings?.address}</p>
          </div>

          <Separator />

          <div className="text-center">
            <h3 className="text-xl font-bold text-primary">RECEIPT</h3>
            <p className="text-sm">#{receipt.receiptNumber}</p>
            <p className="text-xs text-muted-foreground">Date: {receipt.paymentDate}</p>
          </div>

          <Separator />

          {/* Receipt Details */}
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-semibold">Customer:</span>
              <span>{receipt.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Invoice:</span>
              <span>#{receipt.invoiceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Payment Method:</span>
              <span className="capitalize">{receipt.paymentMethod}</span>
            </div>
            {receipt.notes && (
              <div className="flex justify-between">
                <span className="font-semibold">Notes:</span>
                <span>{receipt.notes}</span>
              </div>
            )}
          </div>

          <Separator />

          {/* Amount */}
          <div className="bg-accent p-6 rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-2">Amount Paid</p>
            <p className="text-3xl font-bold text-primary">{formatCurrency(receipt.amount)}</p>
          </div>

          {/* Notes */}
          {receipt.notes && (
            <div>
              <h4 className="font-semibold mb-2">Notes:</h4>
              <p className="text-sm text-muted-foreground">{receipt.notes}</p>
            </div>
          )}

          {/* FIRS Footer */}
          <div className="flex items-center justify-center gap-2 p-4 bg-accent rounded-lg">
            <img src="https://einvoice.firs.gov.ng/favicon.png" alt="FIRS" className="h-6 w-6" />
            <span className="text-sm font-medium">FIRS Compliant</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-center mt-4">
            <Button variant="outline" onClick={() => generateReceiptPDF(receipt)}>
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
