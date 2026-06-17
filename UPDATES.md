# Keepsake Ztation Live-Ready CMS Update

This update converts the admin area into a Supabase-ready content management dashboard for a live showcase website.

## Updated areas

- `src/app/admin/page.tsx`
- `src/components/ui/AdminConsole.tsx`
- `src/app/api/admin/*`
- `src/app/api/upload/route.ts`
- `src/app/api/comments/route.ts`
- `src/app/api/analytics/route.ts`
- `src/lib/supabase.ts`
- `src/lib/admin-auth.ts`
- `src/lib/admin-schema.ts`
- `src/lib/products.ts`
- `src/lib/blog.ts`
- `src/lib/settings.ts`
- `src/components/ui/AnalyticsTracker.tsx`
- `src/components/ui/MessengerOrderButton.tsx`
- `src/components/ui/CommentsBox.tsx`
- `supabase/schema.sql`
- `.env.example`
- `README.md`
- `package.json`
- `package-lock.json`

## Notes

- Public navigation no longer links to `/admin`.
- Supabase is required for the live admin dashboard.
- Public pages fall back to the original Markdown content if Supabase environment variables are missing.
- Product and blog images upload to Supabase Storage.
- Comments are submitted as pending and moderated in admin.
- Analytics tracks product views, blog views, and Messenger order clicks.
