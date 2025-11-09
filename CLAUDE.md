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

### Server-Side Rendering (SSR) Pattern
React Query integration with Next.js Server Components for optimal performance:

**Architecture Pattern:**
1. Export `queryOptions` from hook files with queryKey and queryFn
2. Create QueryClient on server using `makeQueryClient()`
3. Prefetch data on server using `queryClient.ensureQueryData(queryOptions())`
4. Dehydrate QueryClient state with `dehydrate(queryClient)`
5. Hydrate on client using `<HydrationBoundary state={dehydrate(queryClient)}>`

**Key Components:**
- `/src/config/react-query/query-client.ts` - `makeQueryClient()` factory (staleTime: 60s)
- React Query `queryOptions()` - Separates queryKey/queryFn for reuse
- `HydrationBoundary` from @tanstack/react-query - Bridges server/client state

**Implementation Example:**
```typescript
// Hook file exports queryOptions for server usage
export const bannerBySlugQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["banner", "slug", slug] as const,
    queryFn: async () => {
      return kyClient.get(`banners/slug/${slug}`).json<BannerWithItems>();
    },
  });

// Server Component prefetches data
export default async function Page() {
  const queryClient = makeQueryClient();

  await queryClient.ensureQueryData(
    bannerBySlugQueryOptions("main-hero-banner")
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientComponent />
    </HydrationBoundary>
  );
}

// Client Component uses same hook without refetch
function ClientComponent() {
  const { data } = useBannerBySlug("main-hero-banner");
  // Data is already cached from server prefetch
}
```

**Benefits:**
- Zero waterfall: Data fetched during Server Component render
- Reduced client-side loading states
- SEO-friendly with prerendered data
- Automatic client hydration without refetch

### TanStack React Form Pattern
Headless form library for type-safe, performant forms with validation:

**Key Concepts:**
- `useForm()` - Form state management hook
- `form.Field` - Individual field component with render prop
- `validators` - Zod schema or custom validators
- Real-time validation on onChange/onBlur
- Framework-agnostic (works with any UI library)

**Implementation Example:**
```typescript
// Schema definition with Zod
const formSchema = z.object({
  email: z.email("유효한 이메일을 입력해주세요"),
  password: z.string().min(6, "최소 6자 이상"),
});

// Form component
export const MyForm = () => {
  const mutation = useSomeMutation();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: formSchema, // Submit validation
    },
    onSubmit: async ({ value }) => {
      const result = await mutation.mutateAsync(value);

      if (result.error) {
        toast.error(result.error.message);
        return;
      }

      toast.success("성공했습니다");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      <form.Field
        name="email"
        validators={{
          onChange: formSchema.shape.email, // Real-time validation
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              disabled={mutation.isPending}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-red-500">
                {field.state.meta.errors[0]?.message}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <Button
        type="submit"
        disabled={mutation.isPending || !form.state.isFormValid}
      >
        {mutation.isPending && <Spinner className="mr-2 h-4 w-4" />}
        {mutation.isPending ? "진행 중..." : "제출"}
      </Button>
    </form>
  );
};
```

**Validator Usage Patterns:**

Form-level validation (onSubmit):
```typescript
const form = useForm({
  validators: {
    onSubmit: formSchema, // Validate entire form on submit
  },
  onSubmit: async ({ value }) => { /* ... */ },
});
```

Field-level real-time validation (onChange):
```typescript
<form.Field
  name="email"
  validators={{
    onChange: formSchema.shape.email, // Extract field validator from schema
  }}
>
  {(field) => (
    // field.state.value, field.handleChange(), field.handleBlur()
  )}
</form.Field>
```

**Validator Rules:**
- `onSubmit: formSchema` - Full form validation triggered on form submission
- `onChange: formSchema.shape.fieldName` - Real-time field validation as user types
- Use Zod schema `.shape` property to extract individual field validators
- Both can be combined for UX: onChange for feedback, onSubmit for final validation
- Errors accessed via `field.state.meta.errors` (array of error messages)

