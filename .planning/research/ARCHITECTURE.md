# Architecture Research: Notella

**Domain:** Modular personal productivity dashboard
**Date:** 2026-03-31

## System Overview

Notella follows a **modular monolith** architecture inside a Next.js App Router application. Each feature (kanban, files, notes, etc.) is an independent module with its own routes, schema, and API — but they share a common auth layer, database, and UI system.

This is NOT a microservices architecture — that's overkill for a personal dashboard. It's a well-structured monolith where modules can be added/removed without touching others.

## Component Architecture

### 1. Core Layer (Shared Foundation)

```
src/
├── lib/
│   ├── auth.ts              # Better Auth server config
│   ├── auth-client.ts       # Better Auth client
│   ├── db/
│   │   ├── index.ts          # Drizzle + Neon connection
│   │   ├── schema/
│   │   │   ├── index.ts      # Re-exports all schemas
│   │   │   ├── auth.ts       # Better Auth tables (auto-generated)
│   │   │   ├── kanban.ts     # Kanban boards, columns, cards
│   │   │   ├── files.ts      # File metadata
│   │   │   ├── bookmarks.ts  # Bookmarks
│   │   │   ├── notes.ts      # Notes
│   │   │   └── finance.ts    # Transactions, categories
│   │   └── migrations/       # Drizzle Kit migrations
│   ├── r2.ts                 # Cloudflare R2 client (S3 SDK)
│   └── utils.ts              # Shared utilities
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── layout/
│   │   ├── sidebar.tsx       # Main sidebar nav
│   │   ├── header.tsx        # Top bar with user menu
│   │   └── app-shell.tsx     # Dashboard shell wrapper
│   └── shared/               # Shared components (empty states, loading, etc.)
```

### 2. Module Layer (Feature Modules)

Each module follows the same structure:

```
src/app/(dashboard)/
├── kanban/
│   ├── page.tsx              # Board list page
│   ├── [boardId]/
│   │   └── page.tsx          # Single board view
│   ├── _components/          # Kanban-specific components
│   │   ├── board-view.tsx
│   │   ├── column.tsx
│   │   ├── card.tsx
│   │   └── card-dialog.tsx
│   └── _actions/             # Server Actions for kanban
│       ├── boards.ts
│       ├── columns.ts
│       └── cards.ts
├── files/
│   ├── page.tsx
│   ├── _components/
│   └── _actions/
├── bookmarks/
│   ├── page.tsx
│   ├── _components/
│   └── _actions/
├── notes/
│   ├── page.tsx
│   ├── [noteId]/
│   │   └── page.tsx
│   ├── _components/
│   └── _actions/
├── finance/
│   ├── page.tsx
│   ├── _components/
│   └── _actions/
└── settings/
    ├── page.tsx
    └── _components/
```

### 3. API Layer (External Integrations)

```
src/app/api/
├── auth/
│   └── [...all]/
│       └── route.ts          # Better Auth catch-all handler
├── webhooks/
│   └── vclass/
│       └── route.ts          # CF Worker pushes vclass data here
└── files/
    └── upload/
        └── route.ts          # R2 presigned URL generation
```

## Data Flow

### Internal Flow (User → Module)

```
User Browser
    │
    ▼
Next.js App Router (Server Component)
    │
    ├── Auth check (Better Auth middleware)
    │
    ├── Server Component renders with data
    │   └── Drizzle query → Neon PostgreSQL
    │
    └── Client Component for interactivity
        └── Server Action (mutation) → Drizzle → Neon
```

### External Flow (CF Worker → Notella)

```
CF Worker (hourly cron)
    │
    ▼
Scrapes Moodle Vclass
    │
    ▼
POST /api/webhooks/vclass
    │ (API key auth)
    ▼
Notella API Route Handler
    │
    ├── Upsert tasks into kanban cards
    │   └── Drizzle → Neon
    │
    └── Mark completed tasks
```

### File Upload Flow

```
Client
    │
    ├── 1. Request presigned URL
    │   └── POST /api/files/upload
    │       └── Generate R2 presigned URL
    │
    ├── 2. Upload directly to R2
    │   └── PUT [presigned-url] (file bytes)
    │
    └── 3. Confirm upload
        └── Server Action: save file metadata to DB
```

## Module Communication Pattern

Modules are **independent by default**. They share data through the database, not through direct imports.

```
Kanban Module ←────── Vclass Integration
    │                     (writes to kanban tables)
    │
    │ (no direct import)
    │
    ├── DB: kanban_boards, kanban_columns, kanban_cards
    │
    └── Generic API: any module can create a board
        with a `source` field (e.g., "vclass", "personal")
```

### Module Registry Pattern (for sidebar)

```typescript
// src/lib/modules.ts
export const modules = [
  { id: 'kanban', name: 'Kanban', icon: KanbanIcon, href: '/kanban' },
  { id: 'files', name: 'Files', icon: FolderIcon, href: '/files' },
  { id: 'bookmarks', name: 'Bookmarks', icon: BookmarkIcon, href: '/bookmarks' },
  { id: 'notes', name: 'Notes', icon: StickyNoteIcon, href: '/notes' },
  { id: 'finance', name: 'Finance', icon: WalletIcon, href: '/finance' },
] as const;

// Sidebar reads this array — adding a module = adding an entry
```

## Database Schema Design

### Key Design Principles

1. **Every table has `userId`** — multi-tenant by default
2. **Soft deletes optional** — use `deletedAt` timestamp where needed
3. **Timestamps everywhere** — `createdAt`, `updatedAt` on all tables
4. **Organization-scoped** — Better Auth org plugin provides org context; boards/files can be scoped to org

### Schema Relationships

```
users (Better Auth)
  └── organizations (Better Auth org plugin)
       └── members (role: owner/admin/member)

kanban_boards
  ├── userId (owner)
  ├── organizationId (nullable — personal or shared)
  └── source (string: "personal", "vclass", etc.)
       └── kanban_columns
            └── kanban_cards
                 ├── assigneeId → users
                 └── labels (jsonb or separate table)

files
  ├── userId
  ├── folderId (self-referencing for nested folders)
  ├── r2Key (R2 object key)
  └── organizationId (nullable)

bookmarks
  ├── userId
  ├── collectionId (nullable)
  └── tags (text array or jsonb)

notes
  ├── userId
  ├── folderId (nullable)
  └── content (text — serialized TipTap JSON or markdown)

finance_transactions
  ├── userId
  ├── categoryId → finance_categories
  ├── type (income/expense)
  └── amount (numeric)

finance_categories
  ├── userId
  └── name, icon, color
```

## Build Order (Dependency-Driven)

```
Phase 1: Foundation
  └── Auth + DB + App Shell (sidebar, layout)
       │
Phase 2: Core Feature
  └── Kanban (most complex, enables vclass)
       │
Phase 3: Integration
  └── Vclass → Kanban bridge (API endpoint + CF Worker update)
       │
Phase 4-6: Independent Modules (parallel-safe)
  ├── Files + R2
  ├── Bookmarks
  └── Notes
       │
Phase 7: Finance
  └── Finance Tracker (last — most standalone)
```

## Scalability Considerations

- **Neon free tier**: 0.5GB storage. Adequate for personal use. Monitor with `pg_database_size()`.
- **R2 free tier**: 10GB, 10M Class B requests/month. Track usage via CF dashboard.
- **Vercel free tier**: 100GB bandwidth, 100 deployments/day. More than enough for personal + small team use.
- **Cold starts**: Neon ~500ms, Vercel serverless ~200ms. Acceptable for personal dashboard.

---
*Researched: 2026-03-31*
