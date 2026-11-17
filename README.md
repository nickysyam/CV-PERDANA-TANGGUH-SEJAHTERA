# CV. Perdana Tangguh Sejahtera — Corporate Website

> **Reliable Supply. Stronger Partnerships.**

Official corporate website for **CV. Perdana Tangguh Sejahtera (PTS)** — a B2B food supply & distribution company serving MBG (Makan Bergizi Gratis) kitchens, SPPG (Satuan Pelayanan Pemenuhan Gizi), catering businesses, restaurants, hotels, and institutional procurement across **Tangerang, Banten, and surrounding areas**.

This is a **corporate sales and lead-generation platform**, not an e-commerce marketplace.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [SEO Strategy](#seo-strategy)
- [Accessibility](#accessibility)
- [Browser Support](#browser-support)
- [Future Roadmap](#future-roadmap)
- [License](#license)

---

## Tech Stack

| Layer            | Technology                                    |
| ---------------- | --------------------------------------------- |
| Markup           | Semantic HTML5                                |
| Styling          | CSS3 (Grid, Flexbox, CSS Variables, Clamp)    |
| Logic            | Vanilla JavaScript ES6 (no frameworks)       |
| Data             | JSON files (decoupled from logic)             |
| Fonts            | Inter + Plus Jakarta Sans (Google Fonts)      |
| Images           | Unsplash CDN (WebP-ready via URL params)      |
| SEO              | Open Graph, Twitter Cards, Schema.org JSON-LD|

**No build step. No npm install. No bundler. Just open the files.**

---

## Project Structure

```
PTS-WEBSITE/
├── index.html                  # Main HTML entry — all 7 sections
├── assets/
│   ├── css/
│   │   ├── style.css           # Design tokens, base styles, typography
│   │   ├── components.css      # Reusable UI components (buttons, cards, hero, etc.)
│   │   └── responsive.css      # Mobile-first media queries
│   ├── js/
│   │   ├── main.js             # App controller — cross-module init
│   │   ├── components.js       # Renders dynamic sections from JSON
│   │   ├── products.js         # Loads products.json, renders product cards
│   │   ├── animation.js        # Intersection Observer reveals, sticky header
│   │   └── contact.js          # Form validation + WhatsApp submission
│   └── images/                 # Local images (currently empty — Unsplash CDN used)
├── data/
│   ├── company.json            # Company info, about pillars, why-choose, process
│   ├── services.json           # Service cards
│   └── products.json           # Product categories
├── sitemap.xml                 # XML sitemap for search engines
├── robots.txt                  # Crawler directives
└── README.md                   # This file
```

---

## Features

### Single-Page Architecture (7 Sections)
1. **Beranda** (Home) — Hero with dual CTAs and partner summary card
2. **Tentang Kami** (About) — Company intro + 4 business pillars
3. **Layanan** (Services) — 6 service cards loaded from `services.json`
4. **Produk** (Products) — 8 product categories loaded from `products.json` with WhatsApp inquiry CTAs
5. **Keunggulan** (Why Choose Us) — 6 differentiators with icons
6. **Proses Kerja Sama** (Partnership Process) — 6-step visual workflow
7. **Kontak** (Contact) — WhatsApp button, email, address, full inquiry form

### UI / UX
- Sticky white header with active-section highlight (scroll-spy)
- Mobile slide-in navigation with hamburger toggle
- Hero with gradient overlay + glassmorphism info card
- Scroll-triggered reveal animations (Intersection Observer)
- Floating WhatsApp button (with pulse animation)
- Back-to-top button
- Preloader on initial load
- Print stylesheet

### Conversion & Lead Generation
- WhatsApp deep links with prefilled messages on every CTA
- Validated inquiry form that opens WhatsApp with auto-filled inquiry details
- Form fields: Full Name, Business Name, WhatsApp, Product Requirements, Estimated Supply Needs, Delivery Location, Additional Notes
- Indonesian phone number validation (`08xx` / `+62 8xx`)

### Performance
- Mobile-first responsive design (no horizontal overflow)
- Fluid typography via `clamp()`
- Lazy-loaded images
- `preconnect` to Unsplash CDN
- No external JavaScript frameworks → tiny bundle
- Respects `prefers-reduced-motion`

---

## Getting Started

### Option 1 — Open Directly
Just open `index.html` in any modern browser.

> **Note:** Some browsers restrict `fetch()` of local JSON files when using the `file://` protocol. If you see "Failed to load products" in the products section, use Option 2 below.

### Option 2 — Local Static Server (recommended)

```bash
# Python 3 (built-in on most systems)
cd PTS-WEBSITE
python3 -m http.server 8000

# Then open: http://localhost:8000
```

Or with Node.js:

```bash
# Using npx (no install)
cd PTS-WEBSITE
npx serve .

# Or
npx http-server -p 8000
```

Or with VS Code: install the "Live Server" extension → right-click `index.html` → "Open with Live Server".

---

## Configuration

All editable content lives in **`data/`**:

### `data/company.json`
Contains company identity, contact details, about pillars, why-choose items, and partnership process steps.

**Update before deployment:**
- `contact.whatsapp` — your business WhatsApp number (international format, no `+`)
- `contact.whatsappDisplay` — how the number appears on the page
- `contact.email` — business email address
- `contact.address` / `addressFull` — business address
- `social.instagram` / `facebook` / `linkedin` — social profile URLs

### `data/services.json`
Six service cards. Edit titles and descriptions here.

### `data/products.json`
Product categories. Each product can have:
- `name`, `category`, `shortDescription`
- `image` (URL — replace Unsplash URLs with your own assets for production)
- `imageAlt` (accessibility text)
- `keywords` (for SEO context)

> **Important:** The website never claims stock availability, prices, or certifications. Keep the product copy factual.

### Logo
The header logo is currently a styled "PTS" mark with the company name in text. To use the original logo image:
1. Place `logo.png` (or `logo.svg`) in `assets/images/`
2. Edit the `.brand` block in `index.html` to use `<img>` instead of `<span class="brand__mark">`
3. Keep the same dimensions and colors as the original

### Favicon
The favicon is currently an inline SVG data URI with the "PTS" mark on a blue background. Replace with a real favicon in production:
1. Generate icons at [realfavicongenerator.net](https://realfavicongenerator.net/)
2. Place in `assets/images/`
3. Update `<link rel="icon">` in `index.html`

---

## Deployment

### Static hosting (recommended)

The site is pure static HTML/CSS/JS — deploy anywhere:

#### Netlify
```bash
# Drag-and-drop the PTS-WEBSITE folder onto https://app.netlify.com/drop
# Or via CLI:
npm i -g netlify-cli
cd PTS-WEBSITE
netlify deploy --prod
```

#### Vercel
```bash
npm i -g vercel
cd PTS-WEBSITE
vercel --prod
```

#### GitHub Pages
```bash
git init
git add .
git commit -m "Initial commit: PTS corporate website"
git branch -M main
git remote add origin https://github.com/<your-username>/pts-website.git
git push -u origin main

# In GitHub repo Settings → Pages → Source: deploy from main branch
```

#### Cloudflare Pages
```bash
# Connect your Git repo at https://pages.cloudflare.com
# Build command: (leave empty)
# Output directory: /
```

#### Apache / Nginx / cPanel
Upload all files to your web root (`public_html` or `/var/www/html`). No special configuration needed — the site is pure static.

### Post-Deployment Checklist
- [ ] Replace `https://pts.co.id/` in `index.html`, `sitemap.xml`, `robots.txt` with your real domain
- [ ] Replace Unsplash image URLs with optimized, owned images (WebP preferred)
- [ ] Update `data/company.json` with real contact info
- [ ] Submit `sitemap.xml` to Google Search Console
- [ ] Verify phone number and email in WhatsApp and mailto links
- [ ] Test the contact form end-to-end on a real device
- [ ] Run PageSpeed Insights: https://pagespeed.web.dev/

---

## SEO Strategy

### Implemented
- ✅ Semantic HTML5 (`<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`)
- ✅ Proper heading hierarchy (one `<h1>`, multiple `<h2>` per section)
- ✅ Title tag optimized for primary keywords
  - `Supplier MBG`, `Supplier SPPG`, `supplier bahan pangan`, `supplier beras Tangerang`, `supplier catering Banten`, `distributor bahan pokok Banten`
- ✅ Meta description (155-char target)
- ✅ Canonical URL
- ✅ Open Graph tags (Facebook, LinkedIn)
- ✅ Twitter Cards (summary_large_image)
- ✅ Schema.org JSON-LD: `Organization` + `LocalBusiness` + `WebSite`
- ✅ Image alt attributes on every image
- ✅ XML sitemap (`sitemap.xml`)
- ✅ `robots.txt` with sitemap reference
- ✅ Lazy loading on product images
- ✅ Geographical targeting: Tangerang, Tangerang Selatan, Kota Tangerang, Kabupaten Tangerang, Banten, Serang, Cilegon
- ✅ `lang="id"` on `<html>` for locale targeting
- ✅ Internal linking between sections
- ✅ Mobile-friendly (no horizontal overflow, touch-friendly buttons)

### Not Claimed
Per the project brief, the website does **not** claim:
- Official MBG/SPPG affiliation (without verified authorization)
- Stock availability, prices, or specifications
- Company history, certifications, or operational achievements

### Target Keywords (Primary)
- Supplier MBG
- Supplier SPPG
- Supplier bahan pangan
- Supplier beras MBG / Tangerang
- Supplier sayuran / buah Tangerang
- Supplier catering Banten
- Distributor bahan pokok Banten
- Supplier kebutuhan dapur
- Distributor bahan pangan

### Geographical Coverage
Tangerang · Tangerang Selatan · Kota Tangerang · Kabupaten Tangerang · Banten · Serang · Cilegon

---

## Accessibility

- Semantic landmark elements (`header`, `main`, `nav`, `footer`, `section`)
- Skip-to-content link (`<a href="#main">`)
- ARIA labels on icon-only buttons (nav toggle, back-to-top, floating WhatsApp)
- `aria-expanded` on mobile menu toggle
- `aria-live` on form success message and product grid loading
- Visible focus styles (`:focus-visible`)
- Color contrast meets WCAG AA on text/background combinations
- `prefers-reduced-motion` respected (animations disabled)
- All interactive elements are keyboard-navigable

---

## Browser Support

Tested on the latest stable versions of:
- Chrome / Edge (Chromium)
- Firefox
- Safari (macOS, iOS)

Uses widely-supported features: CSS Grid, Flexbox, CSS Custom Properties, `clamp()`, Intersection Observer, `loading="lazy"`, ES6 modules syntax. No polyfills needed for any browser released after 2020.

---

## Future Roadmap

The architecture is intentionally decoupled (JSON content + JS rendering) so the following can be added without restructuring:

- **Blog / Insights / News** section (route through a new JSON file + render component)
- **Portfolio / Case studies** section
- **Testimonials** block
- **CMS integration** (Strapi, Sanity, Contentful) — replace local JSON files with API calls in `components.js` and `products.js`
- **Multi-language** (ID + EN) via `?lang=en` parameter and parallel JSON files
- **Real contact backend** (Formspree, Getform, Netlify Forms, or custom API) — swap the WhatsApp-only flow in `contact.js` for an async `fetch` POST
- **Analytics** (GA4, Plausible, Umami) — add a script tag in `<head>`
- **WebP image variants** — add `<picture>` with `<source>` for optimal format negotiation
- **Service worker / PWA** for offline support

---

## License

© 2026 CV. Perdana Tangguh Sejahtera. All rights reserved.

The source code in this repository is proprietary to CV. Perdana Tangguh Sejahtera. Brand assets, logo, and content are not licensed for reuse without written permission.

---

**CV. Perdana Tangguh Sejahtera**
*Reliable Supply. Stronger Partnerships.*
