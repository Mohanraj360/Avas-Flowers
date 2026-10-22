# Ava’s Flowers — Website Redesign Concept

Responsive static website prototype built with plain HTML, CSS, and JavaScript. It is deployed as a static Vercel site and does not require a build step.

## Run locally

From the repository root:

```bash
python -m http.server 8000
```

Open http://localhost:8000.

## Project structure

- `index.html` — shared page shell, header, navigation, and footer
- `styles.css` — responsive styling and design tokens
- `app.js` — hash-based routing, catalog loading, product/category pages, search, cart preview, and UI interactions
- `assets/catalog/part-00.txt` … `part-03.txt` — base64 chunks of the gzip-compressed scraped product catalog
- `assets/catalog/image-manifest.json` — product-image mapping and source metadata
- `assets/product-images/` — optimized local product images
- `assets/old-content.json` — extracted text from the supplied source document
- `scripts/audit-product-images.mjs` and `.github/workflows/audit-product-images.yml` — product-image audit tooling

## Deployment

The `main` branch is connected to the Vercel project `avas-flowers`. The site is a static HTML/CSS/JavaScript application; there is no package-based build step.

## Important limitations

This is a redesign prototype, not an official Ava’s Flowers service. Product information comes from a supplied scrape and may contain incomplete or mismatched records. Listings flagged for identity verification should be checked against the original product page. The catalog does not currently contain Boss’ Day-specific product tags, so that page presents general flower and plant gifts as alternatives.

Live inventory, delivery-date availability, shipping/service fees, tax calculations, payment processing, order tracking, account services, and real support/claim submissions are not connected. Do not treat the prototype as a live ordering system.

## Before production use

- Verify product names, categories, images, sizes, prices, descriptions, and review associations.
- Confirm current policies, coupons, delivery cutoffs, fees, taxes, and legal wording against the live business.
- Integrate and test real delivery availability, checkout, payment, order confirmation, tracking, and support systems.
- Confirm licensing and permissions for all brand assets and product images.
