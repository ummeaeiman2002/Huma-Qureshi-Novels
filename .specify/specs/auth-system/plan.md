# Authentication & Premium Tier - Implementation Plan

**Plan ID:** AUTH-001-PLAN

**Based on Spec:** AUTH-001

**Created:** March 13, 2026

---

## 1. Implementation Overview

This document outlines the step-by-step implementation plan for the authentication and premium tier system. The implementation is divided into 4 phases over approximately 2-3 weeks.

---

## 2. Phase Breakdown

### Phase 1: Foundation & Authentication (Days 1-5)

**Goal:** Establish core authentication infrastructure

#### Day 1: Setup & Configuration
- [ ] Install dependencies
- [ ] Create environment variables
- [ ] Set up OAuth apps (Google, Facebook)
- [ ] Create Sanity schemas (user, premiumNovel, premiumEpisode, subscription, payment)

#### Day 2: NextAuth Configuration
- [ ] Create NextAuth configuration
- [ ] Implement Credentials provider
- [ ] Implement Google provider
- [ ] Implement Facebook provider
- [ ] Create custom Sanity adapter

#### Day 3: Authentication APIs
- [ ] Create `/api/auth/register` route
- [ ] Create `/api/auth/[...nextauth]` route
- [ ] Implement password hashing
- [ ] Add input validation with Zod

#### Day 4: Auth Components
- [ ] Create LoginForm component
- [ ] Create RegisterForm component
- [ ] Create UserMenu component
- [ ] Add auth context provider

#### Day 5: Auth Pages
- [ ] Create `/login` page
- [ ] Create `/register` page
- [ ] Test complete auth flow
- [ ] Add error handling

**Deliverables:**
- Working registration with email/password
- Working Google login
- Working Facebook login
- User stored in Sanity

---

### Phase 2: Subscription & Payment (Days 6-10)

**Goal:** Implement subscription management and payment processing

#### Day 6: Subscription Schema & Logic
- [ ] Deploy subscription schema to Sanity
- [ ] Create subscription helper functions
- [ ] Implement plan pricing constants
- [ ] Create subscription status checker

#### Day 7: Mock Payment System
- [ ] Create mock checkout function
- [ ] Create mock webhook handler
- [ ] Test payment flow end-to-end
- [ ] Create success/cancel pages

#### Day 8: Subscription Components
- [ ] Create SubscriptionCard component
- [ ] Create PricingPage component
- [ ] Create PaymentSuccess component
- [ ] Add subscription status display

#### Day 9: Subscription APIs
- [ ] Create `/api/subscription/create-checkout` route
- [ ] Create `/api/subscription/webhook` route
- [ ] Create `/api/subscription/status` route
- [ ] Add webhook signature verification (for production)

#### Day 10: Integration Testing
- [ ] Test complete payment flow
- [ ] Test subscription status updates
- [ ] Test edge cases (failed payment, duplicate)
- [ ] Add logging and error handling

**Deliverables:**
- Working mock payment system
- Subscription status tracking
- Payment webhook processing

---

### Phase 3: Premium Content Protection (Days 11-15)

**Goal:** Implement route protection and premium content isolation

#### Day 11: Middleware Setup
- [ ] Create middleware.ts
- [ ] Implement route protection logic
- [ ] Add subscription tier checks
- [ ] Test middleware redirects

#### Day 12: Premium Content Schema
- [ ] Deploy premiumNovel schema
- [ ] Deploy premiumEpisode schema
- [ ] Create sample premium content
- [ ] Create queries for premium content

#### Day 13: Premium Pages
- [ ] Create `/premium` listing page
- [ ] Create `/premium/[slug]` novel page
- [ ] Create `/premium/[slug]/[episodeSlug]` episode page
- [ ] Add premium badges and UI

#### Day 14: API Protection
- [ ] Add auth checks to premium APIs
- [ ] Implement server-side verification
- [ ] Add rate limiting
- [ ] Test unauthorized access scenarios

#### Day 15: Free Tier Verification
- [ ] Verify free content still accessible
- [ ] Test no regression in existing features
- [ ] Add premium teasers for free users
- [ ] Performance testing

**Deliverables:**
- Protected premium routes
- Working premium content pages
- Free tier unaffected

---

### Phase 4: Dashboard & Polish (Days 16-20)

**Goal:** Create user dashboard and finalize implementation

#### Day 16: Dashboard Foundation
- [ ] Create `/dashboard` page
- [ ] Create dashboard layout
- [ ] Add subscription status card
- [ ] Add user profile section

