# SUN DRIVE CARS — website (demo)

A complete bilingual (FR/EN) website for **SUN DRIVE CARS**, 10 Rue Ifni (Talborjt), Agadir, Morocco — car rental without deposit, no credit card needed, 24/7 delivery at Agadir Al Massira airport and hotels. Google 5.0★ · 252 reviews (Oct 2026).

**Live demo:** https://sugarglider7.github.io/sun-drive-cars/

## What this is

A speculative greenfield build for a highly-rated rental agency that currently runs on Google and word of mouth. The design evolves their real brand (gold/black, letterspaced mark — see `research/BRAND_NOTES.md`). Factually conservative by design:

- Fleet shows only vehicles verified from the company's own photos and reviews (`research/FLEET_INVENTORY.md`). No invented cars, no invented prices — everything terminates in a WhatsApp quote request to their published number.
- Verified claims only: no deposit, no credit card, airport meet-at-arrivals, keys-in-car return, 24/7. Unverified terms (mileage, insurance, fuel policy) are deliberately answered as "confirmed in writing with your quote".
- Dedicated SEO landing pages: airport rental and no-deposit explainer, FR intent ("location voiture Agadir sans caution") carried natively on the `fr/` mirror.

## Stack

Static HTML/CSS/vanilla JS, no build step. All links relative — works on GitHub Pages subpath or a root domain.

## Repo notes

- `research/` — SOURCE_OF_TRUTH, FLEET_INVENTORY, BRAND_NOTES, ASSET_INVENTORY (image provenance). Raw research downloads excluded from the repo; published images live in `assets/img/`.
- `QA_CHECKLIST.md` — independent QA findings and fixes.
