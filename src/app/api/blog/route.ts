import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { existsSync, readdirSync, readFileSync } from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildMarkdown(data: Record<string, unknown>): string {
  const today = new Date().toISOString().split("T")[0];
  const tags = Array.isArray(data.tags)
    ? data.tags
    : String(data.tags || "")
        .split(",")
        .map((t: string) => t.trim())
        .filter(Boolean);

  const fm = [
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

  return fm;
}

// POST: Create a new blog post
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    if (!existsSync(BLOG_DIR)) {
      const { mkdirSync } = await import("fs");
      mkdirSync(BLOG_DIR, { recursive: true });
    }

    const slug = toSlug(body.title);
    const filePath = path.join(BLOG_DIR, `${slug}.md`);

    // Avoid overwriting an existing post with the same slug
    const finalSlug = existsSync(filePath) ? `${slug}-${Date.now()}` : slug;
    const finalPath = path.join(BLOG_DIR, `${finalSlug}.md`);

    await writeFile(finalPath, buildMarkdown(body));

    return NextResponse.json({ slug: finalSlug, success: true });
  } catch (err) {
    console.error("Create blog post error:", err);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}

// GET: List all posts as JSON, including unpublished drafts (for admin UI)
export async function GET() {
  try {
    if (!existsSync(BLOG_DIR)) {
      return NextResponse.json({ posts: [] });
    }

    const files = readdirSync(BLOG_DIR).filter(
      (f) => f.endsWith(".md") || f.endsWith(".mdx")
    );

    const posts = files.map((file) => {
      const raw = readFileSync(path.join(BLOG_DIR, file), "utf-8");
      const { data, content } = matter(raw);
      return { ...data, slug: file.replace(/\.mdx?$/, ""), content };
    });

    posts.sort((a: Record<string, unknown>, b: Record<string, unknown>) =>
      new Date(String(b.date || 0)).getTime() - new Date(String(a.date || 0)).getTime()
    );

    return NextResponse.json({ posts });
  } catch (err) {
    console.error("List blog posts error:", err);
    return NextResponse.json({ error: "Failed to list posts" }, { status: 500 });
  }
}
