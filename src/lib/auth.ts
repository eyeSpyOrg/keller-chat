/**
 * Auth guard for KellerChat API routes.
 *
 * Strategy: Cloudflare Workers session (KV-backed, set by the OAuth flow).
 * The session cookie is httpOnly and SameSite=Lax — the browser sends it
 * automatically; JavaScript cannot read it.
 *
 * A route calls `requireAuth(locals)` and short-circuits if it returns a
 * Response (401). On success the resolved userId can be used for ownership
 * checks.
 *
 * When the OAuth flow is wired up, set `session.userId` after verifying the
 * token exchange. Until then, development environments bypass the guard via
 * the KC_DEV_BYPASS env var (never set this in production).
 */

const UNAUTHORIZED = new Response(
  JSON.stringify({ error: 'Unauthorized' }),
  { status: 401, headers: { 'Content-Type': 'application/json' } },
);

export interface AuthResult {
  userId: string;
}

/**
 * Returns `null` if the request is authenticated (caller may proceed),
 * or a 401 Response the caller must return immediately.
 *
 * Usage:
 *   const unauth = requireAuth(locals);
 *   if (unauth) return unauth;
 */
export function requireAuth(locals: App.Locals): Response | null {
  const env = (locals as any).runtime?.env ?? {};

  // Development escape hatch — must NOT be set in production Cloudflare env.
  if (env.KC_DEV_BYPASS === 'true') return null;

  // Cloudflare KV-backed session (populated by the OAuth callback).
  const session = (locals as any).session;
  if (session?.userId) return null;

  return UNAUTHORIZED;
}
