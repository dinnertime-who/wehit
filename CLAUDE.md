# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Package Manager
This project uses **pnpm** (not npm or yarn). All scripts must be run with `pnpm`:

- **Development**: `pnpm dev` - Start Next.js dev server on port 3000
- **Build**: `pnpm build` - Create production build
- **Production**: `pnpm start` - Start production server
- **Linting & Formatting**:
  - `pnpm lint` - Run Biome linter (checks code style and issues)
  - `pnpm format` - Auto-format code with Biome
- **Authentication**: `pnpm auth:generate` - Generate authentication schema from Better-auth config (run after modifying `/src/lib/auth/auth.ts`)

## Architecture Overview

The project is a **Next.js 16 full-stack application** with a layered architecture:

### Directory Structure
- `/src/app` - Next.js App Router (pages and API routes)
  - `/app/admin` - Admin dashboard routes
  - `/app/(platform)` - Public platform routes
  - `/app/api` - API endpoints
- `/src/components` - React components
  - `/components/ui` - Radix UI base components
  - `/components/reusable` - Shared UI components
- `/src/features` - Feature modules organized by clean architecture
  - Each feature contains: `interfaces/`, `repositories/`, `schemas/`, `services/`
- `/src/infrastructure` - External integrations
  - `/infrastructure/db` - Database (Drizzle ORM + PostgreSQL)
  - `/infrastructure/notification` - Email notifications (SMTP)
  - `/infrastructure/storage` - AWS S3/R2 storage
- `/src/lib` - Shared utilities and core libraries
  - `/lib/auth` - Better-auth configuration (handles email/password + OAuth)
  - `/lib/fetch` - HTTP client (Ky)
  - `/lib/abilities` - CASL-based access control
- `/src/hooks` - Custom React hooks
  - `/hooks/apis` - API-related hooks (query/mutation hooks)
  - `/hooks/stores` - Zustand store hooks
  - `/hooks/nuqs` - URL query parameter hooks
- `/src/config` - Global configuration
  - `/config/env` - Environment variable validation (Zod schemas)
  - `/config/react-query` - React Query setup
  - `/config/font` - Font configuration
- `/src/shared` - Shared types and constants across the app

### Authentication Flow (Better-auth)
- Email/password and OAuth (Google, Naver, Kakao) authentication
- Configured in `/src/lib/auth/auth.ts`
- Uses Drizzle adapter for database storage
- Redis for session storage (secondary storage)
- Sessions expire in 1 day, refresh every 12 hours
- Run `pnpm auth:generate` after modifying auth config to regenerate schema

### Data Management
- **Database**: PostgreSQL with Drizzle ORM (`/src/infrastructure/db/drizzle.ts`)
- **Query**: React Query (TanStack Query) for server state
- **Client State**: Zustand for global client state
- **Cache**: Redis for session and secondary storage
- **API Fetching**: Ky HTTP client with environment-based URL (`publicEnv.NEXT_PUBLIC_API_URL`)

### Environment Configuration
Located in `/src/config/env/index.ts` with Zod validation:

**Server-side (required)**:
- `DATABASE_URL` - PostgreSQL connection
- `REDIS_URL` - Redis connection
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` - Email config
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `R2_ACCOUNT_ID` - S3/R2 storage
- OAuth credentials: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NAVER_CLIENT_ID`, `NAVER_CLIENT_SECRET`, `KAKAO_CLIENT_ID`, `KAKAO_CLIENT_SECRET`

**Public/Client-side**:
- `NEXT_PUBLIC_URL` - Application base URL
- `NEXT_PUBLIC_API_URL` - API endpoint URL
- `NEXT_PUBLIC_IMAGE_HOST` - Image hosting domain for Next.js Image optimization

### UI & Styling
- **Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS v4 with Tailwind Merge
- **Components**: Radix UI (accessible component primitives)
- **Icons**: Lucide React
- **Forms**: TanStack React Form
- **Tables**: TanStack React Table
- **Validation**: Zod for schema validation
- **Theme**: Next-themes for dark mode support
- **Notifications**: Sonner for toast notifications

### Code Quality
- **Formatter/Linter**: Biome v2.2.0 (configured in `biome.json`)
  - ESLint-like rules for React, Next.js
  - Auto-import organization
  - 2-space indentation
- **Compiler**: React Compiler (Babel) enabled
- **TypeScript**: Strict mode enabled, paths aliased to `@/*`

### Code Style Guidelines
- **Language**: All responses, comments, and commit messages should be written in Korean (한글)
- **TypeScript Types**: Prefer `type` keyword over `interface`
  - ✅ Good: `type User = { id: string; name: string }`
  - ❌ Avoid: `interface User { id: string; name: string }`
  - Exception: Use `interface` only when type extension or declaration merging is needed
- **CLAUDE.md Editing**: All edits to this CLAUDE.md file must be written in English

