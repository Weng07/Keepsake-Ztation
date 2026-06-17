import { NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/lib/supabase";

export async function GET() {
  const supabase = createServiceSupabaseClient();
  if (!supabase) return NextResponse.json({ analytics: [] });
  const { data, error } = await supabase.from("analytics").select("*").order("count", { ascending: false });
  if (error) return NextResponse.json({ analytics: [] });
  return NextResponse.json({ analytics: data ?? [] });
}

export async function POST(request: Request) {
  const supabase = createServiceSupabaseClient();
  if (!supabase) return NextResponse.json({ ok: false });
  const body = await request.json();
  const target_type = body.target_type;
  const target_slug = body.target_slug;
  const event_type = body.event_type || "view";
  if (!target_type || !target_slug) return NextResponse.json({ error: "Missing analytics target" }, { status: 400 });

  const { error } = await supabase.rpc("increment_analytics", { p_target_type: target_type, p_target_slug: target_slug, p_event_type: event_type });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
