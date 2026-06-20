import { createHmac, timingSafeEqual } from "crypto";

// ---------------------------------------------------------------------------
// Admin authentication
// ---------------------------------------------------------------------------
// This protects every page under /admin and every write-capable API route
// (/api/products, /api/blog, /api/upload) behind a single username/password
// pair, enforced in middleware.ts so it can't be bypassed by calling the
// API routes directly.
//
// Setup: copy .env.local.example to .env.local and set:
//
//   ADMIN_USERNAME=your-chosen-username
//   ADMIN_PASSWORD=your-chosen-password
//   SESSION_SECRET=any-long-random-string
//
// SESSION_SECRET is used to sign the login session cookie so it can't be
// forged or edited by a visitor — it should be long and random, but it
// does not need to be memorable since you'll never type it in yourself.
// Generate one quickly with: openssl rand -hex 32
//
// None of these three values are ever sent to the browser. They are only
// read here, on the server, inside middleware and the login API route.
// ---------------------------------------------------------------------------

export const SESSION_COOKIE_NAME = "kz_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

function getEnv(name: string): string {
  return process.env[name] || "";
}

/**
 * True once ADMIN_USERNAME, ADMIN_PASSWORD, and SESSION_SECRET are all set.
 * Used by middleware to decide whether the admin area can be protected at
 * all — if any of these are missing, middleware blocks every admin
 * request with a clear setup message instead of either crashing or
 * silently leaving the dashboard open.
 */
export function isAuthConfigured(): boolean {
  return Boolean(
    getEnv("ADMIN_USERNAME") && getEnv("ADMIN_PASSWORD") && getEnv("SESSION_SECRET")
  );
}

/**
 * Constant-time string comparison so checking the password doesn't leak
 * timing information about how many characters matched.
 */
function safeStringEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Still run a comparison of equal-length buffers so failed attempts
    // with a wrong-length guess take roughly the same time as a real one.
    timingSafeEqual(bufA, bufA);
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

export function checkCredentials(username: string, password: string): boolean {
  if (!isAuthConfigured()) return false;
  const validUsername = safeStringEqual(username, getEnv("ADMIN_USERNAME"));
  const validPassword = safeStringEqual(password, getEnv("ADMIN_PASSWORD"));
  return validUsername && validPassword;
}

/**
 * Builds a signed session token: `<expiryTimestamp>.<hmacSignature>`.
 * The token contains no secret data itself (just an expiry timestamp), so
 * there's nothing meaningful to decode — its only job is to prove the
 * server issued it, which the signature guarantees.
 */
export function createSessionToken(): string {
  const expiresAt = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  const payload = String(expiresAt);
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

function sign(payload: string): string {
  return createHmac("sha256", getEnv("SESSION_SECRET"))
    .update(payload)
    .digest("hex");
}

/**
 * Verifies a session token's signature and expiry. Returns false for any
 * malformed, expired, or tampered token.
 */
export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token || !isAuthConfigured()) return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [payload, signature] = parts;
  const expected = sign(payload);

  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expected);
  if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
    return false;
  }

  const expiresAt = Number(payload);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;

  return true;
}

export const SESSION_MAX_AGE = SESSION_MAX_AGE_SECONDS;
