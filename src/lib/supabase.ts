import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Supabase Storage — server-side client
// ---------------------------------------------------------------------------
// This file is intentionally written so the rest of the app keeps working
// with zero configuration. If you haven't set up Supabase yet, every
// function below simply returns null/false and the upload API route
// (src/app/api/upload/route.ts) automatically falls back to saving files
// on local disk instead — that's why the site works out of the box.
//
// To switch to Supabase Storage (recommended for any real deployment,
// since most hosts like Vercel have a read-only or ephemeral filesystem):
//
//   1. Create a free project at https://supabase.com
//   2. In your Supabase dashboard, go to Storage → create a new PUBLIC
//      bucket named "uploads" (Storage → New bucket → toggle "Public").
//   3. Go to Project Settings → API and copy:
//        - "Project URL"                  → SUPABASE_URL
//        - "service_role" secret key      → SUPABASE_SERVICE_ROLE_KEY
//      Do NOT use the "anon public" key here — uploads run on the server
//      and need the service role key to write to storage without going
//      through a logged-in user session. Using the anon key for this is
//      the most common cause of upload failures and "getToken()"-style
//      auth errors, because the anon key expects a signed-in Supabase Auth
//      session to exist, which a plain file-upload form does not have.
//   4. Create a file named .env.local in the project root (same folder as
//      package.json) with:
//
//        SUPABASE_URL=https://your-project-ref.supabase.co
//        SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
//        SUPABASE_STORAGE_BUCKET=uploads
//
//   5. Restart `npm run dev`. Uploads will now go to Supabase Storage
//      automatically — no other code changes needed.
//
// SUPABASE_SERVICE_ROLE_KEY bypasses row-level security and storage
// policies, so it must only ever be used in server-side code (API routes,
// like this project does) and must never be prefixed with NEXT_PUBLIC_ or
// sent to the browser.
// ---------------------------------------------------------------------------

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
export const SUPABASE_STORAGE_BUCKET =
  process.env.SUPABASE_STORAGE_BUCKET || "uploads";

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
);

let cachedClient: SupabaseClient | null = null;

/**
 * Returns a server-side Supabase client using the service role key, or
 * null if Supabase hasn't been configured yet via .env.local. Callers
 * should always check for null and fall back gracefully (see
 * src/app/api/upload/route.ts for the reference pattern).
 */
export function getSupabaseServerClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;

  if (!cachedClient) {
    cachedClient = createClient(SUPABASE_URL as string, SUPABASE_SERVICE_ROLE_KEY as string, {
      auth: {
        // Server-side usage only — never persist or auto-refresh a session,
        // since there is no browser/user session involved in this client.
        // This also avoids the "getToken()"/session-refresh errors that
        // happen when a service-role client is mistakenly treated like a
        // browser auth client.
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return cachedClient;
}
