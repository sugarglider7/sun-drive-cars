# QA_CHECKLIST — sun-drive-cars (independent QA pass, 2026-10-02)

Served as `python3 -m http.server 8044 --directory /tmp/sites`, browsed at `http://localhost:8044/sun-drive-cars/` (subpath simulation). Desktop 1440×900 + mobile 390×844, EN + FR.

## Findings & fixes

| # | Finding | Severity | Resolution |
|---|---|---|---|
| 1 | **DO-NOT-PUBLISH research images shipped in the deployable tree.** `assets/research/fleet_logan_silver_airport_family_guestphoto.jpg` (children's faces, inventory says "DO NOT publish without blurring") and `assets/research/unverified_vw_tiguan_black.jpg` (inventory: "DO NOT PUBLISH", fleet unconfirmed) would be publicly served by GitHub Pages under the business's own domain. | **Critical** | **Fixed** — both files deleted; `research/ASSET_INVENTORY.md` rows annotated (CDN tokens retained for re-fetch); `robots.txt` now `Disallow: /research/` and `/assets/research/`. |
| 2 | Book form: empty return date showed "Return can't be before pickup." — wrong message for the empty case (same element covers both `required` and ordering errors). | Minor | **Fixed** — EN: "Please pick a return date — on or after your pickup date."; FR: "Merci de choisir une date de retour — le jour de la prise en charge ou après." |
| 3 | Return-date picker allowed dates before the chosen pickup date (only rejected at submit). | Minor | **Fixed** — `main.js` now syncs `return-date.min` to the pickup date on change **and** after URL prefill (`?from=`). Verified: prefill `from=2026-11-10` → `min=2026-11-10`. |
| 4 | `main.js` `syncFlight()` contained a no-op line (`flightInput.value = flightInput.value`). | Trivial | **Fixed** — removed. |
| 5 | Airport page (EN): "The photo on the right…" — figure stacks *below* the text at mobile widths. | Minor | **Fixed** — "The night photo alongside is a real handover at the airport, taken by us." (FR version never used a positional reference.) |

## Won't-fix (justified)

- `research/*.md` remain in the deployed repo (project documentation; `robots.txt` disallowed; contents are business facts already public on Google Maps). Remaining `assets/research/` images are the owner's own listing photos or generic Unsplash — publishable per inventory.
- Licence plates readable in fleet photos — these are the owner's own public Google listing photos; FLEET_INVENTORY marks blurring as optional ("a builder may blur them").
- JSON-LD `aggregateRating` on own site is self-serving and may be ignored by Google rich results — harmless, factually correct (5.0/252, dated), kept.
- Review chips on FR reviews page stay in English ("no deposit" × 16 …) — intentional, captioned "tels qu'affichés sur notre fiche Google".

## Rails verified clean (no fix needed)

- **Prices:** zero matches for `€ | MAD | $ | /day | per day | par jour` in served HTML/JS. "How much?" answered as personal-WhatsApp-quote only.
- **Fleet:** only Dacia Logan (grey, airport owner photo) + Sandero (white, night-handover owner photo) carded with photos; Duster is a photo-less "on request / subject to availability" card. **No VW Tiguan anywhere** in served pages (and the image itself is now deleted). No transmission/fuel/engine specs published — explicit "confirmed in writing with your WhatsApp quote" notice boxes on fleet pages; only seats/body style (HIGH-confidence per FLEET_INVENTORY).
- **Claims:** no-deposit, no-credit-card, 24/7, airport+hotel delivery, keys-in-car return, 5.0★ · 252 reviews "(October 2026)" / "verified 2 October 2026" — all present and sourced. **No** unlimited-mileage, insurance-terms, driver-age, fuel-policy, or €5-cleaning-fee claims; insurance/fuel/requirements appear only as "confirmed with your quote" (EN+FR FAQ, no-deposit, fleet).
- **No social links** site-wide (the unrelated @sundrivecars IG is not referenced). Contact = `tel:+212661644244`, `wa.me/212661644244`, 10 Rue Ifni Talborjt, Google Maps search link + coords embed (pin lands in Talborjt — verified visually).
- **Quotes:** all 10 review excerpts cross-checked verbatim against SOURCE_OF_TRUTH quote bank, correct years (breakdown quote = 2025, rest 2026); chip counts 16/10/7 match; Zouhair named only as in the source.
- **Links:** programmatic crawl of all 16 pages — 0 broken links, 0 subpath escapes (no root-absolute hrefs), all CSS/JS/images 200. External links: fonts, Google Maps, wa.me only. Console: 0 errors/warnings on crawled pages.
- **Bilingual:** FR twin for all 8 EN pages; header/footer toggles point to the *equivalent* page both directions (verified on every page); canonicals + hreflang en/fr/x-default correct per page; sitemap lists all 16 URLs with hreflang alternates on `https://sugarglider7.github.io/sun-drive-cars/`; FR copy is native-register ("sans caution", "prise en charge", "restitution"), FR title/meta carry "location voiture… Agadir… sans caution" intent; review translations chipped "traduit de l'anglais"; no EN leakage in FR labels/validation/WhatsApp templates.
- **Flows (exercised in Chromium):** home mini-form → `book/?pickup=…&from=…&to=…` prefill works (EN+FR); flight field shows only for airport pickup (hidden for hotel/office, incl. prefill); return-before-pickup rejected with field highlight + no WhatsApp open; valid submit builds correct WA payload — EN: "Hello Sun Drive Cars! I'd like to request a quote: • Pickup: … • Return: … • Flight: FR 1234 • Car … • Name … • WhatsApp … • Notes …"; FR: "Bonjour Sun Drive Cars ! Je souhaite demander un devis : • Prise en charge … • Restitution … • Voiture : Dacia Sandero (compacte) …" — both to 212661644244. `?car=sandero` prefill honoured. Confirm box + "wa-again" fallback link carry the same payload. No-JS `<noscript>` fallback present.
- **Mobile 390px:** burger nav opens/closes with 48px tap rows; sticky CTA (WhatsApp/Call/Book, 48px targets) doesn't overlap footer (body padding 76px > bar 67px), dismiss persists via sessionStorage; hero, cards, form, map, storefront photo all render without overflow.
- **Brand:** gold #C9A24B / black / white / cream; Marcellus display + letterspaced "AGADIR" sub-mark; sun-ray glyph + ray background motif echo the storefront emblem; red used only for form error states. Reveal animations are JS-gated (`html.js`) — content fully visible without JS; `prefers-reduced-motion` honoured.
- **No placeholders:** `lorem|TODO|FIXME|XXX|placeholder` grep clean (only legit `placeholder=` input attributes). 404 page bilingual, noindex, absolute links to the GH Pages subpath.
