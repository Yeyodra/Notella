# Roadmap: Notella

**Created:** 2026-03-31
**Milestone:** v1.0
**Granularity:** Standard (5-7 phases)
**Total Requirements:** 28

## Overview

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|--------------|------------------|
| 1 | Foundation | Auth, DB, app shell with sidebar | AUTH-01..07, DASH-01, DASH-03, DASH-04 | 10 |
| 2 | Kanban System | Generic kanban boards with drag & drop | KANB-01..05 | 5 |
| 3 | Vclass Integration | CF Worker → Notella kanban bridge | VCLS-01..05 | 5 |
| 4 | Bookmarks | Save, manage, search bookmarks | BOOK-01..05 | 5 |
| 5 | Notes | Basic note-taking | NOTE-01..02 | 2 |
| 6 | Dashboard Home | Overview page with summary cards | DASH-02 | 1 |

## Phase Details

### Phase 1: Foundation
**Goal:** Set up the project infrastructure — Next.js app, Neon database, Better Auth with org/invite plugin, and the dashboard shell (sidebar + layout + dark mode + responsive).

**UI hint**: yes

**Requirements:**
- AUTH-01: User can create account with email and password
- AUTH-02: User can log in and stay logged in across browser refresh
- AUTH-03: User can log out from any page
- AUTH-04: User can set display name and avatar on their profile
- AUTH-05: User can log in with Google OAuth
- AUTH-06: Owner can assign roles (owner/admin/member) to users within an organization
- AUTH-07: User can invite others to join via email/link
- DASH-01: User sees a sidebar with links to all active modules (collapsible)
- DASH-03: Dashboard is responsive and usable on mobile (375px+)
- DASH-04: User can toggle dark mode / light mode

**Success Criteria:**
1. User can sign up with email/password and log in — session persists after browser refresh
2. User can log in with Google OAuth and reach the dashboard
3. User can create an organization and invite another user via email link
4. Invited user can accept invite and see shared workspace — role visible in settings
5. Sidebar shows all module links (even if pages are placeholder), collapses on mobile
6. Dark mode toggle works and persists across sessions
7. All auth pages (sign-in, sign-up) render correctly on 375px mobile viewport

**Dependencies:** None — this is the foundation.

---

### Phase 2: Kanban System
**Goal:** Build a fully functional generic kanban board system — CRUD for boards/columns/cards, drag & drop, card details, assignee support. Boards are generic via `source` field.

**UI hint**: yes

**Requirements:**
- KANB-01: User can create, rename, and delete boards
- KANB-02: User can add, rename, reorder, and delete columns on a board
- KANB-03: User can create, edit, and delete cards with title, description, due date, and assignee
- KANB-04: User can drag and drop cards between columns to change status
- KANB-05: Boards are generic — any module can create a board via a `source` field

**Success Criteria:**
1. User can create a new board, add 3+ columns, and create cards in each
2. User can drag a card from one column to another — card stays in new position after page refresh
3. Card detail dialog shows title, description, due date, assignee — all editable
4. User can delete a board and all its columns/cards are removed
5. Board has a `source` field in DB that distinguishes "personal" from "vclass" boards

**Dependencies:** Phase 1 (auth + DB + sidebar).

---

### Phase 3: Vclass Integration
**Goal:** Connect the existing CF Worker to Notella — worker pushes vclass tasks via webhook API, tasks appear as kanban cards with deadline/urgency/links.

**Requirements:**
- VCLS-01: Existing CF Worker pushes pending vclass tasks to Notella via webhook API
- VCLS-02: Vclass tasks appear as cards on a dedicated kanban board with deadline and course name
- VCLS-03: Cards show urgency level (color-coded: red <24h, yellow 1-3 days, green >3 days)
- VCLS-04: Cards link to the original vclass task URL
- VCLS-05: User can manually override task status in Notella (mark done regardless of vclass)

**Success Criteria:**
1. API endpoint `/api/webhooks/vclass` accepts POST with API key auth — returns 200 on valid payload
2. CF Worker sends task data to Notella — tasks appear as cards on a "Vclass" kanban board
3. Cards show urgency colors: red (<24h), yellow (1-3 days), green (>3 days) based on deadline
4. Clicking a card's link opens the original vclass task page in new tab
5. User can drag a vclass card to "Done" column — status persists even if CF Worker re-sends the task

**Dependencies:** Phase 2 (kanban must exist).

---

### Phase 4: Bookmarks
**Goal:** Build the bookmark manager — save URLs with auto-fetched titles/favicons, search, delete.

**UI hint**: yes

**Requirements:**
- BOOK-01: User can save a URL with title and optional description
- BOOK-02: User can view bookmarks in a list and open them in a new tab
- BOOK-03: User can delete saved bookmarks
- BOOK-04: System auto-fetches page title and favicon when saving a URL
- BOOK-05: User can search bookmarks by title or URL keyword

**Success Criteria:**
1. User pastes a URL — system auto-fills title and favicon, user can save with optional description
2. Bookmark list shows title, favicon, URL, and date — clicking opens in new tab
3. User can delete a bookmark — it disappears from the list
4. Search input filters bookmarks in real-time by title or URL substring
5. Bookmarks are scoped to user — User A cannot see User B's bookmarks

**Dependencies:** Phase 1 (auth + DB). Independent of Phase 2/3.

---

### Phase 5: Notes
**Goal:** Basic note-taking — create, edit, delete plain text notes with title and list view.

**UI hint**: yes

**Requirements:**
- NOTE-01: User can create, edit, and delete plain text notes with a title
- NOTE-02: User can view a list of notes with title and date

**Success Criteria:**
1. User can create a note with title and content — saved to DB
2. User can edit an existing note — changes persist
3. User can delete a note — removed from list
4. Note list shows all notes sorted by last modified date
5. Notes are scoped to user — User A cannot see User B's notes

**Dependencies:** Phase 1 (auth + DB). Independent of Phase 2/3/4.

---

### Phase 6: Dashboard Home
**Goal:** Build the dashboard overview page with summary cards showing activity across all modules.

**UI hint**: yes

**Requirements:**
- DASH-02: User sees a home dashboard page with summary cards (task count, recent activity)

**Success Criteria:**
1. Dashboard home shows summary cards: total boards, pending tasks, total bookmarks, total notes
2. Cards show real counts from the database — not hardcoded
3. Dashboard renders correctly on desktop and mobile viewports

**Dependencies:** Phases 2-5 (needs data from all modules to summarize).

---

## Requirement Coverage

All 28 v1 requirements mapped:

| Phase | Requirements | Count |
|-------|-------------|-------|
| Phase 1 | AUTH-01..07, DASH-01, DASH-03, DASH-04 | 10 |
| Phase 2 | KANB-01..05 | 5 |
| Phase 3 | VCLS-01..05 | 5 |
| Phase 4 | BOOK-01..05 | 5 |
| Phase 5 | NOTE-01..02 | 2 |
| Phase 6 | DASH-02 | 1 |
| **Total** | | **28** |

**Unmapped:** 0 ✓

## Phase Dependencies

```
Phase 1 (Foundation)
   │
   ├── Phase 2 (Kanban) ── Phase 3 (Vclass)
   │
   ├── Phase 4 (Bookmarks)  ← independent
   │
   ├── Phase 5 (Notes)      ← independent
   │
   └── Phase 6 (Dashboard Home) ← depends on 2-5
```

Phases 4 and 5 can run in parallel with Phase 2/3.

---
*Roadmap created: 2026-03-31*
*Last updated: 2026-03-31 after removing GitHub OAuth (AUTH-06)*
