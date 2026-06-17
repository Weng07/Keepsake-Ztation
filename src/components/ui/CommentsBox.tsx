"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Comment = {
  id: string;
  author_name: string;
  body: string;
  created_at: string;
};

export default function CommentsBox({ targetType, targetSlug }: { targetType: "product" | "blog"; targetSlug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/comments?target_type=${targetType}&target_slug=${targetSlug}`)
      .then((res) => res.json())
      .then((json) => setComments(json.comments ?? []))
      .catch(() => null);
  }, [targetType, targetSlug]);

  async function submit() {
    try {
      setSaving(true);
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target_type: targetType, target_slug: targetSlug, author_name: name, author_email: email, body }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Could not send comment");
      setName("");
      setEmail("");
      setBody("");
      toast.success("Comment sent for review");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not send comment");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="mt-16 border-t border-stone/10 pt-10">
      <p className="section-label mb-3">Comments</p>
      <h2 className="font-display text-3xl text-ink mb-6">Visitor Notes</h2>
      <div className="space-y-3 mb-8">
        {comments.length ? comments.map((comment) => (
          <div key={comment.id} className="bg-ivory border border-stone/10 p-5">
            <p className="font-semibold text-ink">{comment.author_name}</p>
            <p className="text-sm text-muted mt-2">{comment.body}</p>
          </div>
        )) : <p className="text-sm text-muted">No approved comments yet.</p>}
      </div>
      <div className="bg-ivory border border-stone/10 p-5 space-y-3">
        <input className="w-full border border-stone/15 bg-parchment/80 px-4 py-3 text-sm outline-none focus:border-gold" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="w-full border border-stone/15 bg-parchment/80 px-4 py-3 text-sm outline-none focus:border-gold" placeholder="Email, optional" value={email} onChange={(e) => setEmail(e.target.value)} />
        <textarea className="w-full border border-stone/15 bg-parchment/80 px-4 py-3 text-sm outline-none focus:border-gold" placeholder="Write a comment" rows={4} value={body} onChange={(e) => setBody(e.target.value)} />
        <button disabled={saving} onClick={submit} className="btn-primary">Send Comment</button>
      </div>
    </section>
  );
}
