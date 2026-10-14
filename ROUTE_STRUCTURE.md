# Premium Route Structure - User ID Based

## 🎯 New Routing Architecture

All premium user routes now include the user ID in the URL path for better organization and security.

---

## 📁 Route Structure

### Old Structure (❌ Deprecated)
```
/dashboard
/bookmarks
/history
/favorites
```

### New Structure (✅ Current)
```
/[userId]/dashboard
/[userId]/bookmarks
/[userId]/history
/[userId]/favorites
```

---

## 🔗 Complete Route Map

### Authentication Routes
| Route | Purpose | Auth Required |
|-------|---------|---------------|
| `/login` | Login page | No |
| `/checkout` | Payment checkout | No |
| `/create-test-user` | Create test user | No |

### Premium User Routes
| Route | Purpose | Auth Required |
|-------|---------|---------------|
| `/[userId]/dashboard` | User dashboard | Yes |
| `/[userId]/bookmarks` | User bookmarks | Yes |
| `/[userId]/history` | Reading history | Yes |
| `/[userId]/favorites` | Favorite novels | Yes |
| `/[userId]/subscription` | Subscription details | Yes |
| `/[userId]/subscription/renew` | Renew subscription | Yes |

### Public Routes (Unchanged)
| Route | Purpose |
|-------|---------|
| `/` | Homepage |
| `/premium` | Premium landing page |
| `/novel` | Free novels listing |
| `/pdf` | Free PDFs listing |
| `/about` | About page |
| `/contact` | Contact page |

---

## 🔄 Automatic Redirects

The middleware automatically handles redirects:

### Scenario 1: User accesses old `/dashboard`
```
User visits: /dashboard
Middleware redirects: /{userId}/dashboard
```

### Scenario 2: User logs in
```
User logs in with: premium@test.com
Middleware redirects: /{userId}/dashboard
```

### Scenario 3: User accesses another user's dashboard
```
User A tries: /userBId/dashboard
Middleware redirects: /userAId/dashboard (their own)
```

### Scenario 4: Logged-in user visits auth routes
```
Logged-in user visits: /login or /checkout
Middleware redirects: /{userId}/dashboard
```

---

## 🔒 Security Features

### User ID Validation
- Dashboard checks if URL userId matches session userId
- Mismatch triggers automatic redirect to correct dashboard
- Prevents users from accessing other users' data

### Route Protection
- All `/[userId]/*` routes require authentication
- Payment status must be "completed"
- Expired subscriptions redirect to checkout

---

## 📝 Example URLs

### After Login
```
User: premium@test.com (ID: abc123)
Redirects to: http://localhost:3000/abc123/dashboard
```

### After Checkout
```
New user created (ID: xyz789)
Redirects to: http://localhost:3000/xyz789/dashboard
```

### Manual Navigation
```
User tries: /dashboard
Redirects to: /{theirUserId}/dashboard
```

---

## 🧪 Testing the New Routes

### Test 1: Login Flow
1. Go to `/login`
2. Login with: `premium@test.com` / `Test1234!`
3. ✅ Should redirect to `/{userId}/dashboard`
4. ✅ URL should show your user ID

### Test 2: Checkout Flow
1. Go to `/checkout`
2. Create new user
3. ✅ Should redirect to `/{newUserId}/dashboard`
4. ✅ Check URL contains new user ID

### Test 3: Old Route Redirect
1. Login successfully
2. Manually visit: `/dashboard`
3. ✅ Should auto-redirect to `/{userId}/dashboard`

### Test 4: Protected Route
1. Logout
2. Try to visit: `/abc123/dashboard` (any user ID)
3. ✅ Should redirect to `/login`
4. ✅ After login, redirect back to user dashboard

---

## 🔧 Middleware Logic

```typescript
// Simplified middleware logic
if (pathname matches /[userId]/*) {
  if (!session) {
    redirect to /login
  }
  if (paymentStatus !== "completed") {
    redirect to /checkout
  }
  if (userId !== session.userId) {
    redirect to /{session.userId}/dashboard
  }
}

if (pathname === "/dashboard") {
  redirect to /{session.userId}/dashboard
}
```

---

## 📊 Benefits of User ID Routes

### ✅ Organization
- Clear ownership of user-specific content
- Easy to identify whose dashboard/profile
- Scalable for future features

### ✅ Security
- User-specific validation
- Prevents cross-user data access
- Clear audit trail

### ✅ Performance
- Easier caching strategies
- CDN can cache per user
- Reduced database queries

### ✅ User Experience
- Direct links to user content
- Shareable profile URLs
- Clear navigation structure

---

## 🚨 Important Notes

1. **User IDs are Sanity Document IDs**
   - Format: alphanumeric (e.g., `abc123def456`)
   - Unique per user
   - Assigned automatically by Sanity

2. **Old Routes Still Work (with redirect)**
   - `/dashboard` → redirects to `/{userId}/dashboard`
   - Backwards compatible
   - SEO-friendly redirects

3. **Session Includes User ID**
   - `session.user.id` contains Sanity document ID
   - Used for route validation
   - Checked on every premium request

---

## 📞 Quick Reference

| Action | URL Pattern |
|--------|-------------|
| **Your Dashboard** | `/{yourUserId}/dashboard` |
| **Your Bookmarks** | `/{yourUserId}/bookmarks` |
| **Your History** | `/{yourUserId}/history` |
| **Login** | `/login` |
| **Checkout** | `/checkout` |
| **Premium Info** | `/premium` |

---

**Implementation Date:** March 13, 2026

**Status:** ✅ Active

**Backwards Compatible:** Yes (with redirects)
