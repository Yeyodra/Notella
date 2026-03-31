# Research Summary: Notella

**Domain:** Personal all-in-one productivity dashboard
**Date:** 2026-03-31

## Stack Decision

| Layer | Choice | Confidence |
|-------|--------|------------|
| Frontend | Next.js 15 (App Router) + React 19 + TypeScript | High |
| Styling | Tailwind CSS 4 + shadcn/ui | High |
| ORM | Drizzle ORM | High |
| Database | Neon PostgreSQL (serverless) | High |
| Auth | Better Auth + Organization plugin | High |
| File Storage | Cloudflare R2 (S3-compatible) | High |
| Deployment | Vercel (Hobby/Free) | High |
| State | @tanstack/react-query + zustand | High |
| Rich Text | TipTap (for notes module) | Medium |
| Validation | zod + react-hook-form | High |

**Why this stack:** Next.js + Drizzle + Neon + Better Auth is becoming the standard 2025/2026 full-stack TypeScript combo. There's even a starter kit specifically for this stack. All free-tier compatible. Modular by design.

## Table Stakes Features

Features that MUST be in v1 or the product is unusable:

- **Auth:** Email/password signup, login, session persistence, logout
- **Multi-user:** Invite via link/email, role-based access (owner/admin/member)
- **Dashboard:** Sidebar nav, home overview page, dark mode, responsive
- **Kanban:** CRUD boards/columns/cards, drag & drop, card details, generic (any purpose)
- **Files:** Upload/download via R2 presigned URLs, file list, delete
- **Bookmarks:** Save URL with title, list view, tags, delete
- **Notes:** CRUD with rich text (TipTap), note list, folders
- **Finance:** Add income/expense, category, monthly summary
- **Vclass:** Display pending tasks in kanban, CF Worker pushes data via webhook API

## Key Architecture Decisions

1. **Modular monolith** — NOT microservices. Each feature is a route group in Next.js App Router with its own components, actions, and schema file. Modules share DB, not code.

2. **Module registry pattern** — Sidebar reads from a config array. Adding a module = adding an entry + route group. No refactoring core.

3. **Presigned URL uploads** — Files go direct to R2 from browser. Never proxy through Vercel (4.5MB limit).

4. **CF Worker integration** — Existing vclass worker POSTs to `/api/webhooks/vclass` with API key auth. Idempotent upserts keyed on vclass event ID.

5. **Organization-scoped data** — Better Auth org plugin provides multi-tenant context. Boards/files can be personal or shared within an org.

## Top Pitfalls to Watch

| # | Pitfall | Severity | When |
|---|---------|----------|------|
| 1 | Scope creep ("just one more module") | HIGH | All phases |
| 2 | Permission leaks (missing userId filter) | HIGH | All phases |
| 3 | Neon 0.5GB storage limit | MEDIUM | Phase 1, 4, 6 |
| 4 | R2 upload through server (hits Vercel size limit) | MEDIUM | Phase 4 |
| 5 | Better Auth + Drizzle schema conflicts | MEDIUM | Phase 1 |
| 6 | Vclass sync duplicates / stale data | MEDIUM | Phase 3 |

## Recommended Build Order

```
Phase 1: Auth + DB + Dashboard Shell
Phase 2: Kanban Boards
Phase 3: Vclass Integration
Phase 4: File Storage (R2)
Phase 5: Bookmarks
Phase 6: Notes
Phase 7: Finance Tracker
```

Phases 4-6 are independent and could be parallelized. Phase 7 is fully standalone.

## Free Tier Budget

| Service | Limit | Expected Usage |
|---------|-------|----------------|
| Vercel | 100GB bandwidth, 100 deploys/day | Well within limits |
| Neon | 0.5GB storage, 191.9 compute hrs | Monitor DB size |
| Cloudflare R2 | 10GB storage, 10M requests | Depends on file usage |
| Better Auth | Unlimited (self-hosted) | N/A |

**Total cost: $0/month** if usage stays within free tiers.

---
*Synthesized: 2026-03-31*
