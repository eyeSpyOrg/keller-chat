/**
 * GET /api/connections
 * Returns all contacts assigned to Eric that have a navigator_connection_status.
 */
import type { APIRoute } from 'astro';
import { fetchConnections } from '../../lib/hubspot';

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  const env = (locals as any).runtime?.env ?? {};
  const token: string = env.HUBSPOT_PRIVATE_APP_TOKEN ?? '';
  const ownerId: string = env.HUBSPOT_ERIC_OWNER_ID ?? '';

  if (!token) {
    return new Response(JSON.stringify({ error: 'HubSpot token not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const connections = await fetchConnections(token, ownerId);
    return new Response(JSON.stringify(connections), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[GET /api/connections]', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch connections' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
