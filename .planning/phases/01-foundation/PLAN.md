# Phase 1 — Foundation

**Goal:** Set up the project infrastructure — Next.js app, Neon database, Better Auth with org/invite plugin, and the dashboard shell (sidebar + layout + dark mode + responsive).

**Requirements:** AUTH-01..07, DASH-01, DASH-03, DASH-04
**UI Spec:** `01-UI-SPEC.md` (approved 2026-03-31)
**Depends on:** Nothing — this is the foundation.

---

## Task Breakdown

### Task 1: Project Scaffolding

**What:** Initialize the Next.js 15 project with TypeScript, Tailwind CSS 4, and shadcn/ui. Set up project structure matching the architecture spec.

**Steps:**
1. Run `npx create-next-app@latest notella --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"` (or equivalent flags for Next.js 15)
2. Initialize shadcn/ui with `npx shadcn@latest init` — use "default" preset (neutral), Inter font
3. Install core dependencies:
   - `drizzle-orm` + `drizzle-kit` + `@neondatabase/serverless`
   - `better-auth`
   - `zod`
   - `lucide-react`
4. Create folder structure per architecture spec:
   ```
   src/
   ├── lib/
   │   ├── db/
   │   │   ├── index.ts
   │   │   └── schema/
   │   │       └── index.ts
   │   ├── auth.ts
   │   ├── auth-client.ts
   │   └── utils.ts
   ├── components/
   │   ├── ui/           (shadcn)
   │   ├── layout/
   │   └── shared/
   └── app/
       ├── (auth)/
       │   ├── sign-in/
       │   └── sign-up/
       ├── (dashboard)/
       │   ├── layout.tsx
       │   └── page.tsx
       ├── api/
       │   └── auth/
       │       └── [...all]/
       │           └── route.ts
       ├── layout.tsx
       └── page.tsx
   ```
