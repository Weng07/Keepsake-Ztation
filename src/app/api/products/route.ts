import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const PRODUCTS_DIR = path.join(process.cwd(), "content", "products");

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
    `description: ${JSON.stringify(data.description)}`,
    `price: ${JSON.stringify(data.price || "")}`,
    `category: ${JSON.stringify(data.category || "other")}`,
    `tags: [${tags.map((t: string) => JSON.stringify(t)).join(", ")}]`,
    `coverImage: ${JSON.stringify(data.coverImage || "")}`,
    `images: [${(Array.isArray(data.images) ? data.images : [data.coverImage]).filter(Boolean).map((i: string) => JSON.stringify(i)).join(", ")}]`,
    `featured: ${data.featured === true || data.featured === "true" ? "true" : "false"}`,
    `available: true`,
    `downloadable: ${data.downloadable === true || data.downloadable === "true" ? "true" : "false"}`,
    `externalLink: ${JSON.stringify(data.externalLink || "")}`,
    `createdAt: ${JSON.stringify(data.createdAt || today)}`,
    `updatedAt: ${JSON.stringify(today)}`,
    `---`,
    "",
    data.longDescription ? String(data.longDescription) : "",
  ].join("\n");

  return fm;
}

// POST: Create a new product
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const slug = toSlug(body.title);
    const filePath = path.join(PRODUCTS_DIR, `${slug}.md`);

    // Avoid overwriting — append timestamp if slug exists
    const finalSlug = existsSync(filePath) ? `${slug}-${Date.now()}` : slug;
    const finalPath = path.join(PRODUCTS_DIR, `${finalSlug}.md`);

    await writeFile(finalPath, buildMarkdown({ ...body, slug: finalSlug }));

    return NextResponse.json({ slug: finalSlug, success: true });
  } catch (err) {
    console.error("Create product error:", err);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

// GET: List all products as JSON (for admin UI)
export async function GET() {
  try {
    const { readdirSync, readFileSync } = await import("fs");
    const matter = (await import("gray-matter")).default;

    if (!existsSync(PRODUCTS_DIR)) {
      return NextResponse.json({ products: [] });
    }

    const files = readdirSync(PRODUCTS_DIR).filter((f) =>
      f.endsWith(".md") || f.endsWith(".mdx")
    );

    const products = files.map((file) => {
      const raw = readFileSync(path.join(PRODUCTS_DIR, file), "utf-8");
      const { data, content } = matter(raw);
      return { ...data, slug: file.replace(/\.mdx?$/, ""), longDescription: content };
    });

    products.sort((a: Record<string, unknown>, b: Record<string, unknown>) =>
      new Date(String(b.createdAt || 0)).getTime() - new Date(String(a.createdAt || 0)).getTime()
    );

    return NextResponse.json({ products });
  } catch (err) {
    console.error("List products error:", err);
    return NextResponse.json({ error: "Failed to list products" }, { status: 500 });
  }
}
