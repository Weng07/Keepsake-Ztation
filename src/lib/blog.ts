import fs from "fs";
import path from "path";
import readingTime from "reading-time";
import { parseFrontmatter, markdownToHtml } from "@/lib/content";
import { createPublicSupabaseClient } from "@/lib/supabase";
import { mapBlogRow, type BlogRow } from "@/lib/admin-schema";
import type { BlogPost } from "@/types";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

function getMarkdownPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));

  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
      const { data, content } = parseFrontmatter(raw);
      const slug = file.replace(/\.mdx?$/, "");
      const rt = readingTime(content);
      return { ...data, slug, content: markdownToHtml(content), readingTime: rt.text } as BlogPost;
    })
    .filter((p) => p.published !== false)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function getMarkdownPostBySlug(slug: string): BlogPost | null {
  const mdPath = path.join(BLOG_DIR, `${slug}.md`);
  const mdxPath = path.join(BLOG_DIR, `${slug}.mdx`);
  const target = fs.existsSync(mdxPath) ? mdxPath : mdPath;
  if (!fs.existsSync(target)) return null;

  const raw = fs.readFileSync(target, "utf-8");
  const { data, content } = parseFrontmatter(raw);
  const rt = readingTime(content);
  return { ...data, slug, content: markdownToHtml(content), readingTime: rt.text } as BlogPost;
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const supabase = createPublicSupabaseClient();
  if (!supabase) return getMarkdownPosts();

  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("published", true)
    .order("date", { ascending: false });

  if (error || !data) return getMarkdownPosts();
  return (data as BlogRow[]).map(mapBlogRow);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = createPublicSupabaseClient();
  if (!supabase) return getMarkdownPostBySlug(slug);

  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error || !data) return getMarkdownPostBySlug(slug);
  return mapBlogRow(data as BlogRow);
}

export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  return (await getAllPosts()).filter((p) => p.tags?.includes(tag));
}
