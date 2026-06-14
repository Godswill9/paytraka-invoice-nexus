"use client";

import { Bell, Building2, Lock, Settings as SettingsIcon, UserCog } from "lucide-react";
import { useState } from "react";
import { Button, Card, CheckLine, Input, notifyDashboard, PageHeader } from "../ui";
import { useAuth } from "@/hooks/useAuth";
import { useCompany } from "@/hooks/useCompany";
import { useFirs } from "@/hooks/useFirs";
import { StatusBadge as ApiStatusBadge } from "@/components/ui/StatusBadge";

export function SettingsPage() {
  const [activeSection, setActiveSection] = useState("Company Profile");
  const { user } = useAuth();
  const { company } = useCompany(user?.company_id);
  const { health } = useFirs();

  return (
    <>
      <PageHeader title="Settings" subtitle="Manage company profile, compliance preferences, users, and notification controls." action={<Button onClick={() => notifyDashboard("Settings saved")}>Save Changes</Button>} />
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <Card className="p-4"><div className="space-y-2">{[
          ["Company Profile", Building2],
          ["Compliance", SettingsIcon],
          ["Users & Roles", UserCog],
          ["Notifications", Bell],
          ["Security", Lock],
        ].map(([label, Icon]) => <button key={String(label)} type="button" onClick={() => { setActiveSection(String(label)); notifyDashboard(`${String(label)} settings selected`); }} className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold ${activeSection === label ? "bg-[#DADEFD] text-[#0001B1]" : "text-[#454557]"}`}>{typeof Icon !== "string" ? <Icon className="h-4 w-4" /> : null}{String(label)}</button>)}</div></Card>
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-bold">Company Profile</h2>
              {company?.public_id ? <ApiStatusBadge status="live" label={`Company ID ${company.public_id}`} /> : null}
              {company?.status ? <ApiStatusBadge status={company.status} /> : user?.company_status ? <ApiStatusBadge status={user.company_status} /> : null}
              {company?.mode ? <ApiStatusBadge status={company.mode} /> : null}
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Input label="Company Name" value={company?.company_name ?? ""} />
              <Input label="Trading Name" value={company?.trading_name ?? ""} />
              <Input label="Business Email" value={company?.business_email ?? user?.email ?? ""} />
              <Input label="Tax Identification Number" value={company?.tax_identification_number ?? user?.tax_identification_number ?? ""} />
              <Input label="RC Number / BN Number" value={company?.rc_number ?? ""} />
              <Input label="Country" value={user?.country ?? "Nigeria"} />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-bold">Compliance Preferences</h2>
              <ApiStatusBadge status={user?.firs_enabled === 1 || company?.firs_enabled === 1 ? "live" : "demo"} label={user?.firs_enabled === 1 || company?.firs_enabled === 1 ? "FIRS enabled" : "FIRS disabled"} />
              {health?.status ? <ApiStatusBadge status={health.status} label={`FIRS health: ${health.status}`} /> : null}
            </div>
            <CheckLine label="Require TIN before FIRS/NRS submission" />
            <CheckLine label="Enable APP/SI pathway readiness checks" />
            <CheckLine label="Send validation failure alerts" />
          </Card>
        </div>
      </div>
    </>
  );
}
