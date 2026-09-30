# Software Alternative — progress

## Objective
Implement the complete first release defined in prompt.MD. The initial workspace contained only that specification.

## Architecture
Next.js 16 App Router, React 19, strict TypeScript, plain responsive CSS and normalized SQLite. Server rendering for public routes; focused client components for autocomplete, filters, matcher and editor. No LLM dependency. A single Node 22 production container uses a persistent database volume and runs as a non-root user.

## Phases
0–14 implemented and verified: audit, architecture, database, catalogue, search, alternatives, scoring, comparisons, SEO, administration, analytics/monetization preparation, responsive/accessibility, testing, performance and security.
15 Production review: completed locally. Latest implementation and runtime verification completed on 2026-09-29; public launch awaits the external inputs listed below.

## Completed functionality
- 24 products; 20 taxonomy categories (9 active); 6 platforms; 18 feature definitions; 17 curated alternative relationships; 15 meaningful comparison pairs.
- Official product/project sources consulted 2026-09-21, with field coverage, dates and evidence notes. Later work has not silently refreshed verification dates.
- Exact/partial/alias/typo search and keyboard autocomplete.
- 19 AND-combined filters with persistent URL state; no fabricated support for unknown data.
- Deterministic weighted matching, hard requirements, mismatch penalties, data coverage and reconstructible factors. No payment affects scores.
- Software detail pages, editorial alternative explanations, comparison tables and an interactive matcher.
- Protected admin creation/editing, search, pagination, taxonomy, capabilities, pricing, sources, relationships, affiliate programs and editorial landings. Unknown/stale evidence review queue.
- Version-protected software edits and before/after audit snapshots.
- Metadata, canonical URLs, runtime public origin, Open Graph PNG, SoftwareApplication/ItemList/BreadcrumbList, sitemap and robots. Only one reviewed filter landing (free Photoshop alternatives) meets indexing criteria. Empty categories and query filters are noindex.
- Legal/info structures and explicit pending owner details.
- Provider-neutral in-memory analytics hooks; affiliate, sponsored and ad components. No ads, affiliate programs or analytics vendors are active.
- Loading, error, empty and not-found states.
- Complete README with local, production, Docker, editor, backup and update instructions.

## Database and migrations
001_initial.sql creates software, licenses, taxonomy/join tables, facts, plans, sources, alternative relationships, affiliate programs, landings, history, accounts, sessions and rate limits.
Fresh migration/seed and repeated seed verified. Existing editorial records are preserved. Foreign keys, WAL, transactions, busy timeout and optimistic versions enabled.
Docker creates and seeds the database on startup. Backup via SQLite's consistent backup API verified. A test category survived a container restart and authenticated reads.

## Verification completed (2026-09-25 baseline)
- TypeScript: passed.
- ESLint: passed.
- Vitest: 46 tests passed, including scoring state/weight combinations, unknowns, budgets, filters, aliases/typos, evidence validation, SEO, migrations, idempotent seed, persistence, SQL rollback, conflicts, passwords, sessions, origins and body limits.
- Production webpack build: passed on Windows and from a clean npm ci in Node 22 Docker.
- Playwright: 16 tests passed across desktop and mobile Chromium/Edge. Search, filters, matching, metadata, structured data, admin CRUD, auth/origin rejection, sitemap routes, internal links, true HTTP 404, responsive overflow and axe WCAG checks all passed.
- Expanded console-error capture: all 16 browser tests passed with no unexpected console or page errors.
- npm audit: 0 vulnerabilities, including development dependencies.
- Container health, catalogue, Open Graph PNG, runtime canonical origin, login, write/read, logout and persistence after restart: passed.
- Backup created in the persistent volume.
- Final code scan found no unresolved TODO, FIXME or HACK markers.
- Desktop and mobile screenshots visually inspected. Mobile viewport and document width both 390px, with no overflow or browser errors. Local sample: TTFB 124ms, DOMContentLoaded 216ms, first contentful paint 648ms; these are local diagnostics, not field Core Web Vitals.

## Problems resolved / decisions
- Windows isolation fails with an ACL/helper lock error. apply_patch and the local image viewer cannot operate; authorized elevated workspace commands and screenshot reads are used.
- Large Windows commands must be batched below process limits.
- Vitest was updated to 4.1.11 with compatible Vite 6.4.3 after finding an advisory in the original test dependency. Current audit is clean.
- Installed local Node 20.11.1 emits a transitive lint-engine warning. Supported production runtime is Node 22, verified in Docker.
- Removed the global streaming loading boundary because it caused missing product URLs to return 200; they now return 404. Admin retains a loading boundary.
- Darkened the catalogue strip after axe detected insufficient contrast.
- SITE_URL is a server runtime variable, not a compiled public variable; robots also renders dynamically.
- Production npm start now starts the standalone artifact with copied static assets and an absolute database path.
- Inkscape evidence uses its official project repository because the homepage blocked automated requests.
- Unknown company/license/pricing/capability fields remain explicit. Initial product images are monogram fallbacks; verified logo URLs can be added.
- Product-level scores do not guarantee every feature belongs to a free or cheapest plan; the UI and methodology explain this.

