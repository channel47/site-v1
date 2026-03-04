/**
 * Copy-to-clipboard — shared init for [data-install] copy buttons.
 * Copies the value of `data-install` to clipboard on click.
 */
export function initCopyButtons(): void {
  document.querySelectorAll('[data-install]').forEach(btn => {
    if (btn.hasAttribute('data-initialized')) return;
    btn.setAttribute('data-initialized', 'true');
    btn.addEventListener('click', async () => {
      const text = btn.getAttribute('data-install');
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
        const el = btn as HTMLElement;
        el.textContent = 'Copied';
        el.setAttribute('aria-label', 'Copied to clipboard');
        setTimeout(() => {
          el.textContent = 'Copy';
          el.setAttribute('aria-label', 'Copy install command');
        }, 1500);
      } catch { /* clipboard API may fail in insecure contexts */ }
    });
  });
}
