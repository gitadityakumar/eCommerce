<div align="center">
  <br />
    <a href="#">
      <img src="public/readme/banner.png" alt="PreetyTwist E-Commerce Platform Banner">
    </a>
  <br />

  <div>
    <img src="https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6"/>
    <img src="https://img.shields.io/badge/Next.js-000?style=for-the-badge&logo=next.js&logoColor=white">
    <img src="https://img.shields.io/badge/-Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
    <img src="https://img.shields.io/badge/-Better Auth-black?style=for-the-badge&logoColor=white&logo=betterauth&color=black"/>
    <img src="https://img.shields.io/badge/-Drizzle-black?style=for-the-badge&logoColor=C5F74F&logo=drizzle&color=black"/>
    <img src="https://img.shields.io/badge/-PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white"/>
  </div>

  <h3 align="center">PreetyTwist E-Commerce Platform</h3>
  <p align="center">
    A high-performance, modern e-commerce solution engineered for scalability and seamless user experience.
  </p>
</div>

## Table of Contents

1. [Overview](#overview)
2. [Architecture & Tech Stack](#architecture--tech-stack)
3. [Key Features](#key-features)
4. [Getting Started](#getting-started)
5. [Project Structure](#project-structure)
6. [Database Schema](#database-schema)

## <a name="overview">Overview</a>

This project represents a production-grade e-commerce application built on the Next.js 15 framework. It leverages a modern, type-safe stack to deliver a robust shopping experience, featuring server-side rendering for SEO optimization, secure authentication flows, and a responsive implementation of the PreetyTwist design language.

The platform is designed with modularity in mind, utilizing a component-based architecture and a scalable backend infrastructure powered by Neon PostgreSQL and Drizzle ORM.

## <a name="architecture--tech-stack">Architecture & Tech Stack</a>

The application is built on a full-stack Next.js architecture, ensuring optimal performance through hybrid rendering strategies (SSR/SSG).

### Core Framework

- **[Next.js 16](https://nextjs.org/)**: React framework for production, utilizing App Router and Server Actions.
- **[TypeScript](https://www.typescriptlang.org/)**: Comprehensive static typing for enhanced code quality and maintainability.
- **[React 19](https://react.dev/)**: Latest React features including Server Components and Suspense.

### Styling & UI

- **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first CSS framework for rapid, responsive UI development.
- **[Lucide React & Tabler Icons](https://lucide.dev/)**: Consistent and lightweight icon library.

### Backend & Database

- **[Drizzle ORM](https://orm.drizzle.team/)**: Type-safe ORM for efficient database queries and migrations.
- **[Neon PostgreSQL](https://neon.com/)**: Serverless Postgres database with autoscaling capabilities.
- **[Better Auth](https://www.better-auth.com/)**: Comprehensive authentication solution handling OAuth and credential flows.
- **[Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/)**: S3-compatible object storage for assets and media.

### Email & Documents

- **[ZeptoMail](https://www.zoho.com/zeptomail/)**: Transactional email service for reliable delivery.
- **[React PDF](https://react-pdf.org/)**: PDF generation for digital receipts and documents.

### State Management

- **[Zustand](https://zustand-demo.pmnd.rs)**: Lightweight, transient-state management store.

## <a name="key-features">Key Features</a>

- **Performance-First Experience**: Optimized Core Web Vitals with image optimization, code splitting, and dynamic imports..
- **Secure Authentication**: Multi-provider support (Google, GitHub, Email/Password) with session management via Better Auth.
- **Cart & Checkout Flow**: Persistent shopping cart state managed via Zustand with seamless transition to order processing.
- **Digital Receipts**: Automated PDF receipt generation for completed orders.
- **Transactional Emails**: Automated email notifications using ZeptoMail.
- **Responsive Design**: Mobile-first approach ensuring consistency across all device viewports.
- **Real-time Database Interactions**: Efficient data fetching and mutations using Server Actions.

## <a name="getting-started">Getting Started</a>

Review the prerequisites and follow the steps below to deploy the development environment locally.

### Prerequisites

- **Node.js**: v18.17.0 or higher
- **Package Manager**: npm, pnpm, or yarn
- **Git**: Version control system

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/gitadityakumar/eCommerce
   cd eCommerce
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory and configure the following variables:

   ```env
   # Database Connection
   DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"

   # Authentication (Better Auth)
   BETTER_AUTH_SECRET="your-generated-secret-key"
   BETTER_AUTH_URL="http://localhost:3000"

   # Cloudflare R2 (Storage)
   R2_ACCESS_KEY_ID="your-r2-access-key"
   R2_SECRET_ACCESS_KEY="your-r2-secret-key"
   R2_ENDPOINT="your-r2-endpoint"
   R2_BUCKET="your-bucket-name"

   # ZeptoMail (Email)
   ZEPTOMAIL_API_KEY="your-zeptomail-api-key"
   ZEPTOMAIL_FROM_EMAIL="noreply@yourdomain.com"
   ZEPTOMAIL_FROM_NAME="Your Store Name"
   ZEPTOMAIL_BASE_URL="https://api.zeptomail.in/v1.1/email"

   # Postal API
   NEXT_PUBLIC_POSTAL_PINCODE_API_URL="https://api.postalpincode.in/pincode"

   # Payments (PhonePe)
   PHONEPE_CLIENT_ID="your-client-id"
   PHONEPE_CLIENT_SECRET="your-client-secret"
   PHONEPE_CLIENT_VERSION="1"
   PHONEPE_BASE_SANDBOX_URL="https://api-preprod.phonepe.com/apis/pg-sandbox"

   # Shiprocket
   SHIPROCKET_EMAIL="your-email"
   SHIPROCKET_PASSWORD="your-password"
   ```

4. **Initialize Database**
   Push the schema to your database instance:

   ```bash
   npm run db:push
   ```

5. **Start Development Server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`.

## <a name="project-structure"> Project Structure</a>

The codebase follows a scalable feature-based structure within the `src` directory.

```
src/
├── app/                  # Next.js App Router (Pages & API)
│   ├── (auth)/           # Authentication routes group
│   ├── (shop)/           # E-commerce main routes
│   └── api/              # API Routes (Auth, Webhooks)
├── components/           # Reusable UI components
│   ├── ui/               # Design system primitives
│   └── shared/           # Business logic components
├── lib/                  # Core libraries and configuration
│   ├── auth.ts           # Authentication logic
│   ├── db/               # Database client & Schema definitions
│   └── utils.ts          # Helper utility functions
└── store/                # Global state stores (Zustand)
```

---
