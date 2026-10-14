# 🎯 Testing Your Premium Authentication System

## ✅ Quick Test Guide

### Step 1: Create a Test User

**Method 1: Web Interface (Easiest)**
1. Go to: `http://localhost:3000/create-test-user`
2. Click **"Load Monthly User Preset"**
3. Click **"Create Test User"**
4. ✅ User created! Note the credentials shown

**Method 2: Manual in Sanity Studio**
1. Go to: `http://localhost:3000/studio`
2. Create new **User** document
3. Fill in:
   - Email: `premium@test.com`
   - Name: `Premium Test User`
   - Password Hash: `$2a$12$L7gXz9pQJhK3z8xN5vR2mOqW4tY6uI8oP0aS1dF2gH3jK4lM5nO6p`
   - Subscription Tier: `premium`
   - Subscription Plan: `monthly`
   - Payment Status: `completed`
   - Email Verified: `true`
4. Publish

---

### Step 2: Test Login

1. Go to: `http://localhost:3000/login`
2. Enter credentials:
   - **Email:** `premium@test.com`
   - **Password:** `Test1234!`
3. Click **"Login"**
4. ✅ Should redirect to Dashboard

---

### Step 3: Test Dashboard

After logging in, verify:
- ✅ Your name is displayed
- ✅ Subscription status shows "Active"
- ✅ Plan type is shown (Monthly or 6-Month)
- ✅ Days remaining is displayed
- ✅ Quick stats are visible (Reading History, Bookmarks, Favorites)

---

### Step 4: Test Route Protection

1. **Logout** (clear browser cookies or use incognito)
2. Try to access: `http://localhost:3000/dashboard`
3. ✅ Should redirect to `/login`
4. Login again
5. ✅ Should access dashboard successfully

---

### Step 5: Test Checkout Flow (New User)

1. Go to: `http://localhost:3000/premium`
2. Click **"Subscribe Now"** on any plan
3. Fill the checkout form:
   ```
   Email: newuser@example.com
   Name: New User
   Password: Test1234!
   Plan: Monthly
   Accept Terms: ✓
   ```
4. Click **"Pay & Get Premium"**
5. ✅ Should redirect to dashboard
6. ✅ Check Sanity Studio - user should be created with premium status

---

## 🔐 Test Credentials

### Monthly Plan User
- **Email:** `premium@test.com`
- **Password:** `Test1234!`
- **Plan:** Monthly (250 PKR)
- **Status:** Active

### 6-Month Plan User
- **Email:** `sixmonth@test.com`
- **Password:** `Test1234!`
- **Plan:** 6-Month (1350 PKR)
- **Status:** Active

---

## 📊 Test Checklist

### Authentication Tests
- [ ] Can create test user via `/create-test-user`
- [ ] Can login with email/password
- [ ] Can login with Google (if configured)
- [ ] Can login with Facebook (if configured)
- [ ] Invalid credentials show error
- [ ] Logout works correctly

### Premium Access Tests
- [ ] Dashboard shows correct subscription info
- [ ] Days remaining is calculated correctly
- [ ] Can access `/dashboard` when logged in
- [ ] Redirected to login when accessing `/dashboard` logged out
- [ ] Checkout flow creates user successfully
- [ ] Payment is logged in Sanity

### UI/UX Tests
- [ ] Premium landing page displays correctly
- [ ] Pricing shows correct amounts (250/1350 PKR)
- [ ] Checkout form validates all fields
- [ ] Password requirements are enforced
- [ ] Error messages are clear and helpful
- [ ] Success messages confirm actions

---

## 🐛 Common Issues & Solutions

### "Invalid credentials" on login
**Solution:** Verify password hash in Sanity matches `Test1234!`
```
Hash: $2a$12$L7gXz9pQJhK3z8xN5vR2mOqW4tY6uI8oP0aS1dF2gH3jK4lM5nO6p
```

### "User not found"
**Solution:** Create user first using `/create-test-user` page

### Dashboard shows "Payment pending"
**Solution:** In Sanity, set `paymentStatus` to `"completed"`

### Redirect loop
**Solution:** Clear browser cookies and cache

### Checkout doesn't create user
**Solution:** Check browser console for errors, verify Sanity connection

---

## 🌐 Test URLs

| Page | URL |
|------|-----|
| **Create Test User** | http://localhost:3000/create-test-user |
| **Login** | http://localhost:3000/login |
| **Dashboard** | http://localhost:3000/dashboard |
| **Premium Landing** | http://localhost:3000/premium |
| **Checkout** | http://localhost:3000/checkout |
| **Sanity Studio** | http://localhost:3000/studio |
| **Homepage** | http://localhost:3000 |

---

## 📝 Testing Notes

### What to Look For:
1. **Smooth user flow** - No confusing steps
2. **Clear error messages** - Users know what went wrong
3. **Fast response times** - < 500ms for login
4. **Proper redirects** - No broken links
5. **Consistent UI** - Matches existing design
6. **Mobile responsive** - Works on all screen sizes

### Report Issues:
- Note the exact steps to reproduce
- Include browser console errors
- Screenshot if applicable
- Test in multiple browsers

---

## ✅ Success Criteria

Your premium authentication system is working correctly if:

1. ✅ Can create test users easily
2. ✅ Login works with email/password
3. ✅ Dashboard shows subscription status
4. ✅ Premium routes are protected
5. ✅ Checkout creates users successfully
6. ✅ Free content remains accessible
7. ✅ UI matches existing design
8. ✅ No console errors

---

## 🎉 Ready for Production?

Before going live, ensure:

- [ ] All tests pass
- [ ] Real payment gateway integrated (not mock)
- [ ] Email verification enabled
- [ ] Password reset flow working
- [ ] Security audit completed
- [ ] Terms & Privacy updated
- [ ] Test users deleted
- [ ] Monitoring configured

---

**Happy Testing! 🚀**

For issues, check browser console and Sanity Studio logs.
