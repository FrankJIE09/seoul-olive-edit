# 首尔选物 | Olive Young 购物手册

Buildless Chinese-language guide to shopping at Olive Young in Korea. Open `dist/index.html` directly; no installation or build is required. The public site is deployed from `dist/` to [GitHub Pages](https://frankjie09.github.io/seoul-olive-edit/).

## Features

- Product search by Chinese, English or Korean name.
- Purpose, category, skin preference and planned budget filters; price sorting.
- Product details, Korean name copying and official source links.
- Gift combinations that calculate their budget from the same product data.
- Browser-local shopping list with quantities, recipients, purchased state, text export and printing/PDF.
- 51 curated items across skincare, cleansing, sun care, makeup, hair and body care, with shade, fragrance and usage caveats.
- A dedicated nine-item daily-care shortlist with current plan-price references and bulk add to the shopping list.
- Three directly accessed public Xiaohongshu/rednote text notes plus one searchable public excerpt, with verification limits shown. Two added items map to product lines named in those notes; the remaining additions are clearly marked as editorial or official-listing picks.

## Files

- `dist/data.js`: generated product data, suggested gift bundles and the daily-care shortlist; regenerate with `node build-data.mjs` after updating the research or editorial metadata.
- `dist/notes.js`: public note references and editorial interpretation.
- `dist/app.js`: application state, filtering, dialogs and shopping list.
- `dist/styles.css`: responsive desktop/mobile and print styles.
- `research.json` and `research-additions.json`: official source research, image provenance and 39 additional product records.
- `DESIGN.md`: design decisions and skill selection.
- `.github/workflows/pages.yml`: deploys `dist/` to GitHub Pages on every push to `main`.

All displayed monetary values are planned KRW budgets, not live store prices. Official online listings do not establish physical store availability. Product images belong to their respective brands/retailer. Saved shopping lists stay in the current browser and origin, so local-file, preview and published versions have separate storage.

## Design Skill

Selected [Anthropic frontend-design](https://github.com/anthropics/skills/tree/main/skills/frontend-design) for the responsive retail-guide layout. GitHub Actions publishes the static page; no server-side service is required.

## Preview

For HTTP preview, run `python3 -m http.server 8878 --bind 127.0.0.1 --directory dist` from this project. The static page also works without a server.

No account, checkout, analytics or purchase API is included.
