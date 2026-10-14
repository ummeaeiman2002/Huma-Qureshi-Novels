# Payment-First Authentication Flow

**Decision Date:** March 13, 2026

**Status:** Approved

---

## Executive Summary

Changed from traditional registration-first flow to **payment-first authentication**. This is a more secure and business-aligned approach where payment is the sole gateway to premium access.

---

## Key Changes

### Before (Registration-First)
```
Register → Login → Browse Plans → Payment → Premium Access
```

### After (Payment-First)
```
Browse Plans → Payment → Auto-Register + Auto-Login → Premium Access
```

---

## Why Payment-First?

### Security Benefits
1. **No Free Accounts:** Zero unpaid users in the system
2. **Payment Gate:** Impossible to bypass payment
3. **Simplified Logic:** No tier checking (all authenticated users are premium)
4. **Reduced Attack Surface:** No standalone registration endpoint to exploit

### Business Benefits
1. **Clear Value:** Users pay before accessing, ensuring commitment
2. **No Free Tier Confusion:** Free users don't have accounts
3. **Better Conversion:** Payment is the focus, not an afterthought
4. **Simplified UX:** One flow for everything

### Technical Benefits
1. **Simpler Schema:** `subscriptionTier` always = "premium"
2. **Fewer States:** No "free" → "premium" transition logic
3. **Atomic Operation:** Payment + Registration happen together
4. **Cleaner Middleware:** Check payment status, not tier

---

## Updated User Flow

### Step 1: Premium Landing
- User clicks "Go Premium" from homepage
- Sees benefits, pricing, comparison with free tier
- No login required

### Step 2: Plan Selection
- Choose Monthly (250 PKR) or 6-Month (1350 PKR)
- Clear pricing displayed

### Step 3: Checkout Form
User enters:
- Email (will be their login)
- Password (must meet requirements)
- Name
- Payment details (mock for now)
- Terms & conditions acceptance

### Step 4: Payment Processing
- Mock payment gateway (2-3 second delay)
- Simulates success/failure

### Step 5a: Payment Success
**Atomic Operation:**
1. Create user in Sanity with:
   - `subscriptionTier: "premium"`
   - `subscriptionPlan: "monthly" | "sixMonth"`
   - `subscriptionStartDate: now()`
   - `subscriptionEndDate: calculated`
   - `paymentStatus: "completed"`
2. Auto-login user (create session)
3. Log payment transaction
4. Redirect to `/dashboard`

### Step 5b: Payment Failure
- Show error message
- No account created
- Return to checkout form
- User can retry

---

## Schema Changes

### User Schema
```typescript
{
  // ... other fields
  subscriptionTier: { 
    type: "string", 
    options: { list: ["premium"] }, // ONLY premium, no "free"
    initialValue: "premium" 
  },
  paymentStatus: {
    type: "string",
    options: { 
      list: ["completed", "pending", "failed", "refunded"] 
    },
    initialValue: "pending"
  },
  // ... other fields
}
```

### Key Points:
- `subscriptionTier` is ALWAYS "premium" for authenticated users
- `paymentStatus` tracks payment completion
- No "free" tier exists in the authentication system

---

## API Changes

### Removed Endpoints
- ❌ `POST /api/auth/register` (no standalone registration)

### New Endpoints
- ✅ `POST /api/checkout` (payment + auto-registration)
- ✅ `POST /api/checkout/confirm` (payment confirmation)

### Modified Endpoints
- 🔄 `POST /api/auth/login` (unchanged, for existing users)
- 🔄 `POST /api/subscription/webhook` (updates payment status)

---

## Checkout API Flow

