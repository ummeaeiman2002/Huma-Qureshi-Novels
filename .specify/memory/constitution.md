# Huma Qureshi Novels - Premium Tier Constitution

## Project Overview

**Project Name:** Huma Qureshi Novels - Premium Tier Authentication System

**Version:** 1.0.0

**Date:** March 13, 2026

**Author:** Development Team

---

## 1. Core Principles

### 1.1 Security First
- **NEVER** trust client-side validation for access control
- **ALWAYS** verify authentication and subscription status server-side
- **NEVER** expose premium content in API responses to unauthorized users
- **ALWAYS** hash passwords using bcrypt with minimum 12 rounds
- **NEVER** store plain text passwords or sensitive user data

### 1.2 Free vs Premium Isolation
- Free tier content remains **100% accessible** without authentication
- Premium content is **completely isolated** in separate Sanity schemas
- Authentication is **ONLY** required for premium tier access
- No existing free content should be moved or restricted

### 1.3 User Privacy
- Collect minimum required user data (email, name, subscription info)
- Never share user data with third parties without consent
- Provide data export and deletion capabilities
- Comply with Pakistan data protection regulations

### 1.4 Payment Integrity
- All payment verification happens server-side
- Webhook signatures MUST be verified
- Subscription status changes ONLY via verified webhooks
- Maintain complete payment audit trail

---

## 2. Technical Architecture

### 2.1 Authentication Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Auth Framework | NextAuth.js v5 (Auth.js) | Session management, providers |
| Password Hashing | bcryptjs | Secure password storage |
| Session Storage | JWT + HTTP-only Cookies | Stateless, secure sessions |
| Database | Sanity.io | User documents, subscriptions |
| Email Service | Resend (future) | Email verification, receipts |

### 2.2 Authentication Flow (Payment-First)

**Key Principle:** Users must complete payment BEFORE authentication is granted.
No free accounts exist in the system. Payment = Automatic authentication.

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Landing    │────▶│   Payment    │────▶│   Auto-      │
│   (Premium   │     │   Checkout   │     │   Register   │
│    Info)     │     │  (Mock/Sample)│     │   & Login   │
└──────────────┘     └──────────────┘     └──────────────┘
                            │                    │
                            │                    ▼
                            │             ┌──────────────┐
                            │             │   Premium    │
                            └────────────▶│  Dashboard   │
                             (Failed)     │              │
                                          └──────────────┘