5. Set up `drizzle.config.ts` pointing to Neon
6. Create `.env.local` with placeholders:
   - `DATABASE_URL` (Neon connection string)
   - `BETTER_AUTH_SECRET` (random 32-char string)
   - `BETTER_AUTH_URL` (http://localhost:3000)
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
7. Create `.env.example` with the same keys (no values)
8. Configure `next.config.ts` (no special config needed yet)

**Verify:**
- `npm run dev` starts without errors
- `/` renders a placeholder page
- Folder structure matches architecture spec
- All dependencies in `package.json`

---

### Task 2: Database Schema & Migrations

**What:** Define the Drizzle schema for Better Auth tables + run initial migration against Neon.

**Steps:**
1. Create `src/lib/db/index.ts` — Drizzle + Neon serverless connection:
   ```typescript
   import { neon } from '@neondatabase/serverless';
   import { drizzle } from 'drizzle-orm/neon-http';
   import * as schema from './schema';

   const sql = neon(process.env.DATABASE_URL!);
   export const db = drizzle(sql, { schema });
   ```
2. Create `src/lib/db/schema/auth.ts` — Better Auth tables. Use Better Auth's Drizzle adapter to generate the required tables (user, session, account, verification). Include the organization plugin tables (organization, member, invitation).
3. Create `src/lib/db/schema/index.ts` — re-export all schemas
4. Run `npx drizzle-kit generate` to create migration SQL
5. Run `npx drizzle-kit migrate` (or `push`) to apply to Neon

**Verify:**
- `npx drizzle-kit studio` connects to Neon and shows tables
- Tables exist: `user`, `session`, `account`, `verification`, `organization`, `member`, `invitation`
- Schema TypeScript types are correct (no `as any`)

---

### Task 3: Better Auth Server & Client Setup

**What:** Configure Better Auth with email/password, Google OAuth, and organization plugin. Set up auth API route and client.

**Steps:**
1. Create `src/lib/auth.ts` — server-side Better Auth config:
   ```typescript
   import { betterAuth } from 'better-auth';
   import { drizzleAdapter } from 'better-auth/adapters/drizzle';
   import { organization } from 'better-auth/plugins';
   import { db } from './db';

   export const auth = betterAuth({
     database: drizzleAdapter(db, { provider: 'pg' }),
     emailAndPassword: { enabled: true },
     socialProviders: {
       google: {
         clientId: process.env.GOOGLE_CLIENT_ID!,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
       },
     },
     plugins: [
       organization({
         allowUserToCreateOrganization: true,
       }),
     ],
   });
   ```
2. Create `src/lib/auth-client.ts` — client-side auth:
   ```typescript
   import { createAuthClient } from 'better-auth/react';
   import { organizationClient } from 'better-auth/client/plugins';

   export const authClient = createAuthClient({
     plugins: [organizationClient()],
   });
   ```
3. Create `src/app/api/auth/[...all]/route.ts` — catch-all auth handler:
   ```typescript
   import { auth } from '@/lib/auth';
   import { toNextJsHandler } from 'better-auth/next-js';

   export const { GET, POST } = toNextJsHandler(auth);
   ```
4. Create auth middleware `src/middleware.ts` to protect `(dashboard)` routes — redirect unauthenticated users to `/sign-in`

**Verify:**
- `POST /api/auth/sign-up/email` with email+password returns 200 and creates user in DB
- `POST /api/auth/sign-in/email` returns session token
- Session persists after simulated browser refresh (cookie-based)
- Google OAuth redirect works (requires valid Google credentials)

**Covers:** AUTH-01, AUTH-02, AUTH-05 (partial — needs UI)

---

### Task 4: Auth UI Pages

**What:** Build sign-in and sign-up pages using shadcn/ui components. Use Better Auth UI if it saves time, or build manually with shadcn form components.

**Steps:**
1. Install shadcn components: `button`, `input`, `label`, `card`
2. Create `src/app/(auth)/layout.tsx` — centered layout for auth pages (no sidebar)
3. Create `src/app/(auth)/sign-in/page.tsx`:
   - Email + password form
   - "Continue with Google" button (OAuth)
   - Link to sign-up page
   - Inline validation errors per UI spec copywriting
   - Responsive: works on 375px mobile viewport
4. Create `src/app/(auth)/sign-up/page.tsx`:
   - Name + email + password form
   - "Continue with Google" button
   - Link to sign-in page
   - Inline validation errors
5. Wire forms to Better Auth client methods:
   - `authClient.signIn.email()` / `authClient.signUp.email()`
   - `authClient.signIn.social({ provider: 'google' })`
6. On success: redirect to `/(dashboard)`
7. Style per UI spec: Inter font, zinc color palette, spacing scale

**Verify:**
- Sign-up form creates user, redirects to dashboard
- Sign-in form authenticates user, redirects to dashboard
- Google OAuth button redirects to Google consent, then back to dashboard
- Error messages render inline (e.g., "Invalid email or password")
- Pages render correctly on 375px viewport (Chrome DevTools)
- Button copy matches UI spec ("Sign In", "Sign Up", "Continue with Google")

**Covers:** AUTH-01, AUTH-02, AUTH-05, DASH-03 (auth pages responsive)

---

### Task 5: Dashboard Shell (Sidebar + Layout)

**What:** Build the dashboard layout with collapsible sidebar, top header with user menu, and main content area. The sidebar shows module links.

**Steps:**
1. Install shadcn components: `sidebar`, `dropdown-menu`, `avatar`, `dialog`
2. Create `src/lib/modules.ts` — module registry:
   ```typescript
   import { LayoutDashboard, Kanban, Bookmark, StickyNote } from 'lucide-react';

   export const modules = [
     { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, href: '/' },
     { id: 'kanban', name: 'Kanban', icon: Kanban, href: '/kanban' },
     { id: 'bookmarks', name: 'Bookmarks', icon: Bookmark, href: '/bookmarks' },
     { id: 'notes', name: 'Notes', icon: StickyNote, href: '/notes' },
   ] as const;
   ```
3. Create `src/components/layout/app-sidebar.tsx`:
   - Uses shadcn `Sidebar` component
   - Renders module links from registry
   - Collapsible: full sidebar on desktop, icon-only with tooltips when collapsed
   - On mobile (< 768px): sidebar is a sheet/drawer triggered by hamburger
   - Active link highlighted with primary accent color
   - Bottom section: user avatar + name + sign-out dropdown
4. Create `src/components/layout/app-header.tsx`:
   - Top bar with hamburger (mobile sidebar trigger) and breadcrumb/page title
   - User avatar dropdown on right: profile, settings, sign out
5. Create `src/components/layout/app-shell.tsx`:
   - Wraps sidebar + header + main content area
   - `SidebarProvider` from shadcn
6. Create `src/app/(dashboard)/layout.tsx`:
   - Uses `AppShell` component
   - Fetches current user session server-side
   - Passes user data to sidebar/header
7. Create `src/app/(dashboard)/page.tsx`:
   - Placeholder dashboard home: "Select a module from the sidebar to begin."
8. Create placeholder pages for each module:
   - `src/app/(dashboard)/kanban/page.tsx` — "Kanban — Coming soon"
   - `src/app/(dashboard)/bookmarks/page.tsx` — "Bookmarks — Coming soon"
   - `src/app/(dashboard)/notes/page.tsx` — "Notes — Coming soon"
   - `src/app/(dashboard)/settings/page.tsx` — Settings page (used in Task 7)

**Verify:**
- Sidebar renders all module links
- Clicking links navigates to correct pages
- Sidebar collapses/expands on desktop (toggle button)
- On mobile (375px): sidebar is hidden, hamburger icon opens drawer
- Active link is visually highlighted
- User menu shows name + avatar + sign out option
- Sign out clears session, redirects to `/sign-in`
- Empty state text matches UI spec copywriting

**Covers:** DASH-01, DASH-03, AUTH-03

---

### Task 6: Dark Mode Toggle

**What:** Implement dark/light mode toggle that persists across sessions using `next-themes` or manual cookie-based approach.

**Steps:**
1. Install `next-themes` (works well with shadcn/ui and Tailwind dark mode)
2. Create `src/components/providers/theme-provider.tsx`:
   - Wraps app with `ThemeProvider` from `next-themes`
   - `attribute="class"`, `defaultTheme="system"`, `enableSystem`
3. Add `ThemeProvider` to root `src/app/layout.tsx`
4. Create `src/components/shared/theme-toggle.tsx`:
   - Button that cycles: light → dark → system
   - Uses `Sun` / `Moon` icons from lucide-react
   - `aria-label` for accessibility
5. Place theme toggle in sidebar bottom section (near user menu)
6. Set `<html>` tag with `suppressHydrationWarning` (required by next-themes)
7. Add `color-scheme: dark` to dark mode CSS
8. Add `<meta name="theme-color">` that matches current theme background

**Verify:**
- Toggle switches between light and dark mode instantly
- Preference persists after page reload
- shadcn components render correctly in both modes (colors match UI spec)
- No hydration mismatch warnings in console
- System preference detection works (auto mode)

**Covers:** DASH-04

---

### Task 7: User Profile (Display Name & Avatar)

**What:** Build settings page where user can update display name and avatar.

**Steps:**
1. Create `src/app/(dashboard)/settings/page.tsx`:
   - Profile section: display name input, avatar upload
   - Uses Better Auth's `updateUser` API
2. Create `src/app/(dashboard)/settings/_components/profile-form.tsx`:
   - Form with current name pre-filled
   - Avatar: use Better Auth's built-in `image` field on user, or upload to a simple URL
   - For v1: avatar can be a URL input (e.g., Gravatar URL) — file upload to R2 is v2
   - Save button triggers `authClient.updateUser()` server action
3. Add validation with zod: name required, min 2 chars

**Verify:**
- User can change display name — change reflects in sidebar user menu immediately
- Avatar URL updates — avatar renders in sidebar and header
- Form shows validation errors for empty/too-short names
- Changes persist after page reload

**Covers:** AUTH-04

---

### Task 8: Organization & Invite System

**What:** Enable organization creation, member invites, and role management using Better Auth's organization plugin.

**Steps:**
1. Create `src/app/(dashboard)/settings/_components/org-section.tsx`:
   - "Create Organization" button + dialog with name input
   - List of user's organizations
   - Active organization selector (if user belongs to multiple)
2. Create `src/app/(dashboard)/settings/_components/members-section.tsx`:
   - Shows members of active organization with their roles
   - "Send Invite" button + dialog: email input
   - Owner can assign roles via dropdown: owner / admin / member
   - "Remove Member" with confirmation dialog
3. Wire to Better Auth organization client methods:
   - `authClient.organization.create()`
   - `authClient.organization.inviteMember()`
   - `authClient.organization.updateMemberRole()`
   - `authClient.organization.removeMember()`
4. Create invite acceptance flow:
   - When user receives invite link and clicks it, they see an "Accept Invite" page
   - If not logged in → redirect to sign-up, then accept
   - If logged in → show invite details + "Accept Invite" button
5. Display role badge next to each member name
6. Empty states per UI spec:
   - No organizations: "No organizations yet. Create one to get started."
   - No members: "No members found. Invite someone to collaborate."

**Verify:**
- User can create an organization — appears in org list
- User can invite another user via email — invite email/link is generated
- Invited user can accept invite — appears as member in org
- Owner can change member role — role updates in member list
- Owner can remove member — member disappears, loses access
- Destructive actions show confirmation dialogs per UI spec
- Copy matches UI spec for all buttons and empty states

**Covers:** AUTH-06, AUTH-07

---

### Task 9: Polish & Responsive Verification

**What:** Final pass to ensure responsive design, accessibility, and overall quality.

**Steps:**
1. Test all pages at breakpoints: 375px, 768px, 1024px, 1440px
2. Verify keyboard navigation: Tab through sidebar, forms, dialogs
3. Verify focus rings visible on all interactive elements
4. Check all `aria-label` attributes on icon-only buttons
5. Verify no console errors or hydration warnings
6. Run `npm run build` — ensure clean build with no TypeScript errors
7. Test full user flow end-to-end:
   - Sign up → land on dashboard → create org → invite member → toggle dark mode → sign out → sign in
8. Verify all 7 success criteria from the roadmap

**Verify (Phase Success Criteria):**
1. [ ] User can sign up with email/password and log in — session persists after browser refresh
2. [ ] User can log in with Google OAuth and reach the dashboard
3. [ ] User can create an organization and invite another user via email link
4. [ ] Invited user can accept invite and see shared workspace — role visible in settings
5. [ ] Sidebar shows all module links (even if pages are placeholder), collapses on mobile
6. [ ] Dark mode toggle works and persists across sessions
7. [ ] All auth pages (sign-in, sign-up) render correctly on 375px mobile viewport

---

## Execution Order

```
Task 1 (Scaffolding)
  └── Task 2 (DB Schema)
       └── Task 3 (Auth Server/Client)
            ├── Task 4 (Auth UI)
            ├── Task 5 (Dashboard Shell) ── Task 6 (Dark Mode)
            └── Task 7 (Profile)
                 └── Task 8 (Org & Invites)
                      └── Task 9 (Polish)
```

Tasks 4, 5, and 7 can run in parallel after Task 3 is complete.
Task 6 depends on Task 5 (needs sidebar location for toggle).
Task 8 depends on Task 7 (settings page).
Task 9 is always last.

---

## Technical Notes

- **Better Auth schema generation**: Use `npx @better-auth/cli generate` with Drizzle adapter to produce the correct table schema. Don't hand-write auth tables.
- **Neon serverless driver**: Use `@neondatabase/serverless` (HTTP driver), not `pg` (TCP). HTTP driver is optimal for Vercel serverless.
- **shadcn sidebar**: Use the official shadcn sidebar component (`npx shadcn@latest add sidebar`). It handles responsive behavior, collapse state, and sheet overlay for mobile out of the box.
- **next-themes**: Set `attribute="class"` to work with Tailwind's `darkMode: "class"` config. Add `suppressHydrationWarning` to `<html>` tag.
- **Middleware**: Use Next.js middleware to protect `(dashboard)` group. Better Auth provides a `getSession` helper for middleware.
- **Environment variables**: Never import `.env` values client-side without `NEXT_PUBLIC_` prefix. Auth secrets stay server-only.

---
*Plan created: 2026-03-31*
