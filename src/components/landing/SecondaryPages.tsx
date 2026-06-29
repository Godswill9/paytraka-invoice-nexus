import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  Check,
  CheckCircle2,
  ClipboardList,
  CloudUpload,
  Code2,
  Download,
  FileCheck2,
  FileSearch,
  FileText,
  Gauge,
  Globe2,
  Handshake,
  Home,
  KeyRound,
  Landmark,
  Linkedin,
  LockKeyhole,
  Menu,
  MapPin,
  Mail,
  PackageCheck,
  Phone,
  Search,
  ReceiptText,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  UsersRound,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { AuthNavActions } from "./AuthNavActions";

type PageKey = "home" | "product" | "solutions" | "resources" | "company";

const navLinks: Array<{ label: string; href: string; key: PageKey; icon: LucideIcon }> = [
  { label: "Home", href: "/", key: "home", icon: Home },
  { label: "Product", href: "/product", key: "product", icon: PackageCheck },
  { label: "Solutions", href: "/solutions", key: "solutions", icon: ShieldCheck },
  // { label: "Resources", href: "/resources", key: "resources" },
  { label: "Company", href: "/company", key: "company", icon: UsersRound },
];

const CALENDLY_DEMO_URL =
  "https://calendly.com/software-development-domain-plusltd/30min";

const team = [
  {
    name: "Edet Obong",
    role: "Chief Executive Officer",
    bio: "Leads PayTraka's vision, strategy and partnerships as the company builds dependable financial tools for Nigerian businesses.",
    photo: "/team/pastor Edet2.jpg",
    socials: {},
  },
  {
    name: "Yusuf Saheed",
    role: "Co-Chief Executive Officer",
    bio: "Supports company leadership, commercial direction and operations, helping turn PayTraka's vision into sustainable execution.",
    photo: "/team/mr Yusuf2.jpg",
    socials: {},
  },
  {
    name: "Hycinth God'swill",
    role: "Tech Lead",
    bio: "Leads the technical direction of PayTraka, overseeing product engineering, platform reliability and scalable implementation.",
    photo: "/team/hycinth-godswill.png",
    socials: {},
  },
  {
    name: "Emmanuel Okoye",
    role: "Frontend Developer",
    bio: "Builds responsive, accessible product experiences across PayTraka, turning designs and workflows into clear user interfaces.",
    photo: "/team/emmanuel-okoye.png",
    socials: {},
  },
];

const partners = [
  { name: "Cryptware", logo: "/logos/cryptware.jfif" },
  { name: "eTranzact", logo: "/logos/etransact.png" },
  { name: "Hoptool", logo: "/logos/hoptool.jfif" },
  { name: "NRS", logo: "/logos/nrs.jfif" },
  { name: "Redtech", logo: "/logos/redtech.png" },
];
// const partners = [
//   { name: "hoptools", category: "Access Point", color: "#1117E8" },
//   { name: "REDTECH", category: "Infrastructure", color: "#D82737" },
//   { name: "e-transact", category: "Transactions", color: "#087A52" },
//   { name: "Cryptware", category: "Security", color: "#5B3DD1" },
//   { name: "NRS", category: "Revenue Service", color: "#C07700" },
//   { name: "Domain Plus", category: "ERP & Tech", color: "#1117E8" },
//   { name: "Taxaide", category: "Tax Advisory", color: "#444444" },
//   { name: "Jureb", category: "Access Point", color: "#0474B8" },
// ];

const values = [
  {
    icon: LockKeyhole,
    title: "Trust",
    body: "Transparent records every team member can verify",
  },
  {
    icon: Zap,
    title: "Simplicity",
    body: "Workflows designed for real businesses, not tax experts",
  },
  {
    icon: Landmark,
    title: "Local first",
    body: "Built for Nigerian regulations, timelines and context",
  },
  {
    icon: ClipboardList,
    title: "Control",
    body: "You decide when invoices move forward, always",
  },
];

function SocialLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className="flex h-[30px] w-[30px] items-center justify-center rounded-lg bg-white/[0.08] text-[#9FA6FF] transition-colors hover:bg-white/[0.15]"
    >
      {icon}
    </a>
  );
}

function LinkedInIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function DribbbleIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
}

function MailIcon14() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function StaffSocials({ socials }: { socials: Record<string, string> }) {
  return (
    <div className="mt-3 flex gap-2.5">
      {socials.linkedin && (
        <SocialLink
          href={socials.linkedin}
          label="LinkedIn"
          icon={<LinkedInIcon />}
        />
      )}
      {socials.twitter && (
        <SocialLink
          href={socials.twitter}
          label="X / Twitter"
          icon={<TwitterIcon />}
        />
      )}
      {socials.github && (
        <SocialLink
          href={socials.github}
          label="GitHub"
          icon={<GitHubIcon />}
        />
      )}
      {socials.dribbble && (
        <SocialLink
          href={socials.dribbble}
          label="Dribbble"
          icon={<DribbbleIcon />}
        />
      )}
      {socials.email && (
        <SocialLink href={socials.email} label="Email" icon={<MailIcon14 />} />
      )}
    </div>
  );
}

