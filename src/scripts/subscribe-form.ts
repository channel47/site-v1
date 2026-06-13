/**
 * Enhance any <form data-kit-form data-tag="..."> with /api/subscribe submit behavior.
 *
 * - Always sends `email` + `tag`.
 * - Also sends any other named controls (textarea/select/input) as `fields`,
 *   so a contact form can carry `brief`, `budget`, etc. The API whitelists keys.
 * - Status is announced in a `[data-form-status]` element if the form has one,
 *   otherwise via the email placeholder plus an injected visually-hidden live region.
 * - Gracefully degrades — if JS doesn't load, the form does nothing (no native action).
 */

export function initSubscribeForms() {
  const forms = document.querySelectorAll<HTMLFormElement>('form[data-kit-form]');

  forms.forEach((form) => {
    if (form.hasAttribute('data-initialized')) return;
    form.setAttribute('data-initialized', '');

    const input = form.querySelector<HTMLInputElement>('input[type="email"]');
    const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    if (!input || !button) return;

    const tag = form.dataset.tag || 'general';
    const originalText = button.textContent;

    // Prefer a visible, author-placed status element; otherwise create a
    // visually-hidden live region so screen readers still hear the result.
    let status = form.querySelector<HTMLElement>('[data-form-status]');
    if (!status) {
      status = document.createElement('span');
      status.className = 'visually-hidden';
      status.setAttribute('aria-live', 'polite');
      form.appendChild(status);
    }
    status.setAttribute('role', 'status');

    // Collect extra named controls (everything but the email field) as fields.
    function collectFields(): Record<string, string> {
      const fields: Record<string, string> = {};
      form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
        'input[name], textarea[name], select[name]'
      ).forEach((el) => {
        if (el === input || el.name === 'email') return;
        const value = el.value.trim();
        if (value) fields[el.name] = value;
      });
      return fields;
    }

    function setStatus(message: string) {
      if (status) status.textContent = message;
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = input.value.trim();
      if (!email) return;

      form.classList.remove('is-error', 'is-success');
      input.removeAttribute('aria-invalid');
      form.classList.add('is-loading');
      button.textContent = 'Sending…';
      setStatus('Sending…');

      const fields = collectFields();

      try {
        const res = await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, tag, ...(Object.keys(fields).length ? { fields } : {}) }),
        });

        form.classList.remove('is-loading');

        if (res.ok) {
          form.classList.add('is-success');
          form.reset();
          input.placeholder = 'Subscribed.';
          button.textContent = '✓ Sent';
          setStatus('Got it — check your inbox to confirm. I\'ll be in touch.');
        } else {
          form.classList.add('is-error');
          input.setAttribute('aria-invalid', 'true');
          button.textContent = originalText;
          const data = await res.json().catch(() => ({}));
          const message = data?.message || 'Something broke. Try again.';
          input.placeholder = message;
          input.value = '';
          setStatus(message);
        }
      } catch {
        form.classList.remove('is-loading');
        form.classList.add('is-error');
        input.setAttribute('aria-invalid', 'true');
        button.textContent = originalText;
        input.placeholder = 'Network error. Try again.';
        input.value = '';
        setStatus('Network error. Try again.');
      }
    });
  });
}
