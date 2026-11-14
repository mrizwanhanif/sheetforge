# SheetForge

Multi-tenant foam-board / sheet manufacturing ERP skeleton.  
**Platform chrome:** SheetForge · **Pilot tenant:** G.J. Industries · **Brand:** Timbplast

## Stack

- Next.js (App Router) + TypeScript + Tailwind
- In-memory seed data (`src/lib/seed.ts`) — swap for Postgres later
- No `cursor-app.json` database flag yet (no SQL migrations)

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Click **Enter G.J. Industries demo**.

```bash
npm run typecheck
npm run build
```

## Demo happy path

1. Login / tenant switcher mock → dashboard  
2. Quotations → open `QT-2026-0041` → **Convert to sales order**  
3. Inventory (lots + ledger) · Production (cutting list / scrap)  
4. Invoices → **Print / PDF view** (Timbplast + NTN)  
5. Reports · Settings · Integrations stubs  

## Next DB step

Add Postgres + Prisma/Drizzle with `org_id` on all tables and RLS; map entities in `src/lib/types.ts` 1:1.
