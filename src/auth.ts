import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { client } from "@/sanity/lib/client";

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
      // async authorize(credentials) {
      //   const validated = loginSchema.safeParse(credentials);

      //   if (!validated.success) {
      //     return null;
      //   }

      //   const { email, password } = validated.data;

      //   const user = await client.fetch(
      //     `*[_type == "user" && email == $email][0]{
      //       _id,
      //       email,
      //       name,
      //       image,
      //       passwordHash,
      //       subscriptionTier,
      //       subscriptionPlan,
      //       subscriptionEndDate,
      //       paymentStatus
      //     }`,
      //     { email }
      //   );

      //   if (!user || !user.passwordHash) {
      //     return null;
      //   }

      //   const isMatch = await bcrypt.compare(password, user.passwordHash);

      //   if (!isMatch) {
      //     return null;
      //   }

      //   return {
      //     id: user._id,
      //     email: user.email,
      //     name: user.name,
      //     image: user.image,
      //     // subscriptionTier: user.subscriptionTier,
      //     // subscriptionPlan: user.subscriptionPlan,
      //     // subscriptionEndDate: user.subscriptionEndDate,
      //     // paymentStatus: user.paymentStatus,
      //   };
      // },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        // token.subscriptionTier = user.subscriptionTier;
        // token.subscriptionPlan = user.subscriptionPlan;
        // token.subscriptionEndDate = user.subscriptionEndDate;
        // token.paymentStatus = user.paymentStatus;
      }

      if (trigger === "update" && session) {
        // token.subscriptionTier = session.subscriptionTier;
        // token.subscriptionPlan = session.subscriptionPlan;
        // token.subscriptionEndDate = session.subscriptionEndDate;
        // token.paymentStatus = session.paymentStatus;
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        // session.user.subscriptionTier = token.subscriptionTier as "premium";
        // session.user.subscriptionPlan = token.subscriptionPlan as "monthly" | "sixMonth";
        // session.user.subscriptionEndDate = token.subscriptionEndDate as string;
        // session.user.paymentStatus = token.paymentStatus as string;
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
  secret: process.env.NEXTAUTH_SECRET,
});
