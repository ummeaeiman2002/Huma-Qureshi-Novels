# Authentication & Premium Tier - Specification Document

**Spec ID:** AUTH-001

**Status:** Approved

**Created:** March 13, 2026

**Last Updated:** March 13, 2026

---

## 1. Executive Summary

This document specifies the requirements for implementing a premium tier authentication system for Huma Qureshi Novels. The system will introduce user authentication, subscription management, and premium content protection while maintaining the existing free tier functionality.

### 1.1 Problem Statement

Currently, the website operates entirely as a free platform with no user authentication. All content is accessible to all users. There is no mechanism to:
- Identify individual users
- Offer premium content to paying users
- Track user preferences or reading history
- Monetize the platform through subscriptions

### 1.2 Solution Overview

Implement a **payment-first authentication system** with two completely isolated tiers:

- **Free Tier:** Existing functionality remains 100% accessible with NO authentication
- **Premium Tier:** Payment → Auto-registration → Auto-login → Premium access
  - Users CANNOT create free accounts
  - Payment is the ONLY gateway to authentication
  - All authenticated users are premium by default

### Key Security Principle

**Payment Gate → Account Creation → Authentication**

This ensures:
- Zero unpaid premium access
- No free accounts in the system
- Payment completion = Automatic premium access
- Failed payment = No account created

---

## 2. Scope

### 2.1 In Scope

1. **User Authentication**
   - Email/password registration and login
   - Social login (Google, Facebook)
   - Session management with JWT
   - Secure password storage

2. **Subscription Management**
   - Two subscription plans (Monthly: 250 PKR, 6-Month: 1350 PKR)
   - Mock payment system for testing
   - Subscription status tracking
   - Automatic expiry handling

3. **Premium Content**
   - Separate Sanity schemas for premium novels/episodes
   - Protected routes for premium content
   - Premium-specific UI components

4. **User Dashboard**
   - Subscription status display
   - Reading history tracking
   - Bookmarks and favorites
   - Profile management

5. **Security**
   - Middleware-based route protection
   - Server-side access verification
   - Rate limiting on auth endpoints
   - CSRF and XSS protection

### 2.2 Out of Scope

1. Email verification (Phase 2)
2. Password reset flow (Phase 2)
3. Real payment gateway integration (Phase 2)
4. Admin dashboard for user management (Phase 3)
5. Analytics and reporting (Phase 3)
6. Multi-language support for auth UI (Phase 2)

---

## 3. User Stories

### 3.1 Premium Onboarding (Payment-First Flow)

**US-001: View Premium Benefits**
> As a visitor, I want to see premium benefits and pricing so that I can decide to purchase.

**Acceptance Criteria:**
- [ ] Premium landing page shows all benefits clearly
- [ ] Shows two subscription plans with pricing
- [ ] Shows comparison: Free vs Premium features
- [ ] "Subscribe Now" button on each plan
- [ ] No login/registration required to view

**US-002: Subscribe and Auto-Register**
> As a visitor, I want to subscribe to a premium plan so that I can access premium content.

**Acceptance Criteria:**
- [ ] Clicking "Subscribe Now" opens checkout form
- [ ] Checkout form collects: email, password, name, plan selection
- [ ] Password validation (min 8 chars, uppercase, lowercase, number)
- [ ] Email format validation
- [ ] Payment button clearly shows amount
- [ ] Terms & conditions checkbox required
- [ ] On payment success: auto-create account + auto-login
- [ ] On payment failure: show error, no account created
- [ ] Redirect to premium dashboard on success

**US-003: Complete Payment (Mock)**
> As a subscribing user, I want to complete payment so that I can access premium features.

**Acceptance Criteria:**
- [ ] Mock payment page for testing
- [ ] Simulates processing delay (2-3 seconds)
- [ ] Success response triggers account creation
- [ ] Account created with "premium" tier automatically
- [ ] Subscription end date calculated based on plan
- [ ] Payment transaction logged in Sanity
- [ ] User redirected to dashboard

### 3.2 Login (For Existing Premium Users)

**US-004: Premium User Login**
> As an existing premium user, I want to login so that I can access my premium account.

