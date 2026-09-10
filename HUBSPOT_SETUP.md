# HubSpot Setup Guide

This project uses HubSpot's **Forms Submission API** — not the embed widget.
This means: native, accessible HTML forms submit directly to HubSpot's API.
No HubSpot JS snippet in the page, no iframe, no dependency on their CDN.

---

## Why Native Forms (Not Embed Widget)

| | Native Form (this project) | HubSpot Embed Widget |
|--|--|--|
| Accessibility | WCAG 2.2 AA — our labels, our error messages | HubSpot's markup (variable quality) |
| Performance | Zero third-party JS on page load | Loads HubSpot's full embed SDK |
| Styling | Full control with our CSS variables | HubSpot stylesheet overrides needed |
| Offline/blocked | Graceful error message | Silent failure |
| Consent | Loads after user grants consent | May fire before consent |

---

## Step 1: Create a HubSpot Account

1. Go to [app.hubspot.com](https://app.hubspot.com) → sign up for a free CRM account
2. Your **Portal ID** is in the URL: `app.hubspot.com/contacts/XXXXXXX/`
3. Copy that Portal ID into `src/config/site.js` → `integrations.hubspotPortalId`

---

## Step 2: Create a Form in HubSpot

1. Go to **Marketing → Forms** → **Create form**
2. Choose **Embedded form** (even though we won't embed it — this creates the right form type)
3. Add your fields. **Important:** the `name` attribute in `HubSpotForm.astro` must match the HubSpot **property internal name** exactly.
4. Common internal names:

| Label | Internal Name |
|-------|--------------|
| First Name | `firstname` |
| Last Name | `lastname` |
| Email | `email` |
| Phone | `phone` |
| Message / Notes | `message` (or custom) |
| Company | `company` |

5. After saving, find the **Form GUID** in the form's embed code:
   `formId: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"`
6. Copy that GUID — you'll pass it as `formGuid` to `HubSpotForm.astro`

---

## Step 3: Use HubSpotForm.astro

```astro
---
import HubSpotForm from '../components/HubSpotForm.astro';
---

<!-- Contact form -->
<HubSpotForm
  formGuid="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
  heading="Contact Us"
  submitLabel="Send Message"
  fields={[
    { name: 'firstname', label: 'First name', type: 'text', required: true, autocomplete: 'given-name' },
    { name: 'email', label: 'Email address', type: 'email', required: true },
    { name: 'message', label: 'Message', type: 'textarea', required: true },
  ]}
/>

<!-- Newsletter signup (email only) -->
<HubSpotForm
  formGuid="yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy"
  heading="Stay Connected"
  submitLabel="Subscribe"
  fields={[
    { name: 'email', label: 'Email address', type: 'email', required: true, autocomplete: 'email' },
  ]}
/>
```

---

## Step 4: Forms to Set Up

Create these forms in HubSpot and collect their GUIDs:

| Form | Page | Component |
|------|------|-----------|
| Contact | `/contact/` | `HubSpotForm` |
| Newsletter Signup | Homepage, Footer | `NewsletterSignup` |
| Volunteer Interest | `/contact/` or standalone | `HubSpotForm` |
| Event Registration | `/events/` | `HubSpotForm` |

Update `NewsletterSignup.astro`'s default `formGuid` prop once you have the real GUID.

---

## Step 5: Test a Submission

1. Fill out and submit a form on your local dev server
2. Go to HubSpot → **Contacts** — the submission should appear within seconds
3. Check **Marketing → Forms → [your form] → Submissions** for raw data

---

## Step 6: Set Up Follow-Up Emails (Optional)

1. In HubSpot, go to your form → **Options** tab
2. Enable **Send follow-up email** and configure the template
3. Or build a **Workflow** triggered by the form submission

---

## Environment Variables

The Forms Submission API requires **no secret tokens** — the Portal ID and Form GUID are public identifiers. The only HubSpot env var needed is if you add a Private App for advanced CRM operations:

```bash
# .env — only needed for server-side Private App (rare)
HUBSPOT_PRIVATE_APP_TOKEN=
```

The Portal ID goes in `src/config/site.js`, not `.env`.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| "Something went wrong" on submit | Check Portal ID + Form GUID are correct; check browser console for 4xx/5xx |
| Submission not appearing in HubSpot | Form might not be published — check form status in HubSpot |
| Fields not syncing | `name` attribute must match HubSpot property internal name exactly |
| CORS error | You're hitting the API from localhost — this works fine in production; use `http://localhost:4321` not `127.0.0.1` |

---

## GA4 Integration

`HubSpotForm.astro` fires `gtag('event', 'form_submit', { form_guid })` on successful submission.
Map this in GA4 as a conversion event named `form_submit`. See `GA4_EVENTS.md`.
