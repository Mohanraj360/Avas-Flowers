<<<<<<< HEAD
# Ava's Flowers website redesign concept

Responsive static front-end concept built with HTML, CSS and JavaScript. React/Tailwind was not used so the prototype can run locally without a build tool or dependency installation.

## Run

Use a local static server (required because the site fetches `assets/old-content.json`):
=======
# Ava’s Flowers — Website Redesign

Responsive static website redesign concept created from the supplied Ava’s Flowers source document.

## Run locally
>>>>>>> ac382d9283affccf0d5916d7f0c9b85e80bd1c1b

```bash
python -m http.server 8000
```

Open http://localhost:8000.

<<<<<<< HEAD
## Files
- `index.html` — semantic page shell and shared header/footer
- `styles.css` — responsive styles and CSS design tokens
- `app.js` — hash-routed page templates, interactions, filters shell, cart preview, forms, terms accordion, scroll reveals and reduced-motion handling
- `assets/old-content.json` — all paragraph text extracted in original order from the supplied Word document
- `assets/image1.png` — original logo extracted from the Word document (unaltered)
- `assets/image2.png` … `image24.png`, `image21.gif` … `image23.gif` — original embedded source images (unaltered)
- `PROTOTYPE-README.md` — prototype project README for provenance

## Design tokens
- Accent `#2A9A47`: sampled from the dominant green pixels in the supplied original logo (`assets/image1.png`). It is used for focus states, links, small labels and calm informational panels; the logo itself is unchanged.
- Warm paper `#F8F6F0`, near-black `#201F1B`, white `#FFFEFA`.
- Typefaces: Playfair Display for headings and DM Sans for UI/body, both loaded from Google Fonts with fallbacks. `font-display: swap` is provided by the Google Fonts stylesheet.
- Animation: 450–500 ms fade-up on hero, IntersectionObserver reveals staggered by 70 ms, header background transition, cart-count micro-animation, focus rings and 200 ms menu transitions. `prefers-reduced-motion` disables non-essential motion.

## Source integrity notes
- Prototype's sample product names, Unsplash photos, invented prices/fees, sample reviews and fake order statuses are not used as real Ava's Flowers data.
- The original Word document contains website screenshots, rather than a verified machine-readable product catalogue. As a result, product cards show `Product to be supplied` placeholders. Product photos/prices/options are not fabricated.
- The complete extracted Word-document paragraph text is available in the “Original website content” page. The Terms page groups numbered paragraphs into collapsible sections; check it against the original Word file before production, as Word paragraph boundaries may include headings or line breaks that need editorial verification.
- The original embedded images are copied byte-for-byte from the DOCX media folder. They are not redrawn or recoloured.
- No payment, fulfilment, account, tracking, claim submission, or live support backend is connected.

## Third-party requests
- Google Fonts stylesheet for Playfair Display and DM Sans. No analytics, marketing tags, payment scripts, chat widgets or other third-party JavaScript are included.

## Production placeholders to resolve
- Verified catalogue: products, exact category assignment, names, prices, sizes, options, included items, descriptions, care details and product images (including any second images).
- Confirm current logo and award/badge image mapping from source document. Current originals are used without alteration.
- Service-fee range, delivery fees, tax calculations, coupon offer and complete fine print.
- Live delivery methods, date availability, date-specific guarantee/best-effort rules, delivery cut-off wording and operational status feeds.
- Payment provider, secure checkout integration, order confirmation reference, notification channels and timing.
- Real order status names/descriptions, lookup API, support ticket endpoint, claim upload endpoint and data handling/privacy requirements.
- Current support hours and any call-volume notice wording.
- Exact original testimonials and real product reviews if not present as readable text in the Word document.
- Confirm the 22 legal sections against the source document before production deployment.
=======
## Deployment
This is a plain HTML/CSS/JavaScript project intended for Vercel static hosting. It has no build step. Verify product catalog, live inventory, delivery estimates, pricing, policies, and checkout integrations before production use.
>>>>>>> ac382d9283affccf0d5916d7f0c9b85e80bd1c1b