**Acceptance Criteria:**
- [ ] Login page accessible at `/login`
- [ ] Email/password login form
- [ ] Google login button
- [ ] Facebook login button
- [ ] Invalid credentials show generic error
- [ ] Successful login redirects to dashboard
- [ ] Session persists for 30 days

**US-005: Social Login (Google/Facebook)**
> As a premium user, I want to login with social media so that I can access quickly.

**Acceptance Criteria:**
- [ ] "Login with Google" button functional
- [ ] "Login with Facebook" button functional
- [ ] OAuth flow completes successfully
- [ ] Existing users are logged in
- [ ] Redirect to dashboard after login

### 3.3 Subscription & Payment

**US-006: View Subscription Status**
> As a premium user, I want to see my subscription status so that I know when it expires.

**Acceptance Criteria:**
- [ ] Dashboard shows current plan (Monthly/6-Month)
- [ ] Shows subscription start date
- [ ] Shows subscription end date
- [ ] Shows days remaining
- [ ] Shows "Renew Subscription" button near expiry (< 7 days)
- [ ] Renewal creates new payment transaction

**US-007: Renew Subscription**
> As a premium user with expiring subscription, I want to renew so that I maintain access.

**Acceptance Criteria:**
- [ ] Renewal uses same payment flow as initial subscription
- [ ] New subscription end date extends from current end date
- [ ] Payment history shows all transactions

**US-008: Browse Premium Novels**
> As a premium user, I want to browse premium novels so that I can discover exclusive content.

**Acceptance Criteria:**
- [ ] Premium novels listed separately or with badge
- [ ] Premium badge visible on novel cards
- [ ] Clicking premium novel checks subscription
- [ ] Expired subscription shows upgrade prompt

**US-009: Read Premium Episodes**
> As a premium user, I want to read premium episodes so that I can enjoy exclusive content.

**Acceptance Criteria:**
- [ ] Episode page loads only for active premium users
- [ ] Content protection (no copy/paste) maintained
- [ ] Reading progress tracked
- [ ] Expired subscription blocks access

**US-010: Free User Premium Teaser**
> As a free user, I want to see what premium content exists so that I'm tempted to upgrade.

**Acceptance Criteria:**
- [ ] Premium novels visible in listing with lock icon
- [ ] First paragraph or teaser visible
- [ ] "Upgrade to Read More" CTA
- [ ] Clear value proposition

### 3.4 Dashboard & Profile

**US-011: User Dashboard**
> As a premium user, I want a dashboard so that I can manage my account and see my activity.

**Acceptance Criteria:**
- [ ] Dashboard accessible from header
- [ ] Shows user name and email
- [ ] Shows subscription status card
- [ ] Shows recent reading history
- [ ] Shows bookmarks count
- [ ] Shows favorites count
- [ ] Quick links to key features

**US-012: Reading History**
> As a user, I want to see my reading history so that I can resume where I left off.

**Acceptance Criteria:**
- [ ] History page lists recently read novels/episodes
- [ ] Shows last read timestamp
- [ ] Shows progress percentage
- [ ] Click to continue reading
- [ ] Option to remove from history

**US-013: Bookmarks**
> As a user, I want to bookmark episodes so that I can easily find them later.

**Acceptance Criteria:**
- [ ] Bookmark button on episode pages
- [ ] Bookmarks saved to user profile
- [ ] Bookmarks page lists all saved episodes
- [ ] Click to navigate to episode
- [ ] Option to remove bookmark

---

## 4. Functional Requirements

### 4.1 Authentication (Payment-First)

| ID | Requirement | Priority |
|----|-------------|----------|
| AUTH-FR-001 | System shall NOT allow standalone registration | P0 |
| AUTH-FR-002 | System shall create account ONLY on payment success | P0 |
| AUTH-FR-003 | System shall auto-login user after payment success | P0 |
| AUTH-FR-004 | System shall support Google OAuth login for existing users | P0 |
| AUTH-FR-005 | System shall support Facebook OAuth login for existing users | P0 |
| AUTH-FR-006 | System shall hash passwords with bcrypt (12 rounds) | P0 |
| AUTH-FR-007 | System shall issue JWT tokens on successful auth/payment | P0 |
| AUTH-FR-008 | System shall store session in HTTP-only cookie | P0 |
| AUTH-FR-009 | System shall expire tokens after 30 days | P1 |
| AUTH-FR-010 | All authenticated users shall have subscriptionTier="premium" | P0 |

