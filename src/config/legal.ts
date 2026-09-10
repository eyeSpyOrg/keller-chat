/**
 * legal.ts — pulls legal copy from LEGAL_BRAIN.md values.
 * Edit LEGAL_BRAIN.md once; these strings auto-populate legal pages.
 * Import these into privacy/, terms/, cookies/, accessibility/ pages.
 */

import { SITE } from './site.js';

export const LEGAL = {
  orgName: (SITE as any).legalName ?? SITE.name,
  ein: (SITE as any).ein ?? '[EIN PLACEHOLDER — set in LEGAL_BRAIN.md]',
  email: SITE.email,
  address: SITE.address,
  telephone: SITE.telephone,

  // ── Tax / nonprofit status ────────────────────────────────────
  taxStatement:
    `${(SITE as any).legalName ?? SITE.name} is a 501(c)(3) nonprofit public charity. Donations are tax-deductible to the fullest extent permitted by law.`,

  // ── Privacy ───────────────────────────────────────────────────
  privacyLastUpdated: '2026-09-01',
  dataController: (SITE as any).legalName ?? SITE.name,
  cookieTypes: [
    { name: 'Essential', purpose: 'Required for the website to function. Cannot be disabled.', examples: 'Session state, CSRF tokens' },
    { name: 'Analytics', purpose: 'Help us understand how visitors use the site (Google Analytics 4).', examples: '_ga, _gid' },
    { name: 'Marketing', purpose: 'Used by HubSpot to remember form submissions and personalize content.', examples: 'hubspotutk, __hstc' },
  ],
  gdprRights: [
    'Right to access your personal data',
    'Right to correct inaccurate data',
    'Right to delete your data ("right to be forgotten")',
    'Right to restrict processing',
    'Right to data portability',
    'Right to object to processing',
  ],

  // ── Accessibility ─────────────────────────────────────────────
  wcagLevel: 'WCAG 2.2 Level AA',
  a11yContactEmail: SITE.email,
  a11yLastAuditDate: '2026-09-01',

  // ── Terms ────────────────────────────────────────────────────
  termsLastUpdated: '2026-09-01',
  governingLaw: 'Florida, United States',
};
