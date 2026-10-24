/**
 * GET /api/activity?filter=all|calls|emails
 * Returns Eric's recent calls and/or emails merged into one feed.
 */
import type { APIRoute } from 'astro';
import { fetchActivity } from '../../lib/hubspot';
import { requireAuth } from '../../lib/auth';

export const prerender = false;

export const GET: APIRoute = async ({ url, locals }) => {
  const unauth = requireAuth(locals);
  if (unauth) return unauth;

  const env = (locals as any).runtime?.env ?? {};
  const token: string = env.HUBSPOT_PRIVATE_APP_TOKEN ?? '';
  const ownerId: string = env.HUBSPOT_ERIC_OWNER_ID ?? '';

  if (!token) {
    return new Response(JSON.stringify({ error: 'HubSpot token not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const filterParam = url.searchParams.get('filter') ?? 'all';
  const filter =
    filterParam === 'calls' || filterParam === 'emails' ? filterParam : 'all';

  try {
    const activity = await fetchActivity(token, ownerId, filter);
    return new Response(JSON.stringify(activity), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[GET /api/activity]', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch activity' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
