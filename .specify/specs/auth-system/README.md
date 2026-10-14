# Authentication & Premium Tier - Quick Reference

**Project:** Huma Qureshi Novels - Premium Authentication System

**Created:** March 13, 2026

---

## 📚 Documentation Index

| Document | Path | Purpose |
|----------|------|---------|
| **Constitution** | `.specify/memory/constitution.md` | Core principles, architecture, security standards |
| **Specification** | `.specify/specs/auth-system/spec.md` | Requirements, user stories, acceptance criteria |
| **Plan** | `.specify/specs/auth-system/plan.md` | Implementation phases, timeline, resources |
| **Tasks** | `.specify/specs/auth-system/tasks.md` | Detailed implementation tasks with code |
| **Quick Reference** | This file | Quick lookup for developers |

---

## 🎯 System Overview

### Two-Tier Architecture (Payment-First)

```
┌─────────────────────────────────────────────────────────┐
│                    FREE TIER                            │
│  - Home page (Latest, Trending, Popular)               │
│  - Novel listing (free novels)                         │
│  - PDF listing (free PDFs)                             │
│  - About, Contact, Privacy pages                       │
│  - NO authentication required                          │
│  - NO accounts exist                                   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                   PREMIUM TIER                          │
│  - PAYMENT REQUIRED FIRST                              │
│  - Auto-registration on payment success                │
│  - Auto-login after account creation                   │
│  - Premium novels (separate schema)                    │
│  - Premium episodes (separate schema)                  │
│  - User dashboard                                      │
│  - Reading history, bookmarks, favorites               │
│  - Subscription management                             │
└─────────────────────────────────────────────────────────┘

KEY PRINCIPLE: Payment → Account Creation → Authentication
               No free accounts exist in the system
```

### User Journey (Payment-First)

```
Homepage (Free)
    ↓
Click "Go Premium" or "Upgrade"
    ↓
Premium Landing Page (Benefits + Pricing)
    ↓
Select Plan (Monthly/6-Month)
    ↓
Checkout Form (Email, Password, Name, Payment)
    ↓
Payment Processing
    ↓
    ├─────────────┬──────────────┐
    │             │              │
    ▼             ▼              ▼
Success      Processing      Failure
    │             │              │
    │             │              ▼
    │             │        Return to checkout
    │             │        (no account created)
    │             │
    │             ▼
    │      Auto-create account
    │      (subscriptionTier="premium")
    │      Auto-login
    │             │
    │             ▼
    └─────────▶ Premium Dashboard
              (Full access)
```

---

## 📦 Subscription Plans

| Plan | Price | Duration | Effective Monthly | Payment Required |
|------|-------|----------|-------------------|------------------|
| **Monthly** | 250 PKR | 1 month | 250 PKR/month | YES, before auth |
| **6-Month** | 1350 PKR | 6 months | 225 PKR/month (10% off) | YES, before auth |

**IMPORTANT:** Users CANNOT create accounts without payment.
Payment is the gateway to authentication.

---

## 🔐 Authentication Methods

### 1. Payment + Auto-Registration (New Users)
- User enters email/password during checkout
- On payment success: account auto-created with premium tier
- User auto-logged in immediately
- No standalone registration endpoint

### 2. Email/Password Login (Existing Users)
- For users who already have premium accounts
- Minimum 8 characters
- Requires uppercase, lowercase, number
- Hashed with bcrypt (12 rounds)

### 3. Google OAuth
- One-click login for existing premium users
- Auto-create account if new (only with payment)

### 4. Facebook OAuth
- One-click login for existing premium users
- Auto-create account if new (only with payment)

**CRITICAL:** Social login alone does NOT create accounts.
Social users must also complete payment before authentication is granted.

---

## 📁 New File Structure

```
src/
├── auth.ts                          # NextAuth configuration
├── middleware.ts                    # Route protection
│
├── app/
│   ├── (auth)/                      # Auth route group
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── ...
│   │
│   ├── (premium)/                   # Protected routes
│   │   ├── dashboard/page.tsx
│   │   ├── subscription/page.tsx
│   │   ├── reading-history/page.tsx
│   │   └── ...
│   │
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── auth/register/route.ts
│   │   ├── subscription/create-checkout/route.ts
│   │   ├── subscription/webhook/route.ts
│   │   └── ...
│   │
│   └── (public)/                    # Free tier (existing)
│       ├── page.tsx
│       ├── novel/
│       ├── pdf/
│       └── ...
│
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── UserMenu.tsx
│   │   └── ProtectedRoute.tsx
│   │
│   ├── premium/
│   │   ├── SubscriptionCard.tsx
│   │   ├── PremiumBadge.tsx
│   │   └── PaywallBanner.tsx
│   │
│   └── ...
│
├── lib/
│   ├── auth/
│   │   ├── auth.config.ts
│   │   └── utils.ts
│   │
│   ├── payments/
│   │   ├── mock-checkout.ts
│   │   └── stripe.ts (future)
│   │
│   └── ...
│
├── types/
│   ├── auth.ts
│   └── subscription.ts
│
└── sanity/schemaTypes/
    ├── user.ts
    ├── premiumNovel.ts
    ├── premiumEpisode.ts
    ├── subscription.ts
    └── payment.ts
```

---

## 🗄️ Sanity Schemas

