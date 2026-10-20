// ===== Mobile Nav Toggle =====
const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close mobile nav when a link inside is clicked
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close mobile nav when tapping outside
  document.addEventListener('click', (e) => {
    if (!mainNav.contains(e.target) && !navToggle.contains(e.target)) {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// ===== Smooth scroll offset for fixed header =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (!targetId || targetId === '#') return;

    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const offset = 80; // adjusted header height for mobile views
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== Request Quote Form Handler =====
function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const successMsg = document.getElementById('form-success');

  const name = document.getElementById('name')?.value || '';
  const email = document.getElementById('email')?.value || '';
  const phone = document.getElementById('phone')?.value || '';
  const date = document.getElementById('date')?.value || '';
  const items = document.getElementById('items')?.value || '';
  const message = document.getElementById('message')?.value || '';

  // Show inline success message
  if (successMsg) {
    successMsg.hidden = false;
  }

  // Construct mailto link so request sends to business inbox
  const subject = encodeURIComponent(`New Quote Request - ${name}`);
  const body = encodeURIComponent(
    `Quote Request Details:\n\n` +
    `Name: ${name}\n` +
    `Email: ${email}\n` +
    `Phone: ${phone}\n` +
    `Event Date: ${date}\n` +
    `Items Needed: ${items}\n` +
    `Message: ${message}\n`
  );

  window.location.href = `mailto:oaktree@twoacornsrentals.com?subject=${subject}&body=${body}`;

  form.reset();
  return false;
}

// ===== Rental Agreement Form Handler =====
document.addEventListener('DOMContentLoaded', () => {
  const raForm = document.getElementById('rental-agreement-form');
  if (raForm) {
    raForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const successMsg = document.getElementById('ra-form-success');

      const name = document.getElementById('ra-name')?.value || '';
      const phone = document.getElementById('ra-phone')?.value || '';
      const address = document.getElementById('ra-address')?.value || '';
      const date = document.getElementById('ra-date')?.value || '';
      const time = document.getElementById('ra-time')?.value || '';
      const chairs = document.getElementById('ra-chairs')?.value || '0';
      const tables = document.getElementById('ra-tables')?.value || '0';
      const other = document.getElementById('ra-other')?.value || 'None';
      const delivery = document.getElementById('ra-delivery')?.value || 'Standard';
      const total = document.getElementById('ra-total')?.value || '0.00';
      const sig = document.getElementById('ra-renter-sig')?.value || '';

      if (successMsg) {
        successMsg.hidden = false;
      }

      // Construct mailto link for rental agreement
      const subject = encodeURIComponent(`Submitted Rental Agreement - ${name}`);
      const body = encodeURIComponent(
        `Rental Agreement Submission:\n\n` +
        `Renter Name: ${name}\n` +
        `Phone: ${phone}\n` +
        `Delivery/Event Address: ${address}\n` +
        `Rental Date(s): ${date}\n` +
        `Time: ${time}\n\n` +
        `Items:\n` +
        `- Chairs: ${chairs}\n` +
        `- Tables: ${tables}\n` +
        `- Other: ${other}\n` +
        `- Delivery: ${delivery}\n` +
        `Total Amount Due: $${total}\n\n` +
        `Renter Signature: ${sig}\n`
      );

      window.location.href = `mailto:oaktree@twoacornsrentals.com?subject=${subject}&body=${body}`;

      raForm.reset();
    });
  }
});
