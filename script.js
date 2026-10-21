// ===== Mobile Nav Toggle =====
const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ===== Smooth Scroll Offset =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId && targetId !== '#') {
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 88; // header height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  });
});

// ===== Backend Form Submission URL =====
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyc8213sWf-zD_Xv9tO9xX3qN6GqR0V3kP1mX2lY4zQ5wJ8tV7bN9mK1xL3pQ5sW2vY/exec"; // Replace if needed

// ===== Quote Form Handler =====
document.addEventListener('DOMContentLoaded', () => {
  const quoteBtn = document.getElementById('quote-submit-btn');
  if (quoteBtn) {
    quoteBtn.addEventListener('click', () => {
      const form = document.getElementById('contact-form');
      const successMsg = document.getElementById('quote-form-success');
      
      const formData = new FormData(form);
      quoteBtn.disabled = true;
      quoteBtn.textContent = "Sending...";

      fetch(SCRIPT_URL, { method: 'POST', body: formData })
        .then(res => res.json())
        .then(data => {
          quoteBtn.disabled = false;
          quoteBtn.textContent = "Send Request";
          successMsg.hidden = false;
          form.reset();
        })
        .catch(err => {
          // Fallback if CORS/network blocks direct fetch response
          quoteBtn.disabled = false;
          quoteBtn.textContent = "Send Request";
          successMsg.hidden = false;
          form.reset();
        });
    });
  }

  // ===== Rental Agreement Form Handler =====
  const raBtn = document.getElementById('ra-submit-btn');
  if (raBtn) {
    raBtn.addEventListener('click', () => {
      const form = document.getElementById('rental-agreement-form');
      const successMsg = document.getElementById('ra-form-success');
      
      const formData = new FormData(form);
      raBtn.disabled = true;
      raBtn.textContent = "Submitting...";

      fetch(SCRIPT_URL, { method: 'POST', body: formData })
        .then(res => res.json())
        .then(data => {
          raBtn.disabled = false;
          raBtn.textContent = "Submit Rental Agreement";
          successMsg.hidden = false;
          form.reset();
        })
        .catch(err => {
          raBtn.disabled = false;
          raBtn.textContent = "Submit Rental Agreement";
          successMsg.hidden = false;
          form.reset();
        });
    });
  }

  // ===== Sync English & Spanish Form Inputs =====
  const pairs = [
    ['ra-name-en', 'ra-name-es'],
    ['ra-phone-en', 'ra-phone-es'],
    ['ra-date-en', 'ra-date-es'],
    ['ra-address-en', 'ra-address-es'],
    ['ra-time-en', 'ra-time-es'],
    ['ra-chairs-en', 'ra-chairs-es'],
    ['ra-tables-en', 'ra-tables-es'],
    ['ra-other-en', 'ra-other-es'],
    ['ra-delivery-en', 'ra-delivery-es'],
    ['ra-total-en', 'ra-total-es'],
    ['ra-renter-sig-en', 'ra-renter-sig-es'],
    ['ra-renter-date-en', 'ra-renter-date-es']
  ];

  pairs.forEach(([enId, esId]) => {
    const enEl = document.getElementById(enId);
    const esEl = document.getElementById(esId);
    if (enEl && esEl) {
      enEl.addEventListener('input', () => { esEl.value = enEl.value; });
      esEl.addEventListener('input', () => { enEl.value = esEl.value; });
    }
  });
});

// ===== Rental Agreement Language Toggle =====
function setRentalLang(lang) {
  const btnEn = document.getElementById('btn-lang-en');
  const btnEs = document.getElementById('btn-lang-es');
  const contentEn = document.getElementById('ra-content-en');
  const contentEs = document.getElementById('ra-content-es');
  const submitBtn = document.getElementById('ra-submit-btn');

  if (lang === 'en') {
    btnEn.classList.add('active');
    btnEs.classList.remove('active');
    contentEn.style.display = 'block';
    contentEs.style.display = 'none';
    submitBtn.textContent = "Submit Rental Agreement";
  } else {
    btnEs.classList.add('active');
    btnEn.classList.remove('active');
    contentEs.style.display = 'block';
    contentEn.style.display = 'none';
    submitBtn.textContent = "Enviar Acuerdo de Alquiler";
  }
}
