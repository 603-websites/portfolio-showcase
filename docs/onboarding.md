# Michael's Onboarding Guide — 603 Websites / Sader & Carter

Welcome to the team! This doc covers everything you need to get up and running as our dev/CRM manager.

---

## 1. Team & Roles

| Person | Role | GitHub |
|--------|------|--------|
| Louis Sader | Co-founder, lead dev | `louissader` |
| Logan Carter | Co-founder, dev | `Logan566C` |
| Michael | Dev / CRM Manager | (your GitHub username) |

All repos live under the **`603-websites`** GitHub org. Both Louis and Logan are org owners — you'll be added as a member with write access.

---

## 2. Dev Environment Setup

### Prerequisites
- **Node.js 20+** (use `nvm install 20` if needed)
- **Git** + GitHub account
- **VS Code** (recommended) or any editor
- **Claude Code CLI** — this is how we build fast (see Section 4)

### Clone & Run

```bash
# Clone the main repo
gh repo clone 603-websites/portfolio-showcase
cd portfolio-showcase

# Install dependencies
npm install

# Copy env file and fill in values (ask Louis for keys)
cp .env.example .env.local

# Start dev server
npm run dev
# Site runs at http://localhost:3000
```

### Environment Variables

Ask Louis for the real values. You need:

| Variable | What it is |
|----------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public/anon key |
| `SUPABASE_SERVICE_KEY` | Supabase service role key (server-only) |
| `STRIPE_SECRET_KEY` | Stripe API secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `NEXT_PUBLIC_SITE_URL` | Production URL (`https://websites-sader-carter.vercel.app`) |

---

## 3. Architecture Overview

### Tech Stack
- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS v4** (custom dark theme tokens in `globals.css`)
- **Supabase** — auth, database, RLS (row-level security)
- **Stripe** — subscriptions, invoicing, billing portal
- **Framer Motion** — animations
- **Recharts** — charts in dev dashboard
- **Vercel** — hosting, auto-deploys from `main` branch

### Folder Structure

```
src/
├── app/
│   ├── (marketing)/     # Public pages: home, projects, about, services, contact, order
│   ├── (auth)/          # Login, signup, forgot/reset password, onboarding
│   ├── dev/             # Dev dashboard (role=dev only)
│   ├── client/          # Client portal (role=client only)
│   ├── api/             # API routes (contact, stripe, analytics, auth)
│   ├── layout.tsx       # Root layout
│   └── globals.css      # Tailwind theme tokens
├── components/
│   ├── shared/          # Navbar, Footer, GradientBackground
│   ├── marketing/       # SectionReveal, ProjectBrowser, FAQAccordion, etc.
│   ├── dev/             # DevSidebar, RevenueChart
│   └── client/          # ClientSidebar
├── data/                # Static data (projects, FAQ, pricing)
├── lib/
│   └── supabase/        # client.ts, server.ts, admin.ts
└── middleware.ts         # Route protection (role-based)
```

### Route Groups

| Group | URL Pattern | Who sees it |
|-------|------------|-------------|
| `(marketing)` | `/`, `/projects`, `/about`, etc. | Everyone (public) |
| `(auth)` | `/login`, `/signup`, `/forgot-password`, etc. | Unauthenticated users |
| `dev` | `/dev/dashboard`, `/dev/clients`, etc. | Devs only (Louis, Logan, Michael) |
| `client` | `/client/dashboard`, `/client/billing`, etc. | Clients only |

### Auth & Roles

We use **Supabase Auth** with email/password. Roles are stored in `user_metadata.role`:
- `dev` — full access to dev dashboard, all client data
- `client` — access to their own portal only (enforced by RLS)

The middleware (`src/middleware.ts`) enforces route protection:
- `/dev/*` requires `role=dev`
- `/client/*` requires `role=client`
- Logged-in users get redirected away from `/login` and `/signup`

### Database (Supabase)

Key tables:
- `clients` — business info, plan, Stripe IDs, status
- `client_users` — junction table linking auth users to clients
- `tasks` — kanban tasks (todo, in_progress, review, done)
- `invoices` — payment history (synced from Stripe webhooks)
- `appointments` — meetings/calls
- `analytics_snapshots` — daily page view/visitor snapshots
- `website_content` — client-editable content (menu, hours, promotions, contact)
- `contact_submissions` — from the public contact form

