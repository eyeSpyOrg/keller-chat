/**
 * PATCH /api/connections/:id/transfer
 * Body: { navigatorOwnerId: string }
 * Sets navigator_connection_status → 'Transferred' and reassigns hubspot_owner_id.
 */
import type { APIRoute } from 'astro';
import { patchContactStatus } from '../../../../lib/hubspot';

export const prerender = false;

export const PATCH: APIRoute = async ({ params, locals, request }) => {
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

  let body: { navigatorOwnerId?: string } = {};
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!body.navigatorOwnerId) {
    return new Response(JSON.stringify({ error: 'navigatorOwnerId is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    await patchContactStatus(token, contactId, {
      navigator_connection_status: 'Transferred',
      hubspot_owner_id: body.navigatorOwnerId,
    });
    return new Response(JSON.stringify({ ok: true, status: 'Transferred' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[PATCH /api/connections/:id/transfer]', err);
    return new Response(JSON.stringify({ error: 'Failed to transfer connection' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