### 4.2 Subscription

| ID | Requirement | Priority |
|----|-------------|----------|
| SUB-FR-001 | System shall offer Monthly plan at 250 PKR | P0 |
| SUB-FR-002 | System shall offer 6-Month plan at 1350 PKR | P0 |
| SUB-FR-003 | System shall process mock payments for testing | P0 |
| SUB-FR-004 | System shall update subscription status on payment | P0 |
| SUB-FR-005 | System shall calculate end date based on plan | P0 |
| SUB-FR-006 | System shall auto-expire subscriptions on date | P1 |
| SUB-FR-007 | System shall send expiry reminders (Phase 2) | P2 |

### 4.3 Content Protection

| ID | Requirement | Priority |
|----|-------------|----------|
| PROT-FR-001 | System shall block premium routes for non-premium users | P0 |
| PROT-FR-002 | System shall block premium API responses for free users | P0 |
| PROT-FR-003 | System shall redirect expired users to upgrade page | P0 |
| PROT-FR-004 | System shall verify subscription on server-side | P0 |
| PROT-FR-005 | System shall not expose premium content in page source | P0 |

### 4.4 User Management

| ID | Requirement | Priority |
|----|-------------|----------|
| USER-FR-001 | System shall track reading history | P1 |
| USER-FR-002 | System shall support bookmarking | P1 |
| USER-FR-003 | System shall support favorites | P2 |
| USER-FR-004 | System shall allow profile updates | P1 |
| USER-FR-005 | System shall allow password change | P2 |

---

## 5. Non-Functional Requirements

### 5.1 Performance

| ID | Requirement | Target |
|----|-------------|--------|
| PERF-NFR-001 | Login response time | < 500ms |
| PERF-NFR-002 | Premium content access check | < 100ms |
| PERF-NFR-003 | Dashboard load time | < 1s |
| PERF-NFR-004 | Subscription checkout creation | < 2s |

### 5.2 Security

| ID | Requirement | Implementation |
|----|-------------|----------------|
| SEC-NFR-001 | Password storage | bcrypt with 12 rounds |
| SEC-NFR-002 | Session security | HTTP-only, Secure, SameSite cookies |
| SEC-NFR-003 | CSRF protection | Built-in NextAuth CSRF tokens |
| SEC-NFR-004 | Rate limiting | 10 requests/15min on login |
| SEC-NFR-005 | Input validation | Zod schemas on all inputs |
| SEC-NFR-006 | XSS prevention | React default escaping + CSP headers |

### 5.3 Reliability

| ID | Requirement | Target |
|----|-------------|--------|
| REL-NFR-001 | Authentication uptime | 99.9% |
| REL-NFR-002 | Payment processing success rate | > 99% |
| REL-NFR-003 | Session persistence | 30 days minimum |

### 5.4 Scalability

| ID | Requirement | Target |
|----|-------------|--------|
| SCALE-NFR-001 | Concurrent authenticated users | 10,000+ |
| SCALE-NFR-002 | Daily active users | 100,000+ |
| SCALE-NFR-003 | Database queries per second | 1,000+ |

---

## 6. Data Models

### 6.1 Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐
│    User     │       │  Premium    │
│             │1    * │    Novel    │
│ - email     │◄──────│             │
│ - password  │       │ - title     │
│ - name      │       │ - slug      │
│ - tier      │       │ - body      │
└──────┬──────┘       └─────────────┘
       │1
       │
       │*
┌─────────────┐       ┌─────────────┐
│ Subscription│       │   Payment   │
│             │       │             │
│ - plan      │       │ - amount    │
│ - status    │       │ - status    │
│ - startDate │       │ - date      │
│ - endDate   │       │             │
└─────────────┘       └─────────────┘
```

### 6.2 Sanity Schema Definitions

See `constitution.md` Section 3 for detailed schema definitions.

---

## 7. API Specifications

### 7.1 Authentication APIs

#### POST /api/auth/register

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "subscriptionTier": "free"
  }
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Email already registered"
}
```

#### POST /api/auth/login

Handled by NextAuth.js `/api/auth/callback/credentials`

### 7.2 Subscription APIs