```

**Flow Details:**
1. User clicks "Go Premium" from homepage
2. Lands on premium info page (pricing, benefits)
3. Selects plan → Enters email/password → Payment
4. **On payment success:** Auto-create account + Auto-login
5. Redirect to premium dashboard
6. **On payment failure:** No account created, return to checkout

**Security Benefit:** No free accounts, no unpaid access, payment is the gate.

### 2.3 Session Configuration

```typescript
{
  strategy: "jwt",
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      },
    },
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    jwt: async ({ token, user, trigger, session }) => {
      // Include subscription tier in JWT
      if (user) {
        token.subscriptionTier = user.subscriptionTier;
        token.subscriptionEndDate = user.subscriptionEndDate;
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user.subscriptionTier = token.subscriptionTier;
      session.user.subscriptionEndDate = token.subscriptionEndDate;
      return session;
    },
  },
}
```

---

## 3. Data Models

### 3.1 User Schema (Sanity)

**CRITICAL:** All users in this schema are PREMIUM users by default.
There is NO "free" tier in the authentication system. Free users don't have accounts.

```typescript
{
  name: "user",
  type: "document",
  fields: [
    { name: "email", type: "string", validation: Rule => Rule.required().email() },
    { name: "passwordHash", type: "string", hidden: true },
    { name: "name", type: "string" },
    { name: "image", type: "string" }, // Profile picture from OAuth
    { name: "emailVerified", type: "boolean", initialValue: false },
    { name: "subscriptionTier", type: "string", options: { list: ["premium"] }, initialValue: "premium" }, // ALWAYS premium
    { name: "subscriptionPlan", type: "string", options: { list: ["monthly", "sixMonth"] } },
    { name: "subscriptionStartDate", type: "datetime" },
    { name: "subscriptionEndDate", type: "datetime" },
    { name: "stripeCustomerId", type: "string", hidden: true },
    { name: "paymentStatus", type: "string", options: { list: ["completed", "pending", "failed", "refunded"] }, initialValue: "pending" },
    { name: "readingHistory", type: "array", of: [{ type: "reference", to: [{ type: "premiumNovel" }, { type: "premiumEpisode" }] }] },
    { name: "bookmarks", type: "array", of: [{ type: "reference", to: [{ type: "premiumEpisode" }] }] },
    { name: "favorites", type: "array", of: [{ type: "reference", to: [{ type: "premiumNovel" }] }] },
    { name: "createdAt", type: "datetime", initialValue: () => new Date().toISOString() },
    { name: "updatedAt", type: "datetime" },
  ]
}
```

### 3.2 Premium Novel Schema (Sanity)

```typescript
{
  name: "premiumNovel",
  type: "document",
  fields: [
    { name: "title", type: "string", validation: Rule => Rule.required() },
    { name: "slug", type: "slug", options: { source: "title" } },
    { name: "description", type: "array", of: [{ type: "block" }] },
    { name: "banner", type: "string" },
    { name: "writer", type: "reference", to: [{ type: "writer" }] },
    { name: "genre", type: "reference", to: [{ type: "genre" }] },
    { name: "tags", type: "array", of: [{ type: "string" }] },
    { name: "isPremium", type: "boolean", initialValue: true, hidden: true },
    { name: "releaseDate", type: "datetime" },
    { name: "createdAt", type: "datetime" },
  ]
}
```

### 3.3 Premium Episode Schema (Sanity)

```typescript
{
  name: "premiumEpisode",
  type: "document",
  fields: [
    { name: "title", type: "string" },
    { name: "episodeNumber", type: "string" },
    { name: "slug", type: "slug" },
    { name: "premiumNovel", type: "reference", to: [{ type: "premiumNovel" }] },
    { name: "body", type: "text" },
    { name: "releaseDate", type: "datetime" },
    { name: "isPremium", type: "boolean", initialValue: true, hidden: true },
    { name: "views", type: "number", initialValue: 0 },
  ]
}
```

### 3.4 Subscription Schema (Sanity)

```typescript
{
  name: "subscription",
  type: "document",
  fields: [
    { name: "user", type: "reference", to: [{ type: "user" }] },
    { name: "plan", type: "string", options: { list: ["monthly", "sixMonth"] } },
    { name: "status", type: "string", options: { list: ["active", "cancelled", "expired"] } },
    { name: "startDate", type: "datetime" },
    { name: "endDate", type: "datetime" },
    { name: "amount", type: "number" }, // in PKR
    { name: "stripeSubscriptionId", type: "string" },
    { name: "createdAt", type: "datetime" },
  ]
}
```

### 3.5 Payment Transaction Schema (Sanity)

```typescript
{
  name: "payment",
  type: "document",
  fields: [
    { name: "user", type: "reference", to: [{ type: "user" }] },
    { name: "amount", type: "number" },
    { name: "currency", type: "string", initialValue: "PKR" },
    { name: "status", type: "string", options: { list: ["pending", "completed", "failed", "refunded"] } },
    { name: "stripePaymentIntentId", type: "string" },
    { name: "stripeCheckoutSessionId", type: "string" },
    { name: "plan", type: "string", options: { list: ["monthly", "sixMonth"] } },
    { name: "createdAt", type: "datetime" },
    { name: "metadata", type: "object" },
  ]
}
```

---

## 4. API Design

### 4.1 Authentication Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login (handled by NextAuth) |
| POST | `/api/auth/logout` | Yes | Logout (handled by NextAuth) |
| GET | `/api/auth/session` | No | Get current session |
| POST | `/api/auth/verify-email` | No | Verify email token |

### 4.2 Subscription Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/subscription/create-checkout` | Yes | Create checkout session |
| POST | `/api/subscription/webhook` | No | Stripe webhook handler |
| GET | `/api/subscription/status` | Yes | Get subscription status |
| POST | `/api/subscription/cancel` | Yes | Cancel subscription |

### 4.3 User Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/api/user/profile` | Yes | Get user profile |
| PUT | `/api/user/profile` | Yes | Update user profile |
| GET | `/api/user/reading-history` | Yes | Get reading history |
| POST | `/api/user/bookmark` | Yes | Add bookmark |
| DELETE | `/api/user/bookmark` | Yes | Remove bookmark |

---

## 5. Security Standards

### 5.1 Password Requirements

```typescript
const passwordValidation = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: false, // Optional for better UX
  maxAge: null, // No password expiry
};
```

### 5.2 Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/auth/register` | 5 requests | 1 hour per IP |
| `/api/auth/login` | 10 requests | 15 minutes per IP |
| `/api/subscription/create-checkout` | 10 requests | 1 minute per user |

### 5.3 Input Validation

All user inputs MUST be validated using Zod schemas:

```typescript
import { z } from "zod";

const RegisterSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});
```

### 5.4 CORS Configuration

```typescript
const corsOptions = {
  origin: process.env.NEXT_PUBLIC_SITE_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
```

---

## 6. Premium Content Protection

### 6.1 Middleware Rules

```typescript
// middleware.ts
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/premium/:path*",
    "/api/subscription/:path*",
    "/api/user/:path*",
  ],
};

export default async function middleware(request: NextRequest) {
  const session = await auth();
  
  if (!session?.user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  
  if (session.user.subscriptionTier !== "premium") {
    return NextResponse.redirect(new URL("/dashboard/upgrade", request.url));
  }
  
  return NextResponse.next();
}
```

### 6.2 API Route Protection

