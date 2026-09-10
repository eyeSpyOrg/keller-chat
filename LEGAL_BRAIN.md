# LEGAL_BRAIN.md — Organization Configuration

**Single source of truth for brand, legal, and integration info.**
Fill this in once. `src/config/legal.ts` and `src/config/site.js` pull from these values.
Search and replace `[PLACEHOLDER]` throughout.

---

## Organization

| Field | Value |
|-------|-------|
| Display Name | [PLACEHOLDER — e.g. "Eye Spy Foundation"] |
| Legal Name | [PLACEHOLDER — as filed with IRS] |
| EIN | [PLACEHOLDER — e.g. "12-3456789"] |
| Founded | [PLACEHOLDER — e.g. "2021"] |
| Website | [PLACEHOLDER — e.g. "https://eyespyfoundation.org"] |
| State of Incorporation | [PLACEHOLDER — e.g. "Florida"] |
| Office Hours | [PLACEHOLDER — e.g. "Mon–Fri 9 AM–5 PM ET"] |

---

## Contact

| Field | Value |
|-------|-------|
| Primary Email | [PLACEHOLDER — e.g. "team@example.org"] |
| Phone | [PLACEHOLDER — e.g. "+1-555-000-0000"] |
| Street Address | [PLACEHOLDER] |
| City, State ZIP | [PLACEHOLDER] |
| Country | US |

---

## Brand

| Field | Value |
|-------|-------|
| Primary Color | [PLACEHOLDER hex — verify ≥4.5:1 on white] |
| Secondary Color | [PLACEHOLDER hex] |
| Accent Color | [PLACEHOLDER hex] |
| Body Font | [PLACEHOLDER — e.g. "Nunito Sans"] |
| Display Font | [PLACEHOLDER — e.g. "Baloo 2"] |
| Logo (SVG) | public/favicon.svg |
| Logo (PNG) | public/logo.png |
| OG Image | public/og-default.jpg (1200×630) |
| Tagline | [PLACEHOLDER — e.g. "Living life through a different lens"] |
| Brand Voice | [PLACEHOLDER — e.g. "warm, urgent, hopeful"] |

---

## Mission & Vision

**Mission (≤2 sentences):**
[PLACEHOLDER — e.g. "To help the blind and low vision community navigate resources so they can live a better low vision lifestyle."]

**Vision (≤2 sentences):**
[PLACEHOLDER — e.g. "A world where every person with vision loss has equal access to the resources they need to thrive."]

**Core Values (list 3–5):**
1. [PLACEHOLDER — e.g. "Navigate: help people find what they need"]
2. [PLACEHOLDER — e.g. "Connect: build community bridges"]
3. [PLACEHOLDER — e.g. "Grow: invest in long-term independence"]

---

## Legal Boilerplate (auto-filled in pages)

```
501(c)(3) Status:     IRS-recognized nonprofit public charity
Tax Deductibility:    "Donations are tax-deductible to the fullest extent permitted by law."
Financial Transparency: "View our Form 990 and audit reports at [website]/documents/"
Donor Privacy:        "We protect your privacy. See our privacy policy at [website]/privacy/"
```

---

## Compliance

| Requirement | Status |
|-------------|--------|
| GDPR (EU visitors) | ✅ ConsentBanner.astro in BaseLayout |
| CCPA (CA residents) | ✅ "Do Not Sell" covered in Privacy Policy |
| WCAG 2.2 AA | ✅ Enforced globally via CLAUDE.md |
| Analytics | GA4 — loads after consent only |
| Schema.org | Organization + FAQPage on all pages |

---

## Integrations

### Google Analytics 4
- Measurement ID: `G-XXXXXXXXXX` → set in `src/config/site.js` → `integrations.ga4Id`
- Loads after consent via `Analytics.astro`
- Event map: see `GA4_EVENTS.md`

### HubSpot
- Portal ID: `[PLACEHOLDER]` → set in `src/config/site.js` → `integrations.hubspotPortalId`
- No secret token needed for Forms Submission API
- Setup guide: see `HUBSPOT_SETUP.md`

### Stripe
- Publishable Key: `pk_live_...` → set in `src/config/site.js` → `integrations.stripePublishableKey`
- Payment Links: configure in Stripe Dashboard, paste URLs into `DonationForm.astro` props
- **No secret key in repo, ever** — see `STRIPE_SETUP.md`

---

## Social Media

| Platform | Handle / URL |
|----------|-------------|
| Instagram | @[PLACEHOLDER] |
| Facebook | [PLACEHOLDER URL] |
| YouTube | [PLACEHOLDER URL] |
| LinkedIn | [PLACEHOLDER URL] |
| TikTok | @[PLACEHOLDER] (optional) |
| X/Twitter | @[PLACEHOLDER] (optional) |

---

## Programs / Services

List your programs here. These feed into `programs/index.astro` cards:

1. **[Program 1 Name]**: [1–2 sentence description + key outcome]
2. **[Program 2 Name]**: [1–2 sentence description + key outcome]
3. **[Program 3 Name]**: [1–2 sentence description + key outcome]

---

## Impact Stats (for ImpactMetrics component)

| Number | Label | Detail |
|--------|-------|--------|
| [PLACEHOLDER] | people served | since founding |
| [PLACEHOLDER]% | of clients | report improved quality of life |
| [PLACEHOLDER] | community partners | across the region |
| $0 | cost to clients | all services are free |

---

## Third-Party Verification

| Service | URL | Status |
|---------|-----|--------|
| Charity Navigator | https://www.charitynavigator.org/ein/[EIN] | [Active / Not yet] |
| Candid (GuideStar) | https://www.guidestar.org/profile/[EIN] | [Active / Not yet] |
| BBB Wise Giving | N/A | [Active / Not yet] |

---

## Document Library (public/documents/)

Add PDFs here and list them in `documents/index.astro`:

| File | Year | Type |
|------|------|------|
| annual-report-2024.pdf | 2024 | annual-report |
| annual-report-2023.pdf | 2023 | annual-report |
| form-990-2023.pdf | 2023 | 990 |
| audit-2023.pdf | 2023 | audit |
| press-kit.zip | — | press-kit |

---

## How to Use This File

1. Fill in every `[PLACEHOLDER]` above
2. Copy values into `src/config/site.js` (identity, socials, nav, integrations)
3. Update `src/config/legal.ts` if you need to override computed legal strings
4. Replace placeholder PDF paths with real files in `public/documents/`
5. Run `npm run build` — all pages inherit these values automatically
