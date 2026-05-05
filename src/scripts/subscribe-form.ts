/**
 * Enhance any <form data-kit-form data-tag="..."> with /api/subscribe submit behavior.
 * Gracefully degrades — if JS doesn't load, form does nothing (no native action).
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

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = input.value.trim();
      if (!email) return;

      form.classList.remove('is-error', 'is-success');
      form.classList.add('is-loading');
      button.textContent = 'Sending…';

      try {
        const res = await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, tag }),
        });

        form.classList.remove('is-loading');

        if (res.ok) {
          form.classList.add('is-success');
          input.value = '';
          input.placeholder = 'Subscribed.';
          button.textContent = '✓ Sent';
        } else {
          form.classList.add('is-error');
          button.textContent = originalText;
          const data = await res.json().catch(() => ({}));
          input.placeholder = data?.message || 'Something broke. Try again.';
          input.value = '';
        }
      } catch {
        form.classList.remove('is-loading');
        form.classList.add('is-error');
        button.textContent = originalText;
        input.placeholder = 'Network error. Try again.';
        input.value = '';
      }
    });
  });
}