function PartnerTile({
  name,
  logo,
}: {
  name: string;
  logo: string;
}) {
  return (
    <article className="flex h-24 w-44 flex-shrink-0 items-center justify-center rounded-xl border border-[#D7DEE8] bg-white px-6 shadow-sm transition hover:-translate-y-1 hover:border-[#1117E8] hover:shadow-md">
      <Image
        src={logo}
        alt={`${name} logo`}
        width={132}
        height={56}
        className="max-h-14 w-auto object-contain"
      />
    </article>
  );
}

function PartnersMarquee() {
  const loop = [...partners, ...partners, ...partners];
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white to-transparent" />
      <div className="marquee-track flex w-max gap-5 py-2">
        {loop.map((partner, index) => (
          <PartnerTile
            key={`${partner.name}-${index}`}
            name={partner.name}
            logo={partner.logo}
          />
        ))}
      </div>
    </div>
  );
}

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function SiteNavbar({ active }: { active: PageKey }) {
  return (
    <header className="sticky top-0 z-50 border-b border-[#C5C4DA]/50 bg-white/95 backdrop-blur-xl dark:bg-[#0B1020]">
      <nav
        className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-3 px-4 md:px-8"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="flex items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1117E8]"
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
        <div className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.key}
              href={link.href}
              className={cx(
                "inline-flex items-center gap-2 border-b-2 px-1 py-6 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1117E8]",
                active === link.key
                  ? "border-[#1117E8] text-[#0001B1]"
                  : "border-transparent text-[#454557] hover:text-[#0001B1]",
              )}
              aria-current={active === link.key ? "page" : undefined}
            >
              <link.icon className="h-4 w-4" aria-hidden="true" />
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
              <Menu size={18} aria-hidden="true" />
            </summary>
            <div className="absolute right-0 mt-3 w-[min(14rem,calc(100vw-2rem))] rounded-xl border border-[#C5C4DA] bg-white p-3 shadow-xl">
              {navLinks.map((link) => (
                <a
                  key={link.key}
                  href={link.href}
                  className={cx(
                    "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium hover:bg-[#F7F9FB]",
                    active === link.key ? "text-[#0001B1]" : "text-[#191C1E]",
                  )}
                >
                  <link.icon className="h-4 w-4" aria-hidden="true" />
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

export function SimpleFooter() {
  return (
    <footer className="bg-[#0D1230] text-white">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-16">
        <div className="grid gap-12 border-b border-white/15 pb-12 lg:grid-cols-[1.35fr_0.7fr_0.7fr_1.1fr]">
          <div>
            <Link
              href="/"
              className="inline-flex rounded-xl bg-white px-4 py-2"
            >
              <Image
                src="/paytraka_logo/paytraka-logo-navbar.png"
                alt="PayTraka"
                width={180}
                height={52}
                className="h-10 w-auto object-contain"
              />
            </Link>
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
          <FooterColumn
            title="Explore"
            links={[
              ["Product", "/product"],
              ["Solutions", "/solutions"],
              ["Resources", "/resources"],
            ]}
          />
          <FooterColumn
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

function FooterColumn({ title, links }: { title: string; links: string[][] }) {
  return (
    <div>
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#9FA6FF]">
        {title}
      </p>
      <ul className="mt-5 space-y-3">
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

function ActionLink({
  children,
  href = "#",
  variant = "primary",
  external = false,
}: {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary";
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cx(
        "inline-flex min-h-12 max-w-full items-center justify-center gap-2 rounded-lg px-6 text-center text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1117E8]",
        variant === "primary"
          ? "bg-[#1117E8] text-white shadow-[0_12px_28px_rgba(17,23,232,0.18)] hover:bg-[#0001B1]"
          : "border border-[#D7DEE8] bg-white text-[#0001B1] hover:border-[#1117E8]",
      )}
    >
      {children}
    </a>
  );
}

function IconBadge({
  icon: Icon,
  dark = false,
}: {
  icon: LucideIcon;
  dark?: boolean;
}) {
  return (
    <span
      className={cx(
        "inline-flex h-12 w-12 items-center justify-center rounded-xl",
        dark ? "bg-white/10 text-white" : "bg-[#EEF1FF] text-[#1117E8]",
      )}
    >
      <Icon size={22} aria-hidden="true" />
    </span>
  );
}

export function ProductPage() {
  const cards = [
    {
      icon: Building2,
      title: "Business Onboarding",
      body: "Set up company, tax, customer, supplier, product, and service records once so every invoice starts from cleaner source data.",
      meta: "Structured Setup",
    },
    {
      icon: UsersRound,
      title: "Customer & Supplier Management",
      body: "Maintain a centralized directory of trading partners with contact details, TINs, RC numbers, preferred currencies, and billing context.",
      meta: "Partner Records",
    },
    {
      icon: ReceiptText,
      title: "Receipts & Payment Tracking",
      body: "Record customer payments against invoices, keep receipt history organized, and preserve the transaction trail your finance team needs.",
      meta: "Payment Records",
    },
  ];

  return (
    <div className="public-theme min-h-screen bg-[#F7F9FB]">
      <SiteNavbar active="product" />
      <main>
        <section className="soft-enter border-b border-[#D7DEE8] bg-white px-5 py-20 md:px-8 md:py-24">
          <div className="mx-auto max-w-7xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C9CDFF] bg-[#EEF1FF] px-4 py-2 text-sm font-bold text-[#0001B1]">
            <PackageCheck className="h-4 w-4" aria-hidden="true" />
            PayTraka product suite
          </span>
          <h1 className="mt-7 max-w-5xl text-4xl font-extrabold leading-tight text-[#191C1E] md:text-6xl">
            Invoicing, receipts, and tax-ready records in one workspace
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#454557] md:text-xl md:leading-9">
            PayTraka helps business owners, finance teams, and tax consultants
            organize invoices, payments, customers, suppliers, products, and
            compliance records without juggling spreadsheets.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ActionLink href="/signup">
              Start using PayTraka <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ActionLink>
            <ActionLink href={CALENDLY_DEMO_URL} variant="secondary" external>
              <Phone className="h-4 w-4" aria-hidden="true" />
              Book Demo
            </ActionLink>
          </div>
          </div>
        </section>
        <section className="stagger-children mx-auto grid max-w-7xl gap-6 px-5 py-20 md:grid-cols-3 md:px-8">
          {cards.map(({ icon, title, body, meta }) => (
            <article
              key={title}
              className="interactive-card rounded-xl border border-[#D7DEE8] bg-white p-7 shadow-sm"
            >
              <IconBadge icon={icon} />
              <h2 className="mt-8 text-2xl font-bold text-[#191C1E]">
                {title}
              </h2>
              <p className="mt-4 text-base leading-7 text-[#454557]">{body}</p>
              <p className="mt-7 border-t border-[#D7DEE8] pt-4 text-sm font-semibold text-[#66728A]">
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#12A65A]" />
                {meta}
              </p>
            </article>
          ))}
          <article className="interactive-card rounded-xl border border-[#D7DEE8] bg-white p-7 shadow-sm md:col-span-2">
            <div className="grid min-w-0 gap-8 md:grid-cols-[0.9fr_minmax(0,1.1fr)] md:items-center">
              <div>
                <IconBadge icon={FileText} />
                <h2 className="mt-8 text-2xl font-bold text-[#191C1E]">
                  Sales & Purchase Invoices
                </h2>
                <p className="mt-4 text-base leading-7 text-[#454557]">
                  Create professional, compliant sales and purchase invoices
                  with ease. Our intelligent form layouts automatically
                  calculate taxes, handle line items with precision, and support
                  various currency formats.
                </p>
                <a
                  href="/solutions"
                  className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#0001B1]"
                >
                  Explore Invoice Templates{" "}
                  <ArrowRight size={16} aria-hidden="true" />
                </a>
              </div>
              <div className="rounded-xl border border-[#D7DEE8] bg-[#F7F9FB] p-5">
                <div className="h-2 w-24 rounded-full bg-[#D8DEE3]" />
                <div className="mt-5 h-9 rounded bg-[#E1E5E8]" />
                <div className="mt-3 h-9 w-4/5 rounded bg-[#E1E5E8]" />
                <div className="mt-8 flex justify-end gap-3">
                  <div className="h-8 w-20 rounded bg-[#D8DEE3]" />
                  <div className="h-8 w-20 rounded bg-[#1117E8]" />
                </div>
              </div>
            </div>
          </article>
          <article className="interactive-card rounded-xl bg-[#0001B1] p-7 text-white shadow-[0_18px_45px_rgba(17,23,232,0.24)]">
            <IconBadge icon={FileCheck2} dark />
            <h2 className="mt-8 text-2xl font-bold">Invoice Validation</h2>
            <p className="mt-5 text-base leading-8 text-white/90">
              Ensure every document meets strict regulatory standards before
              submission. Our pre-validation engine checks for required fields,
              accurate tax computations, and formatting errors.
            </p>
            <p className="mt-8 inline-flex rounded bg-white/15 px-3 py-1 text-sm font-semibold">
              Pre-check Active
            </p>
          </article>
          <article className="interactive-card rounded-xl border border-[#D7DEE8] bg-white p-7 shadow-sm md:col-span-2">
            <div className="grid min-w-0 gap-8 md:grid-cols-[0.9fr_minmax(0,1.1fr)] md:items-center">
              <div className="rounded-xl border border-[#D7DEE8] bg-[#F7F9FB] p-5">
                {[
                  "Draft created",
                  "Invoice posted",
                  "Downloaded for sharing",
                ].map((step, index) => (
                  <div key={step} className="flex gap-4 pb-5 last:pb-0">
                    <span className="mt-1 h-6 w-6 rounded-full border-2 border-[#1117E8] bg-[#1117E8]" />
                    <p className="font-bold text-[#191C1E]">{step}</p>
                  </div>
                ))}
                <div className="mt-5 rounded-lg border border-dashed border-[#1117E8] bg-[#EEF1FF] p-4 text-sm text-[#454557]">
                  <strong className="text-[#0001B1]">
                    Optional next step:
                  </strong>{" "}
                  Submit the posted invoice to FIRS when your API credentials
                  are complete.
                </div>
              </div>
              <div>
                <IconBadge icon={CheckCircle2} />
                <h2 className="mt-8 text-2xl font-bold text-[#191C1E]">
                  Invoice Lifecycle Tracking
                </h2>
                <p className="mt-4 text-base leading-7 text-[#454557]">
                  Follow every invoice from draft to posted status. Download the
                  final document and send it to your customer outside PayTraka
                  using email, WhatsApp or any channel you prefer.
                </p>
              </div>
            </div>
          </article>
          <article className="interactive-card rounded-xl border border-[#D7DEE8] bg-white p-7 shadow-sm">
            <IconBadge icon={BarChart3} />
            <h2 className="mt-8 text-2xl font-bold text-[#191C1E]">
              Reports & Audit Trail
            </h2>
            <p className="mt-4 text-base leading-7 text-[#454557]">
              Generate comprehensive compliance reports and maintain an
              immutable audit trail of all actions. Crucial for internal reviews
              and official tax audits.
            </p>
            <p className="mt-7 border-t border-[#D7DEE8] pt-4 text-sm font-semibold text-[#66728A]">
              Immutable Log
            </p>
          </article>
        </section>
        <section className="bg-white px-5 py-20 md:px-8">
          <div className="mx-auto max-w-7xl rounded-2xl bg-[#0D1230] p-6 text-white sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h2 className="text-3xl font-extrabold">Ready to clean up your invoice workflow?</h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-[#C9CDE0]">
                  Start with the records your team needs today, then expand
                  into receipts, reporting, and compliance preparation as your
                  finance process matures.
                </p>
              </div>
              <ActionLink href={CALENDLY_DEMO_URL} external>
                <Phone className="h-4 w-4" aria-hidden="true" />
                Book Demo
              </ActionLink>
            </div>
          </div>
        </section>
      </main>
      <SimpleFooter />
    </div>
  );
}

export function SolutionsPage() {
  const useCases = [
    [
      BriefcaseBusiness,
      "SMEs and business owners",
      "Create official invoices, record payments, and keep customer billing history tidy.",
    ],
    [
      UsersRound,
      "Accountants and tax consultants",
      "Manage client records, spot missing compliance information, and prepare reports faster.",
    ],
    [
      Building2,
      "Growing finance teams",
      "Standardize invoice operations across customers, suppliers, products, and receipts.",
    ],
  ] as const;
  const pipeline = [
    [
      "Capture",
      "Set up business, customer, supplier, product, and tax details.",
      FileText,
    ],
    [
      "Create",
      "Raise invoices and receipts from consistent records.",
      FileCheck2,
    ],
    [
      "Review",
      "Check totals, VAT, payment status, and missing information.",
      FileSearch,
    ],
    [
      "Export",
      "Download clean documents and reports for sharing or filing.",
      Download,
    ],
  ] as const;

  return (
    <div className="public-theme min-h-screen bg-white">
      <SiteNavbar active="solutions" />
      <main>
        <section className="soft-enter border-b border-[#D7DEE8] bg-[#F7F9FB] px-5 py-20 md:px-8 md:py-24">
          <div className="mx-auto max-w-7xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C5C4DA] bg-white px-4 py-2 text-sm font-bold text-[#0001B1]">
            <Handshake className="h-4 w-4" aria-hidden="true" />
            Business finance solutions
          </span>
          <h1 className="mt-8 max-w-5xl text-4xl font-extrabold leading-tight text-[#121B3A] md:text-6xl">
            Better invoice control for teams that need clean records and tax readiness
          </h1>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-[#66728A] md:text-xl md:leading-9">
            PayTraka helps businesses replace scattered invoice files with a
            structured workspace for billing, receipts, partner records,
            product pricing, reporting, and optional FIRS/NRS preparation.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ActionLink href="/signup">
              Get started <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ActionLink>
            <ActionLink href={CALENDLY_DEMO_URL} variant="secondary" external>
              <Phone className="h-4 w-4" aria-hidden="true" />
              Book Demo
            </ActionLink>
          </div>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.72fr_minmax(0,1.28fr)]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#1117E8]">
                Who it helps
              </p>
              <h2 className="mt-4 text-3xl font-extrabold text-[#121B3A] md:text-4xl">
                Practical workflows for finance-heavy businesses
              </h2>
              <p className="mt-4 text-base leading-7 text-[#66728A]">
                Whether you invoice customers daily or prepare compliance packs
                monthly, PayTraka gives your team one place to maintain the
                records behind every transaction.
              </p>
            </div>
            <div className="stagger-children grid gap-5 md:grid-cols-3">
              {useCases.map(([Icon, title, body]) => (
                <article
                  key={title}
                  className="interactive-card rounded-xl border border-[#D7DEE8] bg-white p-6 shadow-sm"
                >
                  <IconBadge icon={Icon} />
                  <h3 className="mt-6 font-bold text-[#121B3A]">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#66728A]">
                    {body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-5 pb-24 md:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-3xl font-bold text-[#121B3A]">
              From transaction details to shareable records
            </h2>
            <p className="hidden font-bold text-[#66728A] sm:block">
              Standard operating workflow
            </p>
          </div>
          <div className="mt-8 rounded-xl border border-[#D7DEE8] bg-white p-8">
            <div className="stagger-children grid gap-8 md:grid-cols-4">
              {pipeline.map(([title, body, Icon]) => (
                <article
                  key={title}
                  className="interactive-card relative rounded-xl p-3 text-center"
                >
                  <IconBadge icon={Icon} />
                  <h3 className="mt-5 text-lg font-bold text-[#121B3A]">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm font-medium leading-6 text-[#66728A]">
                    {body}
                  </p>
                </article>
              ))}
            </div>
            <div className="mt-8 grid gap-4 border-t border-[#D7DEE8] pt-8 md:grid-cols-2">
              <div className="rounded-xl bg-[#F7F9FB] p-5">
                <p className="font-bold text-[#121B3A]">
                  Share with your customer
                </p>
                <p className="mt-2 text-sm leading-6 text-[#66728A]">
                  PayTraka does not send the invoice. Download it and share it
                  through email, WhatsApp or your normal business process.
                </p>
              </div>
              <div className="rounded-xl border border-[#C9CDFF] bg-[#EEF1FF] p-5">
                <p className="flex items-center gap-2 font-bold text-[#0001B1]">
                  <Landmark className="h-5 w-5" /> Optional FIRS branch
                </p>
                <p className="mt-2 text-sm leading-6 text-[#66728A]">
                  Posted invoices can be submitted when FIRS API credentials are
                  complete. Otherwise, continue using the full e-invoicing
                  workflow without submission.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-20 grid gap-8 lg:grid-cols-2">
            <article className="interactive-card rounded-xl border border-[#D7DEE8] bg-white p-8">
              <IconBadge icon={FileSearch} />
              <h2 className="mt-8 text-3xl font-bold text-[#121B3A]">
                Invoice Validation Pathway
              </h2>
              <p className="mt-5 text-lg leading-8 text-[#66728A]">
                Mitigate compliance risk before submission. Our rigorous
                validation engine pre-flights every document against the latest
                FIRS technical specifications, ensuring zero formatting
                rejections.
              </p>
              <div className="mt-14 space-y-6">
                {[
                  "Real-time Schema Auditing",
                  "Tax Calculation Verification",
                ].map((item) => (
                  <p key={item} className="flex gap-4 font-bold text-[#121B3A]">
                    <CheckCircle2
                      className="h-6 w-6 text-[#1117E8]"
                      aria-hidden="true"
                    />
                    {item}
                  </p>
                ))}
              </div>
            </article>
            <article className="interactive-card rounded-xl bg-[#12172F] p-8 text-white">
              <IconBadge icon={CloudUpload} dark />
              <h2 className="mt-8 text-3xl font-bold">
                FIRS/NRS Submission Pathway
              </h2>
              <p className="mt-5 text-lg leading-8 text-white/78">
                An optional pathway for businesses with complete and active FIRS
                API credentials. Posting an invoice in PayTraka does not
                automatically submit it.
              </p>
              <div className="mt-9 space-y-4">
                <div className="flex flex-col gap-3 rounded-lg border border-white/15 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <span className="flex items-center gap-3 font-bold">
                    <KeyRound className="text-green-400" aria-hidden="true" />{" "}
                    Direct API Integration
                  </span>
                  <span className="rounded bg-amber-500/20 px-3 py-1 text-sm font-bold text-amber-300">
                    Setup required
                  </span>
                </div>
                <div className="rounded-lg border border-white/15 bg-white/5 p-4 font-bold">
                  User-controlled submission after posting
                </div>
              </div>
            </article>
          </div>
          <div className="mt-10 rounded-2xl bg-[#1117E8] p-6 text-white sm:p-8 lg:p-10">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h2 className="text-3xl font-extrabold">
                  See how PayTraka fits your workflow
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/80">
                  Walk through customer records, invoice creation, receipts,
                  reporting, and compliance readiness with the team.
                </p>
              </div>
              <ActionLink href={CALENDLY_DEMO_URL} variant="secondary" external>
                <Phone className="h-4 w-4" aria-hidden="true" />
                Book Demo
              </ActionLink>
            </div>
          </div>
        </section>
      </main>
      <SimpleFooter />
    </div>
  );
}

export function ResourcesPage() {
  return (
    <div className="public-theme min-h-screen bg-[#F7F9FB]">
      <SiteNavbar active="resources" />
      <main>
        <section className="soft-enter border-b border-[#D7DEE8] bg-[#F4F6FF] px-5 py-20 text-center md:px-8 md:py-24">
          <h1 className="text-4xl font-extrabold text-[#0001B1] md:text-6xl">
            Resources & Support
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[#454557] md:text-xl">
            Everything you need to master PayTraka and ensure complete FIRS/NRS
            compliance for your business.
          </p>
          <label className="mx-auto mt-10 flex max-w-2xl items-center gap-3 rounded-lg border border-[#D7DEE8] bg-white px-4 py-4 text-left sm:gap-4 sm:px-5">
            <Search className="text-[#66728A]" aria-hidden="true" />
            <span className="sr-only">Search resources</span>
            <input
              className="min-w-0 w-full bg-transparent text-base outline-none placeholder:text-[#757588]"
              placeholder="Search guides, FAQs, and documentation..."
            />
          </label>
        </section>
        <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
          <h2 className="flex items-center gap-4 text-2xl font-bold text-[#191C1E] sm:text-3xl">
            <ShieldCheck className="text-[#1294D8]" aria-hidden="true" />{" "}
            FIRS/NRS Readiness Guide
          </h2>
          <div className="stagger-children mt-10 grid gap-6 lg:grid-cols-[2fr_1fr]">
            <article className="interactive-card rounded-xl border border-[#D7DEE8] bg-white p-7">
              <span className="rounded-full bg-[#EEF1FF] px-4 py-2 text-sm font-bold text-[#0001B1]">
                Complete Guide
              </span>
              <h3 className="mt-7 text-2xl font-bold sm:text-3xl">
                Transitioning to e-Invoicing
              </h3>
              <p className="mt-4 text-lg leading-8 text-[#454557]">
                A step-by-step roadmap for SMEs to migrate from manual invoicing
                to full FIRS compliance using PayTraka. Learn about required
                documentation and technical prerequisites.
              </p>
              <a
                href="#"
                className="mt-7 inline-flex items-center gap-2 font-bold text-[#0001B1]"
              >
                Read Full Guide <ArrowRight size={16} aria-hidden="true" />
              </a>
            </article>
            <article className="interactive-card rounded-xl border border-[#D7DEE8] bg-white p-7">
              <IconBadge icon={ShieldCheck} />
              <h3 className="mt-6 text-xl font-bold">Compliance Checklist</h3>
              <p className="mt-4 text-base leading-7 text-[#454557]">
                Ensure your business meets all mandatory FIRS requirements.
              </p>
              <a
                href="#"
                className="mt-6 inline-block font-bold text-[#0001B1]"
              >
                Download PDF
              </a>
            </article>
            <article className="interactive-card rounded-xl border border-[#D7DEE8] bg-white p-7">
              <IconBadge icon={Gauge} />
              <h3 className="mt-6 text-xl font-bold">Integration Specs</h3>
              <p className="mt-4 text-base leading-7 text-[#454557]">
                Technical documentation for connecting your existing ERP.
              </p>
              <a
                href="/solutions"
                className="mt-6 inline-block font-bold text-[#0001B1]"
              >
                View Docs
              </a>
            </article>
            <article className="interactive-card flex flex-col justify-between gap-6 rounded-xl border border-[#D7DEE8] bg-white p-7 md:flex-row md:items-center">
              <div>
                <h3 className="text-xl font-bold">
                  Upcoming Webinar: Navigating NRS Updates
                </h3>
                <p className="mt-3 text-base text-[#454557]">
                  Join our tax experts on Oct 15th for a live Q&A.
                </p>
              </div>
              <ActionLink href="/company#contact" variant="secondary">
                Register
              </ActionLink>
            </article>
          </div>
        </section>
        <section className="bg-[#EEF2F6] px-5 py-20 md:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-3xl font-bold">Help Center</h2>
            <div className="stagger-children mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                [
                  UsersRound,
                  "Account Setup",
                  "Manage profile, security, and team access.",
                ],
                [
                  FileText,
                  "Creating Invoices",
                  "Templates, line items, and tax calculations.",
                ],
                [
                  Send,
                  "Submission & Validation",
                  "Understanding status codes and FIRS responses.",
                ],
                [
                  BarChart3,
                  "Reports & Analytics",
                  "Exporting data and reading compliance summaries.",
                ],
              ].map(([Icon, title, body]) => (
                <article
                  key={title as string}
                  className="interactive-card rounded-xl border border-[#D7DEE8] bg-white p-7"
                >
                  <IconBadge icon={Icon as LucideIcon} />
                  <h3 className="mt-6 font-bold">{title as string}</h3>
                  <p className="mt-4 text-base leading-7 text-[#454557]">
                    {body as string}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SimpleFooter />
    </div>
  );
}

export function CompanyPage() {
  return (
    <div className="public-theme min-h-screen bg-white">
      <SiteNavbar active="company" />
      <main>
        {/* ── HERO ── */}
        <section className="overflow-hidden bg-[#F7F9FB] pb-0 pt-16 md:pt-24">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:px-8 lg:grid-cols-[0.9fr_minmax(0,1.1fr)]">
            {/* Left */}
            <div>
              <span className="inline-flex rounded-full border border-[#C9CDFF] bg-[#EEF1FF] px-4 py-2 text-xs font-bold uppercase tracking-[0.06em] text-[#0001B1]">
                Built for Nigerian businesses
                {/* Built in Nigeria, for Nigerian businesses */}
              </span>
              <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] text-[#121B3A] md:text-[52px]">
                Invoicing that works. Compliance when you're ready.
              </h1>
              <p className="mt-6 max-w-[480px] text-base leading-8 text-[#66728A] md:text-lg">
                PayTraka empowers businesses to create, track and manage
                professional invoices — with FIRS submission available as a
                clear, confident step when your credentials are in place.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ActionLink href="/signup">Get started free</ActionLink>
                <ActionLink href="#team" variant="secondary">
                  Meet the team
                </ActionLink>
              </div>
              <div className="mt-9 grid max-w-xs grid-cols-3 gap-4 border-t border-[#D7DEE8] pt-7">
                {[
                  // ["₦0 setup", "To start"],
                  ["FIRS ready", "Compliant"],
                  // ["Nigerian", "Built local"],
                ].map(([val, label]) => (
                  <div key={label}>
                    <p className="text-lg font-extrabold text-[#121B3A]">
                      {val}
                    </p>
                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-[#66728A]">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right */}
            <div className="relative min-h-[520px]">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=85"
                alt="Professional Nigerian businesswoman at her desk"
                className="h-[440px] w-full rounded-[1.5rem] object-cover object-top shadow-[0_28px_70px_rgba(18,27,58,0.18)]"
              />
              <div className="absolute -left-4 bottom-10 flex min-w-[260px] items-center gap-4 rounded-2xl border border-[#D7DEE8] bg-white p-5 shadow-xl">
                <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#EEF1FF] text-[#1117E8]">
                  <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-bold text-[#121B3A]">
                    FIRS-ready e-invoicing
                  </p>
                  <p className="mt-0.5 text-xs text-[#66728A]">
                    Submit only when your details are confirmed
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Ticker bar */}
          <div className="mt-12 bg-[#0D1230] py-5">
            <div className="mx-auto max-w-7xl px-5 md:px-8">
              <p className="text-center text-[13px] font-medium text-[#9FA6FF]">
                Trusted by growing Nigerian businesses ·{" "}
                <span className="font-semibold text-white">
                  FIRS e-invoicing compliant
                </span>{" "}
                · Secure
              </p>
            </div>
          </div>
        </section>

        {/* ── MISSION & VISION ── */}
        <section className="border-t border-[#D7DEE8] bg-white py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="text-center">
              <span className="inline-flex rounded-full border border-[#C9CDFF] bg-[#EEF1FF] px-4 py-2 text-xs font-bold uppercase tracking-[0.06em] text-[#0001B1]">
                Who we are
              </span>
              <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-extrabold text-[#121B3A] md:text-[40px]">
                Purpose-built for the way Nigerian businesses actually operate
              </h2>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {/* Mission */}
              <div className="relative overflow-hidden rounded-[1.25rem] bg-[#0D1230] p-10">
                <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-white">
                  <Target className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="text-2xl font-bold text-white">Our Mission</h3>
                <p className="mt-4 text-base leading-8 text-[#C9CDE0]">
                  To simplify business documentation and tax compliance for
                  Nigerian organisations — removing friction, building trust,
                  and putting control back in the hands of finance teams.
                </p>
                <span
                  className="absolute -bottom-6 -right-6 text-white/5"
                  aria-hidden="true"
                >
                  <Target className="h-32 w-32" />
                </span>
              </div>
              {/* Vision */}
              <div className="relative overflow-hidden rounded-[1.25rem] border border-[#D7DEE8] bg-[#F7F9FB] p-10">
                <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#EEF1FF] text-[#1117E8]">
                  <Globe2 className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="text-2xl font-bold text-[#121B3A]">
                  Our Vision
                </h3>
                <p className="mt-4 text-base leading-8 text-[#66728A]">
                  To become the most trusted e-invoicing and compliance platform
                  across Sub-Saharan Africa — connecting businesses, tax
                  authorities and access-point providers through a single,
                  reliable system.
                </p>
                <span
                  className="absolute -bottom-6 -right-6 text-[#1117E8]/10"
                  aria-hidden="true"
                >
                  <Globe2 className="h-32 w-32" />
                </span>
              </div>
            </div>

            {/* Values */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {values.map(({ icon: Icon, title, body }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-[#D7DEE8] bg-[#F7F9FB] px-5 py-6 text-center"
                >
                  <span className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#1117E8] shadow-sm">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h4 className="text-sm font-semibold text-[#121B3A]">
                    {title}
                  </h4>
                  <p className="mt-2 text-xs leading-[1.6] text-[#66728A]">
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TEAM ── */}
        <section id="team" className="bg-[#0D1230] py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.06em] text-[#9FA6FF]">
                  The people behind PayTraka
                </span>
                <h2 className="mt-5 max-w-xl text-3xl font-extrabold text-white md:text-[40px]">
                  Four people, one focused mission.
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-7 text-[#C9CDE0]">
                Leadership and engineering working closely together to make
                invoicing and compliance simpler for Nigerian businesses.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {team.map(({ name, role, bio, photo, socials }) => (
                <article
                  key={name}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] transition-all duration-200 hover:-translate-y-1 hover:border-white/20"
                >
                  <img
                    src={photo}
                    alt={name}
                    className="h-[320px] w-full object-cover object-top"
                  />
                  <div className="p-5">
                    <p className="text-base font-semibold text-white">{name}</p>
                    <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.06em] text-[#9FA6FF]">
                      {role}
                    </p>
                    <p className="mt-2 min-h-[60px] text-xs leading-[1.6] text-[#C9CDE0]">
                      {bio}
                    </p>
                    {Object.keys(socials).length ? (
                      <StaffSocials socials={socials} />
                    ) : null}
                  </div>
                </article>
              ))}
            </div>

            {/* <p className="mt-6 text-center text-xs text-[#9298B3]">
              LinkedIn profiles and contact links will be updated after team
              approval.
            </p> */}
          </div>
        </section>

        {/* ── PARTNERS CAROUSEL ── */}
        <section className="border-t border-[#D7DEE8] bg-white py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="text-center">
              <span className="inline-flex rounded-full border border-[#C9CDFF] bg-[#EEF1FF] px-4 py-2 text-xs font-bold uppercase tracking-[0.06em] text-[#0001B1]">
                Our partners
              </span>
              <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-extrabold text-[#121B3A] md:text-[40px]">
                Working toward connected compliance.
              </h2>
              <p className="mx-auto mt-5 max-w-[560px] text-base leading-8 text-[#66728A]">
                PayTraka is designed to integrate with established access-point
                providers and transaction infrastructure partners across
                Nigeria's e-invoicing ecosystem.
              </p>
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-7xl px-5 md:px-8">
            <PartnersMarquee />
          </div>

          {/* <div className="mx-auto mt-6 max-w-7xl px-5 md:px-8">
            <p className="text-center text-xs text-[#66728A]">
              Partner names shown represent intended integration relationships
              and do not imply finalized commercial arrangements.
            </p>
          </div> */}
        </section>

        {/* ── CONTACT ── */}
        <section
          id="contact"
          className="border-t border-[#D7DEE8] bg-[#F7F9FB] py-16 md:py-24"
        >
          <div className="mx-auto grid max-w-7xl gap-12 px-5 md:px-8 lg:grid-cols-[0.9fr_minmax(0,1.1fr)]">
            {/* Info */}
            <div>
              <span className="inline-flex rounded-full border border-[#C9CDFF] bg-[#EEF1FF] px-4 py-2 text-xs font-bold uppercase tracking-[0.06em] text-[#0001B1]">
                Contact PayTraka
              </span>
              <h2 className="mt-5 text-3xl font-extrabold text-[#121B3A] md:text-[40px]">
                Let's help you get started.
              </h2>
              <p className="mt-5 text-base leading-8 text-[#66728A]">
                Talk to our team about invoice setup, onboarding or preparing
                your optional FIRS integration.
              </p>
              <div className="mt-9 flex flex-col gap-6">
                {[
                  {
                    Icon: MapPin,
                    title: "Address",
                    body: "2 Adaranijo Street, opposite Pedro Police Station,\nPalmgroove, Lagos, Nigeria",
                  },
                  { Icon: Phone, title: "Phone", body: "08126290758" },
                  { Icon: Mail, title: "Email", body: "hello@paytraka.com" },
                ].map(({ Icon, title, body }) => (
                  <div key={title} className="flex gap-4">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-[#D7DEE8] bg-white text-[#1117E8]">
                      <Icon size={17} aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[#121B3A]">
                        {title}
                      </p>
                      <p className="mt-0.5 whitespace-pre-line text-sm leading-6 text-[#66728A]">
                        {body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="rounded-2xl border border-[#D7DEE8] bg-white p-6 shadow-[0_18px_45px_rgba(25,28,30,0.08)] sm:p-10">
              <div className="mb-7 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xl font-bold text-[#121B3A]">
                    Send us a message
                  </p>
                  <p className="mt-1 text-sm text-[#66728A]">
                    We'll point you in the right direction.
                  </p>
                </div>
                <ArrowUpRight
                  className="h-5 w-5 text-[#1117E8]"
                  aria-hidden="true"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <label className="block text-sm font-medium text-[#454557]">
                  First name
                  <input
                    type="text"
                    placeholder="Jane"
                    className="mt-2 w-full rounded-lg border border-[#D7DEE8] bg-[#F7F9FB] px-4 py-3 text-sm outline-none focus:border-[#1117E8]"
                  />
                </label>
                <label className="block text-sm font-medium text-[#454557]">
                  Last name
                  <input
                    type="text"
                    placeholder="Doe"
                    className="mt-2 w-full rounded-lg border border-[#D7DEE8] bg-[#F7F9FB] px-4 py-3 text-sm outline-none focus:border-[#1117E8]"
                  />
                </label>
              </div>
              <label className="mt-4 block text-sm font-medium text-[#454557]">
                Work email
                <input
                  type="email"
                  placeholder="jane@company.com"
                  className="mt-2 w-full rounded-lg border border-[#D7DEE8] bg-[#F7F9FB] px-4 py-3 text-sm outline-none focus:border-[#1117E8]"
                />
              </label>
              <label className="mt-4 block text-sm font-medium text-[#454557]">
                Company name
                <input
                  type="text"
                  placeholder="Enterprise Ltd."
                  className="mt-2 w-full rounded-lg border border-[#D7DEE8] bg-[#F7F9FB] px-4 py-3 text-sm outline-none focus:border-[#1117E8]"
                />
              </label>
              <label className="mt-4 block text-sm font-medium text-[#454557]">
                Message
                <textarea
                  className="mt-2 min-h-[110px] w-full resize-y rounded-lg border border-[#D7DEE8] bg-[#F7F9FB] px-4 py-3 text-sm outline-none focus:border-[#1117E8]"
                  placeholder="Tell us how we can help your business."
                />
              </label>
              <button
                type="submit"
                className="mt-5 w-full rounded-lg bg-[#1117E8] px-5 py-4 text-sm font-bold text-white shadow-[0_12px_28px_rgba(17,23,232,0.18)] transition hover:bg-[#0001B1]"
              >
                Send message
              </button>
            </div>
          </div>
        </section>
      </main>
      <SimpleFooter />
    </div>
  );
}

function Input({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="mt-5 block text-sm font-medium text-[#454557] first:mt-0">
      {label}
      <input
        type={type}
        placeholder={placeholder}
        className="mt-2 h-12 w-full rounded-lg border border-[#D7DEE8] bg-[#F7F9FB] px-4 text-base outline-none focus:border-[#1117E8]"
      />
    </label>
  );
}
