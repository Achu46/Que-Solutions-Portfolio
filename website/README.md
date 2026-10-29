# QUE SOLUTIONS — Full-Stack Website & Admin CMS

> **Customer Care & Call Centre Services**  
> Professional outsourced customer support, call centre operations, and live chat management for small and growing product-based businesses.

---

## 1. System Architecture

```
                                  +---------------------------------------+
                                  |         Frontend (React + Vite)       |
                                  | Tailwind CSS, Framer Motion, Lucide   |
                                  | Hosted on: Vercel (VITE_API_URL)      |
                                  +---------------------------------------+
                                                      |
                                                      | REST API (JSON)
                                                      v
                                  +---------------------------------------+
                                  |         Backend (Node + Express)      |
                                  | Helmet, Rate Limiter, JWT/Cookie Auth |
                                  | Nodemailer Service, Analytics Engine  |
                                  | Hosted on: Railway (PORT, DATABASE_URL)|
                                  +---------------------------------------+
                                                      |
                                                      | Connection Pool
                                                      v
                                  +---------------------------------------+
                                  |         Database (PostgreSQL)         |
                                  | 14 Tables, Constraints, Foreign Keys  |
                                  | Hosted on: Railway PostgreSQL         |
                                  +---------------------------------------+
```

---

## 2. Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Tailwind CSS, Lucide Icons, Framer Motion |
| **Tooling** | Vite 5, PostCSS, Autoprefixer |
| **Backend** | Node.js (v20+), Express.js REST API |
| **Database** | PostgreSQL (with high-reliability local store adapter for zero-friction dev) |
| **Security** | Helmet, bcryptjs, JWT, express-rate-limit, CORS, sanitization |
| **Email** | Nodemailer (Gmail SMTP or Transactional Mail Service) with audit logs |
| **Frontend Hosting** | Vercel (`client/vercel.json`) |
| **Backend + DB Hosting** | Railway (`server/railway.json`, Railway PostgreSQL) |

---

## 3. Brand Identity & Authentic Data

- **Company Name:** QUE SOLUTIONS
- **Tagline:** Customer Care & Call Centre Services
- **Services:** Inbound Call Support · Outbound Call Support · Chat Support
- **Direct Phone:** `7092490337`
- **Official Email:** `que.solutions.services@gmail.com`
- **Location:** Erode, Tamil Nadu
- **Working Hours:** Monday to Saturday: 4 hrs/day (~104 hrs/mo)
- **Official Logos:** Unmodified official logos loaded from `client/public/logo.png` and `client/public/logo-icon.png`.
- **Primary Color Palette:** `#46BAFB` (Vibrant Cyan Blue), `#72AEDD` (Soft Cerulean), `#0A192F` (Deep Navy).

---

## 4. Default Admin Credentials

> [!IMPORTANT]
> The admin portal is strictly accessible at `/que` and is **not** discoverable from public navigation links.

- **Admin Login Route:** `http://localhost:5173/que` (or `https://your-domain.vercel.app/que`)
- **Admin Email:** `admin@quesolutions.com`
- **Default Password:** `AdminPassword@2026`
*(Passwords can be changed immediately from `/que/settings`).*

---

## 5. Project Directory Structure

```
/Que-Solutions/website
├── client/                     # Frontend SPA (React + Tailwind)
│   ├── public/
│   │   ├── logo.png            # Official brand horizontal logo
│   │   ├── logo-icon.png       # Official brand square icon
│   │   ├── favicon.png
│   │   ├── robots.txt          # SEO crawlers directive (blocks /que)
│   │   └── sitemap.xml
│   ├── src/
│   │   ├── admin/              # Admin Panel pages
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── AdminLoginPage.jsx      # /que
│   │   │   ├── AdminDashboardPage.jsx  # /que/dashboard
│   │   │   ├── AdminLeadsPage.jsx      # /que/leads
│   │   │   ├── AdminVisitorsPage.jsx   # /que/visitors
│   │   │   ├── AdminEmailsPage.jsx     # /que/emails
│   │   │   ├── AdminCMSPage.jsx        # /que/cms
│   │   │   └── AdminSettingsPage.jsx   # /que/settings
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── HeroSection.jsx
│   │   │   ├── HeroVisual.jsx  # Custom animated support hub visual
│   │   │   ├── ServicesSection.jsx
│   │   │   ├── PricingSection.jsx
│   │   │   ├── WhyUsSection.jsx
│   │   │   ├── TargetClientsSection.jsx
│   │   │   ├── ProcessSection.jsx
│   │   │   ├── AboutSection.jsx
│   │   │   ├── ContactSection.jsx
│   │   │   └── Footer.jsx
│   │   ├── context/            # AuthContext
│   │   ├── layouts/            # PublicLayout
│   │   ├── pages/              # HomePage, NotFoundPage
│   │   └── services/           # api.js, analyticsTracker.js
│   ├── package.json
│   ├── tailwind.config.js
│   └── vercel.json             # Vercel SPA routing
│
└── server/                     # Backend REST API (Express + PostgreSQL)
    ├── src/
    │   ├── controllers/        # auth, site, services, pricing, leads, email, analytics
    │   ├── db/                 # PostgreSQL Pool, schema.sql, migrate.js, seed.js
    │   ├── middleware/         # auth, rateLimiter, errorHandler
    │   ├── routes/             # REST endpoints
    │   ├── services/           # mailService (Nodemailer)
    │   └── server.js           # Server entry point
    ├── .env.example
    ├── package.json
    ├── railway.json            # Railway deployment config
    └── Procfile
```

