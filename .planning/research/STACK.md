# Stack Research: Notella

**Domain:** Personal all-in-one productivity dashboard
**Date:** 2026-03-31

## Recommended Stack

### Frontend

| Technology | Version | Confidence | Rationale |
|-----------|---------|------------|-----------|
| **Next.js** | 15.x (App Router) | High | Industry standard for React SSR/SSG. App Router enables server components, streaming, layouts. Vercel free tier is purpose-built for it. Owner's modular dashboard benefits from file-based routing — each module maps to a route group. |
| **React** | 19.x | High | Ships with Next.js 15. Server Components reduce client bundle. `use` hook, Actions, transitions — all useful for dashboard interactivity. |
| **TypeScript** | 5.x | High | Non-negotiable for a mega project. Type safety across DB schema (Drizzle), API layer, and UI prevents bugs at scale. |
| **Tailwind CSS** | 4.x | High | CSS-first config in v4, zero-runtime, composable. Pairs with shadcn/ui for consistent design system. |
| **shadcn/ui** | latest | High | Not a library — copy-paste components built on Radix UI + Tailwind. Full control, no vendor lock-in, highly customizable. Perfect for dashboard UI (tables, forms, dialogs, sidebar nav). |

### Backend / API

| Technology | Version | Confidence | Rationale |
|-----------|---------|------------|-----------|
| **Next.js API Routes / Server Actions** | 15.x | High | Co-located with frontend. Server Actions for mutations, Route Handlers for external API endpoints (e.g., CF Worker webhook). No separate backend needed for v1. |
| **Drizzle ORM** | 0.38.x | High | Type-safe SQL ORM. ~60KB bundle, zero deps, first-class Neon serverless support. Schema-as-code with `drizzle-kit` for migrations. Relational queries built-in. |
| **Neon PostgreSQL** | Serverless | High | Owner already familiar. Scale-to-zero without data loss (unlike Supabase suspend). 0.5GB storage, 191.9 compute hours free. ~500ms cold start. |

### Authentication

| Technology | Version | Confidence | Rationale |
|-----------|---------|------------|-----------|
| **Better Auth** | 1.x | High | Open source, framework-agnostic, plugin ecosystem. Organization plugin provides invite system + role-based access out of the box. No user limits, self-hosted. Drizzle adapter available. |
| **Better Auth UI** | latest | Medium | Pre-built shadcn/ui styled auth components (sign-in, sign-up, forgot password). Saves time on auth UI. |

### File Storage

| Technology | Version | Confidence | Rationale |
|-----------|---------|------------|-----------|
| **Cloudflare R2** | - | High | S3-compatible, 10GB free, no egress fees. Owner already in CF ecosystem (vclass worker). Use `@aws-sdk/client-s3` to interact. |

### Deployment

| Technology | Tier | Confidence | Rationale |
|-----------|------|------------|-----------|
| **Vercel** | Free (Hobby) | High | Purpose-built for Next.js. Zero-config deploys, edge functions, image optimization. 100GB bandwidth, 100 deployments/day. Best DX for Next.js apps. |

### Supporting Libraries

| Library | Purpose | Confidence |
|---------|---------|------------|
| **@tanstack/react-query** | Client-side data fetching, caching, optimistic updates | High |
| **zustand** | Lightweight client state management (UI state, not server state) | High |
| **zod** | Schema validation (forms, API inputs, env vars) | High |
| **@aws-sdk/client-s3** | R2 file upload/download (S3-compatible) | High |
| **react-hook-form** | Form handling with zod resolver | High |
| **lucide-react** | Icon library (pairs with shadcn/ui) | High |
| **date-fns** | Date formatting/manipulation | Medium |
| **@tiptap/react** | Rich text editor for notes module | Medium |

## What NOT to Use

| Technology | Reason |
|-----------|--------|
| **Prisma** | Heavier than Drizzle, slower cold starts on serverless, larger bundle. Drizzle is the modern choice for Neon + serverless. |
| **Supabase (DB)** | Suspends after 1 week inactivity on free tier. Neon scale-to-zero is better for personal dashboards. |
| **NextAuth / Auth.js** | Less comprehensive than Better Auth. No built-in organization/invite system. Better Auth has first-class plugin ecosystem. |
| **Clerk** | Vendor lock-in, 10k MAU limit on free tier. Better Auth is open source and unlimited. |
| **MongoDB** | Relational data (users, orgs, kanban boards, tasks) fits PostgreSQL better. No need for document DB. |
| **Redux** | Overkill for this project. Zustand + React Query covers all state needs with less boilerplate. |
| **Cloudflare Pages** | While CF ecosystem is appealing, Next.js on CF Pages has limitations (no full ISR, limited middleware). Vercel is the gold standard for Next.js. |
| **Material UI / Ant Design** | Heavy, opinionated, hard to customize. shadcn/ui gives full control with Tailwind. |

## Stack Diagram

```
┌─────────────────────────────────────────────┐
│                  Vercel                      │
│  ┌─────────────────────────────────────┐    │
│  │         Next.js 15 (App Router)      │    │
│  │  ┌──────────┐  ┌──────────────────┐ │    │
│  │  │  React 19 │  │  Server Actions  │ │    │
│  │  │  shadcn   │  │  Route Handlers  │ │    │
│  │  │  Tailwind │  │  Better Auth     │ │    │
│  │  └──────────┘  └──────────────────┘ │    │
│  └─────────────────────────────────────┘    │
└──────────────┬──────────────┬───────────────┘
               │              │
    ┌──────────▼──┐    ┌──────▼──────┐
    │ Neon Postgres│    │ Cloudflare  │
    │ (Drizzle)   │    │ R2 (files)  │
    └─────────────┘    └─────────────┘
               │
    ┌──────────▼──────────┐
    │ CF Worker (Vclass)  │
    │ pushes data via API │
    └─────────────────────┘
```

---
*Researched: 2026-03-31*
