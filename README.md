# PayTraka Invoice Nexus

PayTraka is a smart invoicing and billing workspace for Nigerian SMEs. It supports mock login, dashboard metrics, customers, products/services, invoices, receipts, credit/debit notes, reports, and business settings.

This repository has been migrated from React + TypeScript + Vite to a Next.js App Router application. The current app is still frontend/mock-data based; it does not yet include a production backend, database, payment gateway, real PDF generation service, or live FIRS e-invoicing integration.

## Tech Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 16 App Router |
| UI | React 19, TypeScript |
| Styling | Tailwind CSS |
| Components | shadcn/ui-style components, Radix UI |
| Charts | Recharts |
| Icons | Lucide React |
| Forms | React Hook Form, Zod |
| Mock state | In-memory services and browser `localStorage` |

Next.js 16 requires Node.js `>=20.9.0`. The local environment used for this upgrade is Node.js `v24.12.0`.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Start a production build:

```bash
npm run start
```

The app normally starts at:

```text
http://localhost:3000
```

If port `3000` is already in use, Next.js will choose the next available port.


## Routes

| Route | Screen |
| --- | --- |
| `/` | Redirects to `/dashboard` |
| `/login` | Login |
| `/dashboard` | Dashboard |
| `/customers` | Customers |
| `/products` | Products & Services |
| `/invoices` | Invoices |
| `/receipts` | Receipts |
| `/adjustments` | Credit & Debit Notes |
| `/reports` | Reports |
| `/settings` | Settings |

Protected routes are grouped under the Next.js App Router layout in `src/app/(app)/layout.tsx`. The existing client-side auth guard is preserved and redirects unauthenticated users to `/login`.

## Project Structure

```text
src/
  app/
    layout.tsx              # Root Next.js layout and metadata
    providers.tsx           # Client providers for Query, toasts, tooltips
    globals.css             # Tailwind and app CSS variables
    page.tsx                # Redirects / to /dashboard
    login/page.tsx
    (app)/
      layout.tsx            # Auth-protected app shell
      dashboard/page.tsx
      customers/page.tsx
      products/page.tsx
      invoices/page.tsx
      receipts/page.tsx
      adjustments/page.tsx
      reports/page.tsx
      settings/page.tsx
  components/
    ui/                     # shadcn/ui-style primitives
    AppSidebar.tsx
    Layout.tsx
    NavLink.tsx
    *Dialog.tsx
  screens/                  # Migrated client screens from the old Vite pages
  services/                 # Mock auth/data/settings/report services
  hooks/
  lib/
  utils/
```

## Current Data Behavior

No database setup is required for the current app.

| Data | Current storage |
| --- | --- |
| Authenticated user | Browser `localStorage` key `paytraka_user` |
| Business settings | Browser `localStorage` key `paytraka_settings` |
| Uploaded logo | Base64 data URL inside `paytraka_settings` |
| Customers | In-memory array in `customersService.ts` |
| Products/services | In-memory array in `productsService.ts` |
| Invoices | In-memory array in `invoicesService.ts` |
| Receipts | In-memory array in `receiptsService.ts` |
| Credit/debit notes | In-memory arrays in `adjustmentsService.ts` |
| Reports | Calculated from in-memory invoice data |

Because most records are module-level arrays, business records may reset when the app reloads or restarts. Settings and mock auth persist in the browser.

## Future Production Architecture

A production PayTraka backend should use MySQL as the source of truth and Redis only for supporting infrastructure.

Recommended shape:

| Layer | Responsibility |
| --- | --- |
| Next.js App Router | UI, route layouts, metadata, server actions or route handlers where appropriate |
| API layer | Authenticated invoice, receipt, customer, product, adjustment, and report operations |
| MySQL | Durable source of truth for tenants, users, customers, products, invoices, receipts, adjustments, document numbers, audit logs, and settings |
| Redis | Rate limiting, short-lived cache, idempotency locks, queues, and background job coordination |
| Worker process | Email sending, PDF generation, FIRS submission/retry workflows, report precomputation |
| Object storage | Generated PDFs, uploaded logos, and document attachments |

Key backend requirements before replacing mock state:

- Use tenant-scoped authorization on every read and write.
- Generate invoice, receipt, credit note, and debit note numbers inside database transactions.
- Use row locks or a dedicated numbering table to prevent duplicate document numbers under concurrency.
- Treat receipts, invoice status changes, credit notes, and debit notes as transactional accounting workflows.
- Keep Redis out of the source-of-truth path; cache can be rebuilt from MySQL.
- Add idempotency keys for payment callbacks, receipt creation, PDF generation, and FIRS submission.
- Store immutable audit events for financial documents.
- Add integration tests around document numbering, partial payments, overpayment prevention, receipt deletion, and adjustment totals.

## Environment Variables

The current mock frontend does not require environment variables.

The PayTraka backend URL is used only by server-side route handlers. Do not expose it with `NEXT_PUBLIC_`; browser requests should go through the same-origin `/api/proxy` route to avoid mixed-content and CORS issues.

```bash
PAYTRAKA_API_BASE_URL=http://paytraka-api.domain-plusltd.com/api
```

Do not expose secrets with `NEXT_PUBLIC_`.

## Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Starts the Next.js development server |
| `npm run build` | Runs a production Next.js build |
| `npm run start` | Starts the production Next.js server |
| `npm run lint` | Runs ESLint over the source files |
| `npm run typecheck` | Runs TypeScript without emitting files |
| `npm test` | Runs the automated Vitest suite |
| `npm run test:api` | Runs the API-focused Vitest suite |

## Automated API Tests

The API tests use Vitest in a Node environment and are deterministic: external HTTP calls, cookie access, and route proxy calls are mocked.

Run all tests:

```bash
npm test
```

Run only the API-focused tests:

```bash
npm run test:api
```

Current coverage includes:

- `src/app/api/auth/session/route.ts`: session read/write/delete behavior, httpOnly cookie setting, malformed JSON, missing token/user validation, and corrupt profile-cookie handling.
- `src/app/api/proxy/[...path]/route.ts`: authentication checks, missing path validation, query forwarding, JSON and multipart request forwarding, upstream validation responses, and upstream network failures.
- `src/lib/api/*.ts`: auth, companies, customers, suppliers, products/categories, sales invoices, FIRS, and receipts client wrappers.
- `src/lib/api/client.ts`: API error message extraction and browser-side 401 session-expiry behavior.

## Verification Notes

The migration was verified with:

- Dependency install from a clean lockfile.
- TypeScript checking.
- Production Next.js build.
- Dev server startup.
- Route smoke checks for `/`, `/login`, `/dashboard`, `/customers`, `/products`, `/invoices`, `/receipts`, `/adjustments`, `/reports`, and `/settings`.

In the WSL 1 shell used during migration, the Windows npm shim intermittently failed with:

```text
WSL 1 is not supported. Please upgrade to WSL 2 or above.
Could not determine Node.js install directory
```

The underlying Next.js build and dev commands were verified through the Windows `.cmd` wrappers from the repository directory.

## Known Limitations

- Authentication is mock-only and stored in browser `localStorage`.
- There is no real backend, database, RBAC, server session, or password hashing.
- Invoice and receipt persistence is not durable.
- PDF generation is currently a placeholder utility.
- FIRS compliance messaging appears in the UI, but live FIRS validation/submission is not implemented.
- API route handlers and client API wrappers are covered by automated Vitest tests.

## License

No license file is present in this repository.
