# Authentication & Premium Tier - Implementation Tasks

**Task Spec ID:** AUTH-001-TASKS

**Based on Plan:** AUTH-001-PLAN

**Created:** March 13, 2026

---

## Phase 1: Foundation & Authentication

### Task 1.1: Install Dependencies

**ID:** AUTH-T001

**Priority:** P0

**Estimated Time:** 30 minutes

**Description:**
Install all required npm packages for authentication and payment functionality.

**Commands:**
```bash
npm install next-auth@beta bcryptjs @types/bcryptjs zod stripe
```

**Acceptance Criteria:**
- [ ] All packages installed successfully
- [ ] No npm audit vulnerabilities (critical)
- [ ] package.json updated with new dependencies
- [ ] package-lock.json committed

**Files Modified:**
- `package.json`
- `package-lock.json`

---

### Task 1.2: Create Environment Variables

**ID:** AUTH-T002

**Priority:** P0

**Estimated Time:** 30 minutes

**Description:**
Create environment variable template and configure local development.

**Steps:**
1. Create `.env.local` file
2. Generate NEXTAUTH_SECRET
3. Configure Sanity variables
4. Set up OAuth credentials

**Environment Variables:**
```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET= # Generate with: openssl rand -base64 32

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-06-12

# OAuth (to be configured)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=

# Mock Payment
MOCK_PAYMENT_ENABLED=true

# Application
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Acceptance Criteria:**
- [ ] `.env.local` created
- [ ] `.env.example` created (without secrets)
- [ ] `.env.local` added to `.gitignore`
- [ ] All variables documented

**Files Created:**
- `.env.local`
- `.env.example`

**Files Modified:**
- `.gitignore` (verify .env.local is excluded)

---

### Task 1.3: Create Sanity User Schema

**ID:** AUTH-T003

**Priority:** P0

**Estimated Time:** 1 hour

**Description:**
Create the user schema in Sanity for storing authentication data.

**Schema Definition:**
```typescript
// src/sanity/schemaTypes/user.ts
import { defineField, defineType } from "sanity";

