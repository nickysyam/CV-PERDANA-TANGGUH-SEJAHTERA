/* ==========================================================================
   main.js — Main Application Controller
   Coordinates initialization across all modules.
   ========================================================================== */

(function (global) {
  "use strict";

  function init() {
    /* All other modules self-initialize on DOMContentLoaded via their own IIFE.
       This file provides:
       - A central place to coordinate any cross-module init
       - Lazy-loading enhancement for images
       - Year injection for any [data-year] elements
       - Console branding for credibility
       */

    /* Console branding (visible to devs, not customers) */
    if (global.console && global.console.log) {
      console.log(
        "%c CV. Perdana Tangguh Sejahtera ",
        "background:#1D4ED8;color:#fff;padding:6px 12px;border-radius:4px;font-weight:bold;"
      );
      console.log(
        "%c Reliable Supply. Stronger Partnerships. ",
        "color:#1D4ED8;font-weight:bold;"
      );
    }

    /* Year injection */
    const year = new Date().getFullYear();
    document.querySelectorAll("[data-year]").forEach((n) => {
      n.textContent = String(year);
    });

    /* Native lazy loading fallback for browsers that don't support it */
    if ("loading" in HTMLImageElement.prototype === false) {
      /* Browsers without native lazy loading — most modern browsers support it though */
      /* Use IntersectionObserver to lazy load images */
      const lazyImgs = document.querySelectorAll('img[loading="lazy"]');
      if (lazyImgs.length > 0 && "IntersectionObserver" in global) {
        const imgObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target;
              if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute("data-src");
              }
              imgObserver.unobserve(img);
            }
          });
        }, { rootMargin: "200px" });
        lazyImgs.forEach((img) => imgObserver.observe(img));
      }
    }

    /* Mark document as JS-enabled (used for any CSS-only fallbacks) */
    document.documentElement.classList.add("js-ready");

    /* Page loaded event for analytics hooks (placeholder) */
    global.addEventListener("load", () => {
      document.dispatchEvent(new CustomEvent("pts:ready"));
    });
  }

  /* Expose API */
  global.PTSMain = { init };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(window);
