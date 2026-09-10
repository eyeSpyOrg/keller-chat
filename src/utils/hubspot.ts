/**
 * hubspot.ts — HubSpot Forms Submission API helpers.
 * Used by HubSpotForm.astro's client-side script.
 * No secrets needed: the Forms v3 API accepts the portal ID + form GUID
 * from the client. Syncs submissions to CRM automatically.
 */

export interface HubSpotField {
  name: string;
  value: string;
}

export interface HubSpotContext {
  hutk?: string;
  pageUri?: string;
  pageName?: string;
}

export interface HubSpotPayload {
  fields: HubSpotField[];
  context: HubSpotContext;
}

/** Submit a form to the HubSpot Forms v3 API. */
export async function submitHubSpotForm(
  portalId: string,
  formGuid: string,
  fields: HubSpotField[],
  context: HubSpotContext = {}
): Promise<void> {
  const endpoint = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuid}`;
  const payload: HubSpotPayload = { fields, context };

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`HubSpot submission failed: HTTP ${res.status}`);
  }
}

/** Read the HubSpot tracking cookie (hutk) from document.cookie. */
export function getHutk(): string {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(/(?:^|; )hubspotutk=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : '';
}
