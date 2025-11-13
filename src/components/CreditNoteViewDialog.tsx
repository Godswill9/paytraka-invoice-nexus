import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { CreditNote } from "@/services/adjustmentsService";
import { formatCurrency } from "@/utils/currency";
import { Download, Printer } from "lucide-react";
import { useEffect, useState } from "react";
import { getSettings, type BusinessSettings } from "@/services/settingsService";

interface CreditNoteViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  creditNote: CreditNote | null;
}

export function CreditNoteViewDialog({ open, onOpenChange, creditNote }: CreditNoteViewDialogProps) {
  const [settings, setSettings] = useState<BusinessSettings | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      const data = await getSettings();
      setSettings(data);
    };
    loadSettings();
  }, []);

  if (!creditNote) return null;

  const generateIRN = () => {
    const timestamp = Date.now().toString();
    const hash = Math.random().toString(36).substring(2, 10).toUpperCase();
    return `${creditNote.creditNoteNumber.replace(/[^A-Z0-9]/g, '')}-${hash}-${new Date().toISOString().split('T')[0].replace(/-/g, '')}`;
  };

  const irn = generateIRN();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Credit Note #{creditNote.creditNoteNumber}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-6 bg-card">
          {/* Header with Logo and QR Code */}
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
            <div className="text-right space-y-3">
              <div className="bg-white p-2 rounded border inline-block">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(irn)}`}
                  alt="Credit Note QR Code"
                  className="h-24 w-24"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary">CREDIT NOTE</h3>
                <p className="text-sm">#{creditNote.creditNoteNumber}</p>
                <p className="text-xs font-mono text-muted-foreground break-all">IRN: {irn}</p>
                <p className="text-xs text-muted-foreground mt-2">Date: {creditNote.date}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Credit Note Details */}
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-semibold">Customer:</span>
              <span>{creditNote.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Invoice:</span>
              <span>#{creditNote.invoiceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Status:</span>
              <span className="capitalize">{creditNote.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Reason:</span>
              <span>{creditNote.reason}</span>
            </div>
          </div>

          <Separator />

          {/* Amount */}
          <div className="bg-accent p-6 rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-2">Credit Amount</p>
            <p className="text-3xl font-bold text-primary">{formatCurrency(creditNote.amount)}</p>
          </div>

          {/* FIRS Footer */}
          <div className="flex items-center justify-center gap-2 p-4 bg-accent rounded-lg">
            <img src="https://einvoice.firs.gov.ng/favicon.png" alt="FIRS" className="h-6 w-6" />
            <span className="text-sm font-medium">FIRS Compliant</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-center mt-4">
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
