"use client";

import { Bell, HelpCircle, Menu, Search, Settings } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getOnboardingState } from "@/lib/onboarding-store";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "./Sidebar";
import { DashboardPageSkeleton, notifyDashboard, SkeletonBlock, StatusBadge, Toast, useDashboardToasts } from "./ui";

const stepRoutes: Record<string, string> = {
  "business-details": "/onboarding/business-details",
  "tax-profile": "/onboarding/tax-profile",
  "bank-details": "/onboarding/bank-details",
  preferences: "/onboarding/preferences",
  review: "/onboarding/review",
};

function useDashboardGuard() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function checkAccess() {
      try {
        const session = await fetch("/api/auth/session", { cache: "no-store" }).then((response) => response.json());
        if (cancelled) return;
        if (!session.authenticated) {
          router.replace("/login");
          return;
        }
        if (session.user?.kyc_complete === false) {
          router.replace("/onboarding/business-details");
          return;
        }
        setReady(true);
      } catch {
        const state = getOnboardingState();
        if (!state.signup.workEmail) {
          router.replace("/login");
          return;
        }
        if (!state.completed) {
          router.replace(stepRoutes[state.currentStep] ?? (state.signup.emailVerified ? "/onboarding/business-details" : "/login"));
          return;
        }
        setReady(true);
      }
    }

    checkAccess();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return ready;
}

function EnvironmentToggle({ mode, setMode }: { mode: "test" | "live"; setMode: (mode: "test" | "live") => void }) {
  return (
    <div className="inline-grid grid-cols-2 rounded-full border border-[#C5C4DA] bg-[#E8ECF3] p-1 text-xs font-bold sm:text-sm">
      {(["test", "live"] as const).map((item) => (
        <button key={item} type="button" onClick={() => setMode(item)} className={`rounded-full px-3 py-2 transition sm:px-5 ${mode === item ? "bg-white text-[#1117E8] shadow-sm" : "text-[#454557]"}`}>
          {item === "test" ? "Test Mode" : "Live Mode"}
        </button>
      ))}
    </div>
  );
}

function Topbar({ mode, setMode, setSidebarOpen }: { mode: "test" | "live"; setMode: (mode: "test" | "live") => void; setSidebarOpen: (open: boolean) => void }) {
  const router = useRouter();
  const { user } = useAuth();
  const initials = `${user?.first_name?.[0] ?? "A"}${user?.last_name?.[0] ?? "U"}`.toUpperCase();

  return (
    <header className="sticky top-0 z-30 border-b border-[#C5C4DA] bg-white/95 backdrop-blur">
      <div className="flex min-h-[64px] min-w-0 items-center gap-2 px-3 sm:min-h-[72px] sm:gap-4 sm:px-6 lg:px-8">
        <button type="button" className="lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open navigation"><Menu className="h-6 w-6" /></button>
        <div className="relative hidden max-w-md flex-1 md:block">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#757588]" />
          <input aria-label="Search dashboard" placeholder="Search invoices, customers, or status..." className="h-11 w-full rounded-full border border-[#C5C4DA] bg-[#F7F9FB] pl-12 pr-4 text-sm outline-none focus:border-[#1117E8] focus:ring-4 focus:ring-[#DADEFD]" />
        </div>
        <div className="ml-auto hidden sm:block"><EnvironmentToggle mode={mode} setMode={setMode} /></div>
        <StatusBadge tone={mode === "live" ? "success" : "primary"}>{mode === "live" ? "Live Mode" : "Sandbox"}</StatusBadge>
        {[
          { label: "Notifications", icon: Bell, action: () => notifyDashboard("No new compliance notifications") },
          { label: "Help", icon: HelpCircle, action: () => router.push("/dashboard/support") },
          { label: "Settings", icon: Settings, action: () => router.push("/dashboard/settings") },
        ].map(({ label, icon: Icon, action }) => <button key={label} type="button" onClick={action} aria-label={label} className="rounded-lg p-1.5 text-[#454557] hover:bg-[#F1F4F8] sm:p-2"><Icon className="h-5 w-5" /></button>)}
        <div className="hidden items-center gap-3 border-l border-[#C5C4DA] pl-4 sm:flex">
          <div className="text-right"><p className="text-sm font-bold">{user?.first_name ? `${user.first_name} ${user.last_name ?? ""}`.trim() : "Admin User"}</p><p className="text-xs text-[#757588]">{user?.company_status?.replace(/_/g, " ") ?? "Manage Profile"}</p></div>
          {user?.logo_url ? <img src={user.logo_url} alt="Company logo" className="h-10 w-10 rounded-full object-cover" /> : <div className="grid h-10 w-10 place-items-center rounded-full bg-[#DADEFD] font-bold text-[#0001B1]">{initials}</div>}
        </div>
      </div>
    </header>
  );
}

