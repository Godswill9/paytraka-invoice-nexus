import {
  BadgeCheck,
  Banknote,
  Boxes,
  Check,
  CircleAlert,
  Download,
  FileCheck2,
  FileText,
  FileWarning,
  Gauge,
  Headphones,
  Landmark,
  LayoutDashboard,
  Menu,
  ReceiptText,
  Send,
  ShieldCheck,
  Sparkles,
  TestTube2,
  UsersRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { AuthNavActions } from "./AuthNavActions";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Product", href: "/product" },
  { label: "Solutions", href: "/solutions" },
  // { label: "Resources", href: "/resources" },
  { label: "Company", href: "/company" },
];

const painPoints = [
  {
    icon: ReceiptText,
    label: "Missing records",
    title: "Sales happen. Records get lost.",
    description:
      "Orders come through calls, chats, paper notes and DMs. When it is time to reconcile, important details are nowhere to be found.",
  },
  {
    icon: Banknote,
    label: "Late payments",
    title: "You keep chasing your own money.",
    description:
      "Without a clear invoice trail, customers forget due dates and you spend valuable time sending awkward payment reminders.",
  },
  {
    icon: CircleAlert,
    label: "Tax confusion",
    title: "Tax rules feel too complicated.",
    description:
      "TINs, VAT, validation and new e-invoicing requirements can feel overwhelming when all you want to do is run your business.",
  },
  {
    icon: Boxes,
    label: "Too many tools",
    title: "Your business is spread everywhere.",
    description:
      "Customer details live in one app, invoices in another and payments somewhere else—creating errors and slowing everyone down.",
  },
];

const workflow = [
  ["Create Draft", "Add the customer, items, tax and payment details."],
  ["Review", "Check totals and required invoice information."],
  ["Post Invoice", "Finalize the document in your PayTraka records."],
  ["Download", "Save the posted invoice as a shareable document."],
  ["Share Externally", "Send it by email, WhatsApp or your preferred channel."],
  ["Optional: FIRS", "Submit separately when your FIRS API setup is complete."],
];

const features: Array<{
  icon: LucideIcon;
  title: string;
  description: string;
}> = [
  {
    icon: Sparkles,
    title: "Easy Onboarding",
    description: "Step-by-step setup for your VAT and TIN credentials.",
  },
  {
    icon: UsersRound,
    title: "Customer CRM",
    description: "Store client tax details for recurring invoice accuracy.",
  },
  {
    icon: Banknote,
    title: "Sales Management",
    description: "Track every revenue stream with compliant categorization.",
  },
  {
    icon: ReceiptText,
    title: "Purchase Ledger",
    description: "Record incoming invoices to claim input tax credits.",
  },
  {
    icon: Boxes,
    title: "Product Catalog",
    description: "Standardize goods/services with correct HS codes.",
  },
  {
    icon: Gauge,
    title: "Live Tracking",
    description: "Visual confirmation of FIRS/NRS portal acceptance.",
  },
  {
    icon: FileCheck2,
    title: "Digital Receipts",
    description: "Generate professional, FIRS-format digital receipts.",
  },
  {
    icon: LayoutDashboard,
    title: "VAT Reports",
    description: "Instant generation of summary sheets for audit.",
  },
];

