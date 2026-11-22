
/* ==========================================================================
   contact.js — Contact Form Validation & WhatsApp Submission
   CV. Perdana Tangguh Sejahtera
   ========================================================================== */

(function (global) {
  "use strict";

  // NOMOR TUJUAN WHATSAPP BISNIS PTS (FIXED)
  const BUSINESS_WHATSAPP = "6285111691818";

  function el(id) {
    return document.getElementById(id);
  }

  // Validasi nomor HP Indonesia
  const PHONE_REGEX = /^(?:\+?62|0)8[1-9][0-9]{6,11}$/;

  function sanitizePhone(value) {
    return value.replace(/[\s\-.()]/g, "");
  }

  function setFieldError(field, show) {
    const errorEl = document.querySelector(
      `.form-error[data-for="${field.id}"]`
    );

    if (errorEl) {
      errorEl.classList.toggle("is-visible", show);
    }

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

    const fields = form.querySelectorAll(
      "input[required], textarea[required], select[required]"
    );

    fields.forEach((field) => {
      if (!validateField(field)) {
        valid = false;
      }
    });

    return valid;
  }

  // Membuat isi pesan inquiry
  function buildWhatsAppMessage(data) {
    const lines = [
      "HALO CV. PERDANA TANGGUH SEJAHTERA",
      "INQUIRY SUPPLY BAHAN PANGAN",
      "",
      "Saya ingin mengajukan inquiry supply dengan detail berikut:",
      "",
      `Nama: ${data.fullName}`,
      `Bisnis/Institusi: ${data.businessName}`,
      `WhatsApp Customer: ${data.whatsapp}`,
    ];

    if (data.productRequirements) {
      lines.push(`Kebutuhan Produk: ${data.productRequirements}`);
    }

    if (data.supplyNeeds) {
      lines.push(`Estimasi Kebutuhan: ${data.supplyNeeds}`);
    }

    if (data.deliveryLocation) {
      lines.push(`Lokasi Pengiriman: ${data.deliveryLocation}`);
    }

    if (data.additionalNotes) {
      lines.push("");
      lines.push(`Catatan Tambahan: ${data.additionalNotes}`);
    }

    lines.push("");
    lines.push("Mohon informasi lebih lanjut dan quotation.");
    lines.push("Terima kasih.");

    return lines.join("\n");
  }

  // Mengambil data form
  function getFormData(form) {
    return {
      fullName: form.elements.namedItem("fullName").value.trim(),
      businessName: form.elements.namedItem("businessName").value.trim(),
      whatsapp: form.elements.namedItem("whatsapp").value.trim(),
      productRequirements: form.elements.namedItem("productRequirements").value.trim(),
      supplyNeeds: form.elements.namedItem("supplyNeeds").value.trim(),
      deliveryLocation: form.elements.namedItem("deliveryLocation").value.trim(),
      additionalNotes: form.elements.namedItem("additionalNotes").value.trim()
    };
  }

  function init() {
    const form = el("contactForm");

    if (!form) return;

    const successEl = el("formSuccess");
    const successMsg = el("formSuccessMsg");
    const submitBtn = el("submitBtn");
    const resetBtn = el("resetBtn");

    // Live validation
    form.querySelectorAll("input, textarea, select").forEach((field) => {
      field.addEventListener("blur", () => validateField(field));

      field.addEventListener("input", () => {
        if (field.classList.contains("is-invalid")) {
          validateField(field);
        }
      });
    });

    // Submit inquiry
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      successEl.classList.remove("is-visible");

      if (!validateForm(form)) {
        const firstInvalid = form.querySelector(".is-invalid");

        if (firstInvalid) {
          firstInvalid.focus();
        }

        return;
      }

      const data = getFormData(form);

      // Buat pesan berdasarkan input pelanggan
      const message = buildWhatsAppMessage(data);

      // TUJUAN SELALU WHATSAPP BISNIS PTS
      // Tidak menggunakan nomor WhatsApp pelanggan sebagai tujuan.
      const url =
        `https://wa.me/${BUSINESS_WHATSAPP}?text=${encodeURIComponent(message)}`;

      // Tampilkan status inquiry
      successMsg.innerHTML = `
        Inquiry Anda berhasil disiapkan.
        <br><br>
        <a href="${url}"
           class="btn btn--whatsapp"
           target="_blank"
           rel="noopener noreferrer"
           style="display:inline-flex;align-items:center;gap:8px;">
          Kirim ke WhatsApp PTS
        </a>
      `;

      successEl.classList.add("is-visible");

      successEl.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

      // Buka WhatsApp bisnis PTS
      // Dilakukan langsung saat submit agar tidak tertahan popup blocker.
      global.open(url, "_blank", "noopener,noreferrer");

      // Update tombol
      if (submitBtn) {
        const originalHTML = submitBtn.innerHTML;

        submitBtn.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2"
               stroke-linecap="round" stroke-linejoin="round"
               width="18" height="18">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Inquiry Disiapkan
        `;

        setTimeout(() => {
          submitBtn.innerHTML = originalHTML;
        }, 2500);
      }
    });

    // Reset form
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        form.querySelectorAll(".is-invalid").forEach((field) => {
          field.classList.remove("is-invalid");
          field.removeAttribute("aria-invalid");
        });

        form.querySelectorAll(".form-error").forEach((error) => {
          error.classList.remove("is-visible");
        });

        if (successEl) {
          successEl.classList.remove("is-visible");
        }
      });
    }
  }

  // Expose API
  global.PTSContact = {
    init,
    validateForm,
    validateField
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})(window);
