# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a JWT authentication project with a Node.js/Express backend and React/TypeScript frontend. The application demonstrates role-based access control with user authentication.

## Development Commands

### Backend (Node.js/Express)
```bash
cd backend
npm run dev     # Start development server with nodemon
npm start       # Start production server
```

### Frontend (React/TypeScript)
```bash
cd frontend
npm run dev     # Start Vite development server
npm run build   # Build for production (includes TypeScript compilation)
npm run lint    # Run ESLint
npm run preview # Preview production build
```

## Architecture

### Backend Structure
- **Entry Point**: `backend/server.js` - Express server with CORS configuration for `http://localhost:5173`
- **Authentication**: JWT-based auth with bcrypt password hashing
- **Routes**:
  - `/api/auth/*` - Login, register, and token verification (backend/routes/auth.js:21-127)
  - `/api/protected/*` - Protected routes with role-based access control (backend/routes/protected.js:36-55)
- **Data Storage**: In-memory user array with pre-seeded admin and regular users
- **Middleware**: Token authentication and role-based authorization middleware

### Frontend Architecture
- **Framework**: React 19 with TypeScript, Vite build tool
- **Routing**: React Router with protected routes
- **State Management**: Dual approach with both Redux Toolkit and React Context
  - Redux store in `src/store/` with auth slice
  - React Context in `src/contexts/AuthContext.tsx` for authentication state
- **API Layer**: Axios-based API client in `src/utils/api.ts`
- **Components**:
  - `ProtectedRoute` component handles authentication and role-based access
  - Page components: Login, Dashboard, AdminPanel, Unauthorized

### Authentication Flow
1. User credentials are validated against in-memory user store
2. JWT tokens are issued with user ID, email, and roles
3. Frontend stores tokens in localStorage
4. Protected routes verify tokens on each request
5. Role-based access control uses `requireRole` middleware

## Key Features
- JWT token-based authentication
- Role-based access control (admin/user roles)
- Protected routes with automatic token validation
- Automatic token persistence via localStorage
- CORS configuration for frontend-backend communication

## Default Users
- Admin: `admin@example.com` / `admin123`
- User: `user@example.com` / `user123`

## Environment Variables
Both backend and frontend have `.env` files that should be configured before running the application.