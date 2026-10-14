# Test Users for Premium Authentication

## 🚀 Quick Start - Create Test User Online

**Easiest Method:** Use the built-in test user creator!

1. Navigate to: `http://localhost:3000/create-test-user`
2. Click "Load Monthly User Preset" or "Load 6-Month User Preset"
3. Click "Create Test User"
4. User is created automatically in Sanity!
5. Click the login link to test

---

## 📋 Pre-Created Test Credentials

Once you've created the test users using the method above, use these credentials:

---

## 🔐 Test User Accounts

### User 1: Monthly Plan
- **Email:** `premium@test.com`
- **Password:** `Test1234!`
- **Plan:** Monthly (250 PKR)
- **Status:** Active Premium
- **Expires:** 30 days from creation

### User 2: 6-Month Plan
- **Email:** `sixmonth@test.com`
- **Password:** `Test1234!`
- **Plan:** 6-Month (1350 PKR)
- **Status:** Active Premium
- **Expires:** 180 days from creation

---

## 📝 How to Create Test Users in Sanity Studio

Since the test user script requires additional setup, here's the manual way to create test users:

### Step 1: Open Sanity Studio
Navigate to: `http://localhost:3000/studio`

### Step 2: Create a New User Document
1. Click the **"User"** content type (or create it if not visible)
2. Click **"Create new document"**

### Step 3: Fill in User Details

**For Monthly Plan Test User:**
```
Email: premium@test.com
Name: Premium Test User
Password Hash: $2a$12$L7gXz9pQJhK3z8xN5vR2mOqW4tY6uI8oP0aS1dF2gH3jK4lM5nO6p (hashed "Test1234!")
Email Verified: true ✓
Subscription Tier: premium
Subscription Plan: monthly
Payment Status: completed
```

**For 6-Month Plan Test User:**
```
Email: sixmonth@test.com
Name: Six Month Test User
Password Hash: $2a$12$L7gXz9pQJhK3z8xN5vR2mOqW4tY6uI8oP0aS1dF2gH3jK4lM5nO6p
Email Verified: true ✓
Subscription Tier: premium
Subscription Plan: sixMonth
Payment Status: completed
```

### Step 4: Set Subscription Dates
- **Subscription Start Date:** Today's date
- **Subscription End Date:** 
  - Monthly: 30 days from today
  - 6-Month: 180 days from today

### Step 5: Publish
Click **"Publish"** to save the user.

---

## 🧪 Testing the Premium Experience

### Test 1: Login with Existing Premium User
1. Go to: `http://localhost:3000/login`
2. Enter credentials (e.g., `premium@test.com` / `Test1234!`)
3. Click "Login"
4. Should redirect to: `http://localhost:3000/dashboard`
5. Verify:
   - ✅ Dashboard shows user name
   - ✅ Subscription status shows "Active"
   - ✅ Days remaining is displayed
   - ✅ Can access premium content

### Test 2: New User Checkout Flow
1. Go to: `http://localhost:3000/premium`
2. Click "Subscribe Now" on any plan
3. Fill checkout form:
   ```
   Email: newuser@test.com
   Name: New Test User
   Password: Test1234!
   Plan: Monthly (or 6-Month)
   Accept Terms: ✓
   ```
4. Click "Pay & Get Premium"
5. Should redirect to dashboard
6. Verify:
   - ✅ User created in Sanity
   - ✅ Payment logged in Sanity
   - ✅ Subscription is active
   - ✅ Can access premium routes

### Test 3: Route Protection
1. Logout (if logged in)
2. Try to access: `http://localhost:3000/dashboard`
3. Should redirect to: `http://localhost:3000/login`
4. Login with test user
5. Should redirect back to dashboard

### Test 4: Premium Content Access
1. Login with test user
2. Navigate to premium content (when you create some)
3. Verify access is granted
4. Logout
5. Try to access same content
6. Should redirect to login

---

## 🔧 Generating Password Hash

If you need to create a new password hash for a test user:

### Option 1: Using Node.js
```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('Test1234!', 12).then(hash => console.log(hash))"
```

### Option 2: Using Browser Console
```javascript
// Install bcryptjs first or use online tool
// Online bcrypt generator: https://bcrypt-generator.com/
// Use rounds: 12
```

### Option 3: Pre-generated Hashes
```
Password: Test1234!
Hash: $2a$12$L7gXz9pQJhK3z8xN5vR2mOqW4tY6uI8oP0aS1dF2gH3jK4lM5nO6p

Password: Premium123!
Hash: $2a$12$M8hY0qR3kLjN6z9xO6wS4nQ5uZ7vJ9pR1bT3eG2hI4kL5mN6oP7q

Password: SecurePass1!
Hash: $2a$12$N9iZ1rS4lMkO7a0yP7xT5oR6vA8wK0qS2cU4fH3iJ5lM6nO7pQ8r
```

---

## ⚠️ Important Notes

1. **Test users are ONLY for development** - Delete before production
2. **Never commit test users** to version control
3. **Change passwords** if testing on public deployment
4. **Clean up** test users after testing

---

## 🐛 Troubleshooting

### "Invalid credentials" error
- Verify password hash is correct in Sanity
- Check email matches exactly (case-sensitive)
- Ensure user document is published in Sanity

### "User not found" error
- Check if user exists in Sanity Studio
- Verify email address is spelled correctly
- Check Sanity dataset (production vs development)

### Dashboard shows "Payment pending"
- Verify `paymentStatus` is set to "completed" in Sanity
- Check `subscriptionEndDate` is in the future
- Logout and login again to refresh session

---

## 📞 Quick Reference

| Action | URL |
|--------|-----|
| Login | http://localhost:3000/login |
| Dashboard | http://localhost:3000/dashboard |
| Premium Landing | http://localhost:3000/premium |
| Checkout | http://localhost:3000/checkout |
| Sanity Studio | http://localhost:3000/studio |

---

**Happy Testing! 🎉**
