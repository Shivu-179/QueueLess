# ⏱ QueueLess – Smart Crowd & Waiting Time Prediction System

[![Live Demo](https://img.shields.io/badge/Live%20Demo-queue--less--indol.vercel.app-brightgreen?style=for-the-badge&logo=vercel)](https://queue-less-indol.vercel.app)
[![Download APK](https://img.shields.io/badge/Download-Android%20APK%20(4.14%20MB)-2563eb?style=for-the-badge&logo=android)](https://queue-less-indol.vercel.app/api/download)
[![Database](https://img.shields.io/badge/Database-Neon%20PostgreSQL-336791?style=for-the-badge&logo=postgresql)](https://neon.tech)
[![Build Status](https://img.shields.io/badge/Build-Passing-success?style=for-the-badge&logo=github)](https://github.com/Shivu-179/QueueLess/actions)

> **Live Production Deployment**: [https://queue-less-indol.vercel.app](https://queue-less-indol.vercel.app)  
> **Direct APK Download**: [https://queue-less-indol.vercel.app/api/download](https://queue-less-indol.vercel.app/api/download)  
> **Multi-Device Portal**: [https://queue-less-indol.vercel.app/download](https://queue-less-indol.vercel.app/download)

---

## 📌 Project Overview

**QueueLess** solves the widespread problem of long, unpredictable queues at public facilities (Hospitals, Banks, Government Offices, College Counters, Railway Stations). By collecting actual wait times from citizens and applying statistical outlier filtering and rolling average predictions, QueueLess calculates:
1. **Real-time Crowd Levels**: 🟢 LOW, 🟡 MEDIUM, 🟠 HIGH, 🔴 VERY HIGH.
2. **Estimated Waiting Time** in minutes for any public counter.
3. **Recommended Best Time Today** to visit with minimum expected wait duration.
4. **Anti-Fake Moderation**: Automatically flags suspicious outliers (e.g. 500 minutes) to keep data accurate.

---

## 🛠 Tech Stack

* **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Semantic HTML5, Custom Responsive CSS.
* **Backend**: Next.js Server Components & Route Handlers (`/app/api/*`).
* **Database & ORM**: PostgreSQL + Prisma ORM (7 relational models).
* **Security & Auth**: `bcryptjs` for password hashing, `jsonwebtoken` for session tokens.
* **Mobile App (Android APK)**: Capacitor (`@capacitor/core`, `@capacitor/cli`, `@capacitor/android`).

---

## 🏗 System Architecture

```mermaid
graph TD
    A[Citizen / User Device] -->|Browser or Android APK| B[Next.js App Router Frontend]
    B -->|REST API Requests| C[Next.js Backend API Routes]
    C -->|Authentication & Sessions| D[JWT & Bcrypt Security Layer]
    C -->|Rolling Averages & Time Optimization| E[TypeScript Prediction Engine]
    C -->|Statistical Outlier Filter| F[Anti-Fake Guard]
    C -->|Type-Safe Queries| G[Prisma ORM Client]
    G -->|Relational Data Storage| H[(PostgreSQL Database)]
    F -->|Flagged Fake Reports| I[Admin Command Dashboard]
```

---

## 🗄 Database Schema (Prisma Models)

The database schema is defined in `prisma/schema.prisma` and contains 7 models:
1. **`User`**: User accounts (name, email, hashed password, role: `USER` or `ADMIN`).
2. **`Place`**: Facilities (name, category, address, counters, operating hours, current crowd).
3. **`QueueReport`**: Citizen wait-time submissions (waiting time, crowd level, queue count, anti-fake flags).
4. **`OperatingHours`**: Daily opening and closing schedules.
5. **`Prediction`**: Hourly predicted wait times and confidence metrics.
6. **`FavoritePlace`**: Bookmarked facilities.
7. **`Feedback`**: User star ratings (1-5) and feedback comments.

---

## 🚀 Getting Started

### 1. Installation
```powershell
cd queueless
npm install
```

### 2. Configure Environment (.env)
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/queueless_db?schema=public"
JWT_SECRET="queueless_super_secret_key_2026_safe"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Database Migration & Seeding
```powershell
npm run prisma:generate    # Generate Prisma Client types
npm run prisma:push        # Push schema to your PostgreSQL database
npm run seed               # Populate demo facilities, users, and reports
```

### 4. Run Development Server
```powershell
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 5. Production Build
```powershell
npm run build
npm run start
```

---

## 📱 Converting to Android APK (Capacitor)

QueueLess is configured with Capacitor (`com.queueless.app`).

### Step-by-step Build Guide:
1. **Install Android Studio**: Download and install from [developer.android.com/studio](https://developer.android.com/studio).
2. **Add the Android Native Platform**:
   ```powershell
   npm run cap:add
   ```
3. **Build the Web Project**:
   ```powershell
   npm run build
   ```
4. **Sync Web Code into Android Project**:
   ```powershell
   npm run cap:sync
   ```
5. **Open in Android Studio**:
   ```powershell
   npm run cap:open
   ```
6. **Generate Debug APK**:
   * In Android Studio menu: **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
   * Your APK will be located at:
     `android/app/build/outputs/apk/debug/app-debug.apk`
7. **Install on Phone**: Transfer `app-debug.apk` to your Android device and tap Install!

---

## 🎓 College Viva & Project Defense Q&A

### Q1: How does the crowd prediction algorithm work without Python or ML?
> **Answer**: It uses a rolling weighted average of recent verified community reports filtered by facility and time window. Outliers (e.g. 500 mins) are automatically removed using standard deviation and threshold clipping, preventing spammers from polluting predictions.

### Q2: How is the "Best Time Today" calculated?
> **Answer**: The system simulates daytime hourly operational intervals (9 AM – 5 PM) against empirical queue volume factors (e.g. morning lull vs afternoon peak) to find the specific hour window with the lowest expected wait time.

### Q3: How does the Anti-Fake system detect false reports?
> **Answer**: `detectFakeReport()` evaluates report duration against physical plausibility limits (>240 mins) and statistical deviations (>3.5x rolling average with >45 min delta). Flagged reports are marked as `FLAGGED_FAKE` and sent to the administrator dashboard for moderation.

### Q4: Why use Next.js + Capacitor instead of React Native?
> **Answer**: It provides a unified codebase. The exact same HTML, CSS, and TypeScript code functions as a responsive website on laptops and converts into a native Android APK via Capacitor without maintaining two separate codebases.

---

## 👥 Demo Test Accounts
* **Admin Login**: `admin@queueless.com` | Password: `admin123`
* **Student/Citizen Login**: `user@queueless.com` | Password: `user123`