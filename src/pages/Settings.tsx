import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Building2, Mail, Phone, MapPin } from "lucide-react";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account and business settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
          <CardDescription>Update your business details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name</Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="businessName" placeholder="Your Business Name" className="pl-9" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="email" type="email" placeholder="business@example.com" className="pl-9" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="phone" placeholder="+234 800 000 0000" className="pl-9" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input id="address" placeholder="Business Address" className="pl-9" />
            </div>
          </div>

          <Button className="mt-4">Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invoice Settings</CardTitle>
          <CardDescription>Configure invoice defaults</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
            <Input id="taxRate" type="number" placeholder="7.5" step="0.1" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentTerms">Payment Terms (Days)</Label>
            <Input id="paymentTerms" type="number" placeholder="30" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="invoiceNotes">Default Invoice Notes</Label>
            <Input id="invoiceNotes" placeholder="Thank you for your business" />
          </div>

          <Button className="mt-4">Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>FIRS Compliance</CardTitle>
          <CardDescription>Tax identification and compliance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="taxId">Tax Identification Number (TIN)</Label>
            <Input id="taxId" placeholder="Enter your TIN" />
          </div>

          <div className="flex items-center gap-2 p-4 bg-accent rounded-lg">
            <img src="https://einvoice.firs.gov.ng/favicon.png" alt="FIRS" className="h-8 w-8" />
            <div>
              <p className="text-sm font-medium">FIRS Compliant Status</p>
              <p className="text-xs text-muted-foreground">Your invoices include FIRS-compliant footers and QR codes</p>
            </div>
          </div>

          <Button className="mt-4">Update Tax Info</Button>
        </CardContent>
      </Card>
    </div>
  );
}