**Best Practices:**
- Always combine both `onChange` + `onSubmit` validators
- Use `!form.state.isFormValid` to disable submit button
- Use `mutation.isPending` to disable all inputs during submission
- Wrap form components in Client Component ("use client")
- Keep form logic in separate component from layout

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
  - **IMPORTANT**: kyClient is configured with `NEXT_PUBLIC_API_URL` as `prefixUrl`
  - Do NOT include "api/" prefix in requests
  - ✅ Correct: `kyClient.get("banners")`, `kyClient.post("banners", { json: data })`
  - ❌ Incorrect: `kyClient.get("api/banners")`, `kyClient.post("api/banners", { json: data })`
  - All return types use `.json<Type>()` for generic typing
- All mutations include React Query cache invalidation on success
- Banner items are automatically filtered by `viewStartDate` and `viewEndDate` in `getActiveBannerItems()`

#### Seed Data
Located in `/src/infrastructure/db/seed/`:
- **banner-seed.ts** - Banner seed logic with MAIN_HERO_BANNER initialization
- **index.ts** - Main seed execution file

**Seed Command:**
```bash
pnpm db:seed
```

**Initial Data (MAIN_HERO_BANNER):**
- Banner: 1920x400, displayDevice: "all", slug: "main-hero-banner"
- Banner Items: 6 items with Unsplash 1920x400 images
  - All items link to `NEXT_PUBLIC_URL` (main page)
  - Always active (no date restrictions)
  - Ordered 0-5 for carousel display

**Setup Steps:**
```bash
pnpm install              # Install tsx dependency
pnpm build                # Generate Drizzle migrations
pnpm db:seed              # Initialize banner seed data
```

### Admin Sign-In Feature
Email/password authentication form for admin dashboard access.

#### Components
- **SignInForm** (`/src/components/reusable/admin/sign-in-form.tsx`)
  - Client component ("use client") using TanStack Form
  - Zod schema validation for email and password
  - Both `onChange` (real-time) and `onSubmit` validators
  - Integrated with `useAuth().emailPassword` mutation
  - Toast notifications for success/error feedback
  - Redirects to `/admin` on successful login
  - Loading state management with `mutation.isPending`

#### Page
- **Admin Sign-In Page** (`/src/app/admin/sign-in/page.tsx`)
  - Server component (no "use client") for routing
  - Full-height centered layout with gradient background
  - Imports and renders `SignInForm` component
  - Added `export const dynamic = "force-dynamic"` to platform page

#### UI Components Used
- `Card`, `CardHeader`, `CardTitle`, `CardContent` from Radix UI
- `Input`, `Label`, `Button` from UI library
- `Spinner` for loading indicator
- `Toaster` from Sonner for notifications

#### Authentication Flow
1. User enters email/password on sign-in form
2. Form validates with Zod schema on change and submit
3. On submit, calls `emailPassword.mutateAsync(value)` from Better-auth
4. Success: Toast notification + redirect to `/admin`
5. Error: Toast notification with error message
6. Loading: Inputs disabled, button shows spinner

#### Key Patterns
- Form component fully separated from page component
- Validation split: `onChange` for UX, `onSubmit` for final check
- Mutation error handling: Check `result.error` before redirecting
- Router usage: `useRouter()` from `next/navigation` for Client Component

#### Root Layout Update
- Added `<Toaster />` component to `/src/app/layout.tsx`
- Enables Sonner toast notifications globally
- Placed after `<DialogService />` component

#### Platform Page Update
- Added `export const dynamic = "force-dynamic"` to `/src/app/(platform)/page.tsx`
- Ensures fresh data fetch for main hero banner on each request
- Prevents stale cache issues with dynamic banner content

### Platform Sign-In Feature
Public-facing sign-in page with OAuth and email/password authentication.

#### Architecture Pattern
Uses reusable form component architecture:
- **SignInAppForm** (`/src/components/reusable/forms/sign-in-form.tsx`) - Core logic
  - Shared between Platform and Admin routes
  - Props: `redirectTo` (redirect path), `onSuccess` (callback)
  - Encapsulates all TanStack Form logic and mutations

