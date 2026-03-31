# Notella

## What This Is

Notella is a personal ultimate dashboard — an all-in-one productivity hub for managing files, bookmarks, tasks, notes, and finances. It features a sidebar-navigated web interface with multi-user auth so the owner can invite others to collaborate (e.g., on kanban boards). Built on free-tier infrastructure, designed to be modular so new features can be added without major refactoring.

## Core Value

A single, self-owned dashboard that consolidates all personal productivity tools — files, bookmarks, tasks, notes, finances — in one place, eliminating the need for multiple scattered services.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Auth system with registration, login, session management
- [ ] Multi-user: invite anyone via link, role-based access
- [ ] Dynamic kanban board system — generic boards usable for any purpose
- [ ] Vclass integration — existing CF Worker feeds task data into kanban tracking
- [ ] File storage — upload/download via Cloudflare R2
- [ ] URL/bookmark manager — save, organize, tag links
- [ ] Notes — rich text editor, markdown support
- [ ] Finance tracker — record expenses, categorize, view summaries
- [ ] Sidebar navigation dashboard layout
- [ ] Modular architecture — easy to add new feature modules

### Out of Scope

- Mobile native app — web-first, responsive is enough for v1
- Real-time chat — not core to productivity dashboard
- Calendar/scheduling — defer to future milestone
- Habit tracker — defer to future milestone
- Pomodoro timer — defer to future milestone
- Password manager — security complexity too high for v1
- Rebuilding vclass scraper inside Notella — leverage existing CF Worker

## Context

- Owner is a Gunadarma university student who already has a working Vclass Discord bot (Cloudflare Worker + KV + Moodle scraping)
- The vclass bot runs on hourly cron, detects new tasks/forums, sends smart reminders to Discord
- Notella should consume vclass data (not rebuild the scraper) — the CF Worker can push data to Notella's API or Notella can read from KV
- "Mega project" mindset — the owner expects this to grow significantly over time, so architecture must be extensible
- All infrastructure must be free-tier: Cloudflare R2 for files, free DB, free hosting
- Multi-user is for general invites (friends, helpers, classmates) — not just campus-specific
- Dashboard style: sidebar navigation, each feature is its own page/section

## Constraints

- **Budget**: Zero cost — all services must fit within free tiers
- **Storage**: Cloudflare R2 (10GB free tier for file storage)
- **Extensibility**: Architecture must support adding new modules without touching existing ones
- **Existing infra**: Vclass CF Worker must remain operational — Notella integrates, not replaces
- **Auth**: Must support multi-user with invite system and role-based permissions

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Keep vclass bot as separate CF Worker | Already working, battle-tested, no need to rebuild | — Pending |
| Cloudflare R2 for file storage | Free 10GB tier, S3-compatible, pairs well with CF ecosystem | — Pending |
| Free-tier deploy stack | Owner wants zero cost, will be determined by research | — Pending |
| Generic kanban system | Kanban is a platform feature, not tied to vclass — any module can create boards | — Pending |
| Modular plugin-like architecture | Mega project needs extensibility without refactoring core | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-31 after initialization*
