/* ==========================================================================
   animation.js — Scroll-triggered Reveal Animations & UI Interactions
   Uses Intersection Observer for performance. Respects prefers-reduced-motion.
   ========================================================================== */

(function (global) {
  "use strict";

  const REDUCED_MOTION = global.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----------------------------------------------------------------------
     Reveal on Scroll (Intersection Observer)
     ---------------------------------------------------------------------- */
  let observer = null;

  function initRevealObserver() {
    if (REDUCED_MOTION) {
      /* Just make everything visible immediately */
      document.querySelectorAll(".reveal").forEach((n) => n.classList.add("is-visible"));
      return;
    }

    if (!("IntersectionObserver" in global)) {
      /* Fallback: show all */
      document.querySelectorAll(".reveal").forEach((n) => n.classList.add("is-visible"));
      return;
    }

    if (observer) observer.disconnect();

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -10% 0px"
      }
    );
    observeReveals();
  }

  function observeReveals() {
    if (!observer) {
      initRevealObserver();
      return;
    }
    document.querySelectorAll(".reveal:not(.is-visible)").forEach((node) => observer.observe(node));
  }

  /* ----------------------------------------------------------------------
     Sticky Header on Scroll
     ---------------------------------------------------------------------- */
  function initStickyHeader() {
    const header = document.getElementById("header");
    if (!header) return;
    let ticking = false;
    function update() {
      if (global.scrollY > 8) {
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }
      ticking = false;
    }
    global.addEventListener("scroll", () => {
      if (!ticking) {
        global.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    update();
  }

  /* ----------------------------------------------------------------------
     Back to Top Button
     ---------------------------------------------------------------------- */
  function initBackToTop() {
    const btn = document.getElementById("backToTop");
    if (!btn) return;
    let ticking = false;
    function update() {
      if (global.scrollY > 400) {
        btn.classList.add("is-visible");
      } else {
        btn.classList.remove("is-visible");
      }
      ticking = false;
    }
    global.addEventListener("scroll", () => {
      if (!ticking) {
        global.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    btn.addEventListener("click", () => {
      if (REDUCED_MOTION) {
        global.scrollTo(0, 0);
      } else {
        global.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
    update();
  }

  /* ----------------------------------------------------------------------
     Hide Preloader
     ---------------------------------------------------------------------- */
  function hidePreloader() {
    const preloader = document.getElementById("preloader");
    if (!preloader) return;
    /* Wait until window is fully loaded */
    function hide() {
      setTimeout(() => preloader.classList.add("is-hidden"), 200);
    }
    if (document.readyState === "complete") {
      hide();
    } else {
      global.addEventListener("load", hide);
    }
  }

  /* ----------------------------------------------------------------------
     Smooth scroll for in-page anchors (with offset for sticky header)
     ---------------------------------------------------------------------- */
  function initSmoothScroll() {
    const header = document.getElementById("header");
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        const targetId = link.getAttribute("href");
        if (!targetId || targetId === "#") return;
        const target = document.querySelector(targetId);
        if (!target) return;
        e.preventDefault();
        const headerHeight = header ? header.getBoundingClientRect().height : 0;
        const top = target.getBoundingClientRect().top + global.scrollY - headerHeight - 8;
        if (REDUCED_MOTION) {
          global.scrollTo(0, top);
        } else {
          global.scrollTo({ top, behavior: "smooth" });
        }
        /* Update focus for accessibility */
        target.setAttribute("tabindex", "-1");
        setTimeout(() => target.focus({ preventScroll: true }), 400);
      });
    });
  }

  /* ----------------------------------------------------------------------
     Scroll-Spy: highlight active nav link based on visible section
     ---------------------------------------------------------------------- */
  function initScrollSpy() {
    const links = Array.from(document.querySelectorAll(".nav__link"));
    const sections = links
      .map((l) => document.querySelector(l.getAttribute("href")))
      .filter(Boolean);

    if (sections.length === 0) return;
    if (!("IntersectionObserver" in global)) return;

    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = `#${entry.target.id}`;
            links.forEach((l) => {
              l.classList.toggle("is-active", l.getAttribute("href") === id);
            });
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );

    sections.forEach((s) => spy.observe(s));
  }

  /* ----------------------------------------------------------------------
     Initialize on DOM ready
     ---------------------------------------------------------------------- */
  function init() {
    initRevealObserver();
    initStickyHeader();
    initBackToTop();
    initSmoothScroll();
    initScrollSpy();
    hidePreloader();
  }

  /* Expose API */
  global.PTSReveal = { init, observeReveals };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(window);
