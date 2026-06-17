import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createServiceSupabaseClient } from "@/lib/supabase";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (auth.error) return auth.error;
  const supabase = createServiceSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Missing SUPABASE_SERVICE_ROLE_KEY" }, { status: 500 });
  const { data, error } = await supabase.from("site_settings").select("*").order("key");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ settings: data ?? [] });
}

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if (auth.error) return auth.error;
  const supabase = createServiceSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Missing SUPABASE_SERVICE_ROLE_KEY" }, { status: 500 });
  const body = await request.json();
  const rows = Object.entries(body).map(([key, value]) => ({ key, value: String(value ?? ""), updated_at: new Date().toISOString() }));
  const { data, error } = await supabase.from("site_settings").upsert(rows, { onConflict: "key" }).select("*");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ settings: data ?? [] });
}
