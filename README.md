# Keepsake Ztation

A live-ready showcase website for a luxury souvenir studio. Built with Next.js 15.5.19, Tailwind CSS v4, and a Supabase-powered admin dashboard.

## What this version includes

- Public showcase pages for products, blogs, about, and home
- No cart and no customer accounts
- Product ordering through a Messenger button
- Private admin dashboard with Supabase Auth login
- Hamburger/sidebar admin menu
- Add, edit, publish, hide, and delete products
- Add, edit, publish, unpublish, and delete blogs
- Upload product and blog images to Supabase Storage
- Product and blog comments with admin moderation
- Product views, blog views, and Messenger click analytics
- Settings page for Messenger and social links
- Tailwind CSS v4 PostCSS setup
- Vercel-ready environment variables

## Install locally

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

Admin:

```text
http://localhost:3000/admin
```

## Supabase setup

Create a free Supabase project, then open the SQL Editor and run:

```text
supabase/schema.sql
```

Create two public storage buckets in Supabase Storage:

```text
product-images
blog-images
```

For each bucket, make it public so uploaded images display on the website.

Create an admin user in Supabase:

```text
Authentication -> Users -> Add user
```

Use that email and password to log in at `/admin`.

## Environment variables

Create `.env.local` using `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

Important: never expose `SUPABASE_SERVICE_ROLE_KEY` in client code. It is only used inside server API routes.

## Vercel deployment

1. Push the project to GitHub.
2. Import the repo into Vercel.
3. Add the same environment variables in Vercel Project Settings.
4. Deploy.

## Admin dashboard guide

The admin menu includes:

```text
Dashboard
Add Product
Manage Products
Add Blog
Manage Blogs
Product Comments
Blog Comments
Analytics
Settings
```

Products, blogs, comments, analytics, and settings are stored in Supabase. You do not need to edit source files after publishing content through the dashboard.

## Messenger ordering

Add your Messenger link in:

```text
/admin -> Settings -> Messenger link
```

Each product has an Order on Messenger button. Button clicks are tracked in analytics.

## Notes

If Supabase environment variables are missing, the public site falls back to the original Markdown sample content. The live admin dashboard requires Supabase.
