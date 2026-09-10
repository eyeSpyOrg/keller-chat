/**
 * SITE CONFIG — SINGLE SOURCE OF TRUTH
 * =====================================
 * Eye Spy Foundation — nonprofit template
 * Edit here, never inline in pages.
 */

export const SITE = {
  // ── Identity ──────────────────────────────────────────────
  name: 'Eye Spy Foundation',
  legalName: 'Eye Spy Foundation',
  url: 'https://eyespyfoundation.org',
  titleTemplate: '%s | Eye Spy Foundation',
  description:
    'Eye Spy Foundation helps blind and low vision people navigate toward a more informed, connected, and confident life — free navigation support, community events, and a curated resource directory.',
  locale: 'en_US',
  language: 'en',

  // ── Organization schema (schema.org/Organization) ─────────
  orgType: 'NGO',
  logo: '/logo.png',
  foundingDate: '2023',
  email: 'team@eyespy.org',
  telephone: '+1-844-222-8848',
  address: {
    streetAddress: '[PLACEHOLDER: Street Address]',
    addressLocality: 'Jacksonville',
    addressRegion: 'FL',
    postalCode: '[PLACEHOLDER]',
    addressCountry: 'US',
  },

  // Social profiles — handle @eyespyorg
  socials: [
    { label: 'Facebook', icon: 'facebook', url: 'https://www.facebook.com/eyespyorg' },
    { label: 'Instagram', icon: 'instagram', url: 'https://www.instagram.com/eyespyorg' },
    { label: 'YouTube', icon: 'youtube', url: 'https://www.youtube.com/@eyespyorg' },
    { label: 'LinkedIn', icon: 'linkedin', url: 'https://www.linkedin.com/company/eyespyorg' },
    { label: 'TikTok', icon: 'tiktok', url: 'https://www.tiktok.com/@eyespyorg' },
    { label: 'X', icon: 'x', url: 'https://x.com/eyespyorg' },
  ],

  // ── Default social sharing image ───────────────────────────
  ogImage: '/og-default.jpg',

  // ── Navigation (drives Header + Footer) ────────────────────
  nav: [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about/' },
    { label: 'Programs', href: '/programs/' },
    { label: 'Support', href: '/support/' },
    { label: 'Contact', href: '/contact/' },
    { label: 'Documents', href: '/documents/' },
  ],
  footerNav: [
    { label: 'Accessibility Statement', href: '/accessibility/' },
    { label: 'Privacy Policy', href: '/privacy/' },
    { label: 'Terms of Use', href: '/terms/' },
    { label: 'Cookie Policy', href: '/cookies/' },
    { label: 'Contact', href: '/contact/' },
  ],

  // ── Phase 2 integrations (see INTEGRATIONS.md) ─────────────
  // Only PUBLIC identifiers belong here. Secrets go in env vars.
  integrations: {
    ga4Id: 'G-G5XJTT1PX2',
    hubspotPortalId: '',
    stripePublishableKey: '',
  },
};
