/* ==========================================================================
   contact.js — Contact Form Validation & WhatsApp Submission
   - Validates required fields
   - Validates WhatsApp number format (Indonesian)
   - Constructs prefilled WhatsApp message
   - Shows success state and provides WhatsApp deep link
   ========================================================================== */

(function (global) {
  "use strict";

  function el(id) { return document.getElementById(id); }

  /* Indonesian mobile number validation: starts with 08 or +62 8, length 10-15 digits */
  const PHONE_REGEX = /^(\+62|62|0)8[1-9][0-9]{6,12}$/;

  function sanitizePhone(value) {
    return value.replace(/[\s\-.()]/g, "");
  }

  function normalizePhoneForWhatsApp(value) {
    /* Strip leading 0, prepend 62 */
    let v = sanitizePhone(value);
    if (v.startsWith("0")) v = "62" + v.slice(1);
    if (v.startsWith("+62")) v = v.slice(1);
    return v;
  }

  function setFieldError(field, show) {
    const errorEl = document.querySelector(`.form-error[data-for="${field.id}"]`);
    if (errorEl) errorEl.classList.toggle("is-visible", show);
    field.classList.toggle("is-invalid", show);
    if (show) {
      field.setAttribute("aria-invalid", "true");
    } else {
      field.removeAttribute("aria-invalid");
    }
  }

  function validateField(field) {
    const value = (field.value || "").trim();

    if (field.hasAttribute("required") && !value) {
      setFieldError(field, true);
      return false;
    }

    if (field.id === "whatsapp" && value) {
      const clean = sanitizePhone(value);
      if (!PHONE_REGEX.test(clean)) {
        setFieldError(field, true);
        return false;
      }
    }

    setFieldError(field, false);
    return true;
  }

  function validateForm(form) {
    let valid = true;
    const fields = form.querySelectorAll("input[required], textarea[required], select[required]");
    fields.forEach((f) => {
      if (!validateField(f)) valid = false;
    });
    return valid;
  }

  function buildWhatsAppMessage(data) {
    const lines = [
      "Halo CV. Perdana Tangguh Sejahtera,",
      "",
      "Saya ingin mengajukan inquiry supply bahan pangan dengan detail berikut:",
      "",
      `Nama: ${data.fullName}`,
      `Bisnis/Institusi: ${data.businessName}`,
      `WhatsApp: ${data.whatsapp}`,
    ];
    if (data.productRequirements) lines.push(`Kebutuhan Produk: ${data.productRequirements}`);
    if (data.supplyNeeds) lines.push(`Estimasi Kebutuhan: ${data.supplyNeeds}`);
    if (data.deliveryLocation) lines.push(`Lokasi Pengiriman: ${data.deliveryLocation}`);
    if (data.additionalNotes) {
      lines.push("");
      lines.push(`Catatan: ${data.additionalNotes}`);
    }
    lines.push("");
    lines.push("Mohon informasi lebih lanjut dan quotation. Terima kasih.");
    return lines.join("\n");
  }

  function getFormData(form) {
    return {
      fullName: (form.fullName.value || "").trim(),
      businessName: (form.businessName.value || "").trim(),
      whatsapp: (form.whatsapp.value || "").trim(),
      productRequirements: (form.productRequirements.value || "").trim(),
      supplyNeeds: (form.supplyNeeds.value || "").trim(),
      deliveryLocation: (form.deliveryLocation.value || "").trim(),
      additionalNotes: (form.additionalNotes.value || "").trim()
    };
  }

  function init() {
    const form = el("contactForm");
    if (!form) return;

    const successEl = el("formSuccess");
    const successMsg = el("formSuccessMsg");
    const submitBtn = el("submitBtn");
    const resetBtn = el("resetBtn");

    /* Live validation: blur event */
    form.querySelectorAll("input, textarea, select").forEach((field) => {
      field.addEventListener("blur", () => validateField(field));
      field.addEventListener("input", () => {
        if (field.classList.contains("is-invalid")) validateField(field);
      });
    });

    /* Submit handler */
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      successEl.classList.remove("is-visible");

      if (!validateForm(form)) {
        /* Focus first invalid field */
        const firstInvalid = form.querySelector(".is-invalid");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const data = getFormData(form);
      const phone = normalizePhoneForWhatsApp(data.whatsapp);
      const message = buildWhatsAppMessage(data);
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

      /* Show success */
      successMsg.innerHTML = `Inquiry Anda siap dikirim. Klik tombol di bawah untuk membuka WhatsApp dengan pesan otomatis.
        <br><br>
        <a href="${url}" class="btn btn--whatsapp" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:8px;">
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.967-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.608.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.371-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/></svg>
          Kirim ke WhatsApp
        </a>`;
      successEl.classList.add("is-visible");
      successEl.scrollIntoView({ behavior: "smooth", block: "center" });

      /* Also auto-open WhatsApp in new tab (after slight delay so user sees success) */
      setTimeout(() => {
        try {
          global.open(url, "_blank", "noopener,noreferrer");
        } catch (err) {
          /* Pop-up blocked — user can still click the link in success message */
        }
      }, 600);

      /* Update submit button label briefly */
      if (submitBtn) {
        const originalHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg> Inquiry Dikirim`;
        setTimeout(() => { submitBtn.innerHTML = originalHTML; }, 2500);
      }
    });

    /* Reset handler */
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        form.reset();
        form.querySelectorAll(".is-invalid").forEach((f) => f.classList.remove("is-invalid"));
        form.querySelectorAll(".form-error").forEach((e) => e.classList.remove("is-visible"));
        if (successEl) successEl.classList.remove("is-visible");
      });
    }
  }

  /* Expose API */
  global.PTSContact = { init, validateForm, validateField };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(window);
