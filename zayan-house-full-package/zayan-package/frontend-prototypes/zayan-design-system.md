# Zayan Collection — Design System V1.0
*(Phase 2 — temporary, fully reconfigurable via SMC)*

## 1. Brand Identity (Temporary)
- **Logo**: text-based wordmark — `ZAYAN` (bold) + `COLLECTION` (light, tracked wide), gold accent on the word "Collection." No icon mark yet.
- Stored as an SMC-editable field so a real logo image can replace the text lockup without touching layout code.

## 2. Color Tokens
All colors are CSS variables (`--token-name`) so SMC's "Brand Colors" module can overwrite them at runtime with zero code changes.

| Token | Value | Use |
|---|---|---|
| `--ink` | `#1F1C1A` | Primary text, header, footer bg |
| `--paper` | `#FAF7F2` | Page background |
| `--gold` | `#B98B3E` | Accent — CTAs, prices, highlights |
| `--gold-deep` | `#8C6A2D` | Hover states |
| `--line` | `#E7E0D5` | Borders, dividers |
| `--muted` | `#7A726A` | Secondary text |
| `--success` | `#2E7D4F` | In-stock, confirmed order |
| `--warn` | `#B54545` | Low stock, sale badge |

Dark-mode equivalents are pre-mapped (ink/paper invert) so the same tokens work if a dark theme is ever enabled — though per the Blueprint, **light theme is the default and only theme for now**.

## 3. Typography
- **Display / Headings**: Georgia (serif) — premium, editorial feel. Sizes: H1 `clamp(26–42px)`, H2 `18–22px` uppercase tracked, H3 `16–18px`.
- **Body / UI**: system sans-serif fallback stack for fast loading and легиб; `13–14px` body, `12px` meta text.
- Letter-spacing: `0.03–0.08em` on labels/nav/headings only — never on body paragraphs.
- Font family itself is a config value (`--font-display`, `--font-body`) so SMC Typography settings can swap it later.

## 4. Components

**Buttons**
- Primary: solid `--ink` bg, `--paper` text, 2px radius, 10–26px padding, uppercase 13px tracked.
- Accent: solid `--gold` bg, dark text — used for promo/exclusive CTAs only.
- Ghost: transparent bg, 1px `--line` border — secondary actions (e.g. "View Details").

**Inputs**
- 1px `--line` border, transparent bg, 2px radius, 10–14px padding, focus state = border → `--gold`.

**Badges**
- Sale: `--warn` bg, white text, small pill, top-left of product image.
- New: `--gold` bg, dark text, pill.
- Out of Stock: `--muted` bg, overlay on image at 70% opacity.

**Navigation**
- Desktop: horizontal, 13px tracked links, underline-on-hover in `--gold`.
- Mobile: collapses to a bottom icon bar (Home / Search / Cart / Account) + hamburger for full category list.

## 5. Product Card
- Aspect ratio 3:4 image, badge overlay, hover = slight lift (`translateY(-3px)`) + shadow.
- Below image: name (13px), price in `--gold` bold, old price struck through in `--muted` if on sale.
- Quick "Add to Cart" appears on hover (desktop) / always visible (mobile).

## 6. Collection Card
- Wider aspect ratio (4:3), full-bleed banner image, collection name overlaid bottom-left on a gradient scrim for legibility, single CTA "Explore →".

## 7. Spacing, Radius, Shadow, Breakpoints

| Token | Value |
|---|---|
| Spacing scale | 4 / 8 / 12 / 16 / 24 / 32 / 44px |
| Radius | 2px (buttons/inputs), 4px (cards/banners) |
| Shadow (hover) | `0 8px 20px rgba(0,0,0,.08)` |
| Breakpoint — mobile | up to 640px |
| Breakpoint — tablet | 641–1024px |
| Breakpoint — desktop | 1025px+ |
| Grid | `repeat(auto-fit, minmax(150–220px, 1fr))` — collapses gracefully at every breakpoint |

## 8. SMC Configurability Map

| Design element | SMC control point |
|---|---|
| Logo / wordmark | General Settings → Logo |
| Color tokens | General Settings → Brand Colors |
| Fonts | General Settings → Typography |
| Homepage section order/visibility | Homepage Management |
| Banner images | Homepage Management → Banner Management |

No color, font, or logo value is hardcoded in component markup — every one resolves from a token that SMC can overwrite.