const faqs = [
  {
    question: "What is PayTraka?",
    answer:
      "PayTraka is a digital platform designed to help businesses manage invoicing, payment tracking, tax compliance workflows, and financial records in one centralized system.",
  },
  {
    question: "Who can use PayTraka?",
    answer:
      "PayTraka is suitable for small businesses, large enterprises, tax consultants, accountants, and organizations that need efficient invoice and compliance management.",
  },
  // {
  //   question: "Can PayTraka integrate with my existing business software?",
  //   answer:
  //     "Yes. PayTraka is designed to support integrations with accounting software, ERP systems, POS solutions, and other business applications through available integration options.",
  // },
  {
    question: "Is my business data secure on PayTraka?",
    answer:
      "Yes. PayTraka uses industry-standard security measures to help protect sensitive business and financial information.",
  },
  {
    question: "Can I track invoices and payments in real time?",
    answer:
      "Yes. PayTraka provides visibility into invoice status, payment progress, and transaction records to help businesses stay informed and organized.",
  },
  {
    question: "Do I need technical expertise to use PayTraka?",
    answer:
      "No. PayTraka is designed with a user-friendly interface that allows business owners and finance teams to get started quickly without advanced technical knowledge.",
  },
  {
    question: "How do I get started with PayTraka?",
    answer:
      "Simply sign up for an account, complete the onboarding process, and configure your business profile. The platform guides you through the setup steps needed to begin using its features.",
  },
];

function ButtonLink({
  children,
  href = "#",
  variant = "primary",
  className = "",
}: {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "light";
  className?: string;
}) {
  const variants = {
    primary:
      "bg-[#1117E8] text-white shadow-[0_14px_32px_rgba(17,23,232,0.22)] hover:bg-[#0001B1]",
    secondary:
      "border border-[#C5C4DA] bg-white text-[#191C1E] hover:border-[#1117E8] hover:text-[#0001B1]",
    light: "bg-white text-[#0001B1] hover:bg-[#DADEFD]",
  };

  return (
    <a
      className={`inline-flex min-h-12 max-w-full items-center justify-center rounded-lg px-6 text-center text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1117E8] ${variants[variant]} ${className}`}
      href={href}
    >
      {children}
    </a>
  );
}

function SectionHeader({
  title,
  description,
  align = "center",
}: {
  title: string;
  description: string;
  align?: "center" | "left";
}) {
  return (
    <div
      className={
        align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-2xl"
      }
    >
      <h2 className="text-2xl font-bold tracking-normal text-[#191C1E] sm:text-3xl md:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-[#454557]">{description}</p>
    </div>
  );
}

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#C5C4DA]/60 bg-white/90 backdrop-blur-xl dark:bg-[#0B1020]">
      <nav
        className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-3 px-4 md:px-8"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1117E8]"
        >
          <Image
            src="/paytraka_logo/paytraka-logo-navbar.png"
            alt="PayTraka"
            width={170}
            height={48}
            className="h-9 w-auto object-contain md:h-11"
            priority
          />
        </Link>
        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[#191C1E] transition hover:text-[#0001B1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1117E8]"
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {/* <ThemeToggle className="hidden sm:inline-flex" /> */}
          <AuthNavActions />
          <details className="group relative lg:hidden">
            <summary
              className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-lg border border-[#C5C4DA] bg-white text-[#0001B1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1117E8]"
              aria-label="Open navigation menu"
            >
              <Menu aria-hidden="true" size={18} />
            </summary>
            <div className="absolute right-0 mt-3 w-[min(14rem,calc(100vw-2rem))] rounded-xl border border-[#C5C4DA] bg-white p-3 shadow-xl">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block rounded-lg px-3 py-3 text-sm font-medium text-[#191C1E] hover:bg-[#F7F9FB] hover:text-[#0001B1]"
                >
                  {link.label}
                </a>
              ))}
              <AuthNavActions mobile />
            </div>
          </details>
        </div>
      </nav>
    </header>
  );
}

