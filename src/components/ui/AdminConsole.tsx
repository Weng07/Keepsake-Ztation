"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  Eye,
  ImagePlus,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  Package,
  PenLine,
  PlusCircle,
  Save,
  Settings,
  Trash2,
  X,
} from "lucide-react";
import { createBrowserSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import type { AnalyticsRow, BlogRow, CommentRow, ProductRow, SiteSettingRow } from "@/lib/admin-schema";

const inputClass = "w-full border border-stone/15 bg-parchment/80 px-4 py-3 text-sm text-ink outline-none transition focus:border-gold";
const labelClass = "text-[10px] font-semibold uppercase tracking-[0.22em] text-muted";

type Section =
  | "dashboard"
  | "addProduct"
  | "manageProducts"
  | "addBlog"
  | "manageBlogs"
  | "productComments"
  | "blogComments"
  | "analytics"
  | "settings";

type ProductForm = {
  id?: string;
  title: string;
  slug: string;
  description: string;
  long_description: string;
  price: string;
  category: string;
  tags: string;
  cover_image: string;
  featured: boolean;
  available: boolean;
  messenger_message: string;
};

type BlogForm = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  author: string;
  tags: string;
  published: boolean;
  date: string;
};

const emptyProduct: ProductForm = {
  title: "",
  slug: "",
  description: "",
  long_description: "",
  price: "",
  category: "souvenir",
  tags: "souvenir, gift",
  cover_image: "",
  featured: false,
  available: true,
  messenger_message: "Hi, I want to order this product.",
};

const emptyBlog: BlogForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover_image: "",
  author: "Keepsake Ztation Studio",
  tags: "souvenir, studio",
  published: true,
  date: new Date().toISOString().slice(0, 10),
};

const menuItems: { id: Section; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "addProduct", label: "Add Product", icon: PlusCircle },
  { id: "manageProducts", label: "Manage Products", icon: Package },
  { id: "addBlog", label: "Add Blog", icon: PenLine },
  { id: "manageBlogs", label: "Manage Blogs", icon: BookOpen },
  { id: "productComments", label: "Product Comments", icon: MessageCircle },
  { id: "blogComments", label: "Blog Comments", icon: MessageCircle },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

function slugFrom(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function getToken() {
  const supabase = createBrowserSupabaseClient();
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token;
}

async function adminFetch(path: string, init: RequestInit = {}) {
  const token = await getToken();
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const res = await fetch(path, { ...init, headers });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || "Admin request failed");
  return json;
}

