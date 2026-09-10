# Nonprofit Website Best Practices

Standards and principles behind every design and content decision in this template.
Reference this when making content or UX decisions for a new site.

---

## 1. Impact-First Storytelling

**Rule:** Lead with impact, not activities.

| Instead of | Write |
|-----------|-------|
| "We run workshops" | "Our workshops helped 800 people find resources they didn't know existed" |
| "We have programs" | "Every program we run answers a need we heard from the community" |
| "We were founded in 2021" | "Founded after a family member's vision loss showed us how hard it is to find help" |

**Why it works:** Donors give to outcomes, not activities. A number + a human story outperforms a list of services every time.

---

## 2. The CURE Framework for Donation Pages

Every donation page section should hit one of:

- **Credibility** — ComplianceBadge, Form 990, Charity Navigator rating
- **Urgency** — specific need ("42 people on our waitlist right now")
- **Relevance** — impact tiers that match the donor's likely gift amount
- **Ease** — minimal clicks from "I want to give" to "payment confirmed"

`DonationForm.astro` implements Ease + Relevance. You provide Credibility + Urgency in the page copy.

---

## 3. Answer-First Writing (AEO)

Every heading should imply a question. The first sentence under it answers that question directly.

```
❌ "About Our Programs"
   Our programs have been running since 2021...

✅ "What Do Our Programs Do?"
   Our programs connect people with vision loss to the resources, 
   technology, and community they need to live independently.
```

This structure also powers AI answer engines (ChatGPT, Perplexity, Google SGE) that pull direct answers from your pages.

---

## 4. NAP Consistency

Name, Address, Phone must be **identical** everywhere:
- Footer
- Contact page
- Schema.org Organization markup
- Google Business Profile
- Charity Navigator / Candid profiles

This template enforces it: all NAP renders from `src/config/site.js` — it cannot drift.

---

## 5. Trust Signals Hierarchy

Place trust signals in this order on donation pages (highest impact first):

1. **501(c)(3) badge + EIN** — `ComplianceBadge.astro` ✅
2. **Specific impact metrics** — "$50 funds one navigation session" ✅
3. **Third-party ratings** — Charity Navigator, Candid (add URLs to ComplianceBadge)
4. **Testimonials** — real names, specific outcomes (`Testimonial.astro`) ✅
5. **Media mentions** — logos of news outlets that covered you
6. **Board/team visibility** — named leadership signals accountability

---

## 6. Donation Form Principles

- **Anchor the middle tier** — your $50 option should be the "default-feeling" tier; most donors pick the middle
- **Impact statements must be specific** — "$50 funds a workshop" not "$50 helps people"
- **Monthly ask should be secondary** — don't lead with it, but make it easy to switch to
- **Tax message must be present** on all donation flows — it's a conversion factor for donors above $500
- **Never require an account** — Stripe Payment Links don't require one ✅

---

## 7. Accessibility = Audience Expansion

For blind and low vision nonprofits especially, but for all: your audience includes people using screen readers, keyboard-only users, people with cognitive differences, and aging adults who increase text size.

- WCAG 2.2 AA is the minimum — this template enforces it globally
- The Accessibility Bar (`AccessibilityBar.astro`) lets users adjust font size, contrast, spacing, and motion without needing browser settings
- Every form error must say what the fix is: not "Invalid input" — "Please enter a valid email address"

---

## 8. Content Freshness Signals

Search engines and AI systems deprioritize stale content. Keep these updated:

| What | How Often |
|------|-----------|
| Annual Report | Annually (publish within 6 months of fiscal year end) |
| Impact metrics on homepage | Annually or quarterly |
| Team bios / photos | When team changes |
| Events | Remove past events promptly |
| FAQ | Review quarterly; add new questions as they come in |
| llms.txt | When major content changes |

---

## 9. Email Collection Strategy

Every page should offer a way to stay connected. Priority order:

1. **Newsletter signup** — lowest friction, highest volume (one field: email)
2. **Volunteer interest form** — higher engagement, lower volume
3. **Donation** — highest value, lowest volume

Sequence matters: newsletter → volunteer → donor is a proven nonprofit funnel. `NewsletterSignup.astro` handles step 1.

---

## 10. Schema.org for Nonprofits

This template ships with:

| Schema Type | Where | Component |
|------------|-------|-----------|
| `Organization` | Every page | `OrganizationSchema.astro` in BaseLayout |
| `FAQPage` | Any page with FAQ | `FAQ.astro` → `FAQSchema.astro` |
| `Event` | Events page | `EventSchema.astro` |
| `WebSite` | Every page | `OrganizationSchema.astro` |

Add per-page types when relevant:
- `Article` for blog posts
- `VideoObject` for YouTube embeds (add `VideoObject` schema to `YouTubeEmbed.astro` when video URLs are known)
- `DonateAction` on the donation page

Use `orgType: 'NGO'` in `site.js` for nonprofits (not `Organization`).

---

## 11. Performance = More Donors

Slow sites lose donors. For every 1-second delay in page load:

- Mobile conversions drop ~20%
- Donation form abandonment increases

This template maintains Lighthouse ≥ 90 by:
- Self-hosted fonts with `font-display: swap` ✅
- Images: `loading="lazy"` below fold, `fetchpriority="high"` on hero ✅
- YouTube facade: no iframe until click ✅
- HubSpot: native form, no SDK ✅
- Analytics: loads after consent, `defer`-equivalent ✅
- Stripe: Payment Links redirect — no JS on your page ✅

---

## 12. Recurring vs. One-Time Giving

Recurring donors are worth 5–10× a one-time donor over 3 years. Conversion tips:

- Show the monthly math: "$50/month = 12 navigation sessions per year"
- Don't default to monthly — let donors discover it; forced defaults backfire
- Monthly donors should get quarterly impact updates (set up in HubSpot)
- Cancellation must be frictionless (Stripe handles this via the customer portal) ✅
