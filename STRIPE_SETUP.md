# Stripe Setup Guide

This project uses **Stripe Payment Links** — Stripe's hosted checkout page.
No custom card form is built (per CLAUDE.md security policy).
Donors click "Donate Now" and are taken to a Stripe-hosted payment page.

---

## Why Payment Links (Not a Custom Form)

| | Payment Links (this project) | Custom Stripe Form |
|--|--|--|
| PCI compliance | Stripe handles it entirely | You must achieve SAQ A-EP |
| Secret key in frontend | Never needed | Required (huge security risk) |
| Build time | Minutes | Days + security review |
| Receipts | Automatic from Stripe | Must build yourself |
| Tax receipts | Automatic | Must build yourself |
| Mobile | Stripe-optimized | You build it |
| Apple/Google Pay | Built in | You integrate |

---

## Step 1: Create a Stripe Account

1. Go to [dashboard.stripe.com](https://dashboard.stripe.com) → sign up
2. Complete account verification (required for live payments)
3. Enable test mode (toggle in top-left of Dashboard)

---

## Step 2: Create Payment Links

Create one Payment Link per donation amount tier + one for custom amounts.

1. Go to **Products** → **Payment Links** → **New**
2. **For a fixed amount:** Add a product called "Donation — $25" at price $25.00 USD
3. **For custom amounts:** Add a product and check "Customer chooses price"
4. Under **Options**:
   - Enable "Collect customer address" (needed for tax receipts)
   - Add a custom field: "Dedication / in memory of" (optional)
   - Set success redirect to `/support/thank-you/` (create this page)
5. Save and copy the Payment Link URL

Repeat for each amount: $25, $50, $100, $250, and one custom-amount link.

---

## Step 3: Add Monthly (Recurring) Versions

For the "Monthly" toggle in `DonationForm.astro`:

1. Create the same amounts but as **Recurring** products (monthly billing)
2. Create separate Payment Links for monthly tiers
3. In `DonationForm.astro`, use the `allowRecurring` prop and create a second set of `paymentLinks` keyed by amount for the monthly versions

For now, the component uses one set of links for both one-time and monthly. You can add a `monthlyPaymentLinks` prop later to separate them.

---

## Step 4: Update DonationForm.astro

Open `src/pages/support/index.astro` and replace the placeholder URLs:

```astro
const paymentLinks = {
  25:     'https://buy.stripe.com/REAL_LINK_25',
  50:     'https://buy.stripe.com/REAL_LINK_50',
  100:    'https://buy.stripe.com/REAL_LINK_100',
  250:    'https://buy.stripe.com/REAL_LINK_250',
  custom: 'https://buy.stripe.com/REAL_LINK_CUSTOM',
};
```

---

## Step 5: Test in Sandbox

Use Stripe's test mode:

- Test card: `4242 4242 4242 4242` · any future expiry · any CVC · any ZIP
- Decline card: `4000 0000 0000 0002`
- 3D Secure card: `4000 0025 0000 3155`

After a test donation:
1. Check **Dashboard → Payments** — it should appear
2. Check your email — Stripe sends a test receipt automatically
3. Verify GA4 event fires in DebugView (see `GA4_EVENTS.md`)

---

## Step 6: Go Live

1. Toggle off test mode in Stripe Dashboard
2. Complete identity verification if prompted
3. Your Payment Links automatically switch to live mode — the same URLs work
4. Update the publishable key in `src/config/site.js` → `integrations.stripePublishableKey` to the live key `pk_live_...`

---

## Donation Receipts

Stripe sends automatic email receipts after every payment. To customize:

1. Go to **Settings → Emails** in Stripe Dashboard
2. Upload your logo
3. Add a custom message: "Thank you for supporting [Org Name], a 501(c)(3) nonprofit. EIN: XX-XXXXXXX. Your donation is tax-deductible to the fullest extent permitted by law."

---

## Webhooks (Optional, for Thank-You Page)

If you want to verify a donation on the server side (e.g., a thank-you page that confirms the payment):

1. Go to **Developers → Webhooks** → **Add endpoint**
2. Endpoint URL: `https://yourdomain.org/api/stripe-webhook` (Astro server route)
3. Events to listen for: `checkout.session.completed`, `payment_intent.succeeded`
4. Copy the Webhook Secret to `STRIPE_WEBHOOK_SECRET` in your hosting env vars

For static sites without server routes, Payment Links handle all confirmation via Stripe's hosted success page. The webhook is only needed for custom server logic.

---

## Environment Variables

```bash
# .env — NEVER commit this file
STRIPE_SECRET_KEY=sk_live_...       # only needed for webhook verification
STRIPE_WEBHOOK_SECRET=whsec_...    # only needed for webhook verification
```

The **Publishable Key** (`pk_live_...`) is public — it goes in `src/config/site.js`, not `.env`.
The **Secret Key** goes in hosting env vars only. Never in the repo.

---

## Tax Receipt Automation

Stripe sends automatic tax receipts. For official acknowledgment letters:

1. Set up a HubSpot workflow triggered by a Stripe contact/event
2. Or use Stripe's built-in receipt email (customize in Dashboard → Settings → Emails)

Annual summary: Stripe Dashboard → **Reports → Revenue recognition** → export donor totals by year.