export const user = defineType({
  name: "user",
  type: "document",
  title: "User",
  fields: [
    defineField({
      name: "email",
      type: "string",
      title: "Email",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "passwordHash",
      type: "string",
      title: "Password Hash",
      hidden: true,
    }),
    defineField({
      name: "name",
      type: "string",
      title: "Name",
    }),
    defineField({
      name: "image",
      type: "string",
      title: "Profile Image URL",
    }),
    defineField({
      name: "emailVerified",
      type: "boolean",
      title: "Email Verified",
      initialValue: false,
    }),
    defineField({
      name: "subscriptionTier",
      type: "string",
      title: "Subscription Tier",
      options: {
        list: [
          { title: "Free", value: "free" },
          { title: "Premium", value: "premium" },
        ],
      },
      initialValue: "free",
    }),
    defineField({
      name: "subscriptionPlan",
      type: "string",
      title: "Subscription Plan",
      options: {
        list: [
          { title: "Monthly", value: "monthly" },
          { title: "6 Month", value: "sixMonth" },
          { title: "None", value: null },
        ],
      },
    }),
    defineField({
      name: "subscriptionStartDate",
      type: "datetime",
      title: "Subscription Start Date",
    }),
    defineField({
      name: "subscriptionEndDate",
      type: "datetime",
      title: "Subscription End Date",
    }),
    defineField({
      name: "stripeCustomerId",
      type: "string",
      title: "Stripe Customer ID",
      hidden: true,
    }),
    defineField({
      name: "readingHistory",
      type: "array",
      title: "Reading History",
      of: [
        {
          type: "reference",
          to: [
            { type: "premiumNovel" },
            { type: "premiumEpisode" },
          ],
        },
      ],
    }),
    defineField({
      name: "bookmarks",
      type: "array",
      title: "Bookmarks",
      of: [
        {
          type: "reference",
          to: [{ type: "premiumEpisode" }],
        },
      ],
    }),
    defineField({
      name: "favorites",
      type: "array",
      title: "Favorites",
      of: [
        {
          type: "reference",
          to: [{ type: "premiumNovel" }],
        },
      ],
    }),
    defineField({
      name: "createdAt",
      type: "datetime",
      title: "Created At",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "updatedAt",
      type: "datetime",
      title: "Updated At",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  previews: {
    select: {
      title: "email",
      subtitle: "subscriptionTier",
    },
  },
});
```

**Acceptance Criteria:**
- [ ] Schema file created
- [ ] Schema added to `schemaTypes/index.ts`
- [ ] Schema deployed to Sanity
- [ ] Can create user manually in Sanity Studio

**Files Created:**
- `src/sanity/schemaTypes/user.ts`

**Files Modified:**
- `src/sanity/schemaTypes/index.ts`

---

### Task 1.4: Create Sanity Premium Novel Schema

**ID:** AUTH-T004

**Priority:** P0

**Estimated Time:** 1 hour

**Description:**
Create schema for premium novels (separate from free novels).

**Schema Definition:**
```typescript
// src/sanity/schemaTypes/premiumNovel.ts
import { defineField, defineType } from "sanity";

export const premiumNovel = defineType({
  name: "premiumNovel",
  type: "document",
  title: "Premium Novel",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      title: "Slug",
      options: {
        source: "title",
        maxLength: 96,
      },
    }),
    defineField({
      name: "description",
      type: "array",
      title: "Description",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading 2", value: "h2" },
            { title: "Heading 3", value: "h3" },
          ],
        },
      ],
    }),
    defineField({
      name: "banner",
      type: "string",
      title: "Banner URL",
    }),
    defineField({
      name: "writer",
      type: "reference",
      title: "Writer",
      to: [{ type: "writer" }],
    }),
    defineField({
      name: "genre",
      type: "reference",
      title: "Genre",
      to: [{ type: "genre" }],
    }),
    defineField({
      name: "tags",
      type: "array",
      title: "Tags",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "isPremium",
      type: "boolean",
      title: "Is Premium",
      initialValue: true,
      hidden: true,
    }),
    defineField({
      name: "releaseDate",
      type: "datetime",
      title: "Release Date",
    }),
    defineField({
      name: "createdAt",
      type: "datetime",
      title: "Created At",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  previews: {
    select: {
      title: "title",
      subtitle: "writer.writername",
    },
  },
});
```

**Acceptance Criteria:**
- [ ] Schema file created
- [ ] Schema added to index
- [ ] Schema deployed to Sanity

**Files Created:**
- `src/sanity/schemaTypes/premiumNovel.ts`

**Files Modified:**
- `src/sanity/schemaTypes/index.ts`

---

### Task 1.5: Create Sanity Premium Episode Schema

**ID:** AUTH-T005

**Priority:** P0

**Estimated Time:** 1 hour

**Description:**
Create schema for premium episodes.

**Schema Definition:**
```typescript
// src/sanity/schemaTypes/premiumEpisode.ts
import { defineField, defineType } from "sanity";

export const premiumEpisode = defineType({
  name: "premiumEpisode",
  type: "document",
  title: "Premium Episode",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Episode Title",
    }),
    defineField({
      name: "episodeNumber",
      type: "string",
      title: "Episode Number/Name",
    }),
    defineField({
      name: "slug",
      type: "slug",
      title: "Episode Slug",
      options: {
        source: "episodeNumber",
      },
    }),
    defineField({
      name: "premiumNovel",
      type: "reference",
      title: "Premium Novel",
      to: [{ type: "premiumNovel" }],
    }),
    defineField({
      name: "body",
      type: "text",
      title: "Episode Content",
    }),
    defineField({
      name: "releaseDate",
      type: "datetime",
      title: "Release Date",
    }),
    defineField({
      name: "isPremium",
      type: "boolean",
      title: "Is Premium",
      initialValue: true,
      hidden: true,
    }),
    defineField({
      name: "views",
      type: "number",
      title: "Views",
      initialValue: 0,
    }),
  ],
  previews: {
    select: {
      title: "title",
      media: "premiumNovel.title",
    },
  },
});
```

**Acceptance Criteria:**
- [ ] Schema file created
- [ ] Schema added to index
- [ ] Schema deployed to Sanity

**Files Created:**
- `src/sanity/schemaTypes/premiumEpisode.ts`

**Files Modified:**
- `src/sanity/schemaTypes/index.ts`

---

### Task 1.6: Create Sanity Subscription Schema

**ID:** AUTH-T006

**Priority:** P1

**Estimated Time:** 45 minutes

**Description:**
Create schema for tracking subscriptions.

**Schema Definition:**
```typescript
// src/sanity/schemaTypes/subscription.ts
import { defineField, defineType } from "sanity";

