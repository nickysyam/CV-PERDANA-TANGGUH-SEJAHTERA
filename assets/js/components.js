/* ==========================================================================
   components.js — Reusable UI Components for PTS Website
   Renders: About pillars, Services grid, Why-Choose grid, Process steps,
            Footer, Service-area chips. Handles dynamic content from JSON.
   ========================================================================== */

(function (global) {
  "use strict";

  /* ----------------------------------------------------------------------
     SVG Icon Library (inline, no external icon font dependencies)
     ---------------------------------------------------------------------- */
  const ICONS = {
    briefcase: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
    "check-circle": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    handshake: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><path d="M20 22c-2 0-3-1-3-3 0 2-1 3-3 3s-3-1-3-3c0 2-1 3-3 3s-3-1-3-3v-7l4-4 4 4 4-4 4 4v7c0 2-1 3-3 3z"/><path d="M8 14v5"/><path d="M16 14v5"/></svg>',
    "shopping-cart": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',
    box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
    "calendar-check": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><polyline points="9 16 17 16"/></svg>',
    headset: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
    tag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>',
    "shield-check": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>',
    refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.967-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.608.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.371-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
    "map-pin": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>'
  };

  function getIcon(name) {
    return ICONS[name] || ICONS["check-circle"];
  }

  /* ----------------------------------------------------------------------
     Tiny DOM helpers
     ---------------------------------------------------------------------- */
  function el(id) { return document.getElementById(id); }
  function create(tag, attrs) {
    const node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach((k) => {
        if (k === "class") node.className = attrs[k];
        else if (k === "html") node.innerHTML = attrs[k];
        else if (k.startsWith("data-")) node.setAttribute(k, attrs[k]);
        else if (k === "dataset") Object.assign(node.dataset, attrs[k]);
        else node.setAttribute(k, attrs[k]);
      });
    }
    return node;
  }

  /* ----------------------------------------------------------------------
     Render: About Pillars
     ---------------------------------------------------------------------- */
  function renderAboutPillars(pillars) {
    const container = el("aboutPillars");
    if (!container || !Array.isArray(pillars)) return;
    container.innerHTML = pillars.map((p, i) => `
      <article class="pillar reveal" data-delay="${(i % 4) + 1}">
        <span class="pillar__icon" aria-hidden="true">${getIcon(p.icon)}</span>
        <h3 class="pillar__title">${p.title}</h3>
        <p class="pillar__text">${p.description}</p>
      </article>
    `).join("");
  }

  /* ----------------------------------------------------------------------
     Render: Services Grid
     ---------------------------------------------------------------------- */
  function renderServices(services) {
    const container = el("servicesGrid");
    if (!container || !Array.isArray(services)) return;
    container.innerHTML = services.map((s, i) => `
      <article class="service-card reveal" data-delay="${(i % 3) + 1}">
        <span class="service-card__index" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span>
        <span class="service-card__icon" aria-hidden="true">${getIcon(s.icon)}</span>
        <h3 class="service-card__title">${s.title}</h3>
        <p class="service-card__text">${s.description}</p>
      </article>
    `).join("");
  }

  /* ----------------------------------------------------------------------
     Render: Why Choose Us Grid
     ---------------------------------------------------------------------- */
  function renderWhyChoose(items) {
    const container = el("whyGrid");
    if (!container || !Array.isArray(items)) return;
    container.innerHTML = items.map((item, i) => `
      <article class="why-card reveal" data-delay="${(i % 3) + 1}">
        <span class="why-card__icon" aria-hidden="true">${getIcon(item.icon)}</span>
        <div class="why-card__body">
          <h3>${item.title}</h3>
          <p>${item.description}</p>
        </div>
      </article>
    `).join("");
  }

  /* ----------------------------------------------------------------------
     Render: Process Steps
     ---------------------------------------------------------------------- */
  function renderProcess(steps) {
    const container = el("processGrid");
    if (!container || !Array.isArray(steps)) return;
    container.innerHTML = steps.map((s, i) => `
      <article class="process-step reveal" data-delay="${(i % 3) + 1}">
        <span class="process-step__num" aria-hidden="true">${s.step}</span>
        <h3 class="process-step__title">${s.title}</h3>
        <p class="process-step__text">${s.description}</p>
      </article>
    `).join("");
  }

  /* ----------------------------------------------------------------------
     Render: Service Area Chips
     ---------------------------------------------------------------------- */
  function renderServiceArea(areas) {
    const container = el("serviceAreaChips");
    if (!container || !Array.isArray(areas)) return;
    container.innerHTML = areas.map((a) =>
      `<span class="service-area__chip">${a}</span>`
    ).join("");
  }

  /* ----------------------------------------------------------------------
     Render: Footer
     ---------------------------------------------------------------------- */
  function renderFooter(company) {
    const grid = el("footerGrid");
    if (!grid) return;

    const c = company.contact || {};
    const s = company.social || {};

    grid.innerHTML = `
  <div class="footer__brand">
    <div class="footer__logo">
      <img
        src="assets/images/Perdana Tangguh Sejahtera Logo.png"
        alt="Logo Perdana Tangguh Sejahtera"
        class="footer__logo-img"
      />
      <span class="footer__logo-text">
        <strong>Perdana Tangguh Sejahtera</strong>
        <span>Food Supply &amp; Distribution</span>
      </span>
    </div>
        <p class="footer__tagline">${company.brandMessage || company.tagline || ""}</p>
        <div class="footer__social">
          ${s.instagram ? `<a href="${s.instagram}" aria-label="Instagram" target="_blank" rel="noopener">${getIcon("instagram")}</a>` : ""}
          ${s.facebook ? `<a href="${s.facebook}" aria-label="Facebook" target="_blank" rel="noopener">${getIcon("facebook")}</a>` : ""}
          ${s.linkedin ? `<a href="${s.linkedin}" aria-label="LinkedIn" target="_blank" rel="noopener">${getIcon("linkedin")}</a>` : ""}
        </div>
      </div>

      <div>
        <h4 class="footer__col-title">Navigasi</h4>
        <ul class="footer__links">
          <li><a href="#beranda">Beranda</a></li>
          <li><a href="#tentang">Tentang Kami</a></li>
          <li><a href="#layanan">Layanan</a></li>
          <li><a href="#produk">Produk</a></li>
          <li><a href="#keunggulan">Keunggulan</a></li>
          <li><a href="#proses">Proses Kerja Sama</a></li>
          <li><a href="#kontak">Kontak</a></li>
        </ul>
      </div>

      <div>
        <h4 class="footer__col-title">Layanan</h4>
        <ul class="footer__links">
          <li><a href="#layanan">Food Supply &amp; Procurement</a></li>
          <li><a href="#layanan">Bulk Purchasing</a></li>
          <li><a href="#layanan">Recurring Supply Solutions</a></li>
          <li><a href="#layanan">Business Procurement Support</a></li>
          <li><a href="#layanan">Product Sourcing</a></li>
          <li><a href="#layanan">Distribution Coordination</a></li>
        </ul>
      </div>

      <div>
        <h4 class="footer__col-title">Kontak</h4>
        <ul class="footer__contact">
          <li>${getIcon("whatsapp")}<span>${c.whatsappDisplay || ""}</span></li>
          <li>${getIcon("mail")}<span>${c.email || ""}</span></li>
          <li>${getIcon("map-pin")}<span>${c.addressFull || c.address || ""}</span></li>
        </ul>
      </div>
    `;

    /* Update copyright year */
    const cr = el("footerCopyright");
    if (cr) {
      const year = new Date().getFullYear();
      cr.textContent = `\u00A9 ${year} ${company.name}. All rights reserved.`;
    }

    /* Update contact displays in contact section */
    const waDisplay = el("waDisplay");
    const waButton = el("waButton");
    const emailDisplay = el("emailDisplay");
    const emailButton = el("emailButton");
    const addressDisplay = el("addressDisplay");
    const floatingWa = el("floatingWa");

    if (waDisplay && c.whatsappDisplay) waDisplay.textContent = c.whatsappDisplay;
    if (waButton && c.whatsapp) {
      const url = `https://wa.me/${c.whatsapp}?text=${encodeURIComponent("Halo PTS, saya ingin mengetahui lebih lanjut tentang supply bahan pangan.")}`;
      waButton.setAttribute("href", url);
    }
    if (emailDisplay && c.email) emailDisplay.textContent = c.email;
    if (emailButton && c.email) emailButton.setAttribute("href", `mailto:${c.email}`);
    if (addressDisplay && c.addressFull) addressDisplay.textContent = c.addressFull;
    if (floatingWa && c.whatsapp) {
      const url = `https://wa.me/${c.whatsapp}?text=${encodeURIComponent("Halo PTS, saya ingin mengetahui lebih lanjut tentang supply bahan pangan.")}`;
      floatingWa.setAttribute("href", url);
    }
  }

  /* ----------------------------------------------------------------------
     Mobile Navigation Toggle
     ---------------------------------------------------------------------- */
  function initMobileNav() {
    const toggle = el("navToggle");
    const nav = el("nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      toggle.classList.toggle("is-active", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Tutup menu navigasi" : "Buka menu navigasi");
      document.body.classList.toggle("nav-open", isOpen);
    });

    /* Close mobile nav when clicking any nav link */
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.classList.remove("is-active");
        toggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("nav-open");
      });
    });

    /* Close mobile nav on Escape */
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.classList.remove("is-active");
        toggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("nav-open");
      }
    });

    /* Reset on resize to large */
    let resizeTimer = null;
    global.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (global.innerWidth > 991) {
          nav.classList.remove("is-open");
          toggle.classList.remove("is-active");
          toggle.setAttribute("aria-expanded", "false");
          document.body.classList.remove("nav-open");
        }
      }, 100);
    });
  }

  /* ----------------------------------------------------------------------
     Initialize — Fetch company.json and render all dynamic components
     ---------------------------------------------------------------------- */
  async function init() {
    try {
      const res = await fetch("data/company.json", { cache: "no-cache" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const company = await res.json();

      if (company.about) renderAboutPillars(company.about.pillars);
      renderWhyChoose(company.whyChoose);
      renderProcess(company.process);
      if (company.contact && company.contact.serviceArea) renderServiceArea(company.contact.serviceArea);
      renderFooter(company);

      /* Render services from services.json */
      const sRes = await fetch("data/services.json", { cache: "no-cache" });
      if (sRes.ok) {
        const services = await sRes.json();
        if (services.services) renderServices(services.services);
      }

      /* Re-init reveal observers for newly injected elements */
      if (global.PTSReveal && typeof global.PTSReveal.observeReveals === "function") {
        global.PTSReveal.observeReveals();
      }
    } catch (err) {
      console.error("[components.js] Failed to load dynamic content:", err);
    }

    initMobileNav();
  }

  /* Expose API */
  global.PTSComponents = {
    init,
    renderServices,
    renderAboutPillars,
    renderWhyChoose,
    renderProcess,
    renderServiceArea,
    renderFooter,
    getIcon
  };

  /* Auto-init on DOMContentLoaded */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(window);
