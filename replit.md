# Overview

This is a **Material Submission Management System** (자료 제출 관리 시스템) - a Korean web application designed for managing document submissions within a company. The system allows administrators to create submission events and users to upload files for those events, with comprehensive tracking and monitoring capabilities.

# System Architecture

The application follows a **monorepo full-stack architecture** with clear separation between client and server code:

- **Frontend**: React 18 with TypeScript, using Vite as the build tool
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **UI Framework**: shadcn/ui components with Tailwind CSS
- **State Management**: TanStack Query for server state, Zustand for client state
- **Development Environment**: Replit with Node.js 20

# Key Components

## Frontend Architecture
- **React Router**: Using Wouter for lightweight client-side routing
- **Component System**: shadcn/ui components providing consistent design system
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **File Handling**: HTML5 File API with drag-and-drop support

## Backend Architecture
- **API Server**: Express.js with TypeScript providing RESTful endpoints
- **File Upload**: Multer middleware for handling multipart form data
- **Storage Layer**: Abstracted storage interface supporting both memory and database implementations
- **Middleware**: Custom logging, error handling, and request processing

## Database Schema
Three main entities with PostgreSQL tables:
- **Events**: Submission events with deadlines and file requirements
- **Submissions**: User submissions linked to events with file metadata
- **Activities**: Audit trail for system actions and changes

# Data Flow

1. **Admin Workflow**:
   - Admin authenticates with password
   - Creates events with titles, descriptions, deadlines, and initial files
   - Monitors submissions and activity through dashboard

2. **User Submission**:
   - Users browse active events
   - Submit personal information and upload files
   - System validates file types and stores metadata
   - Activity logging tracks all submissions

3. **File Processing**:
   - Files uploaded through multipart forms
   - Server validates file types (PDF, DOC, DOCX, XLS, XLSX, TXT)
   - Files stored with unique names to prevent conflicts
   - Metadata stored in database for tracking

# External Dependencies

## Core Framework Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm**: Type-safe database operations and migrations
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight React routing

## UI and Styling
- **@radix-ui/***: Headless UI primitives for accessibility
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Consistent icon system

## File Processing
- **multer**: File upload middleware
- **date-fns**: Date formatting and manipulation with Korean locale support

# Deployment Strategy

**Replit Autoscale Deployment**:
- Development server runs on port 5000 with hot reloading
- Production build combines Vite frontend build with esbuild backend compilation
- Static files served from Express in production
- PostgreSQL database provisioned through Replit modules
- Environment variables managed through Replit secrets

**Build Process**:
1. Frontend: Vite builds React app to `dist/public`
2. Backend: esbuild compiles TypeScript server to `dist/index.js`
3. Production: Single Node.js process serves both static files and API

# Changelog
- June 22, 2025. Initial setup

# User Preferences

Preferred communication style: Simple, everyday language.