export const subscription = defineType({
  name: "subscription",
  type: "document",
  title: "Subscription",
  fields: [
    defineField({
      name: "user",
      type: "reference",
      title: "User",
      to: [{ type: "user" }],
    }),
    defineField({
      name: "plan",
      type: "string",
      title: "Plan",
      options: {
        list: [
          { title: "Monthly", value: "monthly" },
          { title: "6 Month", value: "sixMonth" },
        ],
      },
    }),
    defineField({
      name: "status",
      type: "string",
      title: "Status",
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Cancelled", value: "cancelled" },
          { title: "Expired", value: "expired" },
        ],
      },
    }),
    defineField({
      name: "startDate",
      type: "datetime",
      title: "Start Date",
    }),
    defineField({
      name: "endDate",
      type: "datetime",
      title: "End Date",
    }),
    defineField({
      name: "amount",
      type: "number",
      title: "Amount (PKR)",
    }),
    defineField({
      name: "stripeSubscriptionId",
      type: "string",
      title: "Stripe Subscription ID",
      hidden: true,
    }),
    defineField({
      name: "createdAt",
      type: "datetime",
      title: "Created At",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  previews: {
    select: {
      title: "user.email",
      subtitle: "plan",
    },
  },
});
```

**Acceptance Criteria:**
- [ ] Schema file created
- [ ] Schema added to index
- [ ] Schema deployed to Sanity

**Files Created:**
- `src/sanity/schemaTypes/subscription.ts`

**Files Modified:**
- `src/sanity/schemaTypes/index.ts`

---

### Task 1.7: Create Sanity Payment Schema

**ID:** AUTH-T007

**Priority:** P1

**Estimated Time:** 45 minutes

**Description:**
Create schema for payment transactions.

**Schema Definition:**
```typescript
// src/sanity/schemaTypes/payment.ts
import { defineField, defineType } from "sanity";

export const payment = defineType({
  name: "payment",
  type: "document",
  title: "Payment Transaction",
  fields: [
    defineField({
      name: "user",
      type: "reference",
      title: "User",
      to: [{ type: "user" }],
    }),
    defineField({
      name: "amount",
      type: "number",
      title: "Amount (PKR)",
    }),
    defineField({
      name: "currency",
      type: "string",
      title: "Currency",
      initialValue: "PKR",
    }),
    defineField({
      name: "status",
      type: "string",
      title: "Status",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Completed", value: "completed" },
          { title: "Failed", value: "failed" },
          { title: "Refunded", value: "refunded" },
        ],
      },
    }),
    defineField({
      name: "stripePaymentIntentId",
      type: "string",
      title: "Stripe Payment Intent ID",
      hidden: true,
    }),
    defineField({
      name: "stripeCheckoutSessionId",
      type: "string",
      title: "Stripe Checkout Session ID",
      hidden: true,
    }),
    defineField({
      name: "plan",
      type: "string",
      title: "Plan",
      options: {
        list: [
          { title: "Monthly", value: "monthly" },
          { title: "6 Month", value: "sixMonth" },
        ],
      },
    }),
    defineField({
      name: "createdAt",
      type: "datetime",
      title: "Created At",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "metadata",
      type: "object",
      title: "Metadata",
      fields: [
        { name: "ip", type: "string", title: "IP Address" },
        { name: "userAgent", type: "string", title: "User Agent" },
      ],
    }),
  ],
  previews: {
    select: {
      title: "user.email",
      subtitle: "status",
    },
  },
});
```

**Acceptance Criteria:**
- [ ] Schema file created
- [ ] Schema added to index
- [ ] Schema deployed to Sanity

**Files Created:**
- `src/sanity/schemaTypes/payment.ts`

**Files Modified:**
- `src/sanity/schemaTypes/index.ts`

---

### Task 1.8: Update Sanity Schema Index

**ID:** AUTH-T008

**Priority:** P0

**Estimated Time:** 15 minutes

**Description:**
Register all new schemas in the index file.

**Code:**
```typescript
// src/sanity/schemaTypes/index.ts
import { type SchemaTypeDefinition } from "sanity";
import { novel } from "./novel";
import { writer } from "./writer";
import { genre } from "./genre";
import { comment } from "./comment";
import { novelparent } from "./novelparent";
import { pdf } from "./pdf";
import { systemConfig } from "./systemConfig";

