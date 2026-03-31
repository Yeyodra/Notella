# Pitfalls Research: Notella

**Domain:** Personal all-in-one productivity dashboard
**Date:** 2026-03-31

## Critical Pitfalls

### 1. Scope Creep (The "Mega Project" Trap)

**Risk:** HIGH
**Warning signs:** Adding features before existing ones are stable. "Just one more module" syndrome.
**Prevention:**
- Ship auth + kanban first. Use it for a week before adding more modules.
- Each module must be fully functional before starting the next.
- v1 = 7 modules maximum. Resist temptation to add more.
**Phase impact:** All phases — especially requirements scoping.

### 2. Neon Free Tier Storage Limit (0.5GB)

**Risk:** MEDIUM
**Warning signs:** Storing large text blobs (full note content) or file metadata with base64 previews in DB.
**Prevention:**
- Notes: Store content as text, not rich JSON. Or use TipTap JSON which is compact.
- Files: Store metadata only in DB, actual files in R2. Never store file bytes in PostgreSQL.
- Finance: Numeric data is tiny — not a concern.
- Monitor: Add a health check that queries `pg_database_size()`.
**Phase impact:** Phase 1 (DB setup), Phase 4 (files), Phase 6 (notes).

### 3. R2 Upload Complexity

**Risk:** MEDIUM
**Warning signs:** Trying to upload files through Next.js API routes (4.5MB body limit on Vercel serverless).
**Prevention:**
- Use **presigned URLs** — client uploads directly to R2, bypassing Vercel size limits.
- Flow: client → get presigned URL from API → upload to R2 directly → confirm to API.
- Never proxy file bytes through your server.
**Phase impact:** Phase 4 (file storage).

### 4. Better Auth + Drizzle Schema Conflicts

**Risk:** MEDIUM
**Warning signs:** Auth migration fails, tables collide, schema push breaks existing data.
**Prevention:**
- Let Better Auth generate its tables first (`npx @better-auth/cli generate`).
- Use a separate schema file for auth tables (`schema/auth.ts`).
- Run `drizzle-kit push` carefully — always check the migration SQL before applying.
- Test auth flow in dev before any other module.
**Phase impact:** Phase 1 (auth setup).

### 5. Multi-User Permission Leaks

**Risk:** HIGH
**Warning signs:** User A can see User B's private data. No `WHERE userId = ?` on queries.
**Prevention:**
- Every query must filter by `userId` or `organizationId`. No exceptions.
- Create helper functions: `getUserBoards(userId)`, not raw `db.select()`.
- Add middleware/wrapper that automatically injects user context.
- Test with 2+ accounts from day 1.
**Phase impact:** All phases — especially Phase 1 (auth), Phase 2 (kanban).

### 6. Vclass CF Worker ↔ Notella Sync Issues

**Risk:** MEDIUM
**Warning signs:** Duplicate tasks, stale data, missed updates, CF Worker can't reach Notella API.
**Prevention:**
- Use idempotent upserts keyed on vclass event `id`.
- CF Worker sends webhook with API key auth — store key as env var.
- Handle CF Worker failures gracefully (retry logic, dead letter logging).
- Don't assume vclass data is always available — show "last synced" timestamp.
**Phase impact:** Phase 3 (vclass integration).

### 7. Vercel Serverless Cold Starts + Function Timeout

**Risk:** LOW-MEDIUM
**Warning signs:** Slow initial page loads, API timeouts on complex queries.
**Prevention:**
- Keep serverless functions lean — no heavy imports at top level.
- Use `neon-http` driver (HTTP, not WebSocket) for serverless — faster cold starts.
- Vercel free tier: 10s function timeout. Ensure no query takes >5s.
- Use React Server Components to minimize client-server round trips.
**Phase impact:** Phase 1 (infrastructure setup).

### 8. Dashboard UX Becomes Overwhelming

**Risk:** MEDIUM
**Warning signs:** 7+ sidebar items, each with sub-pages. User doesn't know where things are.
**Prevention:**
- Collapsible sidebar sections (pinned vs all modules).
- Dashboard home shows summary cards, not everything at once.
- Consistent navigation pattern across all modules.
- Don't expose all features at once — progressive disclosure.
**Phase impact:** Phase 1 (dashboard shell), ongoing.

### 9. Rich Text Editor Performance

**Risk:** LOW-MEDIUM
**Warning signs:** TipTap editor freezes on large notes, high memory usage.
**Prevention:**
- Lazy-load TipTap only on the notes module (dynamic import).
- Limit note size in UI (warn at 50KB content).
- Don't load all notes at once — paginate note list.
- Use TipTap's `StarterKit` — don't include unnecessary extensions.
**Phase impact:** Phase 6 (notes).

### 10. Missing Error States and Empty States

**Risk:** MEDIUM
**Warning signs:** Blank pages when no data exists. Cryptic errors when API fails.
**Prevention:**
- Design empty states for every module ("No boards yet — create one").
- Error boundaries at module level (one module crashing doesn't break others).
- Loading skeletons for every page.
- Toast notifications for mutations (success/error).
**Phase impact:** All phases.

## Common Mistakes in Similar Projects

| Mistake | Why it Happens | Prevention |
|---------|---------------|------------|
| Building auth last | "I'll add login later" | Auth is Phase 1. Everything depends on it. |
| No data model upfront | "I'll figure out the schema as I go" | Design full schema in Phase 1, even for future modules. |
| Tight coupling between modules | "Just import from ../kanban" | Modules share DB, not code. Cross-module = DB query. |
| No mobile responsiveness | "Desktop only for now" | Tailwind responsive from day 1. Test on 375px width. |
| Over-engineering early | "Let's add real-time, AI, analytics" | Ship core features. Add polish after validation. |

---
*Researched: 2026-03-31*