```typescript
// Example protected API route
export async function GET(request: NextRequest) {
  const session = await auth();
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  if (session.user.subscriptionTier !== "premium") {
    return NextResponse.json({ error: "Premium subscription required" }, { status: 403 });
  }
  
  // Proceed with premium content fetch
}
```

### 6.3 Server Component Protection

```typescript
// Example protected server component
export default async function PremiumNovelPage({ params }) {
  const session = await auth();
  
  if (!session?.user || session.user.subscriptionTier !== "premium") {
    redirect("/login?redirect=/premium/" + params.slug);
  }
  
  // Fetch and render premium content
}
```

---

## 7. Payment Integration (Sample/Mock)

### 7.1 Mock Payment Flow

For initial testing, we'll implement a mock payment system:

```typescript
// lib/payments/mock-checkout.ts
export async function createMockCheckoutSession({ plan, userId }) {
  // Simulate Stripe checkout
  return {
    id: `mock_session_${Date.now()}`,
    url: `/subscription/success?session_id=mock_${Date.now()}`,
    status: "completed",
  };
}

export async function processMockWebhook(sessionId: string) {
  // Simulate successful payment
  return {
    success: true,
    plan: "monthly", // or "sixMonth"
    amount: 250, // or 1350
  };
}
```

### 7.2 Stripe Integration (Future)

When ready for production:

```typescript
// lib/payments/stripe.ts
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

export const PRICING = {
  monthly: {
    price: 250,
    stripePriceId: "price_monthly_xxx",
  },
  sixMonth: {
    price: 1350,
    stripePriceId: "price_sixmonth_xxx",
  },
};
```

---

## 8. Testing Standards

### 8.1 Unit Tests

- Password hashing validation
- JWT token generation/verification
- Subscription status calculations
- Email validation

### 8.2 Integration Tests

- Registration flow
- Login/logout flow
- Payment webhook handling
- Premium content access control

### 8.3 E2E Tests

- Complete user journey (register → payment → access)
- Subscription upgrade/downgrade
- Session expiry and refresh

---

## 9. Monitoring & Observability

### 9.1 Logging

Log all authentication events:
- User registration (success/failure)
- Login attempts (success/failure)
- Subscription changes
- Payment events

### 9.2 Metrics to Track

- Daily active premium users
- Subscription conversion rate
- Churn rate
- Payment success/failure rate

---

## 10. Deployment Checklist

- [ ] Environment variables configured
- [ ] Sanity schemas deployed
- [ ] Webhook endpoints tested
- [ ] SSL certificates valid
- [ ] Rate limiting enabled
- [ ] Error monitoring configured
- [ ] Backup strategy in place

---

## 11. Folder Structure Standards

```
src/
├── app/
│   ├── (auth)/                    # Auth route group (isolated)
│   ├── (premium)/                 # Premium protected routes
│   ├── (public)/                  # Free tier routes (existing content)
│   └── api/
│       ├── auth/                  # NextAuth endpoints
│       ├── subscription/          # Payment/subscription endpoints
│       └── user/                  # User management endpoints
│
├── components/
│   ├── auth/                      # Auth-related components
│   ├── premium/                   # Premium-specific components
│   └── shared/                    # Shared components
│
├── lib/
│   ├── auth/                      # Auth utilities
│   ├── payments/                  # Payment utilities
│   └── sanity/                    # Sanity utilities
│
├── types/                         # TypeScript types
├── middleware.ts                  # Route protection
└── auth.ts                        # NextAuth configuration
```

---

## 12. Environment Variables

```env
# Required
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=xxx
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-06-12

# Mock Payment (Development)
MOCK_PAYMENT_ENABLED=true

# Stripe (Production - Future)
STRIPE_SECRET_KEY=sk_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_xxx

# Application
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 13. Success Criteria

### Functional Requirements
- [ ] Users can register with email/password
- [ ] Users can login with Google/Facebook
- [ ] Payment flow works (mock for now)
- [ ] Premium content is protected
- [ ] Free content remains accessible
- [ ] Dashboard shows subscription status

### Non-Functional Requirements
- [ ] Login response time < 500ms
- [ ] Premium content access check < 100ms
- [ ] Zero security vulnerabilities in audit
- [ ] 100% test coverage on auth logic

---

## 14. Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Security breach | Critical | Regular audits, minimal data collection |
| Payment fraud | High | Server-side verification, webhook signatures |
| Downtime | High | Graceful degradation, error pages |
| Data loss | Critical | Daily Sanity backups, export capability |

---

## 15. Future Enhancements

1. Email verification flow
2. Password reset functionality
3. Multiple payment gateways (JazzCash, EasyPaisa)
4. Referral system
5. Gift subscriptions
6. Family plans
7. Downloadable content for premium users
8. Early access to new episodes

---

**Document Version:** 1.0.0

**Last Updated:** March 13, 2026

**Next Review:** After Phase 1 completion
