// Two Acorns Rentals - Live Production Script
const GOOGLE_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwBrfE9BWk1_uVqKsqEc9HXOjIlHrmIk7fwwyKz8yx_SF55G2vy9c1KV-pHtoVE4m7Q/exec";

function attachFormHandler(formId, successId, buttonId) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const submitBtn = document.getElementById(buttonId);
    const successMsg = document.getElementById(successId);

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerText = "Submitting...";
    }

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
          if (submitBtn) submitBtn.innerText = "Submitted Successfully!";
        } else {
          alert("Submission error: " + (data.error || "Unknown error"));
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerText = "Try Again";
          }
        }
      })
      .catch((err) => {
        console.error("Submission failed:", err);
        alert("Unable to submit right now. Please call or email us directly.");
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = "Try Again";
        }
      });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  attachFormHandler("contact-form", "quote-form-success", "quote-submit-btn");
  attachFormHandler("rental-agreement-form", "ra-form-success", "ra-submit-btn");
});
