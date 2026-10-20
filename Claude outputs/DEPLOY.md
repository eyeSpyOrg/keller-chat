# KellerChat HubSpot Phase 1 — Deployment Guide

## What this zip contains

| File | Change |
|------|--------|
| `astro.config.mjs` | Adds `@astrojs/cloudflare` adapter (`output: 'hybrid'`) |
| `wrangler.toml` | New — Cloudflare Pages deployment config |
| `src/lib/hubspot.ts` | New — all HubSpot API logic (server-side only) |
| `src/pages/api/connections.ts` | New — GET contacts by status |
| `src/pages/api/connections/[id]/accept.ts` | New — PATCH status → Active |
| `src/pages/api/connections/[id]/decline.ts` | New — PATCH status → Declined |
| `src/pages/api/connections/[id]/transfer.ts` | New — PATCH status → Transferred + reassign owner |
| `src/pages/api/reminders.ts` | New — GET open tasks / PATCH complete task |
| `src/pages/api/activity.ts` | New — GET calls + emails feed |
| `src/pages/dashboard/index.astro` | Rewritten `<script>` block — live fetch from all APIs |

## Steps before deploying

### 1. Install the Cloudflare adapter
```bash
npm install @astrojs/cloudflare
```

### 2. Create HubSpot Private App
In HubSpot: Settings → Integrations → Private Apps → Create a private app.  
Required scopes:
- `crm.objects.contacts.read`
- `crm.objects.contacts.write`
- `crm.objects.tasks.read`
- `crm.objects.tasks.write`
- `crm.objects.engagements.read` (for calls/emails)

Copy the token — you'll use it in step 4.

### 3. Create custom HubSpot contact properties
In HubSpot: Settings → Properties → Contact properties → Create property

| Property name (internal) | Type | Values |
|--------------------------|------|--------|
| `navigator_connection_status` | Dropdown | New, Active, Declined, Transferred |
| `contact_type` | Dropdown | Patient, Navigator |
| `referring_practice` | Single-line text | — |

### 4. Find Eric's HubSpot owner ID
HubSpot → Settings → Users & Teams → click Eric Davis → grab the number from the URL.  
Then open `wrangler.toml` and fill in:
```toml
HUBSPOT_ERIC_OWNER_ID = "123456"   # Eric's actual numeric owner ID
```

### 5. Set the secret token
```bash
# In the keller-chat repo root:
wrangler secret put HUBSPOT_PRIVATE_APP_TOKEN
# Paste the token when prompted — it is never stored in any file
```

### 6. Apply the files
Drop the zip contents into the repo (overwrite existing files), then:
```bash
git add .
git commit -m "feat: HubSpot Phase 1 live integration (connections, reminders, activity)"
git push
```
Cloudflare Pages will auto-deploy on push.

### 7. Set up HubSpot Workflow (optional but recommended)
Trigger: Form submission on form `ffced240-50b3-44bd-a32a-410cfd1e0104`  
Actions:
1. Set `navigator_connection_status = New`
2. Create task: "48hr follow-up" (due 48 hours after submission)
3. Create task: "1-week check-in" (due 7 days after submission)
4. Create task: "1-month check-in" (due 30 days after submission)

---

## Transfer modal — navigator list
`src/pages/dashboard/index.astro` contains a hardcoded `<select>` in the transfer modal with placeholder navigators. Replace or extend these with real navigator HubSpot owner IDs once additional navigators are onboarded.

## Local development
```bash
npm run dev
# Reads wrangler.toml [vars] via platformProxy; secrets need a .env file locally
```
Add to your local `.env` (gitignored):
```
HUBSPOT_PRIVATE_APP_TOKEN=your_token_here
HUBSPOT_ERIC_OWNER_ID=123456
```
