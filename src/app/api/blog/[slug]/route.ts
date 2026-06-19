import { NextRequest, NextResponse } from "next/server";
import { writeFile, unlink } from "fs/promises";
import { existsSync, readFileSync } from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

function buildMarkdown(data: Record<string, unknown>): string {
  const today = new Date().toISOString().split("T")[0];
  const tags = Array.isArray(data.tags)
    ? data.tags
    : String(data.tags || "")
        .split(",")
        .map((t: string) => t.trim())
        .filter(Boolean);

  return [
    `---`,
    `title: ${JSON.stringify(data.title)}`,
    `excerpt: ${JSON.stringify(data.excerpt || "")}`,
    `date: ${JSON.stringify(data.date || today)}`,
    `author: ${JSON.stringify(data.author || "")}`,
    `tags: [${tags.map((t: string) => JSON.stringify(t)).join(", ")}]`,
    `coverImage: ${JSON.stringify(data.coverImage || "")}`,
    `published: ${data.published === true || data.published === "true" ? "true" : "false"}`,
    `---`,
    "",
    data.content ? String(data.content) : "",
  ].join("\n");
}

interface RouteContext {
  params: Promise<{ slug: string }>;
}

// GET single post (used to pre-fill the edit form, including drafts)
export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { slug } = await params;
  const mdPath = path.join(BLOG_DIR, `${slug}.md`);
  const mdxPath = path.join(BLOG_DIR, `${slug}.mdx`);
  const target = existsSync(mdxPath) ? mdxPath : mdPath;

  if (!existsSync(target)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const raw = readFileSync(target, "utf-8");
  const { data, content } = matter(raw);
  return NextResponse.json({ ...data, slug, content });
}

// PUT: Update an existing post
export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    const { slug } = await params;
    const body = await req.json();
    const filePath = path.join(BLOG_DIR, `${slug}.md`);

    // Preserve original publish date unless explicitly changed
    let date = body.date;
    if (!date && existsSync(filePath)) {
      const raw = readFileSync(filePath, "utf-8");
      const { data } = matter(raw);
      date = data.date;
    }

    await writeFile(filePath, buildMarkdown({ ...body, date }));
    return NextResponse.json({ success: true, slug });
  } catch (err) {
    console.error("Update blog post error:", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

// DELETE: Remove a post
export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    const { slug } = await params;
    const mdPath = path.join(BLOG_DIR, `${slug}.md`);
    const mdxPath = path.join(BLOG_DIR, `${slug}.mdx`);
    const target = existsSync(mdxPath) ? mdxPath : mdPath;

    if (!existsSync(target)) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await unlink(target);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete blog post error:", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
