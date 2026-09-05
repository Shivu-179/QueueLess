# 🌐 Free Cloud Deployment Guide for QueueLess

You can deploy QueueLess online for free so anyone (including professors and evaluators) can access it on their phones or laptops via a public `.vercel.app` URL!

---

## 1. Free Cloud PostgreSQL (Neon or Supabase)

### Option A: Neon PostgreSQL (Recommended - 1 Minute Setup)
1. Go to [neon.tech](https://neon.tech) and sign up for free.
2. Click **Create Project** (Name: `queueless`).
3. Copy your PostgreSQL connection string:
   `postgresql://neondb_owner:password@ep-cool-lake-12345.us-east-2.aws.neon.tech/neondb?sslmode=require`

### Option B: Supabase (Alternative)
1. Go to [supabase.com](https://supabase.com) and create a free project.
2. In Project Settings > Database, copy the **URI connection string**.

---

## 2. Push Database Schema to Cloud

In your local `queueless` folder:
1. Open `.env` and paste your cloud `DATABASE_URL`.
2. Push your Prisma schema to create the tables:
   ```powershell
   npm run prisma:push
   ```
3. Seed the initial places and accounts:
   ```powershell
   npm run seed
   ```

---

## 3. Deploy Frontend & Backend on Vercel

1. Push your `queueless` project to GitHub (or use the [Vercel CLI](https://vercel.com/cli)).
2. Go to [vercel.com](https://vercel.com) and click **Add New** > **Project**.
3. Import your GitHub repository.
4. Under **Environment Variables**, add:
   * `DATABASE_URL`: Your cloud PostgreSQL connection string
   * `JWT_SECRET`: Any random secure secret key (e.g. `queueless_prod_secret_2026`)
   * `NEXT_PUBLIC_APP_URL`: Your Vercel URL
5. Click **Deploy**.
6. Within 60 seconds, your site will be live at:
   `https://queueless.vercel.app`!