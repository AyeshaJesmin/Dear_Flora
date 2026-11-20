// Dear Flora — Contact Form Validation + Logging

/* ============================================================
   CONFIG — checkout.js eke danapu SAME URL eka methanatath danna
   ============================================================ */
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyBDnh1AgvHf72xyfLui44k0ZNkQLTxk8EvvqIhlZVqjIQJOuaPvssY1FZXQWjK_sqR6Q/exec';

const contactForm = document.querySelector('#contactForm');
const contactSuccess = document.querySelector('#contactSuccess');

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function showError(field, message) {
  field.classList.add('field-error');
  let errorEl = field.parentElement.querySelector('.field-error-message');
  if (!errorEl) {
    errorEl = document.createElement('small');
    errorEl.className = 'field-error-message';
    field.parentElement.appendChild(errorEl);
  }
  errorEl.textContent = message;
}

function clearError(field) {
  field.classList.remove('field-error');
  const errorEl = field.parentElement.querySelector('.field-error-message');
  if (errorEl) errorEl.remove();
}

/* ---- Send a copy of the message to the Google Sheet (fire-and-forget) ---- */
function logMessageToSheet(payload) {
  if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes('PASTE_YOUR')) {
    console.warn('Google Script URL not configured — message was not logged to the sheet.');
    return;
  }

  fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ type: 'contact', ...payload })
  }).catch((err) => console.error('Could not log message to sheet:', err));
}

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  contactSuccess.hidden = true;

  const nameField = contactForm.querySelector('[name="name"]');
  const emailField = contactForm.querySelector('[name="email"]');
  const messageField = contactForm.querySelector('[name="message"]');

  let hasError = false;

  if (!nameField.value.trim()) {
    showError(nameField, 'Please enter your name.');
    hasError = true;
  } else {
    clearError(nameField);
  }

  if (!emailField.value.trim()) {
    showError(emailField, 'Please enter your email.');
    hasError = true;
  } else if (!isValidEmail(emailField.value.trim())) {
    showError(emailField, 'Please enter a valid email address.');
    hasError = true;
  } else {
    clearError(emailField);
  }

  if (!messageField.value.trim()) {
    showError(messageField, 'Please write a message.');
    hasError = true;
  } else {
    clearError(messageField);
  }

  if (hasError) {
    contactForm.querySelector('.field-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  logMessageToSheet({
    name: nameField.value.trim(),
    email: emailField.value.trim(),
    message: messageField.value.trim()
  });

  contactSuccess.hidden = false;
  contactForm.reset();
});

contactForm.querySelectorAll('input, textarea').forEach((field) => {
  field.addEventListener('input', () => clearError(field));
});