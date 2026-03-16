# SomaSync AI

## Overview

SomaSync AI is a landing page application for an AI-powered health technology product. The application serves as a waitlist signup page where users can subscribe to receive updates. It features a modern, Apple iOS-inspired design with smooth animations and a responsive layout.

The tech stack consists of a React frontend with TypeScript, Express.js backend, PostgreSQL database with Drizzle ORM, and is styled using Tailwind CSS with shadcn/ui components.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with CSS variables for theming
- **Component Library**: shadcn/ui (Radix UI primitives with custom styling)
- **Animations**: Framer Motion for smooth transitions and effects
- **Build Tool**: Vite with hot module replacement

The frontend follows a component-based architecture with:
- Pages in `client/src/pages/`
- Reusable UI components in `client/src/components/ui/`
- Custom hooks in `client/src/hooks/`
- Shared utilities in `client/src/lib/`

Path aliases are configured:
- `@/*` maps to `client/src/*`
- `@shared/*` maps to `shared/*`

### Backend Architecture
- **Framework**: Express.js 5 with TypeScript
- **Runtime**: Node.js with tsx for TypeScript execution
- **API Design**: RESTful endpoints defined in `shared/routes.ts` with Zod validation
- **Database**: PostgreSQL with Drizzle ORM

Key server files:
- `server/index.ts` - Application entry point and middleware setup
- `server/routes.ts` - API route handlers
- `server/storage.ts` - Database access layer (repository pattern)
- `server/db.ts` - Database connection configuration

### Data Storage
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Defined in `shared/schema.ts` using Drizzle's table definitions
- **Migrations**: Managed via `drizzle-kit push` command
- **Validation**: drizzle-zod generates Zod schemas from database tables

Current schema includes a `subscribers` table for email waitlist signups.

### Shared Code
The `shared/` directory contains code used by both frontend and backend:
- `schema.ts` - Database table definitions and types
- `routes.ts` - API contract definitions with Zod schemas for inputs/outputs

This approach ensures type safety across the full stack.

### Build Process
- Development: Vite dev server with Express backend (concurrent)
- Production: 
  - Frontend built with Vite to `dist/public/`
  - Backend bundled with esbuild to `dist/index.cjs`
  - Select dependencies are bundled to reduce cold start times

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connected via `DATABASE_URL` environment variable
- **connect-pg-simple**: Session storage for PostgreSQL (available but not currently used)

### UI Libraries
- **Radix UI**: Accessible component primitives (dialog, dropdown, tooltip, etc.)
- **Lucide React**: Icon library
- **Embla Carousel**: Carousel component
- **cmdk**: Command palette component

### Utilities
- **Zod**: Runtime type validation for API inputs/outputs
- **date-fns**: Date manipulation
- **class-variance-authority**: Component variant styling
- **clsx/tailwind-merge**: Conditional class name utilities

### Replit-specific
- `@replit/vite-plugin-runtime-error-modal`: Development error overlay
- `@replit/vite-plugin-cartographer`: Development tooling
- `@replit/vite-plugin-dev-banner`: Development banner