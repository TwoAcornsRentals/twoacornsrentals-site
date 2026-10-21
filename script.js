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
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyc8213sWf-zD_Xv9tO9xX3qN6GqR0V3kP1mX2lY4zQ5wJ8tV7bN9mK1xL3pQ5sW2vY/exec"; // Active backend web app URL

// ===== Live Total Calculation & Form Handlers =====
document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Live Total Calculation for Rental Agreement
  const chairsInput = document.getElementById('ra-chairs-en') || document.getElementById('Chairs Qty');
  const tablesInput = document.getElementById('ra-tables-en') || document.getElementById('Tables Qty');
  const totalInput = document.getElementById('ra-total-en') || document.getElementById('Total Amount Due');

  function calculateTotal() {
    if (!totalInput) return;
    const chairs = parseInt(chairsInput ? chairsInput.value : 0) || 0;
    const tables = parseInt(tablesInput ? tablesInput.value : 0) || 0;
    
    // Pricing: $2 per chair, $10 per table
    const total = (chairs * 2) + (tables * 10);
    totalInput.value = total > 0 ? total.toFixed(2) : '';
  }

  if (chairsInput) chairsInput.addEventListener('input', calculateTotal);
  if (tablesInput) tablesInput.addEventListener('input', calculateTotal);

  // 2. Smart Number Fields: Auto-clear initial '0' on focus, restore '0' on blur if empty
  const numberInputs = document.querySelectorAll('input[type="number"]');
  numberInputs.forEach(input => {
    input.addEventListener('focus', function() {
      if (this.value === '0') {
        this.value = '';
      }
    });
    input.addEventListener('blur', function() {
      if (this.value === '') {
        this.value = '0';
        calculateTotal();
      }
    });
  });

  // ===== Quote Form Handler =====
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
      enEl.addEventListener('input', () => { esEl.value = enEl.value; calculateTotal(); });
      esEl.addEventListener('input', () => { enEl.value = enEl.value; calculateTotal(); });
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