---

## 6. Local Quick Start

### Prerequisites
- Node.js v18+ (tested on Node v24)
- (Optional) PostgreSQL 15+ (if running native local PostgreSQL)

### Step 1: Install Dependencies
```bash
# Server dependencies
npm --prefix server install

# Client dependencies
npm --prefix client install
```

### Step 2: Configure Environment Variables
Copy `server/.env.example` to `server/.env`:
```bash
cp server/.env.example server/.env
```
Default parameters in `server/.env`:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgres://postgres:postgres@localhost:5432/que_solutions
JWT_SECRET=que_solutions_jwt_secret_production_ready_key_2026_secure
SESSION_SECRET=que_solutions_session_secret_2026
ADMIN_EMAIL=admin@quesolutions.com
ADMIN_DEFAULT_PASSWORD=AdminPassword@2026
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=que.solutions.services@gmail.com
SMTP_PASSWORD=
CLIENT_URL=http://localhost:5173
```

### Step 3: Run Migrations & Seed (PostgreSQL)
```bash
# When your local PostgreSQL is running:
npm run migrate
npm run seed
```
*(Note: If PostgreSQL is not active locally, the server automatically boots with high-reliability persistent local store fallback so you can develop without blocking).*

### Step 4: Start Development Servers
In two terminal windows (or using powershell):
```bash
# Terminal 1: Backend Server (Port 5000)
node --watch server/src/server.js

# Terminal 2: Frontend Client (Port 5173)
npm --prefix client run dev
```

Visit:
- Public Website: `http://localhost:5173`
- Secure Admin Portal: `http://localhost:5173/que`

---

## 7. Deployment Instructions

### A. Deploy Backend + PostgreSQL on Railway

1. Log into [Railway.app](https://railway.app).
2. Click **New Project** → **Provision PostgreSQL**.
3. Once the database is provisioned, click **New Service** → **Deploy from GitHub Repo** → select this repository.
4. Set the **Root Directory** to `/server`.
5. Under service **Variables**, add:
   - `DATABASE_URL`: `${{Postgres.DATABASE_URL}}` (Railway reference variable)
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: *(generate random 32+ character key)*
   - `SESSION_SECRET`: *(generate random 32+ character key)*
   - `ADMIN_EMAIL`: `admin@quesolutions.com`
   - `ADMIN_DEFAULT_PASSWORD`: *(your secure admin password)*
   - `SMTP_USER`: `que.solutions.services@gmail.com`
   - `SMTP_PASSWORD`: *(Google App Password if using Gmail)*
   - `CLIENT_URL`: `https://your-frontend.vercel.app`
6. Railway will automatically execute `server/railway.json` and boot the server.
7. Run migrations on Railway by opening the service CLI / Deploy command:
   ```bash
   node src/db/migrate.js
   node src/db/seed.js
   ```

### B. Deploy Frontend on Vercel

1. Log into [Vercel](https://vercel.com).
2. Click **Add New** → **Project** → Import this repository.
3. Configure the project:
   - **Framework Preset:** Vite
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add Environment Variable:
   - `VITE_API_URL`: `https://your-railway-backend.up.railway.app`
5. Click **Deploy**.
6. The frontend will build and deploy instantly with full client-side routing handled via `client/vercel.json`.

---

## 8. Security & Production Checklist

- [x] **Zero Secrets in Client Bundle**: All API keys, SMTP credentials, and tokens are stored solely in server environment variables.
- [x] **Secure Auth**: bcrypt hashing (10 salt rounds) for passwords, JWT tokens with 7-day expiration, and generic non-leaky auth errors.
- [x] **Route Protection**: `/que/*` protected by React AuthContext + Express JWT Bearer validation.
- [x] **Rate Limiting**: Login endpoint rate limited (10 attempts/15 min); lead submission rate limited (15/hour) to prevent spam.
- [x] **Spam Traps**: Honeypot field `_gotcha` silently drops automated bot submissions.
- [x] **Privacy-Conscious Analytics**: Tracks anonymized session telemetry, referrer, and devices without storing passwords or personal identifying data; respects `Do Not Track`.
- [x] **Responsive & Accessible**: Mobile-first Tailwind CSS, visible focus states, ARIA labels, semantic tags, and full `prefers-reduced-motion` support.
