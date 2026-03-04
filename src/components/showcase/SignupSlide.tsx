import { useState, useCallback, useRef } from 'react';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignupSlide() {
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [email, setEmail] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !EMAIL_REGEX.test(trimmed)) {
      setState('error');
      inputRef.current?.focus();
      setTimeout(() => setState('idle'), 2000);
      return;
    }

    setState('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed, tag: 'showcase' }),
      });

      if (res.ok) {
        setState('success');
        setEmail('');
        setTimeout(() => setState('idle'), 2500);
      } else {
        setState('error');
        setTimeout(() => setState('idle'), 2000);
      }
    } catch {
      setState('error');
      setTimeout(() => setState('idle'), 2000);
    }
  }, [email]);

  return (
    <div className="showcase-signup" role="tabpanel" aria-label="Subscribe">
      <div className="showcase-signup__label">Stay in the loop</div>
      <h2 className="showcase-signup__headline">New tools every week</h2>
      <p className="showcase-signup__sub">
        Plugins, MCPs, and skills for media buyers building with AI. No spam, unsubscribe anytime.
      </p>
      <form
        onSubmit={handleSubmit}
        className={`email-signup email-form${state === 'error' ? ' is-error' : ''}${state === 'success' ? ' is-success' : ''}${state === 'loading' ? ' is-loading' : ''}`}
        style={{ maxWidth: 440 }}
      >
        <label htmlFor="showcase-email" className="sr-only">Email address</label>
        <input
          ref={inputRef}
          type="email"
          id="showcase-email"
          name="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); if (state === 'error') setState('idle'); }}
          placeholder="your@email.com"
          required
          className="email-form__input"
          autoComplete="email"
          spellCheck={false}
          aria-invalid={state === 'error' || undefined}
        />
        <button
          type="submit"
          className="email-form__btn email-signup__submit"
          disabled={state === 'loading'}
          aria-label="Subscribe"
        >
          <span className="email-signup__submit-text">Subscribe</span>
          <span className="email-signup__submit-icons" style={{ position: 'relative', width: 16, height: 16, flexShrink: 0, display: 'inline-flex', alignItems: 'center' }}>
            <svg
              className="email-signup__icon email-signup__icon--arrow"
              style={{ position: 'absolute', inset: 0, width: 16, height: 16, opacity: state === 'loading' || state === 'success' ? 0 : 1, transform: state === 'loading' || state === 'success' ? 'scale(0.8)' : 'scale(1)' }}
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            <svg
              className="email-signup__icon email-signup__icon--check"
              style={{ position: 'absolute', inset: 0, width: 16, height: 16, opacity: state === 'success' ? 1 : 0, transform: state === 'success' ? 'scale(1)' : 'scale(0.8)' }}
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M5 12l5 5L20 7" />
            </svg>
            {state === 'loading' && (
              <svg
                style={{ position: 'absolute', inset: 0, width: 16, height: 16, animation: 'spin 1s linear infinite' }}
                viewBox="0 0 24 24" fill="none"
              >
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </span>
        </button>
      </form>
    </div>
  );
}
