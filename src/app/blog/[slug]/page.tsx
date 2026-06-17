import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { getPostBySlug, getAllPosts } from "@/lib/blog";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="pt-24 min-h-screen bg-parchment">
      <div className="max-w-3xl mx-auto px-6 lg:px-10 py-16">
        <Link href="/blog" className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-muted hover:text-gold transition-colors mb-12">
          <ArrowLeft size={14} /> Back to Journal
        </Link>

        {/* Header */}
        <header className="mb-10">
          <p className="section-label mb-4">{post.tags?.[0] ?? "Journal"}</p>
          <h1 className="font-display text-4xl lg:text-5xl text-ink leading-snug mb-6">
            {post.title}
          </h1>
          <div className="flex items-center gap-5 text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <Calendar size={12} />
              {formatDate(post.date)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={12} />
              {post.readingTime}
            </span>
            {post.author && <span>by {post.author}</span>}
          </div>
        </header>

        {post.coverImage && (
          <div className="relative aspect-video mb-12 overflow-hidden bg-mist">
            <Image src={post.coverImage} alt={post.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 768px" />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg prose-stone max-w-none prose-headings:font-display prose-headings:font-normal prose-a:text-gold prose-a:no-underline hover:prose-a:underline">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="mt-12 pt-8 border-t border-stone/10 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="text-[10px] tracking-widest uppercase text-faint border border-stone/20 px-3 py-1">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
