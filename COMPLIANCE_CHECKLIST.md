# Compliance Checklist

Use this before launch and after any major content update.
All items are required for a compliant nonprofit website.

---

## GDPR (EU Visitors)

- [ ] **Consent banner** — `ConsentBanner.astro` in `BaseLayout.astro` ✅ (already in template)
- [ ] Analytics and HubSpot only load **after** consent is granted ✅
- [ ] **Privacy Policy** live at `/privacy/` with GDPR-required sections
- [ ] **Cookie Policy** live at `/cookies/` listing all cookie categories
- [ ] Users can **withdraw consent** (reload page → banner reappears if cookies cleared, or add preference center)
- [ ] **Data Controller** identified in Privacy Policy → update `LEGAL_BRAIN.md`
- [ ] **Data Processor** agreements in place: Google (Analytics), HubSpot (CRM), Stripe (payments)
- [ ] Privacy Policy states **retention period** for each data type
- [ ] Privacy Policy provides a **contact email** for data requests (`team@example.org`)
- [ ] EU data residents' **six rights** listed (access, rectification, erasure, portability, restriction, objection)
- [ ] If serving EU residents: Privacy Policy states lawful basis for processing (legitimate interest / consent)

---

## CCPA (California Residents)

- [ ] Privacy Policy includes a **"Do Not Sell My Personal Information"** section
- [ ] You have a process to respond to **data deletion requests** within 45 days
- [ ] You have a process to respond to **data access requests** within 45 days
- [ ] **Contact email** for CCPA requests is listed in Privacy Policy
- [ ] Confirm you do NOT sell personal data (if you do, additional disclosures required)
- [ ] Cookie Policy identifies any **third-party advertising** cookies (we use none by default)

---

## Nonprofit / 501(c)(3) Specific

- [ ] **EIN displayed** on Documents page (`ComplianceBadge.astro`) → set in `LEGAL_BRAIN.md`
- [ ] **501(c)(3) status badge** live on Documents and Donate pages
- [ ] **Tax deductibility statement** on every donation flow: "Donations are tax-deductible to the fullest extent permitted by law."
- [ ] **Annual Report** for current year available for download
- [ ] **Form 990** for most recent tax year available for download
- [ ] **Audit report** (if required by your state — typically required above $500K revenue)
- [ ] Charity Navigator / Candid profile claimed and links added to `ComplianceBadge.astro`
- [ ] State charitable solicitation registration current (varies by state — check every state you solicit in)
- [ ] Board-approved **Gift Acceptance Policy** (recommended) — link from Documents page

---

## Financial Transparency

- [ ] Documents page (`/documents/`) is live and all linked PDFs are downloadable
- [ ] Annual report download tracked via GA4 (`document_download` event)
- [ ] Program efficiency metrics visible on About or Documents page (% to programs)
- [ ] Donor acknowledgment: Stripe sends automatic receipts — verify in test mode

---

## Accessibility (WCAG 2.2 AA)

- [ ] `npm run test:a11y` passes with zero errors
- [ ] `npm run test:lighthouse` → Accessibility ≥ 95
- [ ] WAVE browser extension → 0 errors on every page
- [ ] Full keyboard-only navigation pass (Tab through every interactive element)
- [ ] Screen reader pass (VoiceOver or NVDA) on new templates
- [ ] 200% zoom — no content clipped or lost
- [ ] All images have descriptive `alt` text (or `alt=""` for decorative)
- [ ] All forms have visible `<label>` elements
- [ ] Color contrast ≥ 4.5:1 for body text, ≥ 3:1 for large text / UI components
- [ ] No `outline: none` without visible replacement
- [ ] Skip link works and reaches `#main-content`
- [ ] Accessibility Statement at `/accessibility/` is honest and up-to-date
- [ ] Motion animations respect `prefers-reduced-motion`
- [ ] No `maximum-scale` or `user-scalable=no` in viewport meta

---

## SEO / Indexing

- [ ] No stray `noindex` on indexable pages (`grep -r "noindex" src/pages`)
- [ ] `robots.txt` sitemap URL updated to production domain
- [ ] `public/llms.txt` updated with real org info
- [ ] Domain verified in Google Search Console
- [ ] Sitemap submitted to Google Search Console
- [ ] Rich results test passes on at least one page of each schema type
- [ ] All pages have unique `<title>` (≤60 chars) and `<meta description>` (145–160 chars)

---

## Security

- [ ] No secrets in the repository (grep for `sk_live`, `pk_live`, passwords, tokens)
- [ ] `.env` is in `.gitignore` ✅
- [ ] Stripe Secret Key only in hosting env vars — never in code
- [ ] HubSpot Private App token only in hosting env vars (if used)
- [ ] `Content-Security-Policy` header set (via hosting config — Netlify, Amplify, Vercel)
- [ ] `X-Frame-Options: DENY` header set
- [ ] HTTPS enforced (redirect HTTP → HTTPS via hosting config)
- [ ] No `innerHTML` with untrusted content in client scripts

---

## Post-Launch

- [ ] Test donation flow end-to-end (live Stripe payment with real card)
- [ ] Test HubSpot form submission → verify contact appears in CRM
- [ ] Verify GA4 events firing in production DebugView
- [ ] Verify consent banner works (accept → analytics loads; decline → no analytics)
- [ ] Confirm annual tax receipt process is in place for year-end
- [ ] Schedule annual review of this checklist
