# Deployment Checklist

Complete every section before going live. Run from top to bottom.

---

## 0. Pre-Deployment Setup

- [ ] `LEGAL_BRAIN.md` fully filled in (no `[PLACEHOLDER]` values remain)
- [ ] `src/config/site.js` updated with real org name, URL, nav, socials, integrations
- [ ] `src/config/legal.ts` values correct (auto-generated from site.js — verify)
- [ ] Real `public/favicon.svg`, `public/logo.png`, `public/og-default.jpg` (1200×630) in place
- [ ] `.env.example` documents all env vars; `.env` is gitignored ✅

---

## 1. Content

- [ ] Homepage copy written and reviewed
- [ ] About page: mission, vision, team bios, impact stats updated
- [ ] Programs page: real program names, descriptions, impact stories
- [ ] Support/Donate page: real Stripe Payment Link URLs in `paymentLinks` prop
- [ ] Documents page: real PDFs in `public/documents/` and listed in `docs` array
- [ ] Contact page: real HubSpot form GUID in `HubSpotForm` props
- [ ] Privacy Policy: organization name, EIN, data controller, contact email all correct
- [ ] Terms of Service: organization name, governing law correct
- [ ] Cookie Policy: cookie categories match what your integrations actually set
- [ ] Accessibility Statement: audit date, contact email, and WCAG level current
- [ ] `public/llms.txt` updated with real org info and key pages
- [ ] `public/robots.txt` sitemap URL points to production domain

---

## 2. Integrations

### Google Analytics 4
- [ ] Measurement ID set in `site.js` → `integrations.ga4Id`
- [ ] Property verified in Google Analytics
- [ ] Test: browse site, check GA4 DebugView for pageview events
- [ ] Consent flow tested: decline → no GA4 events; accept → events fire

### HubSpot
- [ ] Portal ID set in `site.js` → `integrations.hubspotPortalId`
- [ ] All form GUIDs confirmed (contact, newsletter, volunteer, events)
- [ ] Test each form: submit → verify contact appears in HubSpot CRM
- [ ] Follow-up emails configured in HubSpot for contact + newsletter forms

### Stripe
- [ ] Live Payment Links created in Stripe Dashboard (one per amount tier)
- [ ] Payment Link URLs updated in `src/pages/support/index.astro` → `paymentLinks`
- [ ] Custom-amount Payment Link created (customer chooses price)
- [ ] Monthly versions created (if using recurring donations)
- [ ] Receipt email customized in Stripe Dashboard (logo + tax deductibility message + EIN)
- [ ] Test with a real live card → donation appears in Stripe → receipt email arrives

---

## 3. Quality Gates

Run all three before every deploy:

```bash
npm run build          # must succeed, zero warnings
npm run test:a11y      # Pa11y: zero WCAG2AA errors
npm run test:lighthouse # a11y ≥95, SEO ≥90, best practices ≥90
```

- [ ] `npm run build` passes
- [ ] `npm run test:a11y` passes (0 errors)
- [ ] `npm run test:lighthouse` passes (all thresholds)

---

## 4. Manual Accessibility Pass

Do this on every new page template (not every page — once per template type):

- [ ] **Keyboard-only navigation**: Tab through every page. Can you reach every link, button, and form field? Is focus always visible?
- [ ] **Screen reader** (VoiceOver on Mac / NVDA on Windows): navigate a page, fill out a form, check error announcements
- [ ] **200% zoom**: no content clipped, no horizontal scroll on body
- [ ] **WAVE extension**: 0 errors, 0 contrast errors on every page
- [ ] **Mobile** (375px viewport): tap targets ≥44px, no horizontal overflow

---

## 5. SEO Check

```bash
grep -r "noindex" src/pages
```

- [ ] No `noindex` on indexable pages (about, programs, support, documents, contact)
- [ ] Every page has a unique `<title>` ≤60 chars
- [ ] Every page has a unique `<meta description>` 145–160 chars
- [ ] Run [Rich Results Test](https://search.google.com/test/rich-results) on:
  - [ ] Homepage (Organization schema)
  - [ ] FAQ page (FAQPage schema)
  - [ ] Support page (no schema errors)
- [ ] Open Graph preview looks correct ([opengraph.xyz](https://www.opengraph.xyz) or social preview tool)

---

## 6. Security Check

```bash
grep -rn "sk_live\|sk_test\|pk_live\|pk_test\|hsct\|private_app" src/ --include="*.ts" --include="*.astro" --include="*.js"
```

- [ ] No secrets in any source file (above grep returns nothing)
- [ ] No API keys or tokens committed to git (`git log --all --full-history -- .env`)
- [ ] HTTPS enforced in hosting config
- [ ] `Content-Security-Policy` header configured at hosting level

---

## 7. Hosting / DNS

- [ ] Production domain configured in hosting (Netlify, Amplify, Vercel, etc.)
- [ ] Custom domain DNS propagated (allow 24h)
- [ ] HTTPS certificate issued and auto-renewing
- [ ] `robots.txt` Sitemap URL updated to production URL
- [ ] Canonical URLs in SEO.astro resolve correctly for production domain
- [ ] Redirect: `www.example.org` → `example.org` (or vice versa — pick one, redirect the other)
- [ ] Redirect: `http://` → `https://`

---

## 8. Post-Launch

- [ ] Google Search Console: verify domain, submit sitemap (`/sitemap-index.xml`)
- [ ] Google Analytics: confirm production traffic is flowing (not localhost)
- [ ] Make a live donation with a real card → confirm receipt email, Stripe Dashboard entry
- [ ] Submit a contact form → confirm HubSpot CRM entry + follow-up email
- [ ] Sign up for newsletter → confirm HubSpot list entry
- [ ] Check GA4 DebugView for real session with events
- [ ] Share the site URL on social → check Open Graph preview is correct
- [ ] Create a Charity Navigator / Candid profile if not yet done → add URL to `ComplianceBadge.astro`
- [ ] Schedule annual review of COMPLIANCE_CHECKLIST.md

---

## Emergency Rollback

If something goes wrong after deploy:

```bash
git log --oneline -10          # find the last good commit
git revert HEAD                 # create a revert commit (safe)
# OR for hosting platforms:
# Netlify: Site → Deploys → click "Publish deploy" on previous build
# Amplify: Amplify Console → App → Redeploy previous version
```

Never force-push to `main`. Use `git revert` so the rollback is in history.