```typescript
// POST /api/checkout
export async function POST(request: Request) {
  const body = await request.json();
  
  // 1. Validate input
  const validated = checkoutSchema.safeParse(body);
  if (!validated.success) {
    return error(400, "Invalid input");
  }
  
  // 2. Process payment (mock)
  const paymentResult = await processMockPayment(body.payment);
  if (!paymentResult.success) {
    return error(400, "Payment failed");
  }
  
  // 3. Check if user exists
  const existingUser = await getUserByEmail(body.email);
  
  if (existingUser) {
    // User exists - update subscription
    await updateSubscription(existingUser._id, body.plan);
    await loginUser(existingUser);
  } else {
    // New user - create account + login
    const newUser = await createUser({
      email: body.email,
      passwordHash: await hashPassword(body.password),
      name: body.name,
      subscriptionTier: "premium", // ALWAYS premium
      subscriptionPlan: body.plan,
      paymentStatus: "completed",
    });
    await loginUser(newUser);
  }
  
  // 4. Log payment transaction
  await logPayment({
    userId: user._id,
    amount: PRICING[body.plan].price,
    status: "completed",
  });
  
  // 5. Return success (user is now logged in)
  return success({ redirect: "/dashboard" });
}
```

---

## Middleware Changes

### Before
```typescript
if (!session || session.user.subscriptionTier !== "premium") {
  redirect("/login");
}
```

### After
```typescript
if (!session) {
  redirect("/login");
}

// All authenticated users are premium, but check payment status
if (session.user.paymentStatus !== "completed") {
  redirect("/checkout/complete-payment");
}
```

---

## UI Changes

### New Pages
1. `/premium` - Premium landing page (benefits, pricing)
2. `/checkout` - Checkout form (plan selection, user info, payment)
3. `/checkout/success` - Payment success confirmation
4. `/checkout/failed` - Payment failure handling

### Removed Pages
- ❌ `/register` (no standalone registration)

### Modified Pages
- 🔄 `/login` - Now only for existing premium users
- 🔄 Header - "Go Premium" button instead of "Register"

---

## Security Implications

### Positive
✅ No unpaid accounts possible
✅ Payment is atomic with registration
✅ Simpler access control (all authenticated = premium)
✅ Reduced attack surface (no registration endpoint)

### Considerations
⚠️ Must ensure payment verification is robust
⚠️ Mock payment must be replaced before production
⚠️ Webhook signature verification critical for real payments

---

## Testing Strategy

### Test Cases

1. **Payment Success Flow**
   - [ ] New user completes payment
   - [ ] Account created with premium tier
   - [ ] User auto-logged in
   - [ ] Redirected to dashboard
   - [ ] Can access premium content

2. **Payment Failure Flow**
   - [ ] Payment fails
   - [ ] No account created
   - [ ] User can retry
   - [ ] Error message shown

3. **Existing User Login**
   - [ ] User with account can login
   - [ ] Session created
   - [ ] Can access premium content

4. **Middleware Protection**
   - [ ] Unauthenticated user blocked from premium routes
   - [ ] User with failed payment blocked
   - [ ] Premium user has full access

---

## Migration Notes

### For Existing Free Content
- ✅ No changes required
- ✅ Free novels/PDFs remain accessible
- ✅ No authentication needed for free tier

### For Future Premium Content
- ✅ Premium schemas ready
- ✅ Middleware protects routes
- ✅ Payment gate ensures only paying users access

---

## Rollback Plan

If issues arise:
1. Disable checkout endpoint
2. Show maintenance page for premium
3. Keep free tier operational
4. Fix issues in staging
5. Redeploy

---

## Success Metrics

### Technical
- [ ] Payment success rate > 95%
- [ ] Account creation success rate > 99%
- [ ] Auto-login success rate 100%
- [ ] Zero unpaid premium access

### Business
- [ ] Conversion rate from landing to payment
- [ ] Payment failure rate < 5%
- [ ] User complaints about flow < 1%

---

## Next Steps

1. ✅ Update constitution with payment-first flow
2. ✅ Update spec document
3. ✅ Update tasks with new API structure
4. ⏳ Begin implementation (Phase 1)

---

**Approved By:** Client

**Implementation Lead:** Development Team

**Target Completion:** 25 days from approval