RLS policies ensure clients can only see their own data. Devs have unrestricted read access.

---

## 4. Working with Claude Code

Claude Code is our primary development tool. Here's how to use it effectively.

### Installation

```bash
# Install globally
npm install -g @anthropic-ai/claude-code

# Run it in a project directory
cd portfolio-showcase
claude
```

### Good Prompts (Copy & Use These)

**Understanding the codebase:**
```
Explain how the dev dashboard works — trace the data flow from Supabase queries to the UI components
```

```
Walk me through the auth flow: what happens when a client signs up, from the signup page through onboarding to the client dashboard?
```

```
Show me how Stripe webhooks work in this project and what database changes they trigger
```

**Adding features:**
```
Add a new page at /dev/settings that lets devs update their profile (name, email, avatar). Use the same layout and styling as the other dev pages.
```

```
Add a "notes" textarea to the client detail page at /dev/clients/[id] that saves to a new notes column on the clients table
```

**Fixing bugs:**
```
The revenue chart on /dev/revenue is showing $0 for all months. Debug this — check the Supabase query, the data transformation, and the Recharts config.
```

```
The client sidebar isn't highlighting the active page. Fix the active state detection in ClientSidebar.tsx.
```

**Refactoring:**
```
The client content editors (menu, hours, promotions, contact) all follow the same load/save pattern. Extract the shared logic into a custom hook.
```

### Tips for Great Claude Code Results

1. **Be specific** — "Add a button" is vague. "Add a blue 'Export CSV' button to the top-right of the clients table that downloads all client data as a CSV" is actionable.

2. **Reference files** — "Fix the bug in DevSidebar.tsx" gives Claude context immediately vs "fix the sidebar bug".

3. **Describe the end state** — "I want the tasks page to have a filter dropdown that lets you filter by assignee and by client" tells Claude exactly what done looks like.

4. **Let Claude read first** — If Claude asks to read files before making changes, let it. It produces much better code when it understands context.

5. **Iterate** — Don't try to get everything in one prompt. Build incrementally: get the basic version working, then refine.

### What NOT to Do

- Don't ask Claude to "rewrite everything" — be incremental
- Don't skip the `npm run build` verification step before pushing
- Don't commit `.env.local` (it's in `.gitignore`)
- Don't push directly to `main` without testing — use feature branches

---

## 5. Common Workflows

### Adding a New Page

1. Create the file in the right route group (e.g., `src/app/dev/new-page/page.tsx`)
2. Server components for pages that fetch data, client components for interactive UIs
3. Add a nav link in the relevant sidebar (`DevSidebar.tsx` or `ClientSidebar.tsx`)
4. Run `npm run build` to verify no type errors

### Adding a New Client (as a dev)

1. Go to `/dev/clients` in the dashboard
2. Click "Add Client"
3. Fill in name, business name, email, phone, plan, revenue, website URL
4. The client record is created in Supabase
5. Create their auth account separately (or they sign up themselves via `/order` flow)

### Deploying

```bash
# Verify build passes locally
npm run build

# Push to main — Vercel auto-deploys
git push origin main
```

Preview deployments happen automatically on every branch push.

### Testing Stripe Locally

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to your local server
stripe listen --forward-to localhost:3000/api/stripe/webhooks

# In another terminal, trigger test events
stripe trigger invoice.paid
```

---

## 6. Key URLs

| Resource | URL |
|----------|-----|
| Production site | `https://websites-sader-carter.vercel.app` |
| GitHub org | `https://github.com/603-websites` |
| Supabase dashboard | `https://supabase.com/dashboard` (project: `603-websites-saas`) |
| Stripe dashboard | `https://dashboard.stripe.com` |
| Vercel dashboard | `https://vercel.com` |

---

## 7. Your First Tasks

1. Get the repo cloned and running locally
2. Get your Supabase dev account created (ask Louis)
3. Log in to `/dev/dashboard` and explore the dev tools
4. Read through the codebase structure — start with `src/app/dev/`
5. Try adding a small feature using Claude Code to get comfortable with the workflow

Questions? Ping Louis or Logan in the group chat.
