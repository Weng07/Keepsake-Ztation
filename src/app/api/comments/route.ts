import { NextResponse } from "next/server";
import { createPublicSupabaseClient, createServiceSupabaseClient } from "@/lib/supabase";

export async function GET(request: Request) {
  const supabase = createPublicSupabaseClient();
  if (!supabase) return NextResponse.json({ comments: [] });
  const { searchParams } = new URL(request.url);
  const target_type = searchParams.get("target_type");
  const target_slug = searchParams.get("target_slug");
  if (!target_type || !target_slug) return NextResponse.json({ comments: [] });
  const { data, error } = await supabase
    .from("comments")
    .select("id,target_type,target_slug,author_name,body,status,created_at")
    .eq("target_type", target_type)
    .eq("target_slug", target_slug)
    .eq("status", "approved")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ comments: [] });
  return NextResponse.json({ comments: data ?? [] });
}

export async function POST(request: Request) {
  const supabase = createServiceSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
  const body = await request.json();
  const payload = {
    target_type: body.target_type,
    target_slug: body.target_slug,
    author_name: body.author_name,
    author_email: body.author_email || null,
    body: body.body,
    status: "pending",
  };
  if (!payload.target_type || !payload.target_slug || !payload.author_name || !payload.body) {
    return NextResponse.json({ error: "Please complete the comment form" }, { status: 400 });
  }
  const { error } = await supabase.from("comments").insert(payload);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
