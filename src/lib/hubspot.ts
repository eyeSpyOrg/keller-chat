/**
 * Shared HubSpot API helpers for KellerChat navigator dashboard.
 *
 * All calls use a Private App token stored in the Cloudflare Worker
 * environment (HUBSPOT_PRIVATE_APP_TOKEN). The token never reaches
 * the browser.
 *
 * HubSpot API reference:
 *   https://developers.hubspot.com/docs/api/crm/contacts
 *   https://developers.hubspot.com/docs/api/crm/tasks
 *   https://developers.hubspot.com/docs/api/crm/engagements
 */

const HS_BASE = 'https://api.hubapi.com';

/** Build the common auth + content-type headers */
export function hsHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

// ── Types ─────────────────────────────────────────────────────────────────

export interface Connection {
  id: string;
  name: string;
  email: string;
  type: string;       // 'Patient' | 'Navigator' | …
  source: string;     // referring_practice
  referredAt: string; // ISO date string
  status: 'New' | 'Active' | 'Declined' | 'Transferred';
}

export interface Reminder {
  id: string;
  subject: string;
  dueAt: string;      // ISO timestamp
  contactId: string | null;
  contactName: string;
}

export interface ActivityItem {
  id: string;
  type: 'call' | 'email';
  direction: string;
  summary: string;    // call body or email subject
  durationSec?: number;
  createdAt: string;
  contactId: string | null;
}

// ── Connections ───────────────────────────────────────────────────────────

/**
 * Fetch all contacts assigned to Eric that have a navigator_connection_status.
 * Returns all four statuses so the dashboard shows the full picture.
 */
