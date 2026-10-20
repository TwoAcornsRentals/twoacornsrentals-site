// Helper function to format YYYY-MM-DD to American standard MM/DD/YYYY
function formatAmericanDate(dateString) {
  if (!dateString) return 'Unspecified';
  const parts = dateString.split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${month}/${day}/${year}`;
  }
  return dateString;
}

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
  const rawDate = document.getElementById('date')?.value || '';
  const date = formatAmericanDate(rawDate);
  const items = document.getElementById('items')?.value || 'General inquiry';
  const message = document.getElementById('message')?.value || '';

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

  if (successMsg) {
    successMsg.hidden = false;
    successMsg.style.display = 'block';
    successMsg.style.padding = '18px';
    successMsg.style.marginTop = '16px';
    successMsg.style.backgroundColor = '#e6f4ea';
    successMsg.style.border = '2px solid #34a853';
    successMsg.style.borderRadius = '10px';
    successMsg.style.color = '#137333';
    successMsg.style.textAlign = 'center';
    successMsg.innerHTML = `
      <strong style="font-size: 1.1rem;">✅ Quote Request Prepared!</strong><br>
      <span style="display:inline-block; margin-top:6px; margin-bottom:12px;">Thank you, <strong>${name}</strong>. Tap the button below to open your email draft and hit send:</span><br>
      <a href="${mailtoUrl}" class="btn" style="background:#2C4C38; color:#fff; padding:12px 24px; border-radius:30px; font-weight:700; display:inline-block; text-decoration:none; margin-bottom:10px;">📩 Open Draft in Email App</a><br>
      <small style="color:#555;">Or call/text us directly at <a href="tel:+19107074312" style="color:#137333; text-decoration:underline;">(910) 707-4312</a>.</small>
    `;
  }

  // Attempt auto-open for desktop clients while keeping on-screen button ready
  try {
    const link = document.createElement('a');
    link.href = mailtoUrl;
    link.click();
  } catch (err) {
    console.log('Mailto handler requires direct tap on mobile:', err);
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
      const rawDate = document.getElementById('ra-date')?.value || '';
      const date = formatAmericanDate(rawDate);
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
        successMsg.style.padding = '18px';
        successMsg.style.marginTop = '16px';
        successMsg.style.backgroundColor = '#e6f4ea';
        successMsg.style.border = '2px solid #34a853';
        successMsg.style.borderRadius = '10px';
        successMsg.style.color = '#137333';
        successMsg.style.textAlign = 'center';
        successMsg.innerHTML = `
          <strong style="font-size: 1.1rem;">✅ Rental Agreement Prepared!</strong><br>
          <span style="display:inline-block; margin-top:6px; margin-bottom:12px;">Thank you, <strong>${name}</strong>. Tap the button below to complete your submission in your email app:</span><br>
          <a href="${mailtoUrl}" class="btn" style="background:#2C4C38; color:#fff; padding:12px 24px; border-radius:30px; font-weight:700; display:inline-block; text-decoration:none; margin-bottom:10px;">📩 Open Agreement in Email App</a><br>
          <small style="color:#555;">Or call/text us directly at <a href="tel:+19107074312" style="color:#137333; text-decoration:underline;">(910) 707-4312</a>.</small>
        `;
      }

      try {
        const link = document.createElement('a');
        link.href = mailtoUrl;
        link.click();
      } catch (err) {
        console.log('Mailto handler requires direct tap on mobile:', err);
      }

      raForm.reset();
    });
  }
});
