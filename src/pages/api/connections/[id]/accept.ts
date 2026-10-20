/**
 * PATCH /api/connections/:id/accept
 * Sets navigator_connection_status → 'Active' in HubSpot.
 * The connection stays visible in the Connections tab with status Active.
 */
import type { APIRoute } from 'astro';
import { patchContactStatus } from '../../../../lib/hubspot';

export const prerender = false;

export const PATCH: APIRoute = async ({ params, locals }) => {
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
      navigator_connection_status: 'Active',
    });
    return new Response(JSON.stringify({ ok: true, status: 'Active' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[PATCH /api/connections/:id/accept]', err);
    return new Response(JSON.stringify({ error: 'Failed to accept connection' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
