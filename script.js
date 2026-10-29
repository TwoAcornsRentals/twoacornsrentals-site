/* Two Acorns Event Rentals — interactions */
(() => {
  "use strict";

  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxoNVdcTKanivuoXvZzHPMJ3fjKiCh31DdeUd0tNyFWi6C_PQP76uG095QwQ_CiCyma/exec";

  const navToggle = document.querySelector(".nav-toggle");
  const mainNav = document.querySelector(".main-nav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      const open = mainNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }));
  }

  const quoteForm = document.getElementById("contact-form");
  const quoteEn = document.getElementById("quote-lang-en");
  const quoteEs = document.getElementById("quote-lang-es");
  const quoteLanguageValue = document.getElementById("quote-language-value");
  let quoteLanguage = "en";

  function setQuoteLanguage(lang) {
    quoteLanguage = lang;
    quoteLanguageValue.value = lang === "es" ? "Spanish" : "English";
    quoteEn.classList.toggle("active", lang === "en");
    quoteEs.classList.toggle("active", lang === "es");
    quoteEn.setAttribute("aria-pressed", String(lang === "en"));
    quoteEs.setAttribute("aria-pressed", String(lang === "es"));
    quoteForm.querySelectorAll("[data-en][data-es]").forEach(el => {
      el.textContent = el.dataset[lang];
    });
    quoteForm.querySelectorAll("[data-placeholder-en][data-placeholder-es]").forEach(el => {
      el.placeholder = el.dataset[lang === "es" ? "placeholderEs" : "placeholderEn"];
    });
    const submit = document.getElementById("quote-submit-btn");
    submit.textContent = lang === "es" ? "Enviar solicitud de cotización" : "Send Quote Request";
    // Only the form changes language, not the whole page, so search engines and
    // screen readers still see an English page.
    quoteForm.lang = lang;
  }
  if (quoteEn && quoteEs) {
    quoteEn.addEventListener("click", () => setQuoteLanguage("en"));
    quoteEs.addEventListener("click", () => setQuoteLanguage("es"));
  }

  function showStatus(el, message, type = "") {
    if (!el) return;
    el.textContent = message;
    el.className = "form-status" + (type ? " " + type : "");
    el.hidden = false;
  }

  function prepareFormPost(form, button, status, defaultButtonText, beforeSubmit) {
    if (!form) return;
    form.addEventListener("submit", event => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      if (beforeSubmit && !beforeSubmit()) return;
      const data = new FormData(form);
      const email = (data.get("Email") || "").toString().trim();
      const phone = (data.get("Phone") || "").toString().trim();
      if (form.id === "contact-form" && !email && !phone) {
        showStatus(status, quoteLanguage === "es"
          ? "Por favor, introduzca un correo electrónico o un número de teléfono."
          : "Please enter an email address or phone number.", "error");
        return;
      }
      if ((data.get("botcheck") || "").toString().trim()) return;

      // POST is submitted by the form itself to a hidden iframe. Apps Script redirects
      // cross-origin, so browser JavaScript cannot safely read its final response.
      // We deliberately do not claim that the spreadsheet recorded the request.
      form.action = SCRIPT_URL;
      button.disabled = true;
      button.textContent = quoteLanguage === "es" && form.id === "contact-form" ? "Enviando…" : "Submitting…";
      showStatus(status, quoteLanguage === "es" && form.id === "contact-form"
        ? "Enviando su solicitud…"
        : "Sending your submission…");
      form.submit();

      window.setTimeout(() => {
        button.disabled = false;
        button.textContent = defaultButtonText();
        showStatus(status, quoteLanguage === "es" && form.id === "contact-form"
          ? "El formulario se envió desde su navegador, pero no podemos confirmar que se haya guardado. Si no recibe respuesta, llámenos al (910) 707-4312."
          : "Your browser sent the form to the submission service, but this page cannot confirm it was saved. If you do not hear back, call (910) 707-4312.", "sent");
      }, 1200);
    });
  }

  prepareFormPost(
    quoteForm,
    document.getElementById("quote-submit-btn"),
    document.getElementById("quote-form-status"),
    () => quoteLanguage === "es" ? "Enviar solicitud de cotización" : "Send Quote Request"
  );

  const agreementForm = document.getElementById("rental-agreement-form");
  let agreementLanguage = "en";

  // Only these fields are required. Everything else (delivery/pickup time, return date and time,
  // quantities, other items) is optional, so someone renting only tables or only a game
  // can leave the chair/table counts empty.
  const REQUIRED_IDS = {
    en: ["ra-name-en", "ra-phone-en", "ra-email-en", "ra-date-en", "ra-address-en", "ra-delivery-en", "ra-sig-en", "ra-sig-date-en"],
    es: ["ra-name-es", "ra-phone-es", "ra-email-es", "ra-date-es", "ra-address-es", "ra-delivery-es", "ra-sig-es", "ra-sig-date-es"]
  };

  const priceInputs = {
    en: { chairs: document.getElementById("ra-chairs-en"), tables: document.getElementById("ra-tables-en"), total: document.getElementById("ra-total-en") },
    es: { chairs: document.getElementById("ra-chairs-es"), tables: document.getElementById("ra-tables-es"), total: document.getElementById("ra-total-es") }
  };
  function calculateTotal(lang) {
    const fields = priceInputs[lang];
    if (!fields.chairs || !fields.tables || !fields.total) return;
    // An empty box counts as 0
    const chairs = Math.max(0, parseInt(fields.chairs.value, 10) || 0);
    const tables = Math.max(0, parseInt(fields.tables.value, 10) || 0);
    fields.total.value = (chairs * 2 + tables * 10).toFixed(2);
  }
  Object.keys(priceInputs).forEach(lang => {
    [priceInputs[lang].chairs, priceInputs[lang].tables].forEach(input => {
      if (input) input.addEventListener("input", () => calculateTotal(lang));
    });
    calculateTotal(lang);
  });

  // Keep corresponding fields synchronized, but disable the inactive language's controls
  // so FormData only submits one value for each backend field name.
  const agreementPairs = [
    ["ra-name-en", "ra-name-es"], ["ra-phone-en", "ra-phone-es"],["ra-email-en", "ra-email-es"],
    ["ra-date-en", "ra-date-es"], ["ra-address-en", "ra-address-es"],
    ["ra-time-en", "ra-time-es"], ["ra-pdate-en", "ra-pdate-es"],
    ["ra-ptime-en", "ra-ptime-es"], ["ra-chairs-en", "ra-chairs-es"],
    ["ra-tables-en", "ra-tables-es"], ["ra-other-en", "ra-other-es"],
    ["ra-delivery-en", "ra-delivery-es"], ["ra-total-en", "ra-total-es"],
    ["ra-sig-en", "ra-sig-es"], ["ra-sig-date-en", "ra-sig-date-es"]
  ];
  agreementPairs.forEach(([enId, esId]) => {
    const en = document.getElementById(enId);
    const es = document.getElementById(esId);
    if (!en || !es) return;
    // "input" fires for text boxes, date/time pickers, and dropdowns in current browsers;
    // "change" is added as a safety net for dropdowns.
    ["input", "change"].forEach(evt => {
      en.addEventListener(evt, () => { es.value = en.value; calculateTotal("en"); calculateTotal("es"); });
      es.addEventListener(evt, () => { en.value = es.value; calculateTotal("en"); calculateTotal("es"); });
    });
  });

  function setRentalLang(lang) {
    agreementLanguage = lang;
    const enBlock = document.getElementById("ra-content-en");
    const esBlock = document.getElementById("ra-content-es");
    const enButton = document.getElementById("btn-lang-en");
    const esButton = document.getElementById("btn-lang-es");
    const submit = document.getElementById("ra-submit-btn");
    const languageValue = document.getElementById("agreement-language-value");
    enBlock.hidden = lang !== "en";
    esBlock.hidden = lang !== "es";
    enBlock.querySelectorAll("input, select").forEach(input => {
      input.disabled = lang !== "en";
      input.required = lang === "en" && REQUIRED_IDS.en.includes(input.id);
    });
    esBlock.querySelectorAll("input, select").forEach(input => {
      input.disabled = lang !== "es";
      input.required = lang === "es" && REQUIRED_IDS.es.includes(input.id);
    });
    enButton.classList.toggle("active", lang === "en");
    esButton.classList.toggle("active", lang === "es");
    enButton.setAttribute("aria-pressed", String(lang === "en"));
    esButton.setAttribute("aria-pressed", String(lang === "es"));
    languageValue.value = lang === "es" ? "Spanish" : "English";
    submit.textContent = lang === "es" ? "Enviar acuerdo de alquiler" : "Submit Rental Agreement";
    document.getElementById("ra-form-status").hidden = true;
  }
  window.setRentalLang = setRentalLang;
  document.getElementById("btn-lang-en").addEventListener("click", () => setRentalLang("en"));
  document.getElementById("btn-lang-es").addEventListener("click", () => setRentalLang("es"));
  setRentalLang("en");

  const agreementButton = document.getElementById("ra-submit-btn");
  const agreementStatus = document.getElementById("ra-form-status");
  prepareFormPost(agreementForm, agreementButton, agreementStatus,
    () => agreementLanguage === "es" ? "Enviar acuerdo de alquiler" : "Submit Rental Agreement",
    () => {
      for (const id of REQUIRED_IDS[agreementLanguage]) {
        const field = document.getElementById(id);
        if (!field.value.trim()) {
          field.reportValidity();
          field.focus();
          return false;
        }
      }
      // The inactive language block is disabled; ensure active values are ready.
      calculateTotal(agreementLanguage);
      return true;
    }
  );

  // The native form submit call bypasses the submit event, which is intentional after validation.
  // Make sure the inactive language's fields never get submitted.
  agreementForm.addEventListener("submit", () => {
    const hidden = agreementLanguage === "en" ? document.getElementById("ra-content-es") : document.getElementById("ra-content-en");
    hidden.querySelectorAll("input, select").forEach(input => input.disabled = true);
  });

  // Gallery photos: Cloudflare Pages is case-sensitive, so "Connect-4.JPG" is not "connect-4.jpg".
  // If a photo fails to load, try the same name with other common extensions/cases.
  // If none work, hide that tile (instead of a broken-image icon) and log the missing file
  // in the browser console (F12 > Console) so it is easy to spot.
  const PHOTO_EXTS = [".jpg", ".jpeg", ".png", ".webp", ".JPG", ".JPEG", ".PNG"];
  document.querySelectorAll(".photo-item img").forEach(img => {
    const original = img.getAttribute("src");
    const base = original.replace(/\.[^.]+$/, "");
    let i = 0;
    const tryNext = () => {
      while (i < PHOTO_EXTS.length && base + PHOTO_EXTS[i] === original) i++;
      if (i >= PHOTO_EXTS.length) {
        console.warn("Gallery photo not found on the site:", original);
        const tile = img.closest(".photo-item");
        if (tile) tile.hidden = true;
        return;
      }
      img.src = base + PHOTO_EXTS[i++];
    };
    img.addEventListener("error", tryNext);
    if (img.complete && img.naturalWidth === 0 && img.getAttribute("src")) tryNext();
  });
})();