- **SignInForm** (`/src/components/reusable/platform/sign-in-form.tsx`) - Wrapper
  - Thin wrapper for platform route
  - Passes `redirectTo="/"` to SignInAppForm
  - Platform-specific configuration

- **Admin SignInForm** (`/src/components/reusable/admin/sign-in-form.tsx`) - Wrapper
  - Thin wrapper for admin route
  - Passes `redirectTo="/admin"` to SignInAppForm
  - Admin-specific styling (Card component)

#### Components

**OAuthButtons** (`/src/components/reusable/platform/oauth-buttons.tsx`)
- Three OAuth provider buttons: Google, Kakao, Naver
- Uses `react-icons` library (`FaGoogle`, `RiKakaoTalkFill`, `SiNaver`)
- Calls `useAuth().oauth.mutateAsync(provider)` with provider name
- Custom styling for each provider (Google outline, Kakao yellow, Naver green)
- Disabled during oauth pending state

**SignInAppForm** Core Features:
- Email/password validation with Zod
- TanStack Form with `onChange` + `onSubmit` validators
- Optional redirect after successful login
- Optional onSuccess callback hook
- Loading state with spinner
- Error toast notifications

#### Pages

**Platform Sign-In Page** (`/src/app/(platform)/sign-in/page.tsx`)
- Full-height centered layout
- Header with title and subtitle
- White card container with shadow
- OAuth buttons section
- Divider line ("또는")
- Email/password form (SignInAppForm)
- Sign-up link in footer
- Responsive design with mobile padding

#### Layout Updates

**Platform Layout** (`/src/app/(platform)/layout.tsx`)
- Changed from Suspense to Server Component with HydrationBoundary
- Server-side session prefetch using `sessionQueryOptions`
- Query client dehydration with React Query
- Session data available to Header on initial load

#### Header Component Updates (`/src/components/reusable/platform/header.tsx`)
- Changed to Client Component ("use client")
- Uses `useSession()` hook to check authentication state
- Conditional rendering:
  - Not authenticated: "로그인" link
  - Authenticated: "마이페이지" link + Logout button (LogOut icon from lucide-react)
- Uses `useAuth().signOut.mutateAsync()` for logout
- Session prefetch from layout prevents data waterfall

#### Dependencies
- Added `react-icons@^5.5.0` for OAuth provider icons
- Uses existing: Sonner (toasts), TanStack Form, Zod

