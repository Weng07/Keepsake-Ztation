import type { Metadata } from "next";
import AdminConsole from "@/components/ui/AdminConsole";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Private content management dashboard for Keepsake Ztation.",
};

export default function AdminPage() {
  return (
    <div className="pt-24 min-h-screen bg-parchment">
      <section className="border-b border-stone/10 bg-[radial-gradient(circle_at_top_right,rgba(201,168,76,0.18),transparent_34%),linear-gradient(135deg,#faf8f4,#f5f3ef)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14">
          <p className="section-label mb-3">Keepsake Ztation Admin</p>
          <h1 className="font-display text-5xl lg:text-7xl text-ink mb-4">Live Content Studio</h1>
          <p className="text-muted max-w-2xl leading-relaxed">A private, Supabase-powered dashboard for products, blogs, comments, analytics, images, and Messenger ordering.</p>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
        <AdminConsole />
      </div>
    </div>
  );
}
