# 🌙 LunarCookies Horoscope 2026 - Full Stack Project

A modern full-stack horoscope application built with **Next.js**, **TypeScript**, **React**, and **Supabase**. Browse zodiac forecasts by sign, category, and month for 2026.

**Live Features:**

- 🔮 Browse horoscopes by zodiac sign
- 📅 Filter predictions by month and category (Love, Money, Career, Family, Health)
- 🎨 Beautiful responsive UI with custom CSS
- ⚡ Fast, server-rendered with Next.js 16 (Turbopack)
- 📊 Real-time data from Supabase PostgreSQL

---

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Team Contributions](#team-contributions)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running Locally](#running-locally)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [Available Scripts](#available-scripts)
- [Troubleshooting](#troubleshooting)

---

## 🛠 Tech Stack

### Frontend

- **Next.js** (v16.1.7) – React framework with server-side rendering and Turbopack
- **React** – UI components with server and client components
- **TypeScript** – Type-safe JavaScript
- **Tailwind CSS** – Utility-first CSS framework
- **Custom CSS** – Additional styling in `public/css/style.css`
- **GSAP** – Animation library for interactive elements

### Backend

- **Next.js API Routes** – Serverless backend endpoints
- **Node.js** – JavaScript runtime environment
- **Supabase** – Backend-as-a-Service with PostgreSQL

### Database & Services

- **Supabase PostgreSQL** – Cloud-hosted relational database
- **pg** (node-postgres) – PostgreSQL client for direct connections
- **@supabase/supabase-js** – Supabase JavaScript client library
- **@supabase/ssr** – Supabase Server-Side Rendering utilities

### Development Tools

- **Turbopack** – Next.js bundler for faster development
- **ESLint** – Code linting and quality

---

## 👥 Team Contributions

### Prim (Primc) - Full Stack Developer

**Completed Tasks:**

- ✅ Integrated Supabase client library for real-time PostgreSQL connectivity
- ✅ **Created Supabase data layer** in `lib/db.ts`:
    - `getMonthsFromSupabase()` – Fetch all months for the year
    - `getPredictionFromSupabase()` – Fetch single prediction
    - `getPredictionsForSignMonthFromSupabase()` – Fetch predictions for zodiac sign
    - `getDistinctSignsFromSupabase()` – Fetch all zodiac signs
- ✅ **Migrated all pages to Supabase**:
    - `/app/page.tsx` – Home page with sign & month selection
    - `/app/forecast/page.tsx` – Detailed forecast view
    - `/app/sign/[sign]/page.tsx` – Sign-specific forecast grid
- ✅ Environment configuration and credentials setup
- ✅ Database connection troubleshooting & error handling
- ✅ Documentation and setup instructions

### Richelle Tiongson - Full Stack/Front-End Developer
- ✅ Structured and integrated horoscope data into database:
    - Formatted horoscope content into SQL structure
    - Populated zodiac_predictions_2026 (Aries–Pisces, March–December, all categories)

- ✅ Built fortune cookie animation & interaction:
    - Developed click-to-reveal cookie experience
    - Integrated animation using /public/images/asset-1.png and asset-2.png

- ✅ Designed and implemented forecast/result page:
    - Styled initial UI and layout for forecast experience
    - Refined visual design and interaction flow

- ✅ UX improvements and interaction polish:
    - Improved animation effects (radial light, timing, visibility)
    - Ensured clear, unobstructed cookie interaction
    - Optimized mobile layout and responsiveness
    
- ✅ Product quality and iteration:
    - Refined micro-interactions and transitions as well as improve usability

### Bonnie Wan - Full Stack Developer

**Completed Tasks:**

- ✅ Designed and implemented the **Logo** on the main landing page
- ✅ Built the main landing page with **Category Card UI (visual design)**
  - Implemented card styling and layout in `app/globals.css`
  - Replaced card content with category PNG assets:
    - `Love.png`, `Money.png`, `Career.png`, `Family.png`, `Health.png`
  - Ensured cards remain clickable and visually indicate the currently selected option
- ✅ Implemented the **Main page experience end-to-end**
  - Worked on sign selection + category selection integration
  - Connected carousel selection to the form submit payload (hidden `category` input)
- ✅ Designed and implemented the **Carousel + How It Works**
  - Implemented the carousel component in `app/components/CategoryCardSlider.tsx`
  - How it works:
    - `LandingSentence.tsx` stores the current selected `category` via `useState`
    - The carousel receives `selectedValue` and updates it through `onSelect`
    - Clicking `← / →` changes the selected category, then centers that card using `ref` + `scrollIntoView({ inline: 'center' })`
    - Cards are laid out in a horizontally scrollable container using **scroll-snap**, so the selected card is easy to spot

### [Xiuzi Guo] - [Full-Stack Developer]

- ✅ **Product Direction & Content Planning**
Defined the overall website concept, including content scope, data structure, and user-facing direction. Ensured alignment between user needs and the astrology-based content strategy.

- ✅ **Data Collection & Processing**
Extracted and curated relevant content from Astrology Zone, transforming unstructured text into structured datasets suitable for application use.

- ✅ **Database Design (PostgreSQL)**
Organized and normalized collected data into a PostgreSQL schema. Designed tables and relationships to support scalability, efficient querying, and future feature expansion.

- ✅ **Frontend Development**
Built the initial interface and core pages using modern frontend practices. Designed and implemented basic CSS styling to ensure usability, readability, and a clean user experience.

- ✅ **Cloud Integration (Supabase & Vercel)**
Connected the backend database (Supabase) with the frontend deployment (Vercel). Configured secure environment variables and optimized database connection settings for production.

- ✅ **Deployment & Debugging**
Led the deployment process and identified critical issues preventing successful builds. Troubleshot configuration errors and ensured the application was production-ready.

- ✅ **Documentation & Reporting**
Contributed to the project report by documenting technical decisions, system architecture, and development challenges, with a focus on clarity and reproducibility.

---

## 📦 Prerequisites

- **Node.js** (v18+) – https://nodejs.org/
- **npm** (comes with Node.js)
- **Git** – For cloning the repository
- **Supabase Account** (free) – https://supabase.com/

---

## 🚀 Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/FullStack_2026Project.git
cd FullStack_2026Project
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Supabase Project

1. Go to https://supabase.com and sign up (free)
2. Create new project → PostgreSQL database
3. Go to **Settings → API** and copy:
    - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
    - **anon/public key** → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`

### 4. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=eyJhbGc...your_key
PORT=3000
```

### 5. Set Up Database

In Supabase **SQL Editor**, run:

```sql
-- Create tables
CREATE TABLE months (
  month_id INT PRIMARY KEY,
  name VARCHAR(20)
);

CREATE TABLE zodiac_predictions_2026 (
  id SERIAL PRIMARY KEY,
  sign VARCHAR(20),
  month_id INT,
  category VARCHAR(20),
  prediction TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seed months
INSERT INTO months (month_id, name) VALUES
(1,'January'),(2,'February'),(3,'March'),(4,'April'),
(5,'May'),(6,'June'),(7,'July'),(8,'August'),
(9,'September'),(10,'October'),(11,'November'),(12,'December');
```

Then seed predictions from `database/seed_*.sql` files.

---

## 🏃 Running Locally

```bash
npm run dev          # Development server (http://localhost:3000)
npm run build        # Production build
npm start            # Start production
npm run lint         # Run linter
```

---

## 📁 Project Structure

```
FullStack_2026Project/
├── app/
│   ├── page.tsx                 # Home page
│   ├── layout.tsx               # Root layout
│   ├── forecast/page.tsx        # Forecast details
│   ├── sign/[sign]/page.tsx     # Sign forecasts
│   └── components/              # React components
├── lib/
│   ├── db.ts                    # Supabase data layer
│   └── db.js                    # Legacy PostgreSQL
├── public/
│   ├── images/                  # Logo & images
│   ├── css/style.css            # Custom CSS
│   └── js/                      # Scripts
├── database/
│   ├── schema.sql               # Database schema
│   └── seed_*.sql               # Seed files
├── .env.local                   # Environment vars
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
└── README.md                    # This file
```

---

## 🔐 Environment Variables

| Variable                                       | Example                   |
| ---------------------------------------------- | ------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`                     | `https://xyz.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | `eyJ...`                  |
| `PORT`                                         | `3000`                    |

---

## 🗄 Database

### Tables

**months:**

- month_id (INT) – 1-12
- name (VARCHAR) – January, February, etc.

**zodiac_predictions_2026:**

- id (SERIAL)
- sign (VARCHAR) – Aries, Taurus, etc.
- month_id (INT)
- category (VARCHAR) – Love, Money, Career, Family, Health
- prediction (TEXT)
- created_at (TIMESTAMP)

### Data Functions

```typescript
import {
    getMonthsFromSupabase,
    getPredictionFromSupabase,
    getPredictionsForSignMonthFromSupabase,
} from "@/lib/db";

const months = await getMonthsFromSupabase();
const prediction = await getPredictionFromSupabase("Aries", 1, "Love");
const predictions = await getPredictionsForSignMonthFromSupabase("Aries", null);
```

---

## 📜 Available Scripts

```bash
npm install          # Install dependencies
npm run dev          # Development server
npm run build        # Production build
npm start            # Start production
npm run lint         # ESLint check
npm run db:init      # Init local PostgreSQL
```

---

## 🐛 Troubleshooting

### Supabase Connection Error

```
Check .env.local has:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
```

### Port Already in Use

```bash
PORT=3001 npm run dev
```

### No Data Shows

1. Verify tables in Supabase SQL Editor
2. Check seed data was inserted
3. Verify zodiac signs exist in database

---

## 🔗 Useful Links

- **Supabase:** https://supabase.com/docs
- **Next.js:** https://nextjs.org/docs
- **React:** https://react.dev
- **TypeScript:** https://www.typescriptlang.org/docs/

---

## 📝 License

[BCIT / Whatdafor group]

---

**Happy coding! 🚀🌙**
