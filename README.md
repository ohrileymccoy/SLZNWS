Sleazy News (SLN)

Sleazy News (SLN) is a modern, video-first news platform built with React + Vite + TailwindCSS on the frontend and Cloudflare Workers + R2 + D1 on the backend.
It supports direct video uploads via an admin panel, automatic storage in R2, metadata in D1, and section-based feeds (News, Culture, Sports, Featured).

✨ Features

🎬 Video Uploads via /admin form

☁️ Media Storage in Cloudflare R2

🗄️ Metadata Database in Cloudflare D1

📰 Dynamic Feeds: Home feed shows latest videos, section pages filter by section

🎨 Frontend: React, Vite, TailwindCSS (responsive, fast)

⚡ Backend: Cloudflare Workers Functions API (/api/v1/videos)

🔒 Ready for production with Cloudflare Pages + Workers bindings

📦 Project Structure
src/
  components/      # Shared UI components (Feed, ArticleCard, VideoGrid, etc.)
  hooks/           # Custom React hooks (useVideos)
  pages/           # Page-level components (Admin, ArticlePage, etc.)
  routes/          # Route shells (Home, ArticleShell, etc.)
functions/api/v1/  # Cloudflare Workers API endpoints
  ├── upload.ts    # Handle video uploads → R2 + D1
  ├── list.ts      # Handle video listing → JSON for feeds
  ├── delete.ts    # Handle video deletion (admin)
  └── ...          # Other endpoints (articles legacy, featured, etc.)
migrations/        # SQL migrations for D1 database
wrangler.toml      # Cloudflare config (R2, D1 bindings, env vars)

🚀 Local Development

Install dependencies

npm install


Run local dev server (Vite + Wrangler)

npx wrangler dev


This serves both the frontend (http://127.0.0.1:8787/) and API routes (/api/v1/...) with a local D1 + R2 proxy.

Build for production

npm run build

🗄️ Database Migrations

Migrations live in /migrations.

Apply locally:

npx wrangler d1 migrations apply sln-d1


Apply remotely (Cloudflare D1):

npx wrangler d1 migrations apply sln-d1 --remote


Check schema:

npx wrangler d1 execute sln-d1 --command="PRAGMA table_info(videos);"

☁️ Cloudflare Deployment
1. Configure wrangler.toml
name = "sln-app"
compatibility_date = "2025-08-29"

[[r2_buckets]]
binding = "VIDEOS_BUCKET"
bucket_name = "sln-media"

[[d1_databases]]
binding = "DB"
database_name = "sln-d1"

[vars]
R2_PUBLIC_BASE = "https://pub-xxxx.r2.dev/sln-media"

2. Push Repo to GitHub
git add .
git commit -m "deploy: video feed MVP"
git push origin main

3. Deploy via Cloudflare Pages

Cloudflare Dashboard → Pages → “Create Project” → Connect GitHub repo

Build command: npm run build

Output directory: dist

4. Deploy Worker API

Workers Functions in /functions/api/v1/ are automatically deployed with Pages.

5. Verify Upload + Feed

Upload a test video via /admin

Confirm it appears in /api/v1/videos JSON feed

Confirm it renders in the Home feed

🔑 Environment Variables

VIDEOS_BUCKET → Cloudflare R2 binding (media storage)

DB → Cloudflare D1 binding (metadata)

R2_PUBLIC_BASE → Public base URL for your R2 bucket (used in feeds to build playable video URLs)

🛠️ Development Notes

Home Feed → always shows latest videos (/api/v1/videos)

Section Feeds → use ?section=culture, ?section=sports, etc.

Admin Panel → allows upload with title, caption, section tagging.

Deletion → available via /api/v1/videos/delete (admin-only).

Future: authentication, unified article+video feeds, pagination.

⚖️ License

MIT — free to modify, deploy, and adapt for your own projects.