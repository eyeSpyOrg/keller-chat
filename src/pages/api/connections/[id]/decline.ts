/**
 * PATCH /api/connections/:id/decline
 * Sets navigator_connection_status → 'Declined' in HubSpot.
 */
import type { APIRoute } from 'astro';
import { patchContactStatus } from '../../../../lib/hubspot';
import { requireAuth } from '../../../../lib/auth';

export const prerender = false;

export const PATCH: APIRoute = async ({ params, locals }) => {
  const unauth = requireAuth(locals);
  if (unauth) return unauth;

  const env = (locals as any).runtime?.env ?? {};
  const token: string = env.HUBSPOT_PRIVATE_APP_TOKEN ?? '';
  const contactId = params.id;

  if (!token) {
    return new Response(JSON.stringify({ error: 'HubSpot token not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  if (!contactId) {
    return new Response(JSON.stringify({ error: 'Missing contact id' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    await patchContactStatus(token, contactId, {
      navigator_connection_status: 'Declined',
    });
    return new Response(JSON.stringify({ ok: true, status: 'Declined' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[PATCH /api/connections/:id/decline]', err);
    return new Response(JSON.stringify({ error: 'Failed to decline connection' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
