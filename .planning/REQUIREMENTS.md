# Requirements: Notella

**Defined:** 2026-03-31
**Core Value:** A single, self-owned dashboard that consolidates all personal productivity tools in one place

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Authentication

- [ ] **AUTH-01**: User can create account with email and password
- [ ] **AUTH-02**: User can log in and stay logged in across browser refresh
- [ ] **AUTH-03**: User can log out from any page
- [ ] **AUTH-04**: User can set display name and avatar on their profile
- [ ] **AUTH-05**: User can log in with Google OAuth
- [ ] **AUTH-06**: Owner can assign roles (owner/admin/member) to users within an organization
- [ ] **AUTH-07**: User can invite others to join via email/link (required for role-based access)

### Dashboard & Navigation

- [ ] **DASH-01**: User sees a sidebar with links to all active modules (collapsible)
- [ ] **DASH-02**: User sees a home dashboard page with summary cards (task count, recent activity)
- [ ] **DASH-03**: Dashboard is responsive and usable on mobile (375px+)
- [ ] **DASH-04**: User can toggle dark mode / light mode

### Kanban

- [ ] **KANB-01**: User can create, rename, and delete boards
- [ ] **KANB-02**: User can add, rename, reorder, and delete columns on a board
- [ ] **KANB-03**: User can create, edit, and delete cards with title, description, due date, and assignee
- [ ] **KANB-04**: User can drag and drop cards between columns to change status
- [ ] **KANB-05**: Boards are generic — any module (vclass, personal, etc.) can create a board via a `source` field

### Bookmarks

- [ ] **BOOK-01**: User can save a URL with title and optional description
- [ ] **BOOK-02**: User can view bookmarks in a list and open them in a new tab
- [ ] **BOOK-03**: User can delete saved bookmarks
- [ ] **BOOK-04**: System auto-fetches page title and favicon when saving a URL
- [ ] **BOOK-05**: User can search bookmarks by title or URL keyword

### Notes

- [ ] **NOTE-01**: User can create, edit, and delete plain text notes with a title
- [ ] **NOTE-02**: User can view a list of notes with title and date

### Vclass Integration

- [ ] **VCLS-01**: Existing CF Worker pushes pending vclass tasks to Notella via webhook API
- [ ] **VCLS-02**: Vclass tasks appear as cards on a dedicated kanban board with deadline and course name
- [ ] **VCLS-03**: Cards show urgency level (color-coded: red <24h, yellow 1-3 days, green >3 days)
- [ ] **VCLS-04**: Cards link to the original vclass task URL
- [ ] **VCLS-05**: User can manually override task status in Notella (mark done regardless of vclass)

## v2 Requirements

Deferred to future releases. Tracked but not in current roadmap.

### File Storage

- **FILE-01**: User can upload files via drag & drop or file picker (R2 presigned URLs)
- **FILE-02**: User can download and delete uploaded files
- **FILE-03**: User can organize files in nested folders
- **FILE-04**: User can preview images and PDFs inline
- **FILE-05**: User can search files by name

### Finance Tracker

- **FINC-01**: User can add income/expense entries with amount, category, date, note
- **FINC-02**: User can view, edit, and delete transactions
- **FINC-03**: User can see monthly spending summary
- **FINC-04**: User can create custom expense categories
- **FINC-05**: User can view spending charts by category

### Notes (Enhanced)

- **NOTE-03**: Notes support rich text editing (bold, italic, headings, lists)
- **NOTE-04**: User can organize notes into folders
- **NOTE-05**: User can search within note content
- **NOTE-06**: User can pin important notes to top

### Kanban (Enhanced)

- **KANB-06**: User can add color-coded labels/tags to cards
- **KANB-07**: User can filter cards by assignee, label, or due date
- **KANB-08**: User can add comments on cards

### Dashboard (Enhanced)

- **DASH-05**: Command palette (Cmd+K) for quick search and navigation

## Out of Scope

| Feature | Reason |
|---------|--------|
| Mobile native app | Web-first, responsive is enough |
| Real-time chat | Not core to productivity dashboard |
| Calendar/scheduling | Defer to future milestone |
| Habit tracker | Defer to future milestone |
| Pomodoro timer | Defer to future milestone |
| Password manager | Security complexity too high |
| Rebuild vclass scraper | Already exists as CF Worker — integrate, don't rebuild |
| Real-time collaborative editing | Too complex for personal dashboard |
| Backlinks / knowledge graph | Scope creep — not Obsidian |
| Bank account sync | API costs + security concerns |
| Browser extension | Separate project |
| 2FA / SSO | Enterprise features, not needed for personal use |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Phase 1 | Pending |
| AUTH-02 | Phase 1 | Pending |
| AUTH-03 | Phase 1 | Pending |
| AUTH-04 | Phase 1 | Pending |
| AUTH-05 | Phase 1 | Pending |
| AUTH-06 | Phase 1 | Pending |
| AUTH-07 | Phase 1 | Pending |
| DASH-01 | Phase 1 | Pending |
| DASH-02 | Phase 6 | Pending |
| DASH-03 | Phase 1 | Pending |
| DASH-04 | Phase 1 | Pending |
| KANB-01 | Phase 2 | Pending |
| KANB-02 | Phase 2 | Pending |
| KANB-03 | Phase 2 | Pending |
| KANB-04 | Phase 2 | Pending |
| KANB-05 | Phase 2 | Pending |
| BOOK-01 | Phase 4 | Pending |
| BOOK-02 | Phase 4 | Pending |
| BOOK-03 | Phase 4 | Pending |
| BOOK-04 | Phase 4 | Pending |
| BOOK-05 | Phase 4 | Pending |
| NOTE-01 | Phase 5 | Pending |
| NOTE-02 | Phase 5 | Pending |
| VCLS-01 | Phase 3 | Pending |
| VCLS-02 | Phase 3 | Pending |
| VCLS-03 | Phase 3 | Pending |
| VCLS-04 | Phase 3 | Pending |
| VCLS-05 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 28 total
- Mapped to phases: 28
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-31*
*Last updated: 2026-03-31 after initial definition*
