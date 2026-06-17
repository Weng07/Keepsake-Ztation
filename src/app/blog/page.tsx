import type { Metadata } from "next";
import BlogCard from "@/components/ui/BlogCard";
import { getAllPosts } from "@/lib/blog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Journal",
  description: "Stories, process notes, and inspiration from the studio.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="pt-24 min-h-screen bg-parchment">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="mb-12">
          <p className="section-label mb-3">Journal</p>
          <h1 className="font-display text-5xl lg:text-6xl text-ink">From the Studio</h1>
          <p className="text-muted mt-3">Process, inspiration, and behind-the-scenes stories.</p>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <BlogCard key={post.slug} post={post} featured={i === 0} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-ivory">
            <p className="font-display text-3xl text-ink mb-3">First entry coming soon</p>
            <p className="text-muted text-sm">The journal is warming up. Check back soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