#### Key Patterns
- **Reusable Form Component**: SignInAppForm is DRY (Don't Repeat Yourself)
  - Admin and Platform both wrap it with their own configuration
  - Easy to add new auth routes

- **Session State Management**:
  - Platform layout prefetches session on server
  - Client components use `useSession()` hook for authentication state
  - Prevents waterfall data loading

- **OAuth Integration**:
  - Centralized in OAuthButtons component
  - Uses `useAuth().oauth.mutateAsync(provider)` mutation
  - Provider names: "google" | "kakao" | "naver"

- **Two-Step Auth Layout**:
  - OAuth buttons first (quick login)
  - Email/password as alternative
  - Standard UX pattern for modern apps

### Admin Dashboard Layout
Complete admin dashboard with sidebar navigation and header.

#### Components

**AdminSidebar** (`/src/components/reusable/admin/sidebar.tsx`)
- Client Component ("use client")
- Sidebar structure with organized menu groups
- SidebarHeader: Logo only (WeHit branding)
- Menu structure (4 groups):
  - **개요 (Overview)**: Dashboard
  - **사용자 (Users)**: User Management
  - **컨텐츠 관리 (Contents)**: Services, Reviews, Banners, Notices
  - **시스템 (System)**: Settings
- Active state detection using `usePathname()` comparison
  - Compares current path against menu href
  - Highlights matching route
- Sidebar Footer with user dropdown menu:
  - Avatar with user initials (fallback from session)
  - User name + email from session data
  - Dropdown items: Settings link, Logout action
  - Uses `useAuth().signOut.mutateAsync()` for logout
- Icon integration using lucide-react (LayoutDashboard, Users, Briefcase, Star, Image, Megaphone, Settings)

**AdminHeader** (`/src/components/reusable/admin/header.tsx`)
- Client Component ("use client")
- Sticky header (top-0, z-40, h-16) with border-b
- Currently renders:
  - SidebarTrigger with -ml-1 offset (hamburger menu for sidebar toggle)
- pathConfig preserved for future breadcrumb implementation
- Expandable for breadcrumb or page title navigation

#### Layout Implementation

**Admin Dashboard Layout** (`/src/app/admin/(dashboard)/layout.tsx`)
- Server Component for session prefetch
- **TODO**: Session check and admin role validation
- Session data prefetch using `sessionQueryOptions`
- HydrationBoundary for client-side session access
- SidebarProvider wrapping entire layout
- Main content area: SidebarInset + AdminHeader + children
- Responsive: sidebar collapses to sheet on mobile

#### Dashboard Home Page
Placeholder metrics grid:
- Active Users
- Total Services
- Total Reviews
- Total Notices

#### Navigation Structure
```
/admin/(dashboard)/
├── page.tsx             # Dashboard home with metrics
├── users/page.tsx       # User management
├── services/page.tsx    # Service management
├── reviews/page.tsx     # Review management
├── banners/page.tsx     # Banner management
├── notices/page.tsx     # Notice management
└── settings/page.tsx    # Admin settings
```

#### Keyboard Shortcut
- **Cmd/Ctrl + B**: Toggle sidebar (open/collapse)

#### Menu Icons
- LayoutDashboard: Dashboard
- Users: User Management
- Briefcase: Services
- Star: Reviews
- Image: Banners
- Megaphone: Notices
- Settings: Settings

#### Sidebar Configuration
- Width (desktop): 14rem (224px)
- Width (mobile): 18rem (288px)
- Icon-only width (collapsed): 3rem (48px)
- Keyboard shortcut: Cmd/Ctrl + B to toggle
- Responsive: Sheet drawer on mobile devices
- Cookie persistence: Remembers sidebar state (7-day max age)

#### Key Features
- Active menu highlighting based on current pathname
- User avatar with fallback initials
- Responsive design: sidebar drawer on mobile
- Session data pre-fetched from server
- User logout via Better-auth mutation
- Clean header with sidebar toggle
- Expandable to include breadcrumb/page title navigation

### Admin Banners Page
배너 관리 페이지로 배너 목록을 테이블 형태로 표시.

#### Files Structure
```
/src/app/admin/(dashboard)/banners/
├── page.tsx                    # 메인 페이지 (h1 + 테이블)
├── columns.tsx                 # TanStack Table 컬럼 정의
├── banner-row-actions.tsx     # 행별 액션 버튼 (Popover)
└── banners-data-table.tsx     # 테이블 컴포넌트
```

#### Components

**BannersDataTable** (`banners-data-table.tsx`)
- Client Component ("use client")
- TanStack Table 통합
- Columns: 배너 이름(slug), 비율(widthRatio × heightRatio), 노출 기기(displayDevice), 생성일, Actions
- Pagination: 페이지당 10개 배너
- 로딩 상태: "배너 목록을 로드 중입니다..."
- 빈 상태: "배너가 없습니다"
- 페이지네이션 컨트롤: 이전/다음 버튼 + 페이지 정보

**BannerRowActions** (`banner-row-actions.tsx`)
- 각 행 우측 액션 버튼 (MoreVertical 아이콘)
- Popover 내부 메뉴:
  - **수정**: Link to "#" (Edit 아이콘) - 향후 수정 페이지로 이동
  - **Separator**
  - **삭제**: 클릭 시 `useDialogService().confirm()` 호출
- 삭제 플로우:
  - Confirm 다이얼로그: "정말 이 배너를 삭제하시겠습니까?"
  - 확인 시 `useDeleteBanner().mutateAsync()` 호출
  - 성공: toast notification + Popover 닫음
  - 실패: toast error
- 로딩 상태: 삭제 중에 버튼 disabled + "삭제 중..." 텍스트

**Table Columns** (`columns.tsx`)
- **배너 이름** (slug): font-medium 스타일
- **비율**: "widthRatio × heightRatio" 포맷
- **노출 기기**: mobile/desktop/all → 모바일/데스크톱/전체로 변환
- **생성일**: YYYY-MM-DD 포맷 (date-fns format 사용)
- **Actions**: BannerRowActions 컴포넌트 렌더링

**AdminBannersPage** (`page.tsx`)
- Server Component (기본값)
- h1 제목: "배너 관리"
- 설명: "배너 목록을 보고 관리할 수 있습니다"
- BannersDataTable 컴포넌트 임베드

#### Hooks Integration
- `useBanners()`: Banner[] 데이터 fetch
- `useDeleteBanner(id)`: 배너 삭제 mutation
- `useDialogService().confirm()`: asyncConfirm 역할

#### UI Libraries Used
- **TanStack Table**:
  - `useReactTable`, `ColumnDef`, `flexRender`
  - `getCoreRowModel`, `getPaginationRowModel`
- **UI Components**: Table, Button, Popover, Separator
- **Icons**: MoreVertical, Edit, Trash, ChevronLeft, ChevronRight (lucide-react)
- **Notifications**: sonner (toast)
- **Date**: date-fns (format 함수, ko locale)

#### Key Features
- **TanStack Table**: Server-side state와 independent pagination 구현
- **Row Actions**: Popover 패턴으로 수정/삭제 메뉴 구현
- **Delete Flow**: Confirm 다이얼로그로 사용자 확인 후 삭제
- **Loading States**: 삭제 중 버튼 disabled 처리
- **Error Handling**: API 오류 시 toast error 표시
- **Date Formatting**: 생성일을 사용자 친화적 포맷으로 표시
- **Responsive**: 모바일 환경에서도 테이블 scrollable

#### Excluded Features (As Requested)
❌ 필터 기능
❌ Metric UI (통계 카드)
❌ Breadcrumb 네비게이션

### Service Feature
Comprehensive service management system with CRUD operations, media uploads, and tutor-led service offerings.

#### Database Schema (`/src/infrastructure/db/schema/service.schema.ts`)
- **service** table:
  - `id`: CUID primary key
  - `title`: Service name
  - `subtitle`: Optional subtitle
  - `category`: Service category (programming, design, marketing, business, etc)
  - `tutorInfo`: Tutor information/description
  - `coverImageUrl`: Cover image URL (required)
  - `coverVideoUrl`: Optional cover video URL
  - `description`: Detailed description (rich HTML from Tiptap)
  - `price`: Regular price (integer, positive)
  - `salePrice`: Optional discounted price
  - `createdAt`, `updatedAt`: Timestamps

- **review** table:
  - `id`: CUID primary key
  - `serviceId`: Foreign key to service (cascade delete)
  - `rating`: Review rating (1-5)
  - `comment`: Review text
  - `createdAt`, `updatedAt`: Timestamps

- **site_setting** table:
  - `id`: CUID primary key
  - `key`: Setting key (unique)
  - `value`: JSON setting value
  - `createdAt`, `updatedAt`: Timestamps

#### File Upload Pattern

**Upload Hooks** (`/src/hooks/apis/upload/`)
- **useUploadImage**: Mutation hook for image uploads
  - Accepts: `File` object
  - Returns: `{ imageUrl: string }`
  - Uses: `kyClient.post("upload", { body: formData })`
  - Returns: `.json<UploadImageResponse>()`

- **useUploadVideo**: Mutation hook for video uploads
  - Accepts: `File` object
  - Returns: `{ videoUrl: string }`
  - Uses: `kyClient.post("upload", { body: formData })`
  - Maps API response: `imageUrl` → `videoUrl` field
  - Pattern:
    ```typescript
    const response = await kyClient
      .post("upload", { body: formData })
      .json<{ imageUrl: string }>();
    return { videoUrl: response.imageUrl };
    ```

**Key Pattern**: Single upload endpoint returns `{ imageUrl }` field. Upload hooks normalize response to match their purpose (`imageUrl` for images, `videoUrl` for videos).

#### Unified Create/Edit Form Pattern

**ServiceForm Component** (`/src/components/reusable/admin/services/detail/service-form.tsx`)
- Client Component ("use client")
- Props: `mode: "create" | "edit"`, `service?: Service`
- Single component handles both creation and editing via `mode` discrimination
- Zod schema validation with file size and format constraints:
  - Image: 10MB max, JPEG/PNG/WEBP formats
  - Video: 100MB max, MP4/WebM formats
- Form sections: Basic Info, Tutor Info, Media, Description, Pricing

**Key Patterns**:

1. **Conditional Default Values**:
   ```typescript
   defaultValues: {
     title: service?.title || "",
     subtitle: service?.subtitle || "",
     // ... other fields
   } as ServiceFormValues
   ```

2. **Upload Hook Usage**:
   ```typescript
   const uploadImageMutation = useUploadImage();
   const uploadVideoMutation = useUploadVideo();

   // In onSubmit
   if (value.coverImage) {
     const uploadResult = await uploadImageMutation.mutateAsync(value.coverImage);
     coverImageUrl = uploadResult.imageUrl;
   }
   if (value.coverVideo) {
     const uploadResult = await uploadVideoMutation.mutateAsync(value.coverVideo);
     coverVideoUrl = uploadResult.videoUrl;
   }
   ```

3. **Integrated Loading State**:
   ```typescript
   const isLoading =
     createMutation.isPending ||
     updateMutation.isPending ||
     uploadImageMutation.isPending ||
     uploadVideoMutation.isPending;
   ```

4. **Conditional API Calls**:
   ```typescript
   if (mode === "create") {
     const payload: CreateServiceDTO = { /* ... */ };
     await createMutation.mutateAsync(payload);
     toast.success("서비스가 생성되었습니다");
   } else {
     const payload: UpdateServiceDTO = { /* ... */ };
     await updateMutation.mutateAsync(payload);
     toast.success("서비스가 수정되었습니다");
   }
   ```

#### Default Preview Pattern

**ImageField & VideoField Enhancement**
- Added `defaultPreview?: string` prop
- Enables showing existing media in edit mode:
  ```typescript
  <form.AppField name="coverImage">
    {(field) => (
      <field.ImageField
        label="커버 이미지"
        aspectRatio="16/9"
        defaultPreview={service?.coverImageUrl}
      />
    )}
  </form.AppField>
  ```

- Implementation details:
  - State initialization: `useState<string | null>(defaultPreview || null)`
  - Effect dependency: Include `defaultPreview` in dependency array
  - Fallback logic: Set preview to `defaultPreview` when no file selected

#### AppForm Field Components Integration

ServiceForm uses complete AppForm field component suite:

1. **TextField**: `ServiceForm` uses for title, subtitle, tutorInfo
2. **SelectField**: Category dropdown with predefined options
3. **ImageField**: Cover image upload with 16/9 aspect ratio
4. **VideoField**: Optional cover video upload
5. **TiptapField**: Rich text editor for detailed description
6. **NumberField**: Price and sale price inputs

All fields:
- Support `disabled` state during mutation loading
- Include `required` indicators where needed
- Handle `defaultPreview` for file fields (ImageField, VideoField)
- Integrated with TanStack Form validation

#### Admin Pages Structure

**Services List Page** (`/src/app/admin/(dashboard)/services/page.tsx`)
- Server Component
- Header: "서비스 관리" title and description
- ServiceDataTable component with:
  - TanStack Table with columns: title, category, price, salePrice, createdAt, actions
  - Pagination: 10 services per page
  - Row actions: Edit link, Delete button with confirm dialog
  - "서비스 생성" button (+Plus icon) linking to create page

**Create Page** (`/src/app/admin/(dashboard)/services/create/page.tsx`)
- Server Component
- Renders `<ServiceForm mode="create" />`
- Header: "서비스 생성" with description

**Edit Page** (`/src/app/admin/(dashboard)/services/[id]/page.tsx`)
- Server Component with HydrationBoundary pattern
- Uses `ServiceIdProvider` context for ID communication
- Renders `<ServicePageHeader />` and `<ServiceForm mode="edit" service={data} />`
- Header: "서비스 수정"

**Key Pattern - ID Communication via Context**:
```typescript
// src/components/reusable/admin/services/detail/service-id-provider.tsx
export const ServiceIdProvider = ({ serviceId, children }: Props) => {
  return (
    <ServiceIdContext.Provider value={serviceId}>
      {children}
    </ServiceIdContext.Provider>
  );
};

export const useServiceId = () => useContext(ServiceIdContext);
```

Avoids prop drilling when service ID needed across multiple nested components.

#### React Query Hooks (`/src/hooks/apis/services/`)

**Query Hooks**:
- `useServices()` - Fetch all services with pagination
- `useService(id)` - Fetch single service
- `useServiceBySlug(slug)` - Fetch service with reviews (public detail)

**Mutation Hooks**:
- `useCreateService()` - Create new service
- `useUpdateService(id)` - Update existing service
- `useDeleteService(id)` - Delete service
- `useCreateReview(serviceId)` - Add service review
- `useDeleteReview(reviewId)` - Delete review

All mutations include automatic cache invalidation on success.

#### API Endpoints

**Service Management:**
- `GET /api/services` - List all services (paginated)
- `POST /api/services` - Create service
- `GET /api/services/[id]` - Get specific service
- `PUT /api/services/[id]` - Update service
- `DELETE /api/services/[id]` - Delete service
- `GET /api/services/slug/[slug]` - Get service by slug (public detail)

**Review Management:**
- `POST /api/services/[id]/reviews` - Create review for service
- `DELETE /api/reviews/[reviewId]` - Delete review

#### Key Patterns Summary

1. **Unified Create/Edit Form**: Single component with `mode` prop handles both operations
2. **Upload Hooks Pattern**: Reusable mutation hooks with normalized responses
3. **Integrated Loading State**: Combines all mutation states into single `isLoading` flag
4. **Default Preview for Edits**: Shows existing media before uploading replacements
5. **Context for ID Communication**: Avoids prop drilling across component hierarchy
6. **AppForm Integration**: Leverages full field component suite for consistency
7. **Server Prefetch Pattern**: Admin pages use HydrationBoundary for SSR optimization
8. **Conditional Mutations**: Single form dispatches to create/update based on mode

#### Code Pattern: Why Mode Discrimination

Using mode discrimination instead of separate components reduces duplication:
- ✅ Single form component for both create/edit logic
- ✅ Shared validation schema and field definitions
- ✅ Same UI layout regardless of mode
- ✅ Easier to maintain consistency between create/edit workflows
- ❌ Alternative (separate components) creates code duplication and maintenance burden

#### Implementation Notes
- All route handlers use Next.js 15+ typed routes with `RouteContext`
- Params are handled as `Promise` types (await params before destructuring)
- HTTP client uses `kyClient` with `NEXT_PUBLIC_API_URL` as `prefixUrl`
- All upload mutations must be awaited before constructing API payloads
- File validation happens in Zod schema at form level
- Service ID provider used to avoid prop drilling in admin detail pages

### Display Feature
Display management system with Display-Service N:M relationship for managing content placement across multiple displays.

#### Database Schema (`/src/infrastructure/db/schema/display.schema.ts`)
- **display** table:
  - `id`: CUID primary key
  - `title`: Display name (required)
  - `slug`: Unique identifier for display queries (required, unique)
  - `createdAt`, `updatedAt`: Timestamps

- **display_service** (join table):
  - `id`: CUID primary key
  - `displayId`: Foreign key to display (cascade delete)
  - `serviceId`: Foreign key to service (cascade delete)
  - `order`: Display sequence (integer, non-negative)
  - `createdAt`: Timestamp

**Key Difference from Banner**:
✅ No separate item table (display_item)
✅ Direct N:M relationship with Service via join table
✅ No date-based filtering (Service is always available when connected)
✅ Order field manages display sequence

#### React Query Hooks (`/src/hooks/apis/displays/`)
- `useDisplays()` - Fetch all displays
- `useDisplay(id)` - Fetch display with connected services
- `useCreateDisplay()` - Create mutation
- `useUpdateDisplay(id)` - Update mutation
- `useDeleteDisplay(id)` - Delete mutation
- `useAddDisplayService(displayId)` - Add service to display
- `useRemoveDisplayService(displayId)` - Remove service from display

#### API Endpoints

**Display CRUD:**
- `GET /api/displays` - List all displays
- `POST /api/displays` - Create display
- `GET /api/displays/[id]` - Get display with services
- `PUT /api/displays/[id]` - Update display metadata
- `DELETE /api/displays/[id]` - Delete display (cascade)

**Display-Service Management:**
- `GET /api/displays/[id]/services` - List display's services
- `POST /api/displays/[id]/services` - Add service to display
- `DELETE /api/displays/[id]/services/[serviceId]` - Remove service from display

#### Admin Pages Structure

**List Page** (`/src/app/admin/(dashboard)/displays/page.tsx`)
- Server Component with HydrationBoundary pattern
- Server prefetch of all displays
- DisplaysDataTable component with:
  - TanStack Table integration
  - Columns: title, slug, createdAt, actions
  - Row actions: Edit, Delete with confirmation
  - Create button linking to `/admin/displays/create`

**Create Page** (`/src/app/admin/(dashboard)/displays/create/page.tsx`)
- DisplayCreateForm component
- Input fields: title, slug
- Validation: slug regex pattern (lowercase, numbers, hyphens only)

**Edit/Detail Page** (`/src/app/admin/(dashboard)/displays/[id]/page.tsx`)
- Server Component with HydrationBoundary pattern
- DisplayMetadataForm: Edit title and slug
- DisplayServicesSection: Manage connected services

#### UI Components

**DisplaysDataTable** (`displays-data-table.tsx`)
- Client Component with TanStack Table
- Columns defined in columns.tsx
- DisplayRowActions for each row
- Create button with Plus icon

**DisplayRowActions** (`display-row-actions.tsx`)
- Edit link to detail page
- Delete button with confirmation dialog
- Uses useDialogService for user confirmation

**DisplayMetadataForm** (`display-metadata-form.tsx`)
- Client Component using AppForm pattern
- Edit title and slug
- Cancel and Submit buttons
- Loading state management

**DisplayServicesSection** (`display-services-section.tsx`)
- Display connected services grid
- Add Service button triggering dialog
- Sorted by order field
- Empty state message

**ServiceSearchDialog** (`service-search-dialog.tsx`)
- **Key Component**: Search and add services
- Features:
  - Search services by title (real-time filter)
  - Select from filtered results dropdown
  - Input order field (0 or higher)
  - Uses AppForm pattern for validation
  - Modal dialog with cancel/add buttons

**DisplayServiceCard** (`display-service-card.tsx`)
- Shows connected service info
- Displays order number
- Remove button for quick deletion
- Trash icon with confirmation

#### Key Patterns

**1. Display-Service N:M Relationship**
- Uses join table (display_service) instead of one-to-many
- Enables same service in multiple displays
- Each connection has independent order

**2. Service Search Dialog**
- Real-time filtering by title
- Inline validation for service selection and order
- Seamless integration with display management

**3. Server Prefetch with Hydration**
- List page prefetches all displays on server
- Detail page prefetches display with services
- No waterfall loading on client

**4. Error Handling**
- Delete confirmation prevents accidental removal
- Toast notifications for success/error
- Form validation with error messages

#### Navigation
- Added "디스플레이" menu item to AdminSidebar
- Icon: LayoutGrid (Lucide React)
- Positioned after "리뷰" in Contents section

#### Implementation Notes
- Display title and slug are the only editable metadata (immutable after creation)
- Service order determines display sequence (starts at 0)
- Deleting display cascades delete to all display_service records
- Deleting service cascades delete to all display_service records (but not the display itself)
- Service selection is case-insensitive search
- All admin pages use server-side prefetch for optimal performance