### New Document Types

| Schema | Purpose | Key Fields |
|--------|---------|------------|
| `user` | User accounts | email, passwordHash, subscriptionTier, bookmarks |
| `premiumNovel` | Premium novels | title, slug, description, isPremium |
| `premiumEpisode` | Premium episodes | title, body, premiumNovel, isPremium |
| `subscription` | Subscription tracking | user, plan, status, startDate, endDate |
| `payment` | Payment transactions | user, amount, status, stripePaymentIntentId |

### Content Isolation

```
Free Content (existing)          Premium Content (new)
├── novelparent                  ├── premiumNovel
├── novel (episodes)             ├── premiumEpisode
└── pdf                          └── (future: premiumPDF)
```

---

## 🔒 Security Features

### Password Requirements
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- Hashed with bcrypt (12 rounds)

### Session Security
- JWT strategy
- HTTP-only cookies
- Secure flag in production
- SameSite: lax
- 30-day expiry

### Route Protection
```typescript
// Protected routes pattern
matcher: [
  "/dashboard/:path*",
  "/premium/:path*",
  "/api/subscription/:path*",
  "/api/user/:path*",
]
```

### Rate Limiting
- Login: 10 requests / 15 minutes
- Registration: 5 requests / 1 hour

---

## 🧪 Test Users (Development)

### Free User
```json
{
  "email": "free@test.com",
  "password": "Test1234!",
  "name": "Free User",
  "subscriptionTier": "free"
}
```

### Premium User
```json
{
  "email": "premium@test.com",
  "password": "Test1234!",
  "name": "Premium User",
  "subscriptionTier": "premium",
  "subscriptionPlan": "monthly",
  "subscriptionEndDate": "2026-04-13T00:00:00Z"
}
```

---

## 🚀 Quick Start Commands

### Install Dependencies
```bash
npm install next-auth@beta bcryptjs @types/bcryptjs zod stripe
```

### Generate NextAuth Secret
```bash
openssl rand -base64 32
```

### Run Development Server
```bash
npm run dev
```

### Deploy Sanity Schemas
```bash
# In Sanity Studio or via dashboard
# Navigate to Schema section and publish changes
```

---

## 📊 User Flow Diagram

```
┌─────────────┐
│  Homepage   │ (Free, no auth)
└──────┬──────┘
       │
       │ Click "Login" or "Upgrade"
       ▼
┌─────────────┐
│ Login Page  │
└──────┬──────┘
       │
       ├──────┬──────────┐
       │      │          │
       ▼      ▼          ▼
  Email/   Google    Facebook
 Password
       │
       ▼
┌─────────────┐
│  Dashboard  │ (Free tier - see upgrade prompt)
└──────┬──────┘
       │
       │ Click "Upgrade to Premium"
       ▼
┌─────────────┐
│ Subscription│
│   Plans     │
└──────┬──────┘
       │
       │ Select Plan + Payment
       ▼
┌─────────────┐
│   Payment   │
│  Success    │
└──────┬──────┘
       │
       │ Auto-update subscription
       ▼
┌─────────────┐
│  Dashboard  │ (Premium tier - full access)
└──────┬──────┘
       │
       │ Access premium content
       ▼
┌─────────────┐
│  Premium    │
│   Novels    │
└─────────────┘
```

---

## 🎨 UI Components

### Header Changes

**Before:**
```
[Logo] [Search] [Nav Links]
```

**After:**
```
[Logo] [Search] [Nav Links] [Login/Dashboard Button]
```

### Premium Badge
- Gold color (`#FFD700`)
- Lock or crown icon
- Positioned top-right on novel cards

### Subscription Cards
- Two cards side-by-side (desktop)
- 6-Month plan highlighted as "Recommended"
- Clear pricing and features

---

## 📈 Success Metrics

### Technical
- Authentication success rate: > 99%
- Login response time: < 500ms
- Zero critical security vulnerabilities

### Business
- Conversion rate target: 5%
- Churn rate target: < 10% monthly
- Customer LTV: > 1500 PKR

---

## ⚠️ Important Notes

1. **Free Content Unchanged**: All existing novels and PDFs remain free and accessible without authentication.

2. **Separate Schemas**: Premium content uses completely separate Sanity schemas (`premiumNovel`, `premiumEpisode`) to ensure isolation.

3. **Mock Payments**: Initial implementation uses mock payment system for testing. Real payment gateway (Stripe/JazzCash/EasyPaisa) to be integrated in Phase 2.

4. **No Email Verification (Phase 1)**: Email verification is deferred to Phase 2 for faster MVP launch.

5. **Social Login**: Google and Facebook login included from Day 1 for better UX.

---

## 🐛 Known Limitations (Phase 1)

- No email verification
- No password reset flow
- Mock payment system only
- No admin dashboard
- Basic reading history (no sync across devices)

---

## 📞 Support & Resources

### Documentation
- [NextAuth.js Docs](https://authjs.dev)
- [Sanity.io Docs](https://www.sanity.io/docs)
- [bcryptjs Docs](https://www.npmjs.com/package/bcryptjs)

### Internal
- Constitution: `.specify/memory/constitution.md`
- Spec: `.specify/specs/auth-system/spec.md`

---

**Last Updated:** March 13, 2026

**Version:** 1.0.0
