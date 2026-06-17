import fs from "fs";
import path from "path";
import { parseFrontmatter, markdownToHtml } from "@/lib/content";
import readingTime from "reading-time";
import type { BlogPost } from "@/types";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));

  const posts = files.map((file) => {
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
    const { data, content } = parseFrontmatter(raw);
    const slug = file.replace(/\.mdx?$/, "");
    const rt = readingTime(content);
    return {
      ...data,
      slug,
      content: markdownToHtml(content),
      readingTime: rt.text,
    } as BlogPost;
  });

  return posts
    .filter((p) => p.published !== false)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | null {
  const mdPath = path.join(BLOG_DIR, `${slug}.md`);
  const mdxPath = path.join(BLOG_DIR, `${slug}.mdx`);
  const target = fs.existsSync(mdxPath) ? mdxPath : mdPath;

  if (!fs.existsSync(target)) return null;

  const raw = fs.readFileSync(target, "utf-8");
  const { data, content } = parseFrontmatter(raw);
  const rt = readingTime(content);
  return { ...data, slug, content: markdownToHtml(content), readingTime: rt.text } as BlogPost;
}

export function getPostsByTag(tag: string): BlogPost[] {
  return getAllPosts().filter((p) => p.tags?.includes(tag));
}
