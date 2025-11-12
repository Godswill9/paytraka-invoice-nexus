import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Building2, Mail, Phone, MapPin, Upload, X } from "lucide-react";
import { getSettings, updateSettings, uploadLogo, type BusinessSettings } from "@/services/settingsService";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const [settings, setSettings] = useState<BusinessSettings>({
    businessName: '',
    email: '',
    phone: '',
    address: '',
    taxId: '',
    logo: '',
    defaultTaxRate: 7.5,
    paymentTerms: 30,
    invoiceNotes: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const data = await getSettings();
    setSettings(data);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateSettings(settings);
      toast({
        title: "Success",
        description: "Settings saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const logoUrl = await uploadLogo(file);
        setSettings({ ...settings, logo: logoUrl });
        toast({
          title: "Success",
          description: "Logo uploaded successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to upload logo",
          variant: "destructive",
        });
      }
    }
  };

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
            <Label htmlFor="logo">Business Logo</Label>
            <div className="flex items-center gap-4">
              {settings.logo && (
                <div className="relative">
                  <img src={settings.logo} alt="Logo" className="h-20 w-20 object-contain border rounded" />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0"
                    onClick={() => setSettings({ ...settings, logo: '' })}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div>
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('logo')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Logo
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name</Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="businessName"
                placeholder="Your Business Name"
                className="pl-9"
                value={settings.businessName}
                onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="business@example.com"
                className="pl-9"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                placeholder="+234 800 000 0000"
                className="pl-9"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="address"
                placeholder="Business Address"
                className="pl-9"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              />
            </div>
          </div>

          <Button className="mt-4" onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
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
            <Input
              id="taxRate"
              type="number"
              placeholder="7.5"
              step="0.1"
              value={settings.defaultTaxRate}
              onChange={(e) => setSettings({ ...settings, defaultTaxRate: parseFloat(e.target.value) || 0 })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentTerms">Payment Terms (Days)</Label>
            <Input
              id="paymentTerms"
              type="number"
              placeholder="30"
              value={settings.paymentTerms}
              onChange={(e) => setSettings({ ...settings, paymentTerms: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="invoiceNotes">Default Invoice Notes</Label>
            <Input
              id="invoiceNotes"
              placeholder="Thank you for your business"
              value={settings.invoiceNotes}
              onChange={(e) => setSettings({ ...settings, invoiceNotes: e.target.value })}
            />
          </div>

          <Button className="mt-4" onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
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
            <Input
              id="taxId"
              placeholder="Enter your TIN"
              value={settings.taxId}
              onChange={(e) => setSettings({ ...settings, taxId: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-2 p-4 bg-accent rounded-lg">
            <img src="https://einvoice.firs.gov.ng/favicon.png" alt="FIRS" className="h-8 w-8" />
            <div>
              <p className="text-sm font-medium">FIRS Compliant Status</p>
              <p className="text-xs text-muted-foreground">Your invoices include FIRS-compliant footers and QR codes</p>
            </div>
          </div>

          <Button className="mt-4" onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Update Tax Info"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
