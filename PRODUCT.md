# Product context

Working name: **Karachi Food App** (temporary; see `src/config/brand.ts`). Mobile-first food marketplace for Karachi. Currency PKR, display time `Asia/Karachi`.
Source of requirements: the owner's pasted product description (in place of the missing Master Brief) and `docs/DECISIONS.md`. The Production Plan file has not been supplied yet.

## Who it serves
- **Customers** in DHA, Clifton, Gulistan-e-Johar, Gulshan-e-Iqbal and Nazimabad (more neighbourhoods configurable by admin, never silently restricted).
- **Merchants**: restaurants, cafés, bakeries, dessert shops, other food businesses, each with multiple branches (own stock, pickup windows, delivery coverage).
- **Owner/admins**: approvals, neighbourhoods, reconciliation, platform theme.
- **Drivers** (restaurant-owned), **receiving partners** (verified orphanages), **donors**.

## Customer flows
1. **Buy surplus food.** Exact items or surprise bags (what varies and the minimum promised value are stated). Pickup or restaurant delivery. One branch per checkout. Cash now; online payment in Phase 3.
2. **Name your price.** Inspired by inDrive, original branding. Merchants Accept, Counter or Decline. The customer compares complete totals and picks exactly one. Accepting never charges anyone.
3. **Sponsor meals.** Pool PKR 1–10,000 contributions into batches for verified orphanages. Exact per-batch allocation records. Receipt is confirmed by the home's staff, not by GPS or the driver. Unallocated money stays attributable to the donor and campaign, never platform revenue.

## Money rules
- Restaurant commission (normal, negotiated and sponsored orders) and a donation platform fee (2–3% proposed) are **unconfirmed**. The UI shows "Not set yet"; no rate ships until the owner confirms it.
- No reusable customer wallet.

## Status (Phases 0–1)
Implemented as a front-end prototype on demonstration data: discovery, details, checkout, meal request and offers, sponsorship, merchant dashboard. No backend, payments, notifications or tracking exist yet.

## Unresolved (do not guess)
- Login method, merchant approval process, branch-staff permissions (Phase 2).
- Commission rates and base, donation fee, fee payer, rounding, payment provider, refunds (Phases 3 and 7).
- Reservation duration and no-show handling (Phase 3). Negotiation expiry and minimum rules (Phase 4).
- Public-release languages (Urdu/RTL) before release.
- Driver background-location device coverage (Phase 8).
