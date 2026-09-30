# Software Alternative

An English-first software discovery platform: sourced product facts, curated alternatives and comparisons, a deterministic matcher, and a protected editorial workspace. Built from the specification in prompt.MD.

## Current workspace preview

The verified production container is available at http://localhost:3220. Open http://localhost:3220/admin and use the editor account. Its generated password is in the gitignored .tmp/local-admin-credentials.txt file; move it into your password manager. This file and .env.docker-local are local workspace artifacts, not committed defaults.

To start or rebuild this workspace preview:

```powershell
docker compose --env-file .env.docker-local up -d --build --wait
```

Port 3220 avoids the unrelated application already using port 3000. For a fresh checkout use the setup below; for public hosting follow Deploy with Docker.

## Run locally

Use **Node.js 22.13 or newer in the Node 22 release line**, npm, and a writable local filesystem. The initial development machine has Node 20.11.1; it may emit dependency engine warnings. Docker provides the supported runtime.

```powershell
npm ci
Copy-Item .env.example .env
npm run db:migrate
npm run db:seed
npm run admin:create -- editor
npm run dev
```

On macOS/Linux use `cp .env.example .env`. Do not overwrite an existing environment file. Open http://localhost:3000. The admin command generates a random password and displays it once; store it in a password manager. No default account or password exists. Sign in at /admin.

Production mode locally:

```powershell
npm run build
npm run start
```

Database files live under data/ and are gitignored. The seed preserves existing records and can be repeated safely. Explicit migrations are required before application startup; the Docker entrypoint performs them.

## Main routes

- / — discovery homepage and keyboard autocomplete.
- /software — search and category-filtered catalogue, with pagination.
- /software/[slug] — product facts, plans, evidence and alternatives.
- /alternatives/[slug] — 19 filters, explained feature overlap and a comparison table.
- /alternatives/photoshop/free — reviewed landing, indexable only while at least three eligible alternatives exist.
- /compare — curated pairs; reversed pair URLs redirect to one canonical URL.
- /compare/notion-vs-obsidian — side-by-side comparison.
- /find — weighted preferences and mandatory requirements.
- /admin — password-protected editorial management and the Analytics tab.
- /methodology, /about, /contact, /privacy, /cookies, /terms, /affiliate-disclosure.
- /sitemap.xml, /robots.txt and /api/health.

## Architecture

Next.js 16 App Router + React 19 + strict TypeScript. Public routes render on the server; search, filters, matcher and editor use focused client components. Plain CSS and system fonts avoid font downloads and heavy animations. Components remain reusable and the locale module provides a future translation boundary; English is the only implemented locale.

SQLite uses foreign keys, WAL, transactions and a busy timeout. Versioned migrations create Software, License, Category, Feature, Platform, their join tables, scalar facts, pricing plans, sources, alternative relationships, affiliate programs, SEO landings, change history, admins, sessions and request limits.

This is a **single-instance deployment with a persistent volume**. Do not deploy its writable database on ephemeral serverless storage or run multiple replicas. For greater scale, migrate the repository layer to a networked relational database. Back up before migration.

## Editorial workflow

Create taxonomy entries before referencing their slugs. Select a record in /admin, edit scalar fields and capabilities, and expand **Structured data** for sources, pricing plans, arrays and advanced fields. You can create records, search, filter products needing verification and paginate.

- Unknown boolean facts are null. Missing platform or feature relationships mean unknown, not unsupported.
- A known capability, platform, feature, license, price, billing period or pricing model requires a VERIFIED source covering the exact field, with a verification date. A plan with an unknown amount still needs `plan:<id>` evidence when its billing period is known.
- Source field examples: `description`, `freePlan`, `platform:linux`, `feature:notes`, `plan:base`.
- A draft can carry an unverified description; publication requires description evidence.
- Software slugs are permanent. Version checks reject stale concurrent edits.
- Save source changes and their corresponding facts together; validation prevents keeping an unsupported known claim.
- Set `published: false` to withdraw a product or landing; no destructive delete UI is provided.
- Before/after snapshots and editor identity are stored for every successful change.
- The review filter identifies unknown fields, unverified sources and evidence older than 90 days.
- A source date applies only to its listed fields. The most recent source date does not certify the whole product.

The initial 24-product seed records source checks dated 2026-09-21. The workspace also contains supplemental editorial records dated 2026-09-29 in src/lib/catalogue-content*.ts. Evidence URLs, covered fields and notes remain attached to each record. The implementation review does not reverify vendor facts or refresh these dates. Inkscape uses its official project repository because its website blocked automated access.

The catalogue deliberately leaves many companies, precise licenses, paid prices, free trials, platform claims and advanced capabilities unknown. Strengths are derived from recorded capabilities; unreviewed drawbacks are labeled as such. Initial visual marks are monogram fallbacks, not official logos. No invented reviews, ratings, endorsements or traffic statistics appear.

## Matching

Candidate sets come from explicit editorial relationships. Every hard requirement must be known and satisfied. Soft matches earn their weight, unknowns earn zero, and verified mismatches subtract 25% of their weight. The percentage is the weighted sum divided by total weight, rounded and clamped to 0–100. No criteria produces no score. Ties use coverage then slug.

Monthly budgets use USD only; annual prices divide by 12. A verified free entry plan meets a zero budget. One-time prices are not silently amortized. Product-level capabilities may belong to different paid editions; displayed scores do not guarantee all requested features are available in the cheapest plan.

Repeated criteria are rejected by their meaning: the same platform or feature cannot gain extra weight through a different client key, and a request has one payment preference.

Sponsored, premium and affiliate fields do not participate in the algorithm. Detailed factors allow reconstruction of each result. See /methodology and tests/discovery.test.ts.