#### Day 17: Dashboard Features
- [ ] Implement reading history tracking
- [ ] Create bookmarks system
- [ ] Add favorites functionality
- [ ] Create dashboard components

#### Day 18: Header Integration
- [ ] Update DesktopHeader with auth state
- [ ] Update MobileHeader with auth state
- [ ] Add Login/Dashboard button
- [ ] Add user dropdown menu

#### Day 19: Testing & Bug Fixes
- [ ] End-to-end testing
- [ ] Security audit
- [ ] Performance optimization
- [ ] Bug fixes

#### Day 20: Documentation & Deployment
- [ ] Update README
- [ ] Create user guide
- [ ] Deploy to staging
- [ ] Final testing

**Deliverables:**
- Complete user dashboard
- Integrated header with auth
- Production-ready system

---

## 3. Detailed Task Specifications

### Task 1.1: Install Dependencies

**Command:**
```bash
npm install next-auth@beta bcryptjs @types/bcryptjs zod stripe
```

**Verification:**
- Check package.json for new dependencies
- Verify no security vulnerabilities

### Task 2.1: Create NextAuth Configuration

**File:** `src/auth.ts`

**Requirements:**
- Configure JWT strategy
- Set up all providers
- Implement callbacks for subscription data
- Configure session maxAge (30 days)

**Code Structure:**
```typescript
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"
import { sanityClient } from "@/lib/sanity/client"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({ /* ... */ }),
    Google({ /* ... */ }),
    Facebook({ /* ... */ }),
  ],
  callbacks: {
    jwt: async ({ token, user, trigger, session }) => { /* ... */ },
    session: async ({ session, token }) => { /* ... */ },
  },
  // ... additional config
})
```

### Task 3.1: Create Registration API

**File:** `src/app/api/auth/register/route.ts`

**Requirements:**
- Validate input with Zod
- Check for existing user
- Hash password with bcrypt
- Create user in Sanity
- Return user data (without password)

**Validation Schema:**
```typescript
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/[0-9]/),
  name: z.string().min(2),
})
```

### Task 9.1: Create Middleware

**File:** `src/middleware.ts`

**Requirements:**
- Check authentication for premium routes
- Verify subscription tier
- Handle expired subscriptions
- Allow free tier access

**Matcher Pattern:**
```typescript
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/premium/:path*",
    "/api/subscription/:path*",
    "/api/user/:path*",
  ],
}
```

---

## 4. Database Migration Plan

### 4.1 Sanity Schema Deployment

**Order of Deployment:**
1. `user` (no dependencies)
2. `premiumNovel` (depends on writer, genre)
3. `premiumEpisode` (depends on premiumNovel)
4. `subscription` (depends on user)
5. `payment` (depends on user)

**Deployment Command:**
```bash
# In Sanity Studio or via CLI
sanity dataset export production backup-before-auth.tar.gz
# Then deploy schemas through Studio
```

### 4.2 Sample Data Creation

Create these test users in Sanity:

```json
{
  "_type": "user",
  "email": "test@example.com",
  "name": "Test User",
  "passwordHash": "$2a$12$...", // "Test1234!"
  "subscriptionTier": "free",
  "emailVerified": true
}
```

```json
{
  "_type": "user",
  "email": "premium@example.com",
  "name": "Premium User",
  "passwordHash": "$2a$12$...", // "Test1234!"
  "subscriptionTier": "premium",
  "subscriptionPlan": "monthly",
  "subscriptionStartDate": "2026-03-01T00:00:00Z",
  "subscriptionEndDate": "2026-04-01T00:00:00Z",
  "emailVerified": true
}
```

---

## 5. Security Checklist

### 5.1 Pre-Launch Security Audit

- [ ] Passwords are hashed with bcrypt (12 rounds)
- [ ] JWT tokens are properly signed
- [ ] HTTP-only cookies configured
- [ ] CSRF protection enabled
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] SQL/NoSQL injection prevention
- [ ] XSS prevention headers
- [ ] Premium content not in client bundle
- [ ] Webhook signatures verified

### 5.2 Penetration Testing

- [ ] Attempt to access premium content without auth
- [ ] Attempt to modify JWT payload
- [ ] Attempt SQL/NoSQL injection in forms
- [ ] Attempt XSS in input fields
- [ ] Test rate limiting effectiveness
- [ ] Verify password complexity requirements

---

