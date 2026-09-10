/**
 * ga4.ts — GA4 event tracking helpers.
 * All functions are no-ops when gtag is not loaded (consent not given,
 * ad blocker, or dev mode). This satisfies GDPR/CCPA: no data fires
 * until Analytics.astro loads gtag after consent.
 *
 * Usage (in a <script> block or client-side module):
 *   import { trackEvent } from '../utils/ga4';
 *   trackEvent('donation_click', { amount: 50, type: 'one-time' });
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(eventName: string, params?: Record<string, unknown>): void {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
}

// ── Named event helpers ───────────────────────────────────────────

export function trackDonationClick(amount: number, type: 'one-time' | 'monthly'): void {
  trackEvent('donation_click', { amount, type });
}

export function trackDonationInitiated(source: string): void {
  trackEvent('donation_initiated', { source });
}

export function trackFormSubmit(formName: string, formGuid?: string): void {
  trackEvent('form_submit', { form_name: formName, form_guid: formGuid });
}

export function trackNewsletterSignup(): void {
  trackEvent('newsletter_signup');
}

export function trackDocumentDownload(documentType: string, year?: string): void {
  trackEvent('document_download', { document_type: documentType, year: year ?? 'unknown' });
}

export function trackVideoPlay(videoId: string, videoTitle?: string): void {
  trackEvent('video_play', { video_id: videoId, video_title: videoTitle });
}

export function trackVolunteerSignup(): void {
  trackEvent('volunteer_signup');
}

export function trackEventRegistration(eventName: string): void {
  trackEvent('event_registration', { event_name: eventName });
}

/**
 * Attach scroll-depth tracking to the page. Call once after DOMContentLoaded.
 * Fires at 25%, 50%, 75%, and 100% scroll depth — each threshold fires once.
 */
export function initScrollDepth(): void {
  if (typeof window === 'undefined') return;
  const thresholds = [25, 50, 75, 100];
  const fired = new Set<number>();

  function check() {
    const scrolled = window.scrollY + window.innerHeight;
    const total = document.documentElement.scrollHeight;
    const pct = Math.round((scrolled / total) * 100);
    for (const t of thresholds) {
      if (pct >= t && !fired.has(t)) {
        fired.add(t);
        trackEvent('scroll_depth', { depth: t, page: window.location.pathname });
      }
    }
  }

  window.addEventListener('scroll', check, { passive: true });
}

/**
 * Fire page_engagement after the user spends 30 seconds on the page.
 * Call once after DOMContentLoaded.
 */
export function initPageEngagement(thresholdMs = 30_000): void {
  if (typeof window === 'undefined') return;
  let timer: ReturnType<typeof setTimeout> | null = null;

  function start() {
    timer = setTimeout(() => {
      trackEvent('page_engagement', { page: window.location.pathname });
    }, thresholdMs);
  }

  function stop() {
    if (timer) { clearTimeout(timer); timer = null; }
  }

  document.addEventListener('visibilitychange', () => {
    document.hidden ? stop() : start();
  });

  start();
}