export async function fetchConnections(
  token: string,
  ownerId: string,
): Promise<Connection[]> {
  const body = {
    filterGroups: [
      { filters: [
        { propertyName: 'navigator_connection_status', operator: 'EQ', value: 'New' },
        { propertyName: 'hubspot_owner_id', operator: 'EQ', value: ownerId },
      ]},
      { filters: [
        { propertyName: 'navigator_connection_status', operator: 'EQ', value: 'Active' },
        { propertyName: 'hubspot_owner_id', operator: 'EQ', value: ownerId },
      ]},
      { filters: [
        { propertyName: 'navigator_connection_status', operator: 'EQ', value: 'Declined' },
        { propertyName: 'hubspot_owner_id', operator: 'EQ', value: ownerId },
      ]},
      { filters: [
        { propertyName: 'navigator_connection_status', operator: 'EQ', value: 'Transferred' },
        { propertyName: 'hubspot_owner_id', operator: 'EQ', value: ownerId },
      ]},
    ],
    properties: [
      'firstname', 'lastname', 'email',
      'contact_type', 'referring_practice',
      'createdate', 'navigator_connection_status',
    ],
    sorts: [{ propertyName: 'createdate', direction: 'DESCENDING' }],
    limit: 50,
  };

  const res = await fetch(`${HS_BASE}/crm/v3/objects/contacts/search`, {
    method: 'POST',
    headers: hsHeaders(token),
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`HubSpot contacts search ${res.status}`);
  const { results = [] } = await res.json() as { results: any[] };

  return results.map((c) => ({
    id: c.id,
    name: `${c.properties.firstname ?? ''} ${c.properties.lastname ?? ''}`.trim(),
    email: c.properties.email ?? '',
    type: c.properties.contact_type ?? 'Patient',
    source: c.properties.referring_practice ?? '',
    referredAt: c.properties.createdate ?? '',
    status: c.properties.navigator_connection_status ?? 'New',
  }));
}

/** PATCH a single contact's navigator_connection_status */
export async function patchContactStatus(
  token: string,
  contactId: string,
  properties: Record<string, string>,
): Promise<void> {
  const res = await fetch(`${HS_BASE}/crm/v3/objects/contacts/${contactId}`, {
    method: 'PATCH',
    headers: hsHeaders(token),
    body: JSON.stringify({ properties }),
  });
  if (!res.ok) throw new Error(`HubSpot contact PATCH ${res.status}`);
}

// ── Reminders (Tasks) ─────────────────────────────────────────────────────

/**
 * Fetch Eric's open HubSpot Tasks (auto-created by workflow at
 * 48 hr / 1 wk / 1 mo after a form submission).
 */
export async function fetchReminders(
  token: string,
  ownerId: string,
): Promise<Reminder[]> {
  const body = {
    filterGroups: [{ filters: [
      { propertyName: 'hubspot_owner_id', operator: 'EQ',  value: ownerId },
      { propertyName: 'hs_task_status',   operator: 'NEQ', value: 'COMPLETED' },
    ]}],
    properties: ['hs_task_subject', 'hs_timestamp', 'hs_task_status'],
    associations: ['contacts'],
    sorts: [{ propertyName: 'hs_timestamp', direction: 'ASCENDING' }],
    limit: 20,
  };

  const res = await fetch(`${HS_BASE}/crm/v3/objects/tasks/search`, {
    method: 'POST',
    headers: hsHeaders(token),
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`HubSpot tasks search ${res.status}`);
  const { results = [] } = await res.json() as { results: any[] };

  // Resolve contact names in parallel
  return Promise.all(results.map(async (task) => {
    const contactId: string | null =
      task.associations?.contacts?.results?.[0]?.id ?? null;

    let contactName = '';
    if (contactId) {
      const cr = await fetch(
        `${HS_BASE}/crm/v3/objects/contacts/${contactId}?properties=firstname,lastname`,
        { headers: hsHeaders(token) },
      );
      if (cr.ok) {
        const c = await cr.json() as { properties: any };
        contactName =
          `${c.properties.firstname ?? ''} ${c.properties.lastname ?? ''}`.trim();
      }
    }

    return {
      id: task.id,
      subject: task.properties.hs_task_subject ?? '',
      dueAt: task.properties.hs_timestamp ?? '',
      contactId,
      contactName,
    };
  }));
}

/** Mark a HubSpot Task as COMPLETED */
export async function completeReminder(
  token: string,
  taskId: string,
): Promise<void> {
  const res = await fetch(`${HS_BASE}/crm/v3/objects/tasks/${taskId}`, {
    method: 'PATCH',
    headers: hsHeaders(token),
    body: JSON.stringify({ properties: { hs_task_status: 'COMPLETED' } }),
  });
  if (!res.ok) throw new Error(`HubSpot task PATCH ${res.status}`);
}

// ── Activity (Calls + Emails) ─────────────────────────────────────────────

/** Fetch the 25 most recent calls owned by Eric */
async function fetchCalls(token: string, ownerId: string): Promise<ActivityItem[]> {
  const body = {
    filterGroups: [{ filters: [
      { propertyName: 'hubspot_owner_id', operator: 'EQ', value: ownerId },
    ]}],
    properties: ['hs_call_direction', 'hs_call_duration', 'hs_call_body', 'hs_createdate'],
    associations: ['contacts'],
    sorts: [{ propertyName: 'hs_createdate', direction: 'DESCENDING' }],
    limit: 25,
  };

  const res = await fetch(`${HS_BASE}/crm/v3/objects/calls/search`, {
    method: 'POST',
    headers: hsHeaders(token),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`HubSpot calls search ${res.status}`);
  const { results = [] } = await res.json() as { results: any[] };

  return results.map((c) => ({
    id: c.id,
    type: 'call' as const,
    direction: c.properties.hs_call_direction ?? 'OUTBOUND',
    summary: c.properties.hs_call_body ?? '',
    durationSec: parseInt(c.properties.hs_call_duration ?? '0', 10),
    createdAt: c.properties.hs_createdate ?? '',
    contactId: c.associations?.contacts?.results?.[0]?.id ?? null,
  }));
}

/** Fetch the 25 most recent emails owned by Eric */
async function fetchEmails(token: string, ownerId: string): Promise<ActivityItem[]> {
  const body = {
    filterGroups: [{ filters: [
      { propertyName: 'hubspot_owner_id', operator: 'EQ', value: ownerId },
    ]}],
    properties: ['hs_email_direction', 'hs_email_subject', 'hs_createdate'],
    associations: ['contacts'],
    sorts: [{ propertyName: 'hs_createdate', direction: 'DESCENDING' }],
    limit: 25,
  };

  const res = await fetch(`${HS_BASE}/crm/v3/objects/emails/search`, {
    method: 'POST',
    headers: hsHeaders(token),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`HubSpot emails search ${res.status}`);
  const { results = [] } = await res.json() as { results: any[] };

  return results.map((e) => ({
    id: e.id,
    type: 'email' as const,
    direction: e.properties.hs_email_direction ?? 'OUTGOING',
    summary: e.properties.hs_email_subject ?? '',
    createdAt: e.properties.hs_createdate ?? '',
    contactId: e.associations?.contacts?.results?.[0]?.id ?? null,
  }));
}

/** Merge calls + emails into a single chronological feed */
export async function fetchActivity(
  token: string,
  ownerId: string,
  filter: 'all' | 'calls' | 'emails' = 'all',
): Promise<ActivityItem[]> {
  const [calls, emails] = await Promise.all([
    filter !== 'emails' ? fetchCalls(token, ownerId) : Promise.resolve([]),
    filter !== 'calls'  ? fetchEmails(token, ownerId) : Promise.resolve([]),
  ]);

  return [...calls, ...emails].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}