export default function AdminConsole() {
  const [section, setSection] = useState<Section>("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [blogs, setBlogs] = useState<BlogRow[]>([]);
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsRow[]>([]);
  const [settingsRows, setSettingsRows] = useState<SiteSettingRow[]>([]);
  const [productForm, setProductForm] = useState<ProductForm>(emptyProduct);
  const [blogForm, setBlogForm] = useState<BlogForm>(emptyBlog);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    const supabase = createBrowserSupabaseClient();
    supabase.auth.getSession().then(({ data }) => {
      setSignedIn(Boolean(data.session));
      setLoading(false);
      if (data.session) void refreshAll();
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(Boolean(session));
      if (session) void refreshAll();
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function signIn() {
    try {
      setSaving(true);
      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Admin unlocked");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
    } finally {
      setSaving(false);
    }
  }

  async function signOut() {
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    setSignedIn(false);
  }

  async function refreshAll() {
    try {
      const [productData, blogData, productComments, blogComments, analyticsData, settingsData] = await Promise.all([
        adminFetch("/api/admin/products"),
        adminFetch("/api/admin/blogs"),
        adminFetch("/api/admin/comments?target_type=product"),
        adminFetch("/api/admin/comments?target_type=blog"),
        fetch("/api/analytics").then((r) => r.json()),
        adminFetch("/api/admin/settings"),
      ]);
      setProducts(productData.products ?? []);
      setBlogs(blogData.blogs ?? []);
      setComments([...(productComments.comments ?? []), ...(blogComments.comments ?? [])]);
      setAnalytics(analyticsData.analytics ?? []);
      setSettingsRows(settingsData.settings ?? []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not load dashboard data");
    }
  }

  async function uploadImage(file: File, bucket: "product-images" | "blog-images", folder: string) {
    const token = await getToken();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("bucket", bucket);
    formData.append("folder", folder);
    const res = await fetch("/api/upload", {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: formData,
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Upload failed");
    return json.url as string;
  }

  async function onProductImage(file: File | undefined) {
    if (!file) return;
    try {
      toast.loading("Uploading product image", { id: "upload" });
      const url = await uploadImage(file, "product-images", "products");
      setProductForm((current) => ({ ...current, cover_image: url }));
      toast.success("Product image uploaded", { id: "upload" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed", { id: "upload" });
    }
  }

  async function onBlogImage(file: File | undefined) {
    if (!file) return;
    try {
      toast.loading("Uploading blog image", { id: "upload" });
      const url = await uploadImage(file, "blog-images", "blogs");
      setBlogForm((current) => ({ ...current, cover_image: url }));
      toast.success("Blog image uploaded", { id: "upload" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed", { id: "upload" });
    }
  }

  async function saveProduct() {
    try {
      setSaving(true);
      const payload = {
        id: productForm.id,
        title: productForm.title,
        slug: productForm.slug || slugFrom(productForm.title),
        description: productForm.description,
        long_description: productForm.long_description,
        price: productForm.price,
        category: productForm.category,
        tags: productForm.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        images: productForm.cover_image ? [productForm.cover_image] : [],
        cover_image: productForm.cover_image,
        featured: productForm.featured,
        available: productForm.available,
        messenger_message: productForm.messenger_message,
      };
      await adminFetch("/api/admin/products", { method: "POST", body: JSON.stringify(payload) });
      toast.success("Product saved");
      setProductForm(emptyProduct);
      setSection("manageProducts");
      await refreshAll();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save product");
    } finally {
      setSaving(false);
    }
  }

  async function saveBlog() {
    try {
      setSaving(true);
      const payload = {
        id: blogForm.id,
        title: blogForm.title,
        slug: blogForm.slug || slugFrom(blogForm.title),
        excerpt: blogForm.excerpt,
        content: blogForm.content,
        cover_image: blogForm.cover_image,
        author: blogForm.author,
        tags: blogForm.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        published: blogForm.published,
        date: blogForm.date,
      };
      await adminFetch("/api/admin/blogs", { method: "POST", body: JSON.stringify(payload) });
      toast.success("Blog saved");
      setBlogForm(emptyBlog);
      setSection("manageBlogs");
      await refreshAll();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save blog");
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct(id: string) {
    if (!confirm("Delete this product?")) return;
    await adminFetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
    toast.success("Product deleted");
    await refreshAll();
  }

  async function deleteBlog(id: string) {
    if (!confirm("Delete this blog?")) return;
    await adminFetch(`/api/admin/blogs?id=${id}`, { method: "DELETE" });
    toast.success("Blog deleted");
    await refreshAll();
  }

  async function updateComment(id: string, status: "approved" | "hidden" | "pending") {
    await adminFetch("/api/admin/comments", { method: "POST", body: JSON.stringify({ id, status }) });
    toast.success("Comment updated");
    await refreshAll();
  }

  async function deleteComment(id: string) {
    await adminFetch(`/api/admin/comments?id=${id}`, { method: "DELETE" });
    toast.success("Comment deleted");
    await refreshAll();
  }

  async function saveSettings(formData: FormData) {
    const payload = Object.fromEntries(formData.entries());
    await adminFetch("/api/admin/settings", { method: "POST", body: JSON.stringify(payload) });
    toast.success("Settings saved");
    await refreshAll();
  }

  const stats = useMemo(() => {
    const productViews = analytics.filter((a) => a.target_type === "product" && a.event_type === "view").reduce((sum, a) => sum + a.count, 0);
    const blogViews = analytics.filter((a) => a.target_type === "blog" && a.event_type === "view").reduce((sum, a) => sum + a.count, 0);
    const messengerClicks = analytics.filter((a) => a.event_type === "messenger_click").reduce((sum, a) => sum + a.count, 0);
    return { productViews, blogViews, messengerClicks };
  }, [analytics]);

  if (loading) return <div className="bg-ivory border border-stone/10 p-8 text-sm text-muted">Loading admin studio...</div>;

  if (!isSupabaseConfigured) {
    return (
      <div className="bg-ivory border border-gold/30 p-8">
        <p className="section-label mb-3">Supabase needed</p>
        <h2 className="font-display text-4xl text-ink mb-3">Connect Supabase to unlock the live dashboard.</h2>
        <p className="text-muted text-sm leading-relaxed">Add NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY to .env.local or Vercel environment variables, then restart the site.</p>
      </div>
    );
  }

  if (!signedIn) {
    return (
      <div className="max-w-xl mx-auto bg-ink text-mist border border-gold/20 p-8 shadow-2xl">
        <p className="section-label text-gold mb-3">Private Admin</p>
        <h2 className="font-display text-4xl mb-4">Unlock the studio desk.</h2>
        <p className="text-sm text-mist/60 mb-6">Use the admin email and password created in Supabase Auth.</p>
        <div className="space-y-4">
          <input className="w-full border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-gold" placeholder="Admin email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="w-full border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-gold" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={signIn} disabled={saving} className="btn-primary w-full justify-center">Sign in</button>
        </div>
      </div>
    );
  }

  const sidebar = (
    <aside className="bg-ink text-mist border border-white/10 lg:min-h-[760px]">
      <div className="flex items-center justify-between p-5 border-b border-white/10">
        <div>
          <p className="section-label text-gold">Admin Menu</p>
          <p className="font-display text-2xl">Control Room</p>
        </div>
        <button className="lg:hidden" onClick={() => setMenuOpen(false)} aria-label="Close admin menu"><X size={18} /></button>
      </div>
      <nav className="p-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => { setSection(item.id); setMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left text-xs tracking-widest uppercase transition ${section === item.id ? "bg-gold text-ink" : "text-mist/65 hover:bg-white/5 hover:text-gold"}`}
            >
              <Icon size={16} /> {item.label}
            </button>
          );
        })}
      </nav>
      <div className="p-3 border-t border-white/10">
        <button onClick={signOut} className="w-full flex items-center gap-3 px-4 py-3 text-xs tracking-widest uppercase text-mist/60 hover:text-gold">
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
      <div className="lg:hidden flex items-center justify-between bg-ink text-mist p-4">
        <p className="font-display text-2xl">Admin Menu</p>
        <button onClick={() => setMenuOpen(true)} aria-label="Open admin menu"><Menu /></button>
      </div>
      {menuOpen && <div className="fixed inset-0 z-[80] bg-black/40 lg:hidden" onClick={() => setMenuOpen(false)}><div className="w-[86vw] max-w-sm h-full" onClick={(e) => e.stopPropagation()}>{sidebar}</div></div>}
      <div className="hidden lg:block">{sidebar}</div>
      <main className="space-y-6">
        {section === "dashboard" && <DashboardView products={products} blogs={blogs} comments={comments} stats={stats} setSection={setSection} />}
        {section === "addProduct" && <ProductEditor form={productForm} setForm={setProductForm} save={saveProduct} upload={onProductImage} saving={saving} />}
        {section === "manageProducts" && <ProductsManager products={products} edit={(row) => { setProductForm(rowToProductForm(row)); setSection("addProduct"); }} remove={deleteProduct} />}
        {section === "addBlog" && <BlogEditor form={blogForm} setForm={setBlogForm} save={saveBlog} upload={onBlogImage} saving={saving} />}
        {section === "manageBlogs" && <BlogsManager blogs={blogs} edit={(row) => { setBlogForm(rowToBlogForm(row)); setSection("addBlog"); }} remove={deleteBlog} />}
        {section === "productComments" && <CommentsManager title="Product Comments" comments={comments.filter((c) => c.target_type === "product")} update={updateComment} remove={deleteComment} />}
        {section === "blogComments" && <CommentsManager title="Blog Comments" comments={comments.filter((c) => c.target_type === "blog")} update={updateComment} remove={deleteComment} />}
        {section === "analytics" && <AnalyticsView analytics={analytics} />}
        {section === "settings" && <SettingsView rows={settingsRows} save={saveSettings} />}
      </main>
    </div>
  );
}

function rowToProductForm(row: ProductRow): ProductForm {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    long_description: row.long_description ?? "",
    price: row.price ?? "",
    category: row.category ?? "souvenir",
    tags: (row.tags ?? []).join(", "),
    cover_image: row.cover_image ?? "",
    featured: Boolean(row.featured),
    available: row.available !== false,
    messenger_message: row.messenger_message ?? "Hi, I want to order this product.",
  };
}

function rowToBlogForm(row: BlogRow): BlogForm {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content ?? "",
    cover_image: row.cover_image ?? "",
    author: row.author ?? "Keepsake Ztation Studio",
    tags: (row.tags ?? []).join(", "),
    published: row.published !== false,
    date: (row.date ?? new Date().toISOString()).slice(0, 10),
  };
}

function DashboardView({ products, blogs, comments, stats, setSection }: { products: ProductRow[]; blogs: BlogRow[]; comments: CommentRow[]; stats: { productViews: number; blogViews: number; messengerClicks: number }; setSection: (s: Section) => void }) {
  return (
    <div className="space-y-6">
      <Panel>
        <p className="section-label mb-3">Dashboard</p>
        <h2 className="font-display text-5xl text-ink mb-3">A polished little cockpit for the whole showcase.</h2>
        <p className="text-muted text-sm">Add products, publish blogs, moderate comments, and watch what visitors click without opening the source code.</p>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mt-8">
          <Stat label="Products" value={products.length} />
          <Stat label="Blogs" value={blogs.length} />
          <Stat label="Comments" value={comments.length} />
          <Stat label="Product views" value={stats.productViews} />
          <Stat label="Messenger clicks" value={stats.messengerClicks} />
        </div>
      </Panel>
      <div className="grid md:grid-cols-2 gap-6">
        <button onClick={() => setSection("addProduct")} className="bg-ink text-mist p-8 text-left group">
          <PlusCircle className="text-gold mb-5" />
          <h3 className="font-display text-3xl mb-2">Add a Product</h3>
          <p className="text-sm text-mist/60">Upload a photo, set the price, and publish it to the collection.</p>
        </button>
        <button onClick={() => setSection("addBlog")} className="bg-gold/15 border border-gold/30 p-8 text-left group">
          <PenLine className="text-gold mb-5" />
          <h3 className="font-display text-3xl mb-2">Write a Blog</h3>
          <p className="text-sm text-muted">Create a studio journal entry with a cover image and publish switch.</p>
        </button>
      </div>
    </div>
  );
}

function ProductEditor({ form, setForm, save, upload, saving }: { form: ProductForm; setForm: (f: ProductForm) => void; save: () => void; upload: (file?: File) => void; saving: boolean }) {
  return (
    <Panel>
      <p className="section-label mb-3">Product Editor</p>
      <h2 className="font-display text-4xl text-ink mb-6">{form.id ? "Edit Product" : "Add New Product"}</h2>
      <div className="grid lg:grid-cols-[1fr_300px] gap-6">
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Product name" value={form.title} onChange={(v) => setForm({ ...form, title: v, slug: form.slug || slugFrom(v) })} />
            <Field label="Slug" value={form.slug} onChange={(v) => setForm({ ...form, slug: slugFrom(v) })} />
            <Field label="Price" value={form.price} onChange={(v) => setForm({ ...form, price: v })} />
            <Field label="Category" value={form.category} onChange={(v) => setForm({ ...form, category: v })} />
          </div>
          <TextField label="Short description" rows={3} value={form.description} onChange={(v) => setForm({ ...form, description: v })} />
          <TextField label="Long description" rows={7} value={form.long_description} onChange={(v) => setForm({ ...form, long_description: v })} />
          <Field label="Tags, separated by commas" value={form.tags} onChange={(v) => setForm({ ...form, tags: v })} />
          <Field label="Messenger inquiry text" value={form.messenger_message} onChange={(v) => setForm({ ...form, messenger_message: v })} />
          <div className="flex flex-wrap gap-4 text-sm text-muted">
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} /> Available</label>
          </div>
          <button disabled={saving} onClick={save} className="btn-primary"><Save size={16} /> Save Product</button>
        </div>
        <ImageBox image={form.cover_image} label="Product Image" onUpload={upload} />
      </div>
    </Panel>
  );
}

function BlogEditor({ form, setForm, save, upload, saving }: { form: BlogForm; setForm: (f: BlogForm) => void; save: () => void; upload: (file?: File) => void; saving: boolean }) {
  return (
    <Panel>
      <p className="section-label mb-3">Blog Editor</p>
      <h2 className="font-display text-4xl text-ink mb-6">{form.id ? "Edit Blog" : "Add Blog"}</h2>
      <div className="grid lg:grid-cols-[1fr_300px] gap-6">
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v, slug: form.slug || slugFrom(v) })} />
            <Field label="Slug" value={form.slug} onChange={(v) => setForm({ ...form, slug: slugFrom(v) })} />
            <Field label="Author" value={form.author} onChange={(v) => setForm({ ...form, author: v })} />
            <Field label="Date" type="date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} />
          </div>
          <TextField label="Excerpt" rows={3} value={form.excerpt} onChange={(v) => setForm({ ...form, excerpt: v })} />
          <TextField label="Blog content" rows={12} value={form.content} onChange={(v) => setForm({ ...form, content: v })} />
          <Field label="Tags, separated by commas" value={form.tags} onChange={(v) => setForm({ ...form, tags: v })} />
          <label className="flex items-center gap-2 text-sm text-muted"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Published</label>
          <button disabled={saving} onClick={save} className="btn-primary"><Save size={16} /> Save Blog</button>
        </div>
        <ImageBox image={form.cover_image} label="Blog Cover" onUpload={upload} />
      </div>
    </Panel>
  );
}

function ProductsManager({ products, edit, remove }: { products: ProductRow[]; edit: (row: ProductRow) => void; remove: (id: string) => void }) {
  return <TablePanel title="Manage Products" rows={products} empty="No products yet." render={(p) => (
    <Row key={p.id} image={p.cover_image} title={p.title} meta={`${p.price ?? "No price"} · ${p.available === false ? "Hidden" : "Available"}`}>
      <button className="btn-outline" onClick={() => edit(p)}>Edit</button>
      <button className="btn-outline" onClick={() => remove(p.id)}><Trash2 size={14} /> Delete</button>
    </Row>
  )} />;
}

function BlogsManager({ blogs, edit, remove }: { blogs: BlogRow[]; edit: (row: BlogRow) => void; remove: (id: string) => void }) {
  return <TablePanel title="Manage Blogs" rows={blogs} empty="No blogs yet." render={(b) => (
    <Row key={b.id} image={b.cover_image} title={b.title} meta={`${b.published === false ? "Draft" : "Published"} · ${b.date ?? "No date"}`}>
      <button className="btn-outline" onClick={() => edit(b)}>Edit</button>
      <button className="btn-outline" onClick={() => remove(b.id)}><Trash2 size={14} /> Delete</button>
    </Row>
  )} />;
}

function CommentsManager({ title, comments, update, remove }: { title: string; comments: CommentRow[]; update: (id: string, status: "approved" | "hidden" | "pending") => void; remove: (id: string) => void }) {
  return <TablePanel title={title} rows={comments} empty="No comments yet." render={(c) => (
    <div key={c.id} className="bg-parchment border border-stone/10 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-semibold text-ink">{c.author_name}</p>
          <p className="text-xs text-muted">{c.target_slug} · {c.status}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="btn-outline" onClick={() => update(c.id, "approved")}><CheckCircle2 size={14} /> Approve</button>
          <button className="btn-outline" onClick={() => update(c.id, "hidden")}>Hide</button>
          <button className="btn-outline" onClick={() => remove(c.id)}><Trash2 size={14} /> Delete</button>
        </div>
      </div>
      <p className="text-sm text-muted mt-4">{c.body}</p>
    </div>
  )} />;
}

function AnalyticsView({ analytics }: { analytics: AnalyticsRow[] }) {
  return (
    <Panel>
      <p className="section-label mb-3">Analytics</p>
      <h2 className="font-display text-4xl text-ink mb-6">Views, clicks, and quiet little footprints.</h2>
      <div className="space-y-3">
        {analytics.length ? analytics.map((item) => (
          <div key={item.id} className="flex items-center justify-between bg-parchment border border-stone/10 p-4">
            <div>
              <p className="font-semibold text-ink">{item.target_slug}</p>
              <p className="text-xs text-muted">{item.target_type} · {item.event_type}</p>
            </div>
            <p className="font-display text-3xl text-gold">{item.count}</p>
          </div>
        )) : <p className="text-sm text-muted">Analytics will appear once visitors view products, read blogs, or click Messenger order buttons.</p>}
      </div>
    </Panel>
  );
}

function SettingsView({ rows, save }: { rows: SiteSettingRow[]; save: (data: FormData) => void }) {
  const value = (key: string) => rows.find((row) => row.key === key)?.value ?? "";
  return (
    <Panel>
      <p className="section-label mb-3">Settings</p>
      <h2 className="font-display text-4xl text-ink mb-6">Storefront Settings</h2>
      <form action={save} className="grid sm:grid-cols-2 gap-4">
        <Field name="shop_name" label="Shop name" defaultValue={value("shop_name")} />
        <Field name="messenger_url" label="Messenger link" defaultValue={value("messenger_url")} />
        <Field name="facebook_url" label="Facebook link" defaultValue={value("facebook_url")} />
        <Field name="instagram_url" label="Instagram link" defaultValue={value("instagram_url")} />
        <Field name="tiktok_url" label="TikTok link" defaultValue={value("tiktok_url")} />
        <Field name="contact_email" label="Contact email" defaultValue={value("contact_email")} />
        <div className="sm:col-span-2"><TextField name="homepage_note" label="Homepage text" defaultValue={value("homepage_note")} rows={4} /></div>
        <button className="btn-primary sm:col-span-2"><Save size={16} /> Save Settings</button>
      </form>
    </Panel>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return <section className="bg-ivory border border-stone/10 p-6 lg:p-8 shadow-sm">{children}</section>;
}

function Stat({ label, value }: { label: string; value: number }) {
  return <div className="bg-parchment border border-stone/10 p-4"><p className="text-[10px] uppercase tracking-widest text-muted mb-2">{label}</p><p className="font-display text-4xl text-ink">{value}</p></div>;
}

function Field(props: { label: string; value?: string; defaultValue?: string; name?: string; type?: string; onChange?: (v: string) => void }) {
  return <label className="space-y-2 block"><span className={labelClass}>{props.label}</span><input name={props.name} type={props.type ?? "text"} className={inputClass} value={props.value} defaultValue={props.defaultValue} onChange={(e) => props.onChange?.(e.target.value)} /></label>;
}

function TextField(props: { label: string; rows: number; value?: string; defaultValue?: string; name?: string; onChange?: (v: string) => void }) {
  return <label className="space-y-2 block"><span className={labelClass}>{props.label}</span><textarea name={props.name} rows={props.rows} className={inputClass} value={props.value} defaultValue={props.defaultValue} onChange={(e) => props.onChange?.(e.target.value)} /></label>;
}

function ImageBox({ image, label, onUpload }: { image: string; label: string; onUpload: (file?: File) => void }) {
  return (
    <div className="bg-parchment border border-stone/10 p-4">
      <p className={labelClass}>{label}</p>
      <div className="relative aspect-square bg-mist mt-3 mb-4 overflow-hidden">
        {image ? <Image src={image} alt={label} fill className="object-cover" /> : <div className="absolute inset-0 flex items-center justify-center text-muted"><ImagePlus /></div>}
      </div>
      <input type="file" accept="image/*" onChange={(e) => onUpload(e.target.files?.[0])} className="text-xs" />
      {image && <p className="mt-3 text-xs text-muted break-all">{image}</p>}
    </div>
  );
}

function TablePanel<T>({ title, rows, empty, render }: { title: string; rows: T[]; empty: string; render: (row: T) => React.ReactNode }) {
  return <Panel><p className="section-label mb-3">Content</p><h2 className="font-display text-4xl text-ink mb-6">{title}</h2><div className="space-y-3">{rows.length ? rows.map(render) : <p className="text-sm text-muted">{empty}</p>}</div></Panel>;
}

function Row({ image, title, meta, children }: { image?: string | null; title: string; meta: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-parchment border border-stone/10 p-4">
      <div className="relative h-20 w-20 bg-mist shrink-0 overflow-hidden">{image ? <Image src={image} alt={title} fill className="object-cover" /> : <Package className="absolute left-7 top-7 text-muted" size={20} />}</div>
      <div className="flex-1"><p className="font-semibold text-ink">{title}</p><p className="text-xs text-muted">{meta}</p></div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
