# Visual system

Reference: `ui-reference.png` (three-phone food app mock-up). Applied to customer screens only. Impeccable was not available in this environment, so these rules were derived by hand from the image and should be treated as the baseline, not an audit result.

## Tokens (`src/index.css`, overridden from `src/config/brand.ts`)
- Surfaces: cream `--bg #faf6ee`, white sheets, a soft pink/peach page wash.
- Hero: pale-green gradient (`--hero-from`/`--hero-to`) under location, search and categories; a white sheet with a 36px top radius overlaps it.
- Pastels: green, yellow, peach, pink. Each has a strong (`--tint`) and soft (`--tint-soft`) value, selected with `data-tint`.
- Primary: orange gradient (`#f4731f → #ee6313 → #d9530a`) with a translucent outer ring and an inner highlight. `--primary-press #b94b0a` is the text-safe orange.
- Radii: 14 / 22 / 30 / 36 / pill. Shadows are warm and low-contrast. Font: Nunito 500/700/800/900.

## Components
- **Circular category**: 72px, radial pastel disc, white rim, orange outline when selected.
- **Food card**: pastel tinted, large image, tilted white discount chip, round heart toggle (44px), dark round bag button, price with strike-through original.
- **Info tiles**: portion, pickup window, remaining stock, saving per portion. No nutrition or other claims are shown, because none are substantiated.
- **Dock**: floating white pill, five slots, raised orange centre button for Sponsor, dot above the active tab.
- **Details**: full-bleed pastel hero with oversized image and tilted chips, overlapping white sheet, sticky glossy buy button instead of the dock.
- **Drawer**: bottom sheet dialog with focus trap, Escape and focus restore.

## Imagery
Food photography is a placeholder: emoji with a soft shadow, labelled "Demo image" on details. Replace with isolated merchant photos (Phase 5 tools) without changing layout.

## Layout
Mobile first. At 700px the grid has 3 columns and tiles 4; at 1000px the grid has 4 columns and details becomes two columns (sticky hero left). Other pages use a 600px column.

## Accessibility
- White on the button gradient is about 2.9:1 at the lightest stop (a thin highlight above the text), 3.3:1 mid-height and 4.0:1 at the darkest, so labels are 19px bold (large text, 3:1 minimum) with a text shadow. The lightest stop is slightly under 3:1: flagged for the owner to review. Orange text on white is 5.2:1.
- Muted text is at least 4.8:1 on every tint. Icon buttons and pills are at least 44px.
- `prefers-reduced-motion` disables all animation. Logical CSS properties keep layouts ready for RTL.
- States: loading skeleton, empty, sold out, network error with retry (open `#simulate-error`), validation, expired offers.

## Not yet done
Motion library animation, Tailwind, shadcn and React Router were not adopted: the working CSS and state routing stay until a feature needs them.