### Important Notes
- The app uses a two-tier routing system:
  - Admin dashboard (`/admin`) - authenticated admin routes
  - Platform (`/`) - public platform routes
- Biome is used instead of ESLint/Prettier - all code must follow Biome rules
- All authentication is handled through Better-auth - don't create custom auth
- Environment variables are validated at runtime with Zod - missing variables will cause startup failures
- The project uses React 19 with automatic JSX transform (no `import React` needed)
- Experimental features enabled: React Compiler, View Transitions, Typed Routes

### Development Workflow
1. Make code changes
2. Run `pnpm format` to ensure code follows Biome style
3. Run `pnpm lint` to check for issues
4. Run `pnpm dev` to test locally
5. Commit changes (formatting is auto-organized by Biome)

### Common Tasks
- **Add a new page**: Create file in `/src/app` following Next.js conventions
- **Add a new API endpoint**: Create route handler in `/src/app/api`
- **Add a new feature**: Create directory in `/src/features` with clean architecture layers
- **Add authentication to a route**: Use Better-auth session via hooks in `/src/hooks/apis/auth/`
- **Add a database table**: Define schema in `/src/infrastructure/db/schema/`, then run `pnpm build`
- **Add a new environment variable**: Add to schema in `/src/config/env/index.ts`

## Implemented Features

### Banner Feature
A comprehensive banner management system for displaying promotional content with date-based activation.

#### Database Schema (`/src/infrastructure/db/schema/banner.schema.ts`)
- **banner** table:
  - `id`: CUID primary key
  - `slug`: Unique identifier for banner queries
  - `widthRatio`: Aspect ratio width
  - `heightRatio`: Aspect ratio height
  - `displayDevice`: Enum - "mobile", "desktop", "all"
  - `createdAt`, `updatedAt`: Timestamps

- **banner_item** table:
  - `id`: CUID primary key
  - `bannerId`: Foreign key to banner (cascade delete)
  - `imageUrl`: Banner image URL
  - `linkUrl`: Click destination URL
  - `order`: Display order
  - `viewStartDate`: Optional activation start date
  - `viewEndDate`: Optional activation end date
  - `createdAt`, `updatedAt`: Timestamps

#### API Endpoints
All endpoints include `TODO: 권한 검증 추가 (admin only)` comments for permission implementation.

**Banner Management:**
- `GET /api/banners` - List all banners
- `POST /api/banners` - Create banner
- `GET /api/banners/[id]` - Get specific banner
- `PUT /api/banners/[id]` - Update banner
- `DELETE /api/banners/[id]` - Delete banner
- `GET /api/banners/slug/[slug]` - Get banner with active items by slug (date-filtered)

**Banner Item Management:**
- `GET /api/banners/[id]/items` - List items for banner
- `POST /api/banners/[id]/items` - Create banner item
- `GET /api/banners/items/[itemId]` - Get specific item
- `PUT /api/banners/items/[itemId]` - Update item
- `DELETE /api/banners/items/[itemId]` - Delete item

#### Clean Architecture Layers
Located in `/src/features/banner/`:
- **interfaces/** - `IBannerRepository`, `IBannerService` abstractions
- **repositories/** - `BannerRepository` - Database access layer
- **services/** - `BannerService` - Business logic (date-based filtering, etc.)
- **schemas/** - Zod validation schemas for DTOs

#### React Query Hooks (`/src/hooks/apis/banners/`)
- `useBanners()` - Fetch all banners
- `useBanner(id)` - Fetch specific banner
- `useBannerBySlug(slug)` - Fetch banner with active items by slug
- `useCreateBanner()` - Mutation: create banner
- `useUpdateBanner(id)` - Mutation: update banner
- `useDeleteBanner(id)` - Mutation: delete banner
- `useCreateBannerItem(bannerId)` - Mutation: create item
- `useUpdateBannerItem(itemId)` - Mutation: update item
- `useDeleteBannerItem(itemId)` - Mutation: delete item

**Usage Example:**
```typescript
import { useBannerBySlug } from '@/hooks/apis/banners/use-banner-by-slug';

// In component
const { data: banner, isLoading } = useBannerBySlug('hero-banner');
// banner includes: banner data + active items (filtered by date)
```

#### Key Features
- ✅ Automatic date-based item activation filtering in service layer
- ✅ Proper sorting by `order` field in repository
- ✅ Typed routes using `RouteContext<"/api/banners/[id]">` pattern
- ✅ Ky HTTP client for API calls with generic return types
- ✅ Proper cascade deletion via Drizzle ORM
- ✅ Full CRUD operations for both banners and items

#### Implementation Notes
- All route handlers use Next.js 15+ typed routes with `RouteContext`
- Params are handled as `Promise` types (await params before destructuring)
- HTTP client uses `kyClient` from `/src/lib/fetch/client` with prefixed URLs
- All mutations include React Query cache invalidation on success
- Banner items are automatically filtered by `viewStartDate` and `viewEndDate` in `getActiveBannerItems()`
