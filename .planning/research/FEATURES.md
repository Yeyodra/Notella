# Features Research: Notella

**Domain:** Personal all-in-one productivity dashboard
**Date:** 2026-03-31
**Comparable products:** Notion, Heptabase, Anytype, AppFlowy, Obsidian, Todoist, Linear

## Feature Categories

### 1. Authentication & Multi-User

**Table Stakes:**
- Email/password signup and login — Complexity: Low
- Session persistence across browser refresh — Complexity: Low
- Logout from any page — Complexity: Low
- User profile (name, avatar) — Complexity: Low

**Differentiators:**
- Invite system via link/email — Complexity: Medium (Better Auth organization plugin handles this)
- Role-based access (owner, admin, member) — Complexity: Medium
- OAuth login (Google, GitHub) — Complexity: Low (Better Auth supports this)
- Magic link login — Complexity: Low (Better Auth plugin)

**Anti-features:**
- 2FA — Complexity: Medium. Not needed for v1 personal dashboard.
- SSO/SAML — Enterprise feature, irrelevant.

**Dependencies:** Auth is foundational — everything depends on it.

---

### 2. Dashboard & Navigation

**Table Stakes:**
- Sidebar navigation with collapsible sections — Complexity: Low
- Dashboard home page with overview/summary — Complexity: Medium
- Responsive layout (mobile-friendly) — Complexity: Medium
- Dark mode — Complexity: Low (Tailwind + shadcn built-in)

**Differentiators:**
- Customizable dashboard widgets (drag/rearrange summary cards) — Complexity: High
- Quick search / command palette (Cmd+K) — Complexity: Medium
- Breadcrumb navigation — Complexity: Low

**Anti-features:**
- Notion-style block editor for dashboards — Over-engineered for v1.
- Custom themes/colors — Nice-to-have, not v1.

**Dependencies:** Sidebar nav must exist before any module can be accessed.

---

### 3. Kanban Boards

**Table Stakes:**
- Create/edit/delete boards — Complexity: Low
- Create/edit/delete columns (statuses) — Complexity: Low
- Create/edit/delete cards (tasks) — Complexity: Low
- Drag and drop cards between columns — Complexity: Medium
- Card details: title, description, due date, assignee — Complexity: Medium

**Differentiators:**
- Generic/dynamic boards — any module can create a board (vclass, personal, project) — Complexity: Medium
- Labels/tags on cards — Complexity: Low
- Filters (by assignee, label, due date) — Complexity: Medium
- Multiple board views (kanban, list, table) — Complexity: High
- Card comments — Complexity: Medium

**Anti-features:**
- Gantt chart view — Too complex for v1.
- Sub-tasks / checklists within cards — Nice-to-have, defer.
- Time tracking per card — Scope creep.

**Dependencies:** Depends on auth (card ownership, assignees). Vclass integration depends on kanban API being available.

---

### 4. File Storage

**Table Stakes:**
- Upload files (drag & drop + file picker) — Complexity: Medium
- Download files — Complexity: Low
- File list with name, size, type, date — Complexity: Low
- Delete files — Complexity: Low

**Differentiators:**
- Folder organization (nested folders) — Complexity: Medium
- File preview (images, PDFs) — Complexity: Medium
- Search files by name — Complexity: Low
- File sharing links (public/private) — Complexity: Medium

**Anti-features:**
- Real-time collaborative editing (Google Docs style) — Way too complex.
- File versioning — Defer.
- Video streaming — Bandwidth cost.

**Dependencies:** Depends on auth (file ownership). R2 backend independent of other modules.

---

### 5. URL / Bookmark Manager

**Table Stakes:**
- Save URL with title and optional description — Complexity: Low
- List/grid view of bookmarks — Complexity: Low
- Delete bookmarks — Complexity: Low
- Open bookmark in new tab — Complexity: Low

**Differentiators:**
- Auto-fetch page title and favicon from URL — Complexity: Medium
- Tags/categories for organizing — Complexity: Low
- Search bookmarks — Complexity: Low
- Bookmark collections/folders — Complexity: Medium
- Import/export bookmarks — Complexity: Medium

**Anti-features:**
- Full page archiving (Pocket-style) — Storage-heavy, defer.
- Browser extension for saving — Separate project, defer.
- Web page screenshot thumbnails — Complex, defer.

**Dependencies:** Depends on auth only. Independent module.

---

### 6. Notes

**Table Stakes:**
- Create/edit/delete notes — Complexity: Low
- Rich text editing (bold, italic, headings, lists) — Complexity: Medium (TipTap)
- Note list with title and preview — Complexity: Low

**Differentiators:**
- Markdown support — Complexity: Low (TipTap extension)
- Note folders/categories — Complexity: Low
- Search within notes — Complexity: Medium
- Code blocks with syntax highlighting — Complexity: Low (TipTap extension)
- Note pinning — Complexity: Low

**Anti-features:**
- Real-time collaborative editing — Too complex for v1.
- Backlinks / knowledge graph (Obsidian-style) — Scope creep.
- PDF export — Nice-to-have, defer.
- AI summarization — Defer.

**Dependencies:** Depends on auth only. Independent module.

---

### 7. Finance Tracker

**Table Stakes:**
- Add income/expense entries with amount, category, date, note — Complexity: Low
- View transaction list — Complexity: Low
- Monthly/weekly summary — Complexity: Medium
- Edit/delete entries — Complexity: Low

**Differentiators:**
- Category management (custom categories) — Complexity: Low
- Charts/visualizations (monthly spending by category) — Complexity: Medium
- Budget setting per category — Complexity: Medium
- Recurring transactions — Complexity: Medium

**Anti-features:**
- Bank account sync — API costs, security concerns.
- Invoice generation — Different product.
- Multi-currency — Complexity for v1.

**Dependencies:** Depends on auth only. Independent module.

---

### 8. Vclass Integration

**Table Stakes:**
- Display pending vclass tasks in a kanban board — Complexity: Medium
- Show deadline, course name, urgency level — Complexity: Low
- Link to original vclass task URL — Complexity: Low

**Differentiators:**
- Automatic status sync (CF Worker pushes updates) — Complexity: Medium
- Manual task status override (mark as done in Notella) — Complexity: Low
- New task notification within dashboard — Complexity: Medium

**Anti-features:**
- Rebuild vclass scraper inside Notella — Already exists as CF Worker.
- Forum integration — Defer to future.

**Dependencies:** Depends on kanban module + API endpoint for CF Worker to push data.

---

## Feature Dependency Graph

```
Auth ──────────────────────────────────────────┐
  │                                             │
  ├── Dashboard/Sidebar ──┬── Kanban ◄── Vclass │
  │                       ├── Files             │
  │                       ├── Bookmarks         │
  │                       ├── Notes             │
  │                       └── Finance           │
  │                                             │
  └── Multi-user (org/invite) ─────────────────┘
```

## Recommended Build Order

1. **Auth + Dashboard shell** (foundation)
2. **Kanban** (most complex, core feature, vclass depends on it)
3. **Vclass integration** (extends kanban)
4. **Files** (independent module)
5. **Bookmarks** (simplest module — quick win)
6. **Notes** (needs rich text editor)
7. **Finance** (independent, can be last)

---
*Researched: 2026-03-31*