function useDashboardRouteLoading() {
  const pathname = usePathname();
  const [routeLoading, setRouteLoading] = useState(false);

  useEffect(() => {
    setRouteLoading(false);
  }, [pathname]);

  function handleClickCapture(event: React.MouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement | null;
    const anchor = target?.closest("a[href]") as HTMLAnchorElement | null;
    if (!anchor || anchor.target || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const nextUrl = new URL(anchor.href);
    const currentUrl = new URL(window.location.href);
    if (nextUrl.origin !== currentUrl.origin) return;
    if (`${nextUrl.pathname}${nextUrl.search}` === `${currentUrl.pathname}${currentUrl.search}`) return;
    setRouteLoading(true);
    window.setTimeout(() => setRouteLoading(false), 1200);
  }

  return { routeLoading, handleClickCapture };
}

function DashboardShellSkeleton() {
  return (
    <div className="dashboard-theme min-h-screen overflow-x-hidden bg-[#F7F9FB] text-[#191C1E]">
      <div className="hidden border-r border-[#C5C4DA] bg-white p-5 lg:fixed lg:inset-y-0 lg:flex lg:w-[272px] lg:flex-col">
        <SkeletonBlock className="h-10 w-36" />
        <div className="mt-8 space-y-3">
          {[0, 1, 2, 3, 4, 5, 6].map((item) => <SkeletonBlock key={item} className="h-10 w-full" />)}
        </div>
      </div>
      <div className="min-w-0 lg:pl-[272px]">
        <header className="sticky top-0 z-30 border-b border-[#C5C4DA] bg-white/95 backdrop-blur">
          <div className="flex min-h-[64px] items-center gap-4 px-3 sm:min-h-[72px] sm:px-6 lg:px-8">
            <SkeletonBlock className="h-10 w-10 rounded-xl lg:hidden" />
            <SkeletonBlock className="hidden h-11 max-w-md flex-1 rounded-full md:block" />
            <SkeletonBlock className="ml-auto h-9 w-24 rounded-full" />
            <SkeletonBlock className="h-10 w-10 rounded-full" />
          </div>
        </header>
        <main className="min-w-0 px-3 py-5 sm:px-6 sm:py-6 lg:px-8">
          <DashboardPageSkeleton title="Preparing dashboard" />
        </main>
      </div>
    </div>
  );
}

function RouteLoadingOverlay({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[90]" role="status" aria-label="Loading page">
      <div className="h-1 overflow-hidden bg-[#DADEFD]">
        <div className="route-progress h-full bg-[#1117E8]" />
      </div>
      <div className="ml-auto mr-3 mt-3 hidden w-[min(420px,calc(100vw-1.5rem))] rounded-2xl border border-[#C5C4DA] bg-white/92 p-4 shadow-2xl backdrop-blur sm:block lg:mr-8">
        <div className="flex items-center gap-3">
          <SkeletonBlock className="h-10 w-10 rounded-xl" />
          <div className="flex-1 space-y-2">
            <SkeletonBlock className="h-4 w-1/2" />
            <SkeletonBlock className="h-3 w-3/4" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const ready = useDashboardGuard();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mode, setMode] = useState<"test" | "live">("test");
  const toastMessage = useDashboardToasts();
  const { routeLoading, handleClickCapture } = useDashboardRouteLoading();
  if (!ready) return <DashboardShellSkeleton />;

  return (
    <div className="dashboard-theme min-h-screen overflow-x-hidden bg-[#F7F9FB] text-[#191C1E]" onClickCapture={handleClickCapture}>
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="min-w-0 lg:pl-[272px]">
        <Topbar mode={mode} setMode={setMode} setSidebarOpen={setSidebarOpen} />
        <main className="min-w-0 px-3 py-5 sm:px-6 sm:py-6 lg:px-8">{children}</main>
      </div>
      <RouteLoadingOverlay show={routeLoading} />
      <Toast show={Boolean(toastMessage)}>{toastMessage}</Toast>
    </div>
  );
}
