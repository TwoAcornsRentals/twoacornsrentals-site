// Two Acorns Rentals - Live Production Script
const GOOGLE_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwBrfE9BWk1_uVqKsqEc9HXOjIlHrmIk7fwwyKz8yx_SF55G2vy9c1KV-pHtoVE4m7Q/exec";

// ===== Mobile Nav Toggle =====
const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
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

// ===== Smooth scroll offset for fixed header & logo top scroll =====
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

// ===== Form Handler via JavaScript Fetch (No native form posting / no warnings) =====
function attachFormHandler(formId, successId, buttonId) {
  const form = document.getElementById(formId);
  const submitBtn = document.getElementById(buttonId);
  if (!form || !submitBtn) return;

  submitBtn.addEventListener("click", function (e) {
    e.preventDefault();

    const successMsg = document.getElementById(successId);

    submitBtn.disabled = true;
    submitBtn.innerText = "Submitting...";

    const formData = new FormData(form);
    const payload = new URLSearchParams(formData);

    fetch(GOOGLE_WEB_APP_URL, {
      method: "POST",
      body: payload
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.result === "success") {
          form.reset();
          if (successMsg) successMsg.hidden = false;
          submitBtn.innerText = "Submitted Successfully!";
        } else {
          alert("Submission error: " + (data.error || "Unknown error"));
          submitBtn.disabled = false;
          submitBtn.innerText = "Try Again";
        }
      })
      .catch((err) => {
        console.error("Submission failed:", err);
        alert("Unable to submit right now. Please call or email us directly.");
        submitBtn.disabled = false;
        submitBtn.innerText = "Try Again";
      });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  attachFormHandler("contact-form", "quote-form-success", "quote-submit-btn");
  attachFormHandler("rental-agreement-form", "ra-form-success", "ra-submit-btn");
});