#### POST /api/subscription/create-checkout

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request:**
```json
{
  "plan": "monthly" // or "sixMonth"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "checkoutUrl": "/subscription/success?session_id=mock_123",
  "sessionId": "mock_123"
}
```

#### POST /api/subscription/webhook

**Request (from payment provider):**
```json
{
  "type": "checkout.session.completed",
  "data": {
    "sessionId": "mock_123",
    "userId": "user_123",
    "plan": "monthly",
    "amount": 250
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Webhook processed"
}
```

---

## 8. UI/UX Specifications

### 8.1 Design System

**Colors:**
- Primary: `#2C2C2C` (existing)
- Secondary: `#6495ED` (existing)
- Tertiary: `#FFFFFF` (existing)
- Premium Accent: `#FFD700` (Gold for premium badges)
- Success: `#10B981` (for active subscriptions)
- Error: `#EF4444` (for expired/expiry warnings)

**Typography:**
- Headings: Geist Sans (existing)
- Body: Inter (existing)
- Urdu: Noto Nastaliq Urdu (existing)

### 8.2 Component Specifications

#### Login Button (Header)
- Location: Top right corner (desktop), menu (mobile)
- Text: "Login" / "Dashboard" based on auth state
- Style: Secondary color border, hover effect

#### Subscription Cards
- Layout: Side-by-side on desktop, stacked on mobile
- Highlight: 6-Month plan as "Recommended"
- CTA: "Subscribe Now" button

#### Premium Badge
- Icon: Lock or Crown
- Color: Gold gradient
- Placement: Top-right of novel cards

---

## 9. Testing Requirements

### 9.1 Unit Tests

- [ ] Password hashing produces different hashes for same password
- [ ] JWT token contains correct user data
- [ ] Subscription end date calculation is accurate
- [ ] Email validation rejects invalid formats

### 9.2 Integration Tests

- [ ] Registration creates user in Sanity
- [ ] Login returns valid session
- [ ] Payment webhook updates subscription status
- [ ] Middleware redirects unauthenticated users

### 9.3 E2E Tests

- [ ] Complete registration → payment → content access flow
- [ ] Social login flow (Google, Facebook)
- [ ] Subscription expiry blocks access

---

## 10. Deployment Requirements

### 10.1 Environment Setup

- [ ] All environment variables configured
- [ ] Sanity schemas deployed
- [ ] OAuth apps created (Google, Facebook)
- [ ] Webhook endpoints configured

### 10.2 Monitoring

- [ ] Error tracking configured (Sentry or similar)
- [ ] Analytics events for conversions
- [ ] Uptime monitoring enabled

---

## 11. Acceptance Criteria Summary

### Phase 1 (MVP) - Must Have

- [ ] Email/password registration works
- [ ] Google login works
- [ ] Facebook login works
- [ ] Mock payment processes successfully
- [ ] Premium routes protected by middleware
- [ ] Dashboard shows subscription status
- [ ] Premium novels schema created
- [ ] Free content remains accessible

### Phase 2 - Should Have

- [ ] Email verification
- [ ] Password reset
- [ ] Real payment gateway
- [ ] Reading history
- [ ] Bookmarks

### Phase 3 - Nice to Have

- [ ] Favorites
- [ ] Admin dashboard
- [ ] Analytics
- [ ] Referral system

---

## 12. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Security vulnerability | Medium | Critical | Security audit before launch |
| Payment fraud | Medium | High | Server-side verification |
| Downtime during deploy | Low | Medium | Deploy during low-traffic hours |
| Data migration issues | Low | High | Backup before schema changes |

---

## 13. Success Metrics

### 13.1 Technical Metrics

- Authentication success rate: > 99%
- Average login time: < 500ms
- Zero critical security vulnerabilities

### 13.2 Business Metrics

- Conversion rate (free to premium): Target 5%
- Churn rate: < 10% monthly
- Customer lifetime value: > 1500 PKR

---

**Document Approval:**

| Role | Name | Date |
|------|------|------|
| Product Owner | | |
| Tech Lead | | |
| Security Lead | | |

---

**References:**
- Constitution: `.specify/memory/constitution.md`
- Sanity Documentation: https://www.sanity.io/docs
- NextAuth.js Documentation: https://authjs.dev
