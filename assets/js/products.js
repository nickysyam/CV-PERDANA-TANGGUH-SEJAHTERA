/* ==========================================================================
   products.js — Dynamic Product Cards Loader
   Loads products.json and renders product cards with inquiry CTAs.
   Handles loading skeleton, error, and empty states.
   ========================================================================== */

(function (global) {
  "use strict";

  function el(id) { return document.getElementById(id); }

  function escapeHtml(s) {
    if (typeof s !== "string") return "";
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function showSkeletons(container, count) {
    container.innerHTML = Array.from({ length: count })
      .map(() => `<div class="product-skeleton" aria-hidden="true"></div>`)
      .join("");
  }

  function buildWhatsAppLink(productName) {
    const message = `Halo PTS, saya tertarik untuk inquiry produk: ${productName}. Mohon info lebih lanjut mengenai ketersediaan dan quotation.`;
    return `https://wa.me/6281200000000?text=${encodeURIComponent(message)}`;
  }

  function renderProduct(product) {
    const link = buildWhatsAppLink(product.name);
    return `
      <article class="product-card reveal" data-delay="${(Math.floor(Math.random() * 4) + 1)}">
        <div class="product-card__media">
          <img
            src="${product.image}"
            alt="${escapeHtml(product.imageAlt || product.name)}"
            loading="lazy"
            width="800"
            height="600"
            onerror="this.onerror=null;this.src='data:image/svg+xml;utf8,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 800 600\\'%3E%3Crect width=\\'800\\' height=\\'600\\' fill=\\'%23EFF6FF\\'/%3E%3Ctext x=\\'400\\' y=\\'300\\' font-family=\\'Arial\\' font-size=\\'28\\' fill=\\'%231D4ED8\\' text-anchor=\\'middle\\'%3E${encodeURIComponent(escapeHtml(product.name))}%3C/text%3E%3C/svg%3E';"
          />
          <span class="product-card__tag">${escapeHtml(product.category || "")}</span>
        </div>
        <div class="product-card__body">
          <h3 class="product-card__title">${escapeHtml(product.name)}</h3>
          <p class="product-card__text">${escapeHtml(product.shortDescription || "")}</p>
          <a class="product-card__action" href="${link}" target="_blank" rel="noopener" aria-label="Inquiry ${escapeHtml(product.name)} via WhatsApp">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="16" height="16"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.967-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.608.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.371-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885"/></svg>
            Inquiry Produk
          </a>
        </div>
      </article>
    `;
  }

  function renderProducts(products) {
    const container = el("productsGrid");
    if (!container) return;
    container.innerHTML = products.map(renderProduct).join("");
    /* Re-trigger reveal observer for new cards */
    if (global.PTSReveal && typeof global.PTSReveal.observeReveals === "function") {
      global.PTSReveal.observeReveals();
    }
  }

  function renderError(message) {
    const container = el("productsGrid");
    if (!container) return;
    container.innerHTML = `
      <div class="products__error" role="alert">
        <strong>Gagal memuat produk</strong>
        <p>${escapeHtml(message)}. Silakan refresh halaman atau hubungi kami langsung via WhatsApp.</p>
      </div>
    `;
  }

  async function loadProducts() {
    const container = el("productsGrid");
    if (!container) return;
    showSkeletons(container, 8);
    try {
      const res = await fetch("data/products.json", { cache: "no-cache" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!data.products || !Array.isArray(data.products) || data.products.length === 0) {
        throw new Error("Data produk kosong");
      }
      renderProducts(data.products);
    } catch (err) {
      console.error("[products.js] Failed to load products:", err);
      renderError(err.message || "Terjadi kesalahan");
    }
  }

  /* Expose API */
  global.PTSProducts = {
    load: loadProducts,
    render: renderProducts
  };

  /* Auto-init on DOMContentLoaded */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadProducts);
  } else {
    loadProducts();
  }
})(window);
