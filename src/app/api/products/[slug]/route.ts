import { NextRequest, NextResponse } from "next/server";
import { writeFile, unlink } from "fs/promises";
import { existsSync, readFileSync } from "fs";
import path from "path";
import matter from "gray-matter";

const PRODUCTS_DIR = path.join(process.cwd(), "content", "products");

function buildMarkdown(data: Record<string, unknown>, slug: string): string {
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
    `description: ${JSON.stringify(data.description)}`,
    `price: ${JSON.stringify(data.price || "")}`,
    `category: ${JSON.stringify(data.category || "other")}`,
    `tags: [${tags.map((t: string) => JSON.stringify(t)).join(", ")}]`,
    `coverImage: ${JSON.stringify(data.coverImage || "")}`,
    `images: [${(Array.isArray(data.images) ? data.images : [data.coverImage]).filter(Boolean).map((i: string) => JSON.stringify(i)).join(", ")}]`,
    `featured: ${data.featured === true || data.featured === "true" ? "true" : "false"}`,
    `available: ${data.available === false ? "false" : "true"}`,
    `downloadable: ${data.downloadable === true || data.downloadable === "true" ? "true" : "false"}`,
    `externalLink: ${JSON.stringify(data.externalLink || "")}`,
    `createdAt: ${JSON.stringify(data.createdAt || today)}`,
    `updatedAt: ${JSON.stringify(today)}`,
    `---`,
    "",
    data.longDescription ? String(data.longDescription) : "",
  ].join("\n");
}

interface RouteContext {
  params: Promise<{ slug: string }>;
}

// GET single product
export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { slug } = await params;
  const filePath = path.join(PRODUCTS_DIR, `${slug}.md`);
  const mdxPath = path.join(PRODUCTS_DIR, `${slug}.mdx`);
  const target = existsSync(mdxPath) ? mdxPath : filePath;

  if (!existsSync(target)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const raw = readFileSync(target, "utf-8");
  const { data, content } = matter(raw);
  return NextResponse.json({ ...data, slug, longDescription: content });
}

// PUT: Update existing product
export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    const { slug } = await params;
    const body = await req.json();
    const filePath = path.join(PRODUCTS_DIR, `${slug}.md`);

    // Read existing to preserve createdAt
    let createdAt = new Date().toISOString().split("T")[0];
    if (existsSync(filePath)) {
      const raw = readFileSync(filePath, "utf-8");
      const { data } = matter(raw);
      createdAt = data.createdAt || createdAt;
    }

    await writeFile(filePath, buildMarkdown({ ...body, createdAt }, slug));
    return NextResponse.json({ success: true, slug });
  } catch (err) {
    console.error("Update product error:", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

// DELETE: Remove product
export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    const { slug } = await params;
    const mdPath = path.join(PRODUCTS_DIR, `${slug}.md`);
    const mdxPath = path.join(PRODUCTS_DIR, `${slug}.mdx`);
    const target = existsSync(mdxPath) ? mdxPath : mdPath;

    if (!existsSync(target)) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await unlink(target);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete product error:", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