## External launch requirements
No hosting/DNS/TLS credentials or legal operator/contact details have been supplied. Public deployment and legal publication remain external tasks. Real AdSense/affiliate accounts are also absent; integrations remain inactive.
The locally tested release can be used without these external services.

## Commands
npm ci
npm run db:migrate
npm run db:seed
npm run admin:create -- editor
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm audit
docker compose --env-file .env.docker-local up -d --build --wait
docker compose exec app node dist/db.cjs backup

## Delivered local state (2026-09-25 baseline)
- Preview: http://localhost:3220, bound to loopback; admin: http://localhost:3220/admin.
- Final production container is healthy. Rechecked on 2026-09-25 after more than 30 hours of uptime.
- Editor account: editor. Generated password is stored only in the gitignored .tmp/local-admin-credentials.txt file; transfer it to a password manager.
- Temporary persistence-test category and verification account were removed after checking their exact identities. Final catalogue: 24 published products and 20 categories.
- SQLite integrity_check returned ok; foreign_key_check returned no violations.
- Startup logs show successful migration, idempotent seed and server readiness without application errors.
- Final route/header/canonical/404/editor checks passed. Details: .tmp/production-report.json; mobile diagnostics: .tmp/browser-metrics.json; screenshot: .tmp/mobile-preview.png.
- No application implementation or verification tasks remain for the local MVP.

## Latest implementation and production review — 2026-09-29
- Re-read prompt.MD, audited the existing implementation and completed the locally runnable scope of phases 0–15. The initial baseline above is historical; the checks below were run in this session.
- Fixed semantic duplicate matching criteria: repeated platforms/features with different client keys and multiple payment preferences now return 400 instead of changing their effective weight. Sponsorship and premium flags remain outside scoring.
- Fixed editorial evidence validation: a known billing period requires VERIFIED `plan:<id>` evidence even when the amount is unknown. Completely unknown plans remain representable.
- Added unit regressions and authenticated/anonymous API checks in the desktop and mobile E2E journeys.
- `npm run verify`: passed ESLint, TypeScript, all 48 unit tests and the Windows production build. The final E2E additions also passed a subsequent targeted lint and TypeScript check.
- `npm run test:e2e`: all 16 tests passed, including search, filters, matching, admin writes/rejections, routes, metadata, mobile overflow, axe accessibility and console checks.
- `npm audit --json`: zero vulnerabilities.
- Docker Node 22 production image rebuilt successfully; dependency installation reused the existing Docker cache. No claim of a new uncached installation is made.
- Created a consistent pre-update backup at `/app/data/backups/catalogue-2026-09-29T15-10-29-540Z.sqlite` in the persistent volume, then updated the existing local container. It is healthy at http://localhost:3220.
- Runtime smoke checks passed for health, product page, sitemap, robots, Open Graph PNG, admin, anonymous API rejection, real 404, security headers, canonical origin and the duplicate-criteria regression. Report: `.tmp/release-review-2026-09-29.json`.
- SQLite integrity_check: ok; foreign_key_check: no violations; 24 published products and 20 categories persisted. Startup logs show successful migrations, seed and readiness without application errors.
- No new schema migration. No unresolved TODO/FIXME/HACK markers in application, scripts or tests.
- Preserved the existing editorial enrichment files and their source dates. Vendor claims were not independently rechecked in this implementation review. The deployed database retains 199 explicitly unknown boolean facts; no invented values were added to complete them.
- README now documents the stricter evidence/criteria rules, the existing supplemental source records and the aggregate verification command.
- Public deployment still requires hosting/DNS/TLS access and actual operator/contact details. Monetization remains inactive pending real provider accounts.

## Next steps requiring external inputs
1. Supply server, DNS and HTTPS access; deploy with the exact Docker instructions in README.md.
2. Complete SITE_OPERATOR and CONTACT_EMAIL, and review the legal drafts before public launch.
3. Activate monetization only when actual provider accounts and approved partner URLs are available.
4. Continue editorial verification of explicit unknowns; retain the true consultation dates.

## Google Analytics 4 and AdSense preparation — 2026-09-30
- Added `GA_MEASUREMENT_ID` and `ADSENSE_PUBLISHER_ID` runtime variables (both validated by format in `src/lib/google.ts`; empty means disabled).
- GA4 loads only after Allow analytics, respects DNT/GPC, keeps ad/personalisation signals denied, sends page path without query strings and is stopped with its `_ga*` cookies removed on decline/withdrawal. CSP now allows only Google Analytics/Tag Manager hosts.
- `ADSENSE_PUBLISHER_ID` serves `/ads.txt` and the `google-adsense-account` verification meta tag. No AdSense script is loaded and no ads are shown; `AdSlot` stays disabled.
- Privacy, cookie and affiliate-disclosure copy updated to match. Match scoring is unchanged.
- Open items: Google-certified CMP (Funding Choices) is required before serving ads in the EEA; AdSense approval and content sufficiency are not guaranteed (another site on the same AdSense account shows "low value content"); GA property data-retention setting and operator legal details (`SITE_OPERATOR`) still to be completed by the owner.
- Verification: lint, typecheck, 61 unit tests and production build passed. Full E2E run: 19 passed, 1 failed (`analytics.spec.ts` session-cookie rotation); the same spec passed on isolated reruns both with and without the Google variables, so it looks timing-related under load rather than caused by this change.
