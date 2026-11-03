# Built By Boyka — Premium Coaching Website & Admin Dashboard

Official brand name: **Built By Boyka**  
Website title: **Built By Boyka | Premium Coaching**  
Default WhatsApp: **+201140108262** (`01140108262`) — URL: `https://wa.me/201140108262`

A complete, production-grade online coaching platform and content management system inspired by leading Egyptian and international fitness coaching brands (Bergos Coaching, Sam Samouy). Built with Next.js 14 App Router, TypeScript, Tailwind CSS, Prisma ORM, and secure server-side JWT authentication.

---

## 🌟 Key Features

### 1. Public-Facing Coaching Website
- **Cinematic Visual Identity:** Liquid glass interfaces, dynamic theme gradients, and ambient floating orbs with motion settings.
- **Interactive Before & After Comparison:** Interactive slider allowing visitors to wipe left/right to reveal dramatic client transformations.
- **12 Full Sections:**
  1. Sticky Frosted Glass Navigation with mobile drawer and WhatsApp CTA
  2. Hero Section with high-contrast typography, coach portrait, and live trust metrics
  3. Trust Indicators & Methodology (Precision Biomechanics, Metabolic Nutrition, 24/7 Accountability, Sustainable Autonomy)
  4. Meet Coach Boyka (biography, ISSA certifications, achievements, image gallery)
  5. Specialized Coaching Programs (VIP 1-on-1, Hypertrophy Architecture, Aggressive Shred, Contest Prep)
  6. Client Transformations Showcase with category filtering (Fat Loss, Muscle Gain, Recomp, Contest Prep)
  7. Video Hub & Masterclasses with embedded responsive video modal player
  8. Pricing & Packages Tiers (Silver, Gold Dominance - Most Popular, VIP Elite Inner Circle)
  9. Verified Athlete Testimonials with star ratings and reviews
  10. FAQ Accordion addressing nutrition, training, and communication
  11. Direct WhatsApp VIP Contact & Persistent Client Application Form
  12. Liquid Glass Footer with social media profiles and discrete admin portal access
- **Floating WhatsApp Widget:** Bottom-corner pulse widget with pre-filled message support.
- **Dynamic Dedicated Pages:**
  - Dedicated service pages (`/services/[slug]`)
  - Dynamic page builder pages (`/pages/[slug]`)
  - Auto-generated XML sitemap (`/sitemap.xml`) and `robots.txt`

### 2. Secure Administrator Dashboard (`/admin`)
- **Server-Side Authentication:** Protected by bcrypt password hashing, HTTP-only JWT session cookies, and login brute-force rate limiting.
- **18 Management Modules:**
  1. **Overview:** Live application counts (packages, services, transformations, videos, pages, incoming inquiries)
  2. **Website Content:** Live editor for Hero, About, Trust stats, and CTAs
  3. **Pages & Builder:** Compose custom pages with reusable blocks (headings, rich text, images, videos, CTA banners, stats)
  4. **Navigation Menus:** Add, reorder, and toggle visibility of navbar links
  5. **Theme & Gradient Editor:** Interactive gradient customizer (linear/radial, angle, color stops, liquid glass blur, live component preview, and presets)
  6. **Animations & Motion:** Floating orb count, speed, blur radius, hover 3D tilt, and reduced-motion toggle
  7. **Media Library:** Drag-and-drop persistent file uploads, category filters, and instant URL copying
  8. **Video Library:** Add YouTube/Vimeo embeds with custom thumbnails and categories
  9. **Client Transformations:** Manage before/after photos, kg lost/gained, weeks, and client quotes
  10. **Testimonials:** Manage verified athlete reviews and star ratings
  11. **Coaching Services:** Manage programs, duration, investment fees, and curricula
  12. **Packages & Pricing:** Manage tiers, discount savings, badges, and billing periods
  13. **FAQs Manager:** Expandable question & answer items
  14. **WhatsApp & Contact:** Phone numbers, automated WhatsApp inquiry templates, and incoming contact form applications inbox
  15. **Social Media:** Links to Instagram, YouTube, TikTok, and Facebook
  16. **SEO Settings:** Meta titles, descriptions, keywords, Open Graph image, and Google search preview
  17. **General Settings:** Brand name, browser title, custom logo, and favicon
  18. **Admin Security:** Change username and update password

---

## 🛠 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with custom liquid glass and CSS custom property architecture
- **Database ORM:** Prisma ORM with SQLite (Default `file:./dev.db`, easily switchable to PostgreSQL)
- **Authentication:** `bcryptjs` for password hashing & `jsonwebtoken` for secure session cookies
- **Icons:** Lucide React

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ (tested on v26.8.1)
- npm or yarn

### 2. Installation
Clone or navigate to the project directory:
\`\`\`bash
cd "d:\WebSite Work Protfolio\Built By Boyka"
npm install
\`\`\`

### 3. Environment Variables
Create a `.env` file in the root directory (already provided):
\`\`\`env
# Database (SQLite default for zero-setup local dev)
DATABASE_URL="file:./dev.db"

# Admin Authentication & Security
JWT_SECRET="built-by-boyka-super-secure-jwt-secret-key-2026-production-ready"
ADMIN_DEFAULT_USERNAME="Boyka"
ADMIN_DEFAULT_PASSWORD="Boyka1234"

# Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
\`\`\`

### 4. Database Setup & Seeding
Initialize the database tables and populate production data:
\`\`\`bash
npx prisma db push
node prisma/seed.js
\`\`\`

### 5. Running the Application
Development mode:
\`\`\`bash
npm run dev
\`\`\`
Production build:
\`\`\`bash
npm run build
npm run start
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Admin Dashboard Credentials

Access the dashboard at: [http://localhost:3000/admin](http://localhost:3000/admin)

- **Default Username:** `Boyka`
- **Default Password:** `Boyka1234`

*(You can update both your username and password securely anytime inside **Admin Security**).*

---

## 📱 WhatsApp Integration Details

- **Default Local Number:** `01140108262`
- **Default International Format:** `+201140108262`
- **WhatsApp URL:** `https://wa.me/201140108262`
- **Message Templates:**
  - *General Inquiry:* `"Hello Built By Boyka, I would like to know more about your coaching services."`
  - *Package Inquiry:* `"Hello Built By Boyka, I'm interested in the [Package Name] package. Please send me more details."`
  - *Service Inquiry:* `"Hello Built By Boyka, I'm interested in [Service Name]. Could you provide more information?"`

All buttons dynamically read from the database settings, so changing the number in the dashboard updates all links across the website instantly.

---

## 🚢 Production Deployment

### Option A: Vercel / Railway / Render
1. Push repository to GitHub.
2. In your hosting provider (e.g. Vercel or Railway), add the environment variables from `.env`.
3. If using PostgreSQL, update `provider = "postgresql"` in `prisma/schema.prisma` and supply the `DATABASE_URL`.
4. Deploy!

### Option B: Self-Hosted Docker or Node.js Server
\`\`\`bash
npm run build
NODE_ENV=production npm run start
\`\`\`
