# Decisions

## Confirmed by owner (2026-11-13)
- The working product brief is the owner's pasted description (in place of the missing Master Brief). The Production Plan sets the phase order.
- Temporary name: **Karachi Food App**. Name, logo and colours are configured centrally in `src/config/brand.ts`.
- Language: English for the first prototype. Strings live in `src/i18n`; layout is RTL-ready. Confirm public-release language requirements before release.
- Stack: React, TypeScript, Vite; Supabase from Phase 2.
- Neighbourhoods: DHA, Clifton, Gulistan-e-Johar, Gulshan-e-Iqbal and Nazimabad. These become admin-configurable in Phase 2.
- Restaurants deliver with their own riders. One branch per checkout. No customer wallet.

## Prototype defaults (reversible)
- Client-side state routing; no router dependency yet.
- Emoji on pastel tiles stand in for food photography until real merchant photos exist.
- Checkout offers cash only. Online payment is shown as Phase 3.
- Delivery charge is set per branch; null means pickup only.

## Open (ask before the dependent phase)
- Commission rates and commission base, donation fee (2–3% proposed), who pays each fee, rounding: before Phase 3 and Phase 7.
- Payment provider and sandbox access: Phase 3.
- Reservation duration and no-show handling: Phase 3.
- Negotiation minimums and expiry rules: Phase 4.
- Driver background-location devices: Phase 8.

## Missing inputs
- `Karachi_Food_App_Production_Plan.md` and the UI reference image have not been supplied yet. Tokens follow the written visual description.
