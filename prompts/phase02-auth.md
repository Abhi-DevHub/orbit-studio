# Phase 2: Authentication

## Task
Implement authentication with Better Auth supporting email/password, GitHub OAuth, and Google OAuth.

## Files
- packages/auth/src/index.ts - Better Auth configuration
- apps/web/src/providers/AuthProvider.tsx
- apps/web/src/app/(auth)/sign-in/page.tsx
- apps/web/src/app/(auth)/sign-up/page.tsx
- apps/web/src/app/(auth)/callback/route.ts
- apps/web/src/components/auth/SignInForm.tsx
- apps/web/src/components/auth/SignUpForm.tsx
- apps/web/src/components/auth/UserMenu.tsx
- apps/web/src/server/api/context.ts - Add auth to tRPC context

## Features
- Email/password sign up and sign in
- GitHub OAuth with read:user scope
- Google OAuth with profile + email scope
- Session management with 7-day expiry
- Protected routes redirect to sign-in
- User menu with avatar and sign out
- Session middleware for tRPC
