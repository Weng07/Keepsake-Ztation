import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Product } from "@/types";

// Each product lives as a single Markdown file inside content/products/.
// The file's frontmatter (the --- block at the top) holds every field shown
// on the site, including the image. To change a product's photo, either:
//   1. Open the .md file in content/products/ and edit the `coverImage`
//      (and `images`) fields to point at a different file under public/, or
//   2. Use the admin panel at /admin/products to upload a new photo and
//      save — this rewrites the same fields automatically.
//
// Sample images for this starter project live in public/images/products/
// (e.g. "/images/products/keychain.svg"). Replace them with your own photos
// by adding a file to that folder and updating coverImage/images to match,
// for example: coverImage: "/images/products/keychain.jpg"
const PRODUCTS_DIR = path.join(process.cwd(), "content/products");

export function getAllProducts(): Product[] {
  if (!fs.existsSync(PRODUCTS_DIR)) return [];

  const files = fs
    .readdirSync(PRODUCTS_DIR)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));

  const products = files.map((file) => {
    const raw = fs.readFileSync(path.join(PRODUCTS_DIR, file), "utf-8");
    const { data } = matter(raw);
    const slug = file.replace(/\.mdx?$/, "");
    return { ...data, slug } as Product;
  });

  return products
    .filter((p) => p.available !== false)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// Products shown in the homepage "Selected Works" section. This reads the
// `featured: true` flag set on each product — toggle it per-product in the
// content file, or visually via /admin/showcase.
export function getFeaturedProducts(): Product[] {
  return getAllProducts().filter((p) => p.featured);
}

export function getProductBySlug(slug: string): Product | null {
  const filePath = path.join(PRODUCTS_DIR, `${slug}.md`);
  const mdxPath = path.join(PRODUCTS_DIR, `${slug}.mdx`);
  const target = fs.existsSync(mdxPath) ? mdxPath : filePath;

  if (!fs.existsSync(target)) return null;

  const raw = fs.readFileSync(target, "utf-8");
  const { data, content } = matter(raw);
  return { ...data, slug, longDescription: content } as Product;
}

export function getProductsByCategory(category: string): Product[] {
  return getAllProducts().filter((p) => p.category === category);
}

export function getCategories(): string[] {
  const products = getAllProducts();
  return [...new Set(products.map((p) => p.category))];
}