// New auth schemas
import { user } from "./user";
import { premiumNovel } from "./premiumNovel";
import { premiumEpisode } from "./premiumEpisode";
import { subscription } from "./subscription";
import { payment } from "./payment";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    novel,
    writer,
    genre,
    comment,
    novelparent,
    pdf,
    systemConfig,
    // Auth schemas
    user,
    premiumNovel,
    premiumEpisode,
    subscription,
    payment,
  ],
};
```

**Acceptance Criteria:**
- [ ] All schemas imported
- [ ] All schemas exported in types array
- [ ] Sanity Studio loads without errors

**Files Modified:**
- `src/sanity/schemaTypes/index.ts`

---

### Task 2.1: Create NextAuth Configuration

**ID:** AUTH-T009

**Priority:** P0

**Estimated Time:** 2 hours

**Description:**
Create the main NextAuth.js configuration file.

**Code:**
```typescript
// src/auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { sanityClient } from "@/sanity/lib/client";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validated = loginSchema.safeParse(credentials);
        
        if (!validated.success) {
          return null;
        }

        const { email, password } = validated.data;

        const user = await sanityClient.fetch(
          `*[_type == "user" && email == $email][0]`,
          { email }
        );

        if (!user || !user.passwordHash) {
          return null;
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);

        if (!isMatch) {
          return null;
        }

        return {
          id: user._id,
          email: user.email,
          name: user.name,
          image: user.image,
          subscriptionTier: user.subscriptionTier,
          subscriptionEndDate: user.subscriptionEndDate,
        };
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" || account?.provider === "facebook") {
        // Check if user exists
        const existingUser = await sanityClient.fetch(
          `*[_type == "user" && email == $email][0]`,
          { email: user.email }
        );

        if (!existingUser) {
          // Create new user
          const newUser = {
            _type: "user",
            email: user.email!,
            name: user.name!,
            image: user.image!,
            emailVerified: true,
            subscriptionTier: "free",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          const created = await sanityClient.create(newUser);
          user.id = created._id;
        } else {
          user.id = existingUser._id;
          user.subscriptionTier = existingUser.subscriptionTier;
          user.subscriptionEndDate = existingUser.subscriptionEndDate;
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.subscriptionTier = user.subscriptionTier;
        token.subscriptionEndDate = user.subscriptionEndDate;
      }
      
      if (trigger === "update" && session) {
        token.subscriptionTier = session.subscriptionTier;
        token.subscriptionEndDate = session.subscriptionEndDate;
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.subscriptionTier = token.subscriptionTier as string;
        session.user.subscriptionEndDate = token.subscriptionEndDate as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
  },
});
```

**Acceptance Criteria:**
- [ ] NextAuth configured
- [ ] Credentials provider working
- [ ] Google provider configured
- [ ] Facebook provider configured
- [ ] JWT callbacks include subscription data

**Files Created:**
- `src/auth.ts`

---

### Task 2.2: Create Zod Validation Schemas

**ID:** AUTH-T010

**Priority:** P0

**Estimated Time:** 30 minutes

**Description:**
Create reusable validation schemas for authentication.

**Code:**
```typescript
// src/types/auth.ts
import { z } from "zod";

export const registerSchema = z.object({
  email: z.string()
    .email("Invalid email address")
    .min(1, "Email is required"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
});

export const loginSchema = z.object({
  email: z.string()
    .email("Invalid email address")
    .min(1, "Email is required"),
  password: z.string()
    .min(1, "Password is required"),
});

export const subscriptionSchema = z.object({
  plan: z.enum(["monthly", "sixMonth"]),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type SubscriptionInput = z.infer<typeof subscriptionSchema>;
```

**Acceptance Criteria:**
- [ ] All schemas defined
- [ ] Types exported
- [ ] Used in API routes

**Files Created:**
- `src/types/auth.ts`

---

I'll continue with more detailed tasks. Let me know when you're ready to proceed with the implementation or if you'd like me to create more task specifications!
