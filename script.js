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

    // Handle scroll to top specifically for logo and top links
    if (targetId === '#top') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const offset = 80;
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

  const name = document.getElementById('name')?.value || 'Valued Customer';
  const email = document.getElementById('email')?.value || '';
  const phone = document.getElementById('phone')?.value || 'N/A';
  const date = document.getElementById('date')?.value || 'Unspecified';
  const items = document.getElementById('items')?.value || 'General inquiry';
  const message = document.getElementById('message')?.value || '';

  // 1. Format mailto link
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
  const mailtoUrl = `mailto:oaktree@twoacornsrentals.com?subject=${subject}&body=${body}`;

  // 2. Show clear, accurate confirmation message on-screen
  if (successMsg) {
    successMsg.hidden = false;
    successMsg.style.display = 'block';
    successMsg.style.padding = '15px';
    successMsg.style.marginTop = '15px';
    successMsg.style.backgroundColor = '#e6f4ea';
    successMsg.style.border = '1px solid #34a853';
    successMsg.style.borderRadius = '8px';
    successMsg.style.color = '#137333';
    successMsg.innerHTML = `
      <strong>✅ Email Drafted & Ready to Send!</strong><br>
      Thank you, <strong>${name}</strong>. Your request details have been pre-filled in your email app. Please hit <strong>Send</strong> in your email window to deliver it to <strong>oaktree@twoacornsrentals.com</strong>.<br><br>
      <small>Email app didn't open? <a href="${mailtoUrl}" style="color: #137333; text-decoration: underline;">Click here to open draft manually</a> or call/text us at <a href="tel:+19107074312" style="color: #137333; text-decoration: underline;">(910) 707-4312</a>.</small>
    `;
  }

  // 3. Trigger email app popup safely
  try {
    const link = document.createElement('a');
    link.href = mailtoUrl;
    link.click();
  } catch (err) {
    console.log('Mailto client not configured locally:', err);
  }

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

      const name = document.getElementById('ra-name')?.value || 'Renter';
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
      const mailtoUrl = `mailto:oaktree@twoacornsrentals.com?subject=${subject}&body=${body}`;

      if (successMsg) {
        successMsg.hidden = false;
        successMsg.style.display = 'block';
        successMsg.style.padding = '15px';
        successMsg.style.marginTop = '15px';
        successMsg.style.backgroundColor = '#e6f4ea';
        successMsg.style.border = '1px solid #34a853';
        successMsg.style.borderRadius = '8px';
        successMsg.style.color = '#137333';
        successMsg.innerHTML = `
          <strong>✅ Rental Agreement Drafted!</strong><br>
          Thank you, <strong>${name}</strong>. Your agreement details have been pre-filled in your email app. Please hit <strong>Send</strong> in your email window to complete your submission.<br><br>
          <small>Email app didn't open? <a href="${mailtoUrl}" style="color: #137333; text-decoration: underline;">Click here to open draft manually</a> or call/text us at <a href="tel:+19107074312" style="color: #137333; text-decoration: underline;">(910) 707-4312</a>.</small>
        `;
      }

      try {
        const link = document.createElement('a');
        link.href = mailtoUrl;
        link.click();
      } catch (err) {
        console.log('Mailto client not configured locally:', err);
      }

      raForm.reset();
    });
  }
});