function InvoiceMockup() {
  return (
    <div className="relative mx-auto w-full max-w-xl min-w-0">
      <div className="absolute -right-6 top-8 hidden rounded-full bg-[#1117E8] px-4 py-3 text-sm font-black text-white shadow-xl lg:block">
        NRS
      </div>
      <div className="absolute -right-12 top-28 hidden h-16 w-16 items-center justify-center rounded-full bg-[#0001B1] text-xl font-black text-white shadow-xl lg:flex">
        VAT
      </div>
      <div className="overflow-hidden rounded-2xl border border-[#D7DEE8] bg-white shadow-[0_28px_70px_rgba(25,28,30,0.18)]">
        <div className="flex min-w-0 items-center gap-3 bg-[#202827] px-4 py-3 sm:px-5">
          <span className="h-3 w-3 rounded-full bg-white/25" />
          <span className="h-3 w-3 rounded-full bg-white/25" />
          <span className="h-3 w-3 rounded-full bg-white/25" />
          <span className="ml-1 min-w-0 truncate rounded bg-white/10 px-3 py-1 text-xs font-semibold text-white/80 sm:ml-3 sm:px-4">
            paytraka.com/dashboard
          </span>
        </div>
        <div className="grid min-w-0 grid-cols-[52px_minmax(0,1fr)] sm:grid-cols-[72px_minmax(0,1fr)]">
          <div className="border-r border-[#D7DEE8] bg-[#F2F4FF] p-3 sm:p-4">
            <span className="block h-9 w-9 rounded-lg bg-[#1117E8]" />
            {[1, 2, 3, 4].map((item) => (
              <span
                key={item}
                className="mt-4 block h-9 w-9 rounded-lg bg-[#DADEFD]"
              />
            ))}
          </div>
          <div className="min-w-0 p-4 sm:p-5">
            <div className="flex min-w-0 items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs text-[#757588]">Today</p>
                <h2 className="truncate text-base font-black text-[#191C1E] sm:text-lg">
                  Abuja Prime Hotels Ltd
                </h2>
              </div>
              <span className="rounded bg-[#DADEFD] px-3 py-1 text-xs font-black text-[#0001B1]">
                Ready
              </span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                ["Invoiced", "₦2.4M", "bg-[#EEF1FF]"],
                ["Collected", "₦1.9M", "bg-[#F4F6FF]"],
                ["Outstanding", "₦500K", "bg-[#FFF0CC]"],
              ].map(([label, value, color]) => (
                <div
                  key={label}
                  className={`rounded-lg border border-[#D7DEE8] p-4 ${color}`}
                >
                  <p className="text-xs text-[#454557]">{label}</p>
                  <p className="mt-2 text-lg font-black text-[#191C1E]">
                    {value}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-xl border border-[#D7DEE8]">
              <div className="flex items-center justify-between border-b border-[#D7DEE8] px-4 py-3">
                <p className="text-xs font-black uppercase tracking-wide text-[#757588]">
                  Recent invoices
                </p>
                <span className="flex gap-1">
                  {[1, 2, 3].map((item) => (
                    <span
                      key={item}
                      className="h-3 w-1.5 rounded bg-[#1117E8]"
                    />
                  ))}
                </span>
              </div>
              {[
                [
                  "INV-0042",
                  "Abuja Prime Hotels",
                  "₦850,000",
                  "Paid",
                  "bg-[#1117E8]",
                ],
                [
                  "INV-0041",
                  "Kano Retail Hub",
                  "₦142,000",
                  "Partial",
                  "bg-[#F59E0B]",
                ],
                [
                  "INV-0040",
                  "Enugu Agro Ventures",
                  "₦67,500",
                  "Ready",
                  "bg-[#1117E8]",
                ],
              ].map(([id, client, amount, status, dot]) => (
                <div
                  key={id}
                  className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] gap-3 border-b border-[#D7DEE8] px-4 py-3 last:border-b-0 sm:gap-4"
                >
                  <div className="min-w-0">
                    <p className="font-black text-[#191C1E]">{id}</p>
                    <p className="truncate text-xs text-[#454557]">{client}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-[#191C1E]">{amount}</p>
                    <p className="flex items-center justify-end gap-1 text-xs text-[#454557]">
                      <span className={`h-2 w-2 rounded-full ${dot}`} />
                      {status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <ButtonLink variant="secondary" className="gap-2" href="/signup">
          <Send size={16} aria-hidden="true" /> Send to Customer
        </ButtonLink>
        <ButtonLink className="gap-2" href="/signup">
          <Landmark size={16} aria-hidden="true" /> Submit to FIRS/NRS
        </ButtonLink>
      </div> */}
    </div>
  );
}

function HeroSection() {
  return (
    <section className="overflow-hidden border-b border-[#D7DEE8] bg-[radial-gradient(circle_at_78%_18%,rgba(218,222,253,0.9)_0,rgba(247,249,251,0)_32%),linear-gradient(180deg,#F7F9FB_0%,#FFFFFF_100%)] dark:bg-[radial-gradient(circle_at_78%_18%,rgba(63,92,255,0.22)_0,rgba(11,16,32,0)_32%),linear-gradient(180deg,#080D18_0%,#0B1020_100%)]">
      <div className="mx-auto grid min-h-[calc(100svh-5rem)] max-w-7xl items-center gap-10 px-5 py-12 md:px-8 lg:grid-cols-[0.95fr_minmax(0,1.05fr)] lg:py-10">
        <div className="reveal-up min-w-0">
          <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-tight tracking-normal text-[#0001B1] md:text-5xl xl:text-6xl">
            Create, Validate & Submit E-Invoices with Confidence
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#454557] lg:text-lg lg:leading-8">
            Streamline your transition to the new FIRS/NRS tax framework.
            PayTraka provides the tools to manage your sales, purchases, and
            compliance reporting in one unified readiness portal.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <ButtonLink href="/signup">Get Started</ButtonLink>
            {/* <ButtonLink href="/signup">Start Free Trial</ButtonLink> */}
            <ButtonLink href="/company#contact" variant="secondary">
              Book a demo
            </ButtonLink>
          </div>
          <div className="mt-10 grid max-w-xl gap-5 text-[#191C1E] sm:grid-cols-3">
            {[
              ["Create", "structured invoices"],
              ["Validate", "tax-ready records"],
              ["Submit", "APP/SI pathways"],
            ].map(([value, label]) => (
              <div key={label}>
                <p className="text-2xl font-black sm:text-3xl">{value}</p>
                <p className="text-sm font-medium text-[#454557]">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="reveal-up [animation-delay:160ms]">
          <InvoiceMockup />
        </div>
      </div>
    </section>
  );
}

function PainPointsSection() {
  return (
    <section className="relative overflow-hidden bg-white py-16 md:py-24">
      <div
        className="absolute -right-24 top-20 h-72 w-72 rounded-full bg-[#DADEFD]/50 blur-3xl"
        aria-hidden="true"
      />
      <div className="reveal-up relative mx-auto max-w-7xl px-5 md:px-8">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-[#1117E8]">
            Does this sound familiar?
          </p>
          <h2 className="text-3xl font-bold leading-tight text-[#191C1E] sm:text-4xl md:text-5xl">
            Running a business is already hard.{" "}
            <span className="text-[#1117E8]">
              Invoicing shouldn&apos;t make it harder.
            </span>
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#454557] md:text-lg">
            Whether you sell products, offer services or work for yourself,
            these everyday money problems cost you time, cash and peace of mind.
          </p>
        </div>

        <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-[0.85fr_1.5fr]">
          <div className="relative min-h-[420px] overflow-hidden rounded-3xl bg-[#1117E8] p-6 text-white shadow-[0_24px_60px_rgba(17,23,232,0.22)] sm:p-8">
            <div
              className="absolute -right-16 -top-16 h-48 w-48 rounded-full border-[28px] border-white/10"
              aria-hidden="true"
            />
            <p className="text-sm font-semibold text-[#C8CBFF]">
              A familiar business day
            </p>
            <p className="mt-2 max-w-xs text-2xl font-bold leading-snug">
              Plenty of activity. Not enough clarity.
            </p>

            <div className="relative mt-8 space-y-3">
              <div className="ml-6 rounded-2xl rounded-tl-sm bg-white p-4 text-[#191C1E] shadow-lg">
                <p className="text-xs font-bold uppercase tracking-wider text-[#6A6A7C]">
                  Customer message
                </p>
                <p className="mt-1 text-sm font-semibold">
                  “Please, can you resend my invoice?”
                </p>
              </div>
              <div className="mr-8 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-[#C8CBFF]">
                      INV-0048
                    </p>
                    <p className="mt-1 font-bold">₦185,000</p>
                  </div>
                  <span className="rounded-full bg-[#FFF0CC] px-3 py-1 text-xs font-bold text-[#7A5100]">
                    12 days overdue
                  </span>
                </div>
              </div>
              <div className="ml-10 rounded-2xl bg-[#F7F9FB] p-4 text-[#191C1E] shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFE5E5]">
                    <FileWarning
                      className="h-5 w-5 text-[#C62F2F]"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#6A6A7C]">
                      Month-end question
                    </p>
                    <p className="text-sm font-bold">
                      “Where is that receipt?”
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <p className="absolute bottom-6 left-6 right-6 border-t border-white/20 pt-4 text-sm leading-6 text-[#E7E8FF] sm:bottom-8 sm:left-8 sm:right-8">
              If you have experienced even one of these, you are not alone.
            </p>
          </div>

          <div className="stagger-children grid gap-5 sm:grid-cols-2">
            {painPoints.map(({ icon: Icon, label, title, description }) => (
              <article
                key={title}
                className="interactive-card group rounded-3xl border border-[#D9D9E5] bg-[#F7F9FB] p-6 shadow-[0_12px_30px_rgba(25,28,30,0.04)] hover:border-[#1117E8] sm:p-7"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E7E9FF] transition-colors group-hover:bg-[#1117E8]">
                    <Icon
                      className="h-6 w-6 text-[#1117E8] transition-colors group-hover:text-white"
                      aria-hidden="true"
                    />
                  </div>
                  <span className="rounded-full border border-[#D9D9E5] bg-white px-3 py-1 text-xs font-semibold text-[#5C5C6E]">
                    {label}
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-bold leading-snug text-[#191C1E]">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#454557] sm:text-[15px]">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function WorkflowSection() {
  return (
    <section className="bg-[#F1F4F8] py-16 md:py-20">
      <div className="reveal-up mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeader
          title="A clear invoice lifecycle—with you in control"
          description="PayTraka creates and records your invoice. You download and share it outside the platform, then choose whether to submit it to FIRS."
          align="left"
        />
        <div className="stagger-children mt-12 grid gap-6 md:grid-cols-3 lg:grid-cols-6">
          {workflow.map(([title, description], index) => (
            <article key={title} className="text-center">
              <div className="progress-glow mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#1117E8] text-xl font-extrabold text-white shadow-[0_14px_30px_rgba(17,23,232,0.2)]">
                {index === 3 ? (
                  <Download className="h-6 w-6" aria-hidden="true" />
                ) : (
                  index + 1
                )}
              </div>
              <h3 className="mt-5 text-base font-bold text-[#191C1E]">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-5 text-[#454557]">
                {description}
              </p>
            </article>
          ))}
        </div>
        <div className="mt-10 grid gap-4 rounded-2xl border border-[#C5C4DA] bg-white p-5 sm:grid-cols-2 sm:p-6">
          <div className="flex gap-3">
            <Check
              className="mt-0.5 h-5 w-5 shrink-0 text-[#1117E8]"
              aria-hidden="true"
            />
            <p className="text-sm leading-6 text-[#454557]">
              <strong className="text-[#191C1E]">Customer delivery:</strong>{" "}
              PayTraka does not send invoices to customers. Download the posted
              invoice and share it through your preferred channel.
            </p>
          </div>
          <div className="flex gap-3">
            <Landmark
              className="mt-0.5 h-5 w-5 shrink-0 text-[#1117E8]"
              aria-hidden="true"
            />
            <p className="text-sm leading-6 text-[#454557]">
              <strong className="text-[#191C1E]">FIRS submission:</strong>{" "}
              Optional for users who have completed their FIRS API credentials.
              You can still use PayTraka for e-invoicing without submitting.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureGridSection() {
  return (
    <section className="bg-[#F7F9FB] py-16 md:py-24">
      <div className="reveal-up mx-auto max-w-7xl px-5 md:px-8">
        <div className="mx-auto">
          <SectionHeader
            align="left"
            title="Comprehensive Features for Every Tax Detail"
            description="A purpose-built toolkit for Nigerian financial controllers and small business owners."
          />
        </div>
        <div className="stagger-children mx-auto mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="interactive-card rounded-2xl border border-[#C5C4DA]/80 bg-white/70 p-6 shadow-[0_14px_30px_rgba(25,28,30,0.04)] backdrop-blur hover:border-[#1117E8] hover:bg-white"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-[#DADEFD]/70 text-[#1117E8]">
                <Icon size={18} aria-hidden="true" />
              </span>
              <h3 className="mt-7 text-base font-extrabold text-[#191C1E]">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-[#454557]">
                {description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ConsultantsSection() {
  const clients = [
    ["Lagos Logistics Ltd", "100% Compliant", "bg-teal-500"],
    ["Kano Retail Hub", "3 Pending Docs", "bg-amber-500"],
    ["Enugu Agro Ventures", "100% Compliant", "bg-teal-500"],
  ];

  return (
    <section className="bg-[#0001B1] py-16 text-white md:py-24">
      <div className="reveal-up mx-auto grid max-w-7xl gap-10 px-5 md:px-8 lg:grid-cols-2 lg:items-center">
        <div className="rounded-xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
              <BadgeCheck size={20} aria-hidden="true" />
            </span>
            <h2 className="text-lg font-semibold">Tax Consultant Admin View</h2>
          </div>
          <div className="stagger-children mt-8 space-y-4">
            {clients.map(([name, status, color]) => (
              <div key={name} className="rounded-lg bg-white/10 p-4">
                <p className="text-xs text-white/70">Client</p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="font-semibold">{name}</p>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold text-white ${color}`}
                  >
                    {status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 grid grid-cols-3 gap-3 text-center">
            {[
              ["12", "Active Clients"],
              ["156", "Submissions"],
              ["0", "Errors"],
            ].map(([value, label]) => (
              <div key={label}>
                <p className="text-2xl font-extrabold">{value}</p>
                <p className="mt-1 text-xs text-white/70">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold md:text-4xl">
            For Tax Consultants & Accountants
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-white/82">
            Scale your practice by managing all your clients&apos; e-invoicing
            workflows from a single, professional dashboard.
          </p>
          <div className="mt-7 space-y-5">
            {[
              "Monitor Submissions: Real-time oversight of every client's FIRS/NRS filing status.",
              "Export Compliance Reports: Generate audit-ready documentation for all linked entities in bulk.",
            ].map((item) => (
              <p
                key={item}
                className="flex gap-3 text-sm leading-7 text-white/90"
              >
                <Check className="mt-1 h-5 w-5 shrink-0" aria-hidden="true" />
                {item}
              </p>
            ))}
          </div>
          <div className="mt-9">
            <ButtonLink href="/company#contact" variant="light">
              Get Consultant Access
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="reveal-up mx-auto max-w-4xl px-5 md:px-8">
        <SectionHeader title="Frequently Asked Questions" description="" />
        <div className="mt-10 space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group interactive-card rounded-lg border border-[#C5C4DA] bg-[#F7F9FB]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-[#191C1E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1117E8]">
                {faq.question}
                <span className="text-[#0001B1] transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="border-t border-[#C5C4DA] px-5 py-4 text-sm leading-7 text-[#454557]">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function ComplianceNotice() {
  return (
    <section className="bg-[#E8EAED] py-10">
      <div className="reveal-up mx-auto max-w-5xl px-5 md:px-8">
        <div className="rounded-xl border border-[#C5C4DA] bg-white p-6">
          <h2 className="flex items-center gap-3 text-sm font-bold text-[#0001B1]">
            <CircleAlert size={18} aria-hidden="true" /> Compliance & Readiness
            Notice
          </h2>
          <p className="mt-3 text-sm leading-7 text-[#454557]">
            PayTraka is an independent technology platform providing readiness
            tools for tax compliance. We facilitate the creation, validation,
            and submission of data based on current Nigerian tax regulations.
            Users are responsible for the accuracy of data provided. PayTraka
            does not provide legal or professional tax advice. All logos and
            trademarks belong to their respective owners.
          </p>
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="reveal-up mx-auto max-w-4xl px-5 text-center md:px-8">
        <h2 className="text-4xl font-extrabold leading-tight text-[#0001B1] md:text-5xl">
          Prepare your business for <br></br>e-invoicing compliance
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#454557]">
          Join hundreds of Nigerian businesses already using PayTraka to
          streamline their tax workflows.
        </p>
        <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
          <ButtonLink href="/signup">Get Started</ButtonLink>
          <ButtonLink href="/company#contact" variant="secondary">
            Talk to Sales
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#0D1230] text-white">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-16">
        <div className="grid gap-12 border-b border-white/15 pb-12 lg:grid-cols-[1.35fr_0.7fr_0.7fr_1.1fr]">
          <div>
            <div className="inline-flex rounded-xl bg-white px-4 py-2">
              <Image
                src="/paytraka_logo/paytraka-logo-navbar.png"
                alt="PayTraka"
                width={180}
                height={52}
                className="h-10 w-auto object-contain"
              />
            </div>
            <p className="mt-5 max-w-sm text-sm leading-6 text-[#C9CDE0]">
              Create, post and download professional e-invoices, with optional
              FIRS submission when your integration is ready.
            </p>
            <a
              href="/signup"
              className="mt-7 inline-flex min-h-11 items-center rounded-lg bg-white px-5 text-sm font-bold text-[#0001B1] transition hover:bg-[#E7E9FF]"
            >
              Get started
            </a>
          </div>
          <FooterLinks
            title="Explore"
            links={[
              ["Product", "/product"],
              ["Solutions", "/solutions"],
              ["Resources", "/resources"],
            ]}
          />
          <FooterLinks
            title="Company"
            links={[
              ["About us", "/company"],
              ["Our team", "/company#team"],
              ["Contact", "/company#contact"],
            ]}
          />
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#9FA6FF]">
              Contact
            </p>
            <address className="mt-5 not-italic text-sm leading-7 text-[#C9CDE0]">
              2 Adaranijo Street, opposite Pedro Police Station, Palmgroove,
              Lagos, Nigeria
            </address>
            <a
              href="tel:+2348126290758"
              className="mt-4 inline-flex text-sm font-bold text-white transition hover:text-[#9FA6FF]"
            >
              Call us: 08126290758
            </a>
          </div>
        </div>
        <div className="flex flex-col gap-4 pt-7 text-xs text-[#AEB3C9] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 PayTraka. All rights reserved.</p>
          <p>Built for Nigerian businesses. FIRS submission is optional.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterLinks({ title, links }: { title: string; links: string[][] }) {
  return (
    <div>
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#9FA6FF]">
        {title}
      </p>
      <ul className="mt-4 space-y-3">
        {links.map(([label, href]) => (
          <li key={label}>
            <a
              href={href}
              className="text-sm text-[#C9CDE0] transition hover:text-white"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LandingPage() {
  return (
    <div className="public-theme min-h-screen bg-[#F7F9FB]">
      <Navbar />
      <main>
        <HeroSection />
        <PainPointsSection />
        <WorkflowSection />
        <FeatureGridSection />
        {/* <ConsultantsSection /> */}
        <FAQSection />
        <ComplianceNotice />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
