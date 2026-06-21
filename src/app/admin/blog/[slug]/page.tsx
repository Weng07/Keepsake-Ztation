import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import BlogForm from "@/components/ui/BlogForm";
import { getPostBySlug } from "@/lib/blog";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  return { title: post ? `Edit — ${post.title}` : "Edit Post" };
}

export default async function EditBlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  return (
    <div className="pt-24 min-h-screen bg-parchment">
      <div className="max-w-4xl mx-auto px-6 lg:px-10 py-16">
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-muted hover:text-gold transition-colors mb-8"
        >
          <ArrowLeft size={14} /> Back to Posts
        </Link>

        <p className="section-label mb-3">Edit Entry</p>
        <h1 className="font-display text-4xl text-ink mb-10">{post.title}</h1>

        <BlogForm mode="edit" slug={slug} initial={post} />
      </div>
    </div>
  );
}
