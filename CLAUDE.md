# Karachi Food App

Mobile-first food marketplace for Karachi: surplus food, meal-price negotiation, pooled orphanage meal sponsorship.
Working brief: docs/DECISIONS.md. Phase order: docs/ROADMAP.md.

## Rules
- PKR as integer rupees. Store UTC, display `Asia/Karachi`.
- The brand lives only in `src/config/brand.ts`. UI text lives only in `src/i18n/`. Use logical CSS properties for future RTL.
- Demo data (`src/data/demo.ts`) must stay labelled as demonstration. Never present commission or fee rates as confirmed.
- From Phase 3 on, the backend is authoritative for prices, stock and permissions. `src/lib/pricing.ts` is a preview only.
- Restaurants deliver with their own riders. One branch per checkout.

## Commands
- `npm run dev`: dev server (read the port from its output)
- `npm test`: unit tests (Vitest)
- `npm run build`: type-check and build
- `npm run e2e`: Playwright smoke journey. Needs the dev server running; set `APP_URL` if the port differs.
