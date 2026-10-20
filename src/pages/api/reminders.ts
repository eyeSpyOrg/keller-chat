/**
 * GET  /api/reminders          — fetch Eric's open tasks
 * PATCH /api/reminders?id=:id  — mark a task COMPLETED
 */
import type { APIRoute } from 'astro';
import { fetchReminders, completeReminder } from '../../lib/hubspot';

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
    const reminders = await fetchReminders(token, ownerId);
    return new Response(JSON.stringify(reminders), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[GET /api/reminders]', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch reminders' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const PATCH: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env ?? {};
  const token: string = env.HUBSPOT_PRIVATE_APP_TOKEN ?? '';

  if (!token) {
    return new Response(JSON.stringify({ error: 'HubSpot token not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: { id?: string } = {};
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!body.id) {
    return new Response(JSON.stringify({ error: 'Task id is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    await completeReminder(token, body.id);
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[PATCH /api/reminders]', err);
    return new Response(JSON.stringify({ error: 'Failed to complete reminder' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
