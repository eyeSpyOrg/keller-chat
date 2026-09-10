# GA4 Event Tracking Map

All events are implemented in `src/utils/ga4.ts` and fired within components.
Events only fire after the user grants analytics consent (via `ConsentBanner.astro`).

---

## Event Reference

| Event Name | Where It Fires | Parameters | Component |
|-----------|---------------|-----------|-----------|
| `donation_click` | User clicks a preset amount OR donation CTA | `amount` (number), `type` ("one-time" \| "monthly") | `DonationForm.astro` |
| `donation_initiated` | Donation page loads | `source` (page URL) | `support/index.astro` |
| `form_submit` | Any HubSpot form submitted successfully | `form_guid` (string) | `HubSpotForm.astro` |
| `newsletter_signup` | Newsletter form submitted | — | `NewsletterSignup.astro` |
| `document_download` | Download link clicked | `document_type`, `year` | `DocumentCard.astro` |
| `video_play` | YouTube facade clicked / video started | `video_id`, `video_title` | `YouTubeEmbed.astro` |
| `scroll_depth` | User reaches 25/50/75/100% scroll | `depth` (25\|50\|75\|100), `page` | `ga4.ts initScrollDepth()` |
| `page_engagement` | User active on page ≥30 seconds | `page` (path) | `ga4.ts initPageEngagement()` |
| `volunteer_signup` | Volunteer form submitted | — | `HubSpotForm.astro` (volunteer form) |
| `event_registration` | Event registration form submitted | `event_name` | `HubSpotForm.astro` (event form) |

---

## Setup in GA4 Dashboard

### Step 1: Connect GA4

1. Go to [analytics.google.com](https://analytics.google.com) → create a property
2. Copy the **Measurement ID** (`G-XXXXXXXXXX`)
3. Set it in `src/config/site.js` → `integrations.ga4Id`
4. Analytics only loads after consent — `Analytics.astro` handles this

### Step 2: Mark Conversion Events

In GA4 → **Events**, mark these as conversions:

| Event | Why |
|-------|-----|
| `donation_click` | Primary conversion — measures donation intent |
| `form_submit` | Contact/newsletter conversion |
| `newsletter_signup` | Audience growth metric |
| `event_registration` | Event funnel metric |

### Step 3: Create Custom Dimensions

In GA4 → **Admin → Custom definitions → Custom dimensions**:

| Dimension Name | Scope | Event Parameter |
|----------------|-------|----------------|
| Donation Amount | Event | `amount` |
| Donation Type | Event | `type` |
| Document Type | Event | `document_type` |
| Document Year | Event | `year` |
| Video ID | Event | `video_id` |
| Scroll Depth | Event | `depth` |

### Step 4: Verify in DebugView

1. Open GA4 → **Admin → DebugView**
2. Browse your site with the GA4 Debugger Chrome extension enabled
3. Events should appear in real time with all parameters

---

## Using GA4 Helpers in Components

```typescript
// In a <script> block inside any .astro component:
import { trackEvent, trackDocumentDownload } from '../utils/ga4';

// Generic event
trackEvent('custom_event', { param1: 'value' });

// Named helpers (recommended — consistent parameter names)
trackDocumentDownload('annual-report', '2024');
```

---

## GDPR/CCPA Compliance

- GA4 loads **only after** the user clicks "Accept" in `ConsentBanner.astro`
- If the user declines or hasn't chosen, `gtag` is never defined — all `trackEvent` calls silently no-op
- GA4 is configured with **no ad personalization** (set `allow_google_signals: false` in `Analytics.astro` if needed)
- IP anonymization is on by default in GA4

---

## Funnel Analysis (Recommended)

Set up these funnel explorations in GA4:

### Donation Funnel
1. `donation_initiated` (page load)
2. `donation_click` (amount selected)
3. [Stripe redirect — tracked by Stripe separately]

### Contact Funnel
1. Page view on `/contact/`
2. `form_submit`

### Content Engagement
1. Page view
2. `scroll_depth` (50%)
3. `page_engagement` (30s)
