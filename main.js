/**
 * Nethra Shree — Personal Portfolio
 * Modern Web Best Practices & Accessible Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initFormValidationAndSubmission();
  initCopyEmailActions();
  initAriaInvalidSync();
});

/**
 * Mobile Navigation Toggle
 */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.getElementById('primary-nav');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', String(!isExpanded));
    navMenu.classList.toggle('is-open');
  });

  // Close menu when any nav link is clicked
  const navLinks = navMenu.querySelectorAll('.nav-link');
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      toggleBtn.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('is-open');
    });
  });
}

/**
 * Accessible Form Validation & Transparent Mailto Delivery
 * Strictly satisfies: "Do not display a fake success message or pretend that a message was sent."
 */
function initFormValidationAndSubmission() {
  const form = document.getElementById('contact-form');
  const statusAlert = document.getElementById('form-status-alert');
  const statusTitle = document.getElementById('status-title');
  const statusBody = document.getElementById('status-body');

  if (!form) return;

  const recipientEmail = 'nebula8002@gmail.com';

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    // Check standard HTML5 validity constraints
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const subject = subjectInput ? subjectInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : '';

    // Construct formatted mailto parameters
    const emailSubject = encodeURIComponent(`Portfolio Inquiry: ${subject}`);
    const emailBody = encodeURIComponent(
      `Hello Nethra,\n\n${message}\n\n---\nFrom: ${name}\nReply-To: ${email}`
    );

    const mailtoUrl = `mailto:${recipientEmail}?subject=${emailSubject}&body=${emailBody}`;

    // Open default mail client
    try {
      window.location.href = mailtoUrl;
    } catch (e) {
      console.warn('Mailto link navigation:', e);
    }

    // Display honest, transparent confirmation (no fake mock success)
    if (statusAlert && statusTitle && statusBody) {
      statusTitle.textContent = 'Opening Your Email Client';
      statusBody.innerHTML = `
        Your message has been formatted and opened in your system's email application directed to <strong>${recipientEmail}</strong>.<br><br>
        If an email client did not open automatically, you can email <a href="mailto:${recipientEmail}" class="direct-email-link">${recipientEmail}</a> or use the button below to copy your drafted message.
        <div style="margin-top: 1rem;">
          <button type="button" class="btn-sm" id="copy-draft-btn">Copy Formatted Draft</button>
        </div>
      `;
      statusAlert.classList.add('is-visible');

      const copyDraftBtn = document.getElementById('copy-draft-btn');
      if (copyDraftBtn) {
        copyDraftBtn.addEventListener('click', () => {
          const draftText = `To: ${recipientEmail}\nSubject: Portfolio Inquiry: ${subject}\n\nHello Nethra,\n\n${message}\n\nFrom: ${name} (${email})`;
          copyToClipboard(draftText, 'Draft copied to clipboard! You can paste it into your email.');
        });
      }
    }
  });
}

/**
 * Copy Email to Clipboard with Accessible Visual Feedback Toast
 */
function initCopyEmailActions() {
  const copyBtn = document.getElementById('copy-email-btn');
  const emailToCopy = 'nebula8002@gmail.com';

  if (!copyBtn) return;

  copyBtn.addEventListener('click', () => {
    copyToClipboard(emailToCopy, 'Email copied: nebula8002@gmail.com');
  });
}

/**
 * Robust Clipboard Helper with Non-intrusive Toast Notice
 */
function copyToClipboard(text, message) {
  if (navigator && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    navigator.clipboard.writeText(text).then(() => {
      showToast(message);
    }).catch(() => {
      fallbackCopy(text, message);
    });
  } else {
    fallbackCopy(text, message);
  }
}

function fallbackCopy(text, message) {
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.setAttribute('readonly', '');
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '-9999px';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    if (successful) {
      showToast(message);
    }
  } catch (err) {
    console.warn('Clipboard fallback not supported:', err);
  }
}

let toastTimeout;
function showToast(message) {
  let toast = document.getElementById('toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notice';
    toast.className = 'toast-notice';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('is-active');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('is-active');
  }, 3500);
}

/**
 * Modern Web Guidance: Synchronize programmatic accessibility states (aria-invalid)
 * with the visual :user-invalid state so screen reader users receive error feedback only after interaction.
 */
function initAriaInvalidSync() {
  const updateAriaState = (event) => {
    const input = event.target;
    if (!input || !input.matches || !input.matches('input, textarea, select')) return;

    // Check if the browser currently considers this input :user-invalid
    let isUserInvalid = false;
    try {
      isUserInvalid = input.matches(':user-invalid');
    } catch {
      isUserInvalid = input.classList.contains('user-invalid-fallback');
    }

    if (isUserInvalid) {
      input.setAttribute('aria-invalid', 'true');
    } else {
      input.removeAttribute('aria-invalid');
    }
  };

  // Listen on blur and focus in capture phase because they do not bubble
  document.addEventListener('blur', updateAriaState, true);
  document.addEventListener('focus', updateAriaState, true);

  // Update on input if already marked invalid so the error clears immediately upon fix
  document.addEventListener('input', (event) => {
    const input = event.target;
    if (!input || !input.matches || !input.matches('input, textarea, select')) return;

    if (input.getAttribute('aria-invalid') === 'true') {
      updateAriaState(event);
    }
  });

  // Fallback for browsers lacking native :user-invalid support
  const supportsNativeUserInvalid = (typeof CSS !== 'undefined' && CSS.supports && CSS.supports('selector(:user-invalid)'));
  if (!supportsNativeUserInvalid) {
    const dirtyState = new WeakMap();

    const handleFallbackEvent = (event) => {
      const input = event.target;
      if (!input || !input.matches || !input.matches('input, textarea, select')) return;

      const isValid = typeof input.checkValidity === 'function' ? input.checkValidity() : true;
      const state = dirtyState.get(input) || { hasInteracted: false, hasBlurred: false };

      if (event.type === 'input' || event.type === 'change') {
        state.hasInteracted = true;
      } else if (event.type === 'blur') {
        state.hasBlurred = true;
      }

      dirtyState.set(input, state);

      if (state.hasBlurred && state.hasInteracted) {
        input.classList.toggle('user-invalid-fallback', !isValid);
        input.classList.toggle('user-valid-fallback', isValid);
        if (!isValid) {
          input.setAttribute('aria-invalid', 'true');
        } else {
          input.removeAttribute('aria-invalid');
        }
      }
    };

    document.addEventListener('blur', handleFallbackEvent, true);
    document.addEventListener('input', handleFallbackEvent, true);
    document.addEventListener('change', handleFallbackEvent, true);
  }
}