## Security and privacy

Password hashes use scrypt with random salts. Session tokens are random, stored hashed and expire after eight hours. Cookies are HttpOnly and SameSite=Strict; use COOKIE_SECURE=true on public HTTPS deployments. Mutations require the configured public origin. JSON body size is bounded while streaming; all input is validated; SQL data uses bound parameters. Login and matcher limits persist in SQLite.

The application sends no third-party analytics or ad requests. Provider-neutral browser events remain available through the `software-alternative:analytics` CustomEvent. First-party measurement requires an explicit Allow analytics choice; declining or withdrawing consent stops collection. The privacy and cookie pages describe the stored information.

## Backoffice analytics

Sign in at /admin and open **Analytics**. Select Today, Last 7 days, Last 30 days, Last 180 days or custom dates, then choose day/week/month grouping and press **Update statistics**. Dates use UTC and weeks begin on Monday. **Download CSV** exports the same period's totals, trend and rankings.

The dashboard reports unique consenting browsers, visits (sessions with a 30-minute inactivity expiry), all public page views, submitted searches, searches without results, completed matches and unsuccessful matches, comparison views, official/affiliate link clicks, most searched tools, most viewed tools, popular pages, enabled filters, entry referrer domains and broad device sizes. Tool searches use the selected software or first catalogue result; raw search terms and match criteria are never stored. Autocomplete keystrokes are not counted.

Visitors are approximate browser counts, not identified people. Period totals deduplicate browsers across all recorded activity in the selected range; adding daily rows would overcount returning visitors. A visit can resume with an interaction after inactivity without a new page view. Referrers/device sizes count each session once, using its first recorded event in the selected range. Partial weeks/months respect the selected dates.

The consent preference cookie lasts 180 days. Optional random visitor and visit identifiers are HttpOnly cookies; only their hashes are stored in SQLite. Consent withdrawal deletes both identifier cookies. Collection checks consent, same origin, browser DNT/GPC signals, recognised bots, event validation and rate limits. Signed-in editors and admin/API routes are excluded. No IP address, account identity, full referrer URL or arbitrary query/property data is retained. Analytics never feeds recommendation scores.

Migrations 002 and 003 add the event store, indexes and reporting state. Events older than 180 days are pruned on the next collection/report, at most once per UTC day. The earliest recorded event is shown in the panel; there is no reconstructed historical traffic. The metrics endpoint and CSV require an admin session.

To check your installation, use a private browser window, open the public site and choose **Allow analytics**, then browse/search. Open Analytics in your separate signed-in editor window. Normal editor browsing intentionally does not generate traffic.

Security headers block framing, object embedding and arbitrary connection targets. The CSP permits inline script/style for Next.js hydration; no HTML is accepted from catalogue data, and JSON-LD is escaped. Add TLS/HSTS at your reverse proxy. Do not expose the database, backups, .env or admin password output.

## Verification

```powershell
npm run verify
npm run test:e2e
npm audit
```

Playwright uses installed Microsoft Edge by default, in desktop and mobile Chromium contexts. Set PLAYWRIGHT_CHANNEL=chrome to use installed Chrome. The browser tests start a production server on port 3210 and an isolated database at .tmp/e2e.sqlite. The temporary test credential file is gitignored and never used against the primary database.

Tests cover scoring, unknowns, hard requirements, weighting, budgets, filters, fuzzy search, source validation, SQL rollback, migrations, seeding, persistence, admin sessions, rate limiting, origin validation, metadata, primary browser journeys, accessibility, responsive layouts and published route status. Final verification results are recorded in PROGRESS.md.

## Deploy with Docker

Complete operator details and review the legal drafts before public launch. Provision a server with Docker Compose, DNS and HTTPS. No hosting account or deployment credential is included.

```powershell
Copy-Item .env.example .env
```

Edit .env:

```dotenv
SITE_URL=https://software-alternative.com
COOKIE_SECURE=true
SITE_OPERATOR=Your actual legal operator
CONTACT_EMAIL=Your real public contact address
PORT=3000
```

Then:

```powershell
docker compose up -d --build --wait
docker compose exec app node dist/admin.cjs editor
docker compose logs --tail=100 app
```

The container runs as the node user and starts migrations, an idempotent seed, and the standalone Next.js server. The catalogue named volume persists across rebuilds. The published port binds only to 127.0.0.1; point the server's HTTPS reverse proxy at 127.0.0.1:3000, preserving the Host header. Configure SITE_URL to match the exact public origin. Do not run multiple app replicas.

Health check: GET /api/health must return 200 with status ok and a nonempty catalogue. Validate sign-in through the final HTTPS hostname, /sitemap.xml and /robots.txt after deployment.

For local Docker testing set SITE_URL=http://localhost:3000 and COOKIE_SECURE=false. Restore secure cookies before any public deployment.

## Backups and updates

```powershell
npm run db:backup
docker compose exec app node dist/db.cjs backup
```

Backups use SQLite's consistent backup API and go to data/backups. Copy backups to separate storage. For Docker, use `docker compose cp app:/app/data/backups ./backups`.

Before an update, back up; build the new image; run `docker compose up -d --build --wait`; check health and routes. Existing catalogue edits survive seed reruns. For restoration stop the app, preserve the existing database and its WAL/SHM sidecars, restore a verified backup into the persistent volume with node-user ownership, then restart. Never overwrite a running SQLite database. Test restore procedures on a separate instance first.

## External launch requirements

Public deployment needs server/DNS/TLS access and owner-provided legal and contact information. AdSense and affiliate activation need actual accounts, identifiers and approved partner URLs. None is fabricated or enabled by default. These external inputs do not block running and testing the local application.
