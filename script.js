// ===== Mobile Nav Toggle =====
const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');

navToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

// Close mobile nav when a link is clicked
mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ===== Smooth scroll offset for fixed header =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 72; // header height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== Contact form handler =====
function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const successMsg = document.getElementById('form-success');

  // In production, replace this with a real form backend or API call.
  // For now, show a success message and reset the form.
  successMsg.hidden = false;
  form.reset();

  setTimeout(() => { successMsg.hidden = true; }, 5000);
  return false;
}
