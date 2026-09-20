/**
 * SITE CONFIG — SINGLE SOURCE OF TRUTH
 * =====================================
 * KellerChat — accessible audio/text-first navigation platform
 * Eye Spy Foundation | OGS Grant Project 2026–2027
 * Edit here, never inline in pages.
 */

export const SITE = {
  // ── Identity ──────────────────────────────────────────────
  name: 'KellerChat',
  legalName: 'Eye Spy Foundation Inc.',
  url: 'https://kellerchat.com',
  titleTemplate: '%s | KellerChat',
  description:
    'KellerChat is the accessible audio/text-first chat platform for blind and low-vision navigators — built with wake word activation, voice messaging, and HIPAA-compliant PHI routing.',
  locale: 'en_US',
  language: 'en',

  // ── Organization schema (schema.org/Organization) ─────────
  orgType: 'NGO',
  logo: '/logo.png',
  foundingDate: '2023',
  email: 'team@eyespy.org',
  telephone: '+1-844-222-8848',
  address: {
    streetAddress: '',
    addressLocality: 'Jacksonville',
    addressRegion: 'FL',
    postalCode: '',
    addressCountry: 'US',
  },

  // Social profiles — handle @eyespyorg
  socials: [
    { label: 'Facebook',  icon: 'facebook',  url: 'https://www.facebook.com/eyespyorg' },
    { label: 'Instagram', icon: 'instagram', url: 'https://www.instagram.com/eyespyorg' },
    { label: 'YouTube',   icon: 'youtube',   url: 'https://www.youtube.com/@eyespyorg' },
    { label: 'LinkedIn',  icon: 'linkedin',  url: 'https://www.linkedin.com/company/eyespyorg' },
  ],

  // ── Default social sharing image ───────────────────────────
  ogImage: '/og-default.jpg',

  // ── Navigation ─────────────────────────────────────────────
  nav: [
    { label: 'Chat',          href: '/' },
    { label: 'Accessibility', href: '/accessibility/' },
    { label: 'Privacy',       href: '/privacy/' },
    { label: 'Portal',        href: '/login/' },
  ],
  footerNav: [
    { label: 'Accessibility Statement', href: '/accessibility/' },
    { label: 'Privacy Policy',          href: '/privacy/' },
    { label: 'Terms of Use',            href: '/terms/' },
  ],

  // ── Integrations (PUBLIC identifiers only — secrets in env) ──
  integrations: {
    ga4Id:              'G-G5XJTT1PX2',
    hubspotPortalId:    '',      // set in .env → HUBSPOT_PORTAL_ID
    stripePublishableKey: '',    // not used in KellerChat
    gcpHipaaEndpoint:   '',      // set in .env → GCP_HIPAA_ENDPOINT
  },

  // ── KellerChat feature flags ───────────────────────────────
  features: {
    wakeWord:     true,   // "Hey Keller" Web Speech API wake word
    pushToTalk:   true,   // hold-to-record PTT + Ctrl+M keyboard
    audioOnly:    true,   // TTS mode for blind navigators
    phiFilter:    true,   // regex PHI detection → GCP HIPAA vault
    hubspotCRM:   true,   // background CRM conversation tracking
  },
};