## 6. Testing Plan

### 6.1 Unit Tests

**File:** `src/lib/auth/__tests__/auth.test.ts`

```typescript
describe("Password Hashing", () => {
  it("should hash password", async () => {
    // Test
  });
  
  it("should verify password", async () => {
    // Test
  });
});

describe("JWT Token", () => {
  it("should contain user data", async () => {
    // Test
  });
});
```

### 6.2 Integration Tests

**File:** `src/__tests__/auth-flow.test.ts`

```typescript
describe("Registration Flow", () => {
  it("should register new user", async () => {
    // Test
  });
  
  it("should reject duplicate email", async () => {
    // Test
  });
});
```

### 6.3 E2E Tests

**File:** `e2e/auth.spec.ts` (Playwright)

```typescript
test("complete registration and payment flow", async ({ page }) => {
  await page.goto("/register");
  // Fill form
  // Submit
  // Verify redirect to dashboard
  // Navigate to subscription
  // Complete payment
  // Verify premium access
});
```

---

## 7. Rollback Plan

### 7.1 Rollback Triggers

Rollback if:
- Critical security vulnerability found
- > 5% payment failures
- Authentication downtime > 30 minutes
- Data corruption detected

### 7.2 Rollback Steps

1. Disable new registrations
2. Redirect premium routes to maintenance page
3. Restore Sanity from backup
4. Deploy previous version
5. Re-enable site

### 7.3 Backup Strategy

- Daily Sanity exports
- Git tags before each deployment
- Environment variable backup

---

## 8. Monitoring & Alerting

### 8.1 Key Metrics to Monitor

| Metric | Alert Threshold | Owner |
|--------|-----------------|-------|
| Auth failures | > 100/hour | Dev Team |
| Payment failures | > 5% | Dev Team |
| Premium 403s | Spike > 200% | Dev Team |
| API latency | p95 > 1s | Dev Team |

### 8.2 Logging Requirements

Log all:
- Registration attempts (success/failure)
- Login attempts (success/failure)
- Payment events
- Subscription changes
- Premium access denials

---

## 9. Success Criteria

### 9.1 Technical Acceptance

- [ ] All unit tests pass (> 80% coverage)
- [ ] All integration tests pass
- [ ] All E2E tests pass
- [ ] Zero critical security issues
- [ ] Performance benchmarks met

### 9.2 Business Acceptance

- [ ] Users can register successfully
- [ ] Users can login successfully
- [ ] Payments process correctly
- [ ] Premium content protected
- [ ] Free content accessible

### 9.3 User Acceptance

- [ ] Registration completes in < 2 minutes
- [ ] Login completes in < 30 seconds
- [ ] Payment flow completes in < 5 minutes
- [ ] Dashboard loads in < 2 seconds

---

## 10. Post-Launch Tasks

### Week 1 After Launch

- [ ] Monitor error rates daily
- [ ] Review user feedback
- [ ] Fix critical bugs within 24 hours
- [ ] Analyze conversion metrics

### Month 1 After Launch

- [ ] Complete security audit
- [ ] Optimize slow queries
- [ ] Plan Phase 2 features
- [ ] Document lessons learned

---

## 11. Resource Requirements

### Development Team

- 1 Senior Full-Stack Developer (lead)
- 1 Frontend Developer
- 1 Backend Developer (part-time)

### Infrastructure

- Sanity.io (existing plan sufficient)
- Vercel hosting (existing)
- Google OAuth (free tier)
- Facebook OAuth (free tier)

### Third-Party Services

| Service | Purpose | Cost |
|---------|---------|------|
| Google OAuth | Social login | Free |
| Facebook OAuth | Social login | Free |
| Stripe (mock) | Payment testing | Free |
| Stripe (prod) | Payment processing | 2.9% + 30¢ |

---

## 12. Timeline Summary

| Phase | Duration | End Date |
|-------|----------|----------|
| Phase 1: Foundation | 5 days | Day 5 |
| Phase 2: Subscription | 5 days | Day 10 |
| Phase 3: Protection | 5 days | Day 15 |
| Phase 4: Polish | 5 days | Day 20 |
| Testing & Buffer | 5 days | Day 25 |

**Total Estimated Duration:** 25 working days

---

**Approval:**

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Project Manager | | | |
| Tech Lead | | | |
| Product Owner | | | |

---

**References:**
- Spec Document: `.specify/specs/auth-system/spec.md`
- Constitution: `.specify/memory/constitution.md`
