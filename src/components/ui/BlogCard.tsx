import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/types";
import { formatDate } from "@/lib/utils";
import { Clock } from "lucide-react";

interface Props {
  post: BlogPost;
  featured?: boolean;
}

export default function BlogCard({ post, featured = false }: Props) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="card-hover bg-ivory overflow-hidden h-full flex flex-col">
        <div className={`relative overflow-hidden bg-mist ${featured ? "aspect-video" : "aspect-[16/9]"}`}>
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-mist to-stone/20">
              <span className="font-display text-5xl text-faint">✦</span>
            </div>
          )}
        </div>
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-3 mb-3">
            <p className="section-label">{formatDate(post.date)}</p>
            <span className="text-faint text-xs">·</span>
            <span className="flex items-center gap-1 text-xs text-muted">
              <Clock size={11} />
              {post.readingTime}
            </span>
          </div>
          <h3 className={`font-display text-ink leading-snug mb-2 group-hover:text-gold transition-colors duration-200 ${featured ? "text-2xl" : "text-xl"}`}>
            {post.title}
          </h3>
          <p className="text-sm text-muted line-clamp-3 flex-1">{post.excerpt}</p>
          <div className="mt-4 flex gap-2 flex-wrap">
            {post.tags?.slice(0, 3).map((tag) => (
              <span key={tag} className="text-[10px] tracking-widest uppercase text-faint border border-stone/20 px-2 py-0.5">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </article>
    </Link>
  );
}
