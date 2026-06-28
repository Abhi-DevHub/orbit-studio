# Orbit Studio — Security Specification

## Version 1.0

---

## 1. Authentication

### 1.1 Better Auth Setup
```typescript
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '@orbit/database';

export const auth = betterAuth({
  database: prismaAdapter(prisma),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  session: {
    expiresIn: 7 * 24 * 60 * 60, // 7 days
    updateAge: 24 * 60 * 60, // update every 24 hours
  },
});
```

### 1.2 Session Management
- JWT-based sessions with refresh tokens
- Session rotation on privilege escalation
- Secure HTTP-only cookies
- CSRF protection
- Session invalidation on password change

### 1.3 OAuth Flow
- GitHub OAuth with read:user scope
- Google OAuth with profile + email scope
- PKCE flow for SPA compatibility
- State parameter validation
- Redirect URI whitelist

## 2. Authorization

### 2.1 Row-Level Security
```sql
-- Enable RLS on all tables
ALTER TABLE "Project" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CanvasState" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Snapshot" ENABLE ROW LEVEL SECURITY;

-- Project isolation policy
CREATE POLICY project_isolation ON "Project"
  USING ("userId" = current_setting('app.user_id')::text);
```

### 2.2 API Authorization
- All mutations require authentication
- Resource ownership validation
- Role-based access (admin, editor, viewer)
- Rate limiting per user/IP
- Input validation with Zod schemas

## 3. Data Protection

### 3.1 Encryption
- TLS 1.3 for all communications
- AES-256 encryption for stored exports
- Password hashing with bcrypt (cost factor 12)
- No plaintext secrets in database

### 3.2 API Key Management
- Keys stored hashed (SHA-256)
- Rate limiting per key
- Key rotation support
- Audit logging for key usage

## 4. OWASP Top 10 Mitigation

| Risk | Mitigation |
|------|-----------|
| Broken Access Control | tRPC middleware, RLS, ownership checks |
| Cryptographic Failures | TLS 1.3, bcrypt, AES-256 |
| Injection | Prisma parameterized queries, Zod validation |
| Insecure Design | Input validation, rate limiting |
| Security Misconfiguration | Environment validation, secure defaults |
| Vulnerable Components | Regular dependency updates, Dependabot |
| Auth Failures | Better Auth, session rotation, MFA ready |
| Data Integrity Failures | CSRF tokens, signed cookies |
| Logging Failures | Structured logging, audit trail |
| SSRF | URL validation, network segmentation |

## 5. Rate Limiting

```typescript
// Redis-based rate limiter
interface RateLimitConfig {
  endpoint: string;
  maxRequests: number;
  windowMs: number;
}

const limits: Record<string, RateLimitConfig> = {
  'api':      { endpoint: 'api',      maxRequests: 100, windowMs: 60000 },
  'ai':       { endpoint: 'ai',       maxRequests: 20,  windowMs: 60000 },
  'export':   { endpoint: 'export',   maxRequests: 10,  windowMs: 60000 },
  'auth':     { endpoint: 'auth',     maxRequests: 5,   windowMs: 60000 },
};
```

## 6. Environment Variables

```env
# Required
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/orbitstudio
REDIS_URL=redis://localhost:6379
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET=orbit-studio

# Auth
BETTER_AUTH_SECRET=your-secret-key-here
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# AI (at least one required)
OPENAI_API_KEY=
GEMINI_API_KEY=
ANTHROPIC_API_KEY=
LITELLM_API_KEY=

# Optional
NEXT_PUBLIC_POSTHOG_KEY=
SENTRY_DSN=
```
