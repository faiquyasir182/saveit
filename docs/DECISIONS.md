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

- Negotiation demo rules: merchants accept at or above their minimum, counter at their minimum if the offer is within 70% of it, otherwise decline. Offers expire after 10 min (accept) or 2 min (counter). Demo responders ignore neighbourhood coverage.
- Sponsorship demo: the platform fee is unset (shown as "Not set yet"). Contributions fill the oldest batch still raising funds first, and leftover money stays unallocated and linked to the donor.
- Merchant demo: one branch (Demo Biryani House). Order status moves new → accepted → ready → completed; only new orders can be rejected.

## Open (ask before the dependent phase)
- Commission rates and commission base, donation fee (2–3% proposed), who pays each fee, rounding: before Phase 3 and Phase 7.
- Payment provider and sandbox access: Phase 3.
- Reservation duration and no-show handling: Phase 3.
- Negotiation minimums and expiry rules: Phase 4.
- Driver background-location devices: Phase 8.

## Missing inputs
- `Karachi_Food_App_Production_Plan.md` and the UI reference image have not been supplied yet. Tokens follow the written visual description.

## Saveit redesign (2026-11-14)
- Brand "Saveit" (src/config/brand.ts); simple original logo (orange bowl mark + lowercase wordmark).
- Warm, appetising, premium; orange is the only action accent; flat buttons, no gradients or glass.
- Motion 300-450ms via motion/react: sliding ring (layoutId), header tint crossfade, copy fade, card fade/stagger. Reduced motion honoured (MotionConfig). Note: >300ms is a documented exception to the generic 300ms motion-token guidance.
- English + Urdu (RTL, Figtree + Noto Nastaliq Urdu). Urdu text needs native review; some demo dish names stay English.
- Photos: Wikimedia Commons, representative demo images only, not the restaurants' dishes. Sources and licences in public/images/food/manifest.json; credit shown on the details page.
- Assumptions (unconfirmed): mobile-first; home prioritises nearby deals; Request/Sponsor secondary.
- Not done: background-removed cutouts; Impeccable (runs on the user's Mac after cloning).
- Photos are cutouts on white (U2-Net via rembg, run offline in a script; derivatives of the Commons originals, so CC BY-SA credit and share-alike still apply to the biryani image; others are CC0/public domain).
