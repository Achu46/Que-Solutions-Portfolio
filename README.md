# QUE SOLUTIONS - Premium 3D Interactive Portfolio & Platform

> **"People Today. A Brighter Tomorrow."**  
> **Pillars**: SUPPORT | TECHNOLOGY | GROWTH

A standalone corporate website, interactive 3D support hub, and enterprise lead capture system built for **QUE SOLUTIONS** (Erode, Tamil Nadu) — specialized outsourced customer care and call centre services for small and growing product-based businesses.

---

## 🌟 Key Highlights & Engineering Features

- **Interactive 3D Support Hub**: Full-screen 100dvh React Three Fiber canvas featuring procedural glass/metal geometries (central olive icosahedron, orbiting rings, floating headset, chat bubble, phone silhouette, and message icons) with damped mouse parallax.
- **Scroll-Driven 3D Story**: Persistent fixed canvas seamlessly morphing through Services, Process, and Pricing views with GSAP and Lenis smooth scrolling.
- **Strict Black & White Design System**:
  - **Dark Mode**: Background `#000000`, surfaces `#0A0A0A`/`#121212`, text `#FFFFFF`.
  - **Light Mode**: Background `#FFFFFF`, surfaces `#F5F5F5`, text `#000000`.
  - **Strict Pairing Rules**: CSS variable tokens (`--bg`, `--surface`, `--elevated`, `--hover`, `--border`, `--text`, `--inverse-bg`, `--inverse-fg`).
  - **Unmodified Official Brand Logo**: Extracted exact olive palette (`#54703F`, `#425832`, `#2C3B22`, `#94B380`, `#D7E3CD`).
  - **Indian Currency Formatting**: All plan rates formatted strictly with `Intl.NumberFormat('en-IN')` (e.g., ₹11,999/mo, ₹15,999/mo, ₹21,999/mo).
- **Anti-Fabrication Compliance**: Zero fabricated client logos, testimonials, or statistics. Empty sections are automatically hidden and can be published from the admin panel once real data is added.
- **Firebase v10+ Modular Integration**:
  - Instant bundled offline fallbacks for immediate rendering with zero layout shift.
  - Real-time `onSnapshot` listeners for admin management.
  - Public create-only validated leads with custom claim `admin: true` authorization for management.
  - App Check and analytics consent with Do Not Track respect.
- **Hidden Admin Control Panel (`/que`)**:
  - Real-time leads CRM with search, filters, inline status transitions, notes editor, and CSV export.
  - Full CMS for Services, Pricing Plans, Projects, Testimonials, and Site Settings.
  - Excluded from search indexing via `robots.txt` and meta headers.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js 18+ (tested on Node v24.19.0)
- npm 9+ (tested on npm 11.17.0)

### 2. Installation
```bash
# Clone or navigate to the repository root
npm install
```

### 3. Environment Setup
Copy the example environment file and add your Firebase credentials:
```bash
cp .env.example .env
```
Fill in the parameters from your Firebase Console:
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=que-solutions.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=que-solutions
VITE_FIREBASE_STORAGE_BUCKET=que-solutions.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_FIREBASE_RECAPTCHA_KEY=your_recaptcha_v3_site_key_here
```
> *Note: If `.env` is omitted or contains placeholder values, the application automatically runs in demo mode using bundled company fallback data and localStorage persistence, allowing full client presentations without waiting for Firebase setup.*

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛡️ Administrative Portal (`/que`)

The admin management interface is hidden at `/que`:
- **URL**: `http://localhost:3000/que` (or `https://quesolutions.in/que`)
- **Initial Demo Credentials**:
  - **Email**: `admin@quesolutions.in`
  - **Password**: `admin123`

### Setting Up a Production Admin User
To grant the required custom claim `{ admin: true }` to a Firebase Auth user:
1. Download your service account key from the Firebase Console (*Project Settings > Service Accounts > Generate new private key*).
2. Save it as `serviceAccountKey.json` in the root folder (this file is `.gitignore`d).
3. Run:
```bash
npm run set-admin admin@quesolutions.in
```

---

## 💾 Database Seeding

To seed the official company data (site settings, services, pricing plans, and projects) into live Firestore:
```bash
npm run seed
```

---

## 🔒 Security Rules & Unit Tests

### Firestore Security Architecture (`firestore.rules`)
- **Public Read**: Restricted to `siteSettings`, `hero`, `about`, `services` (where `isActive == true`), `plans` (where `isActive == true`), `projects` (where `isPublished == true`), and `testimonials` (where `isPublished == true`).
- **Leads**: Public creation ONLY with strict field schema verification (`name`, `email`, `phone`, `company`, `businessType`, `selectedPlan`, `message`, `source`, `status == "new"`, `createdAt == request.time`). Public reads, updates, and deletes are denied. Only admins can read, update status/notes, and delete.
- **Storage Rules (`storage.rules`)**: Public read for project images; admin-only upload restricted to image MIME types and <= 5MB.

### Run Rules Unit Tests
```bash
npm run test:rules
```

---

## 🧪 Theme & Contrast Audit

To run the automated Playwright audit across all routes (`/`, `/privacy`, `/terms`, `/que/login`, `/404`) in both Dark (#000000) and Light (#FFFFFF) themes at mobile (390px) and desktop (1440px):
```bash
npm run audit:theme
```

---

## 📦 Production Build & Deployment

### Build
```bash
npm run build
```

### Preview Local Production Bundle
```bash
npm run preview
```

### Deploy to Firebase Hosting & Firestore
```bash
# Deploy security rules
firebase deploy --only firestore:rules,storage

# Deploy web bundle
firebase deploy --only hosting
```
