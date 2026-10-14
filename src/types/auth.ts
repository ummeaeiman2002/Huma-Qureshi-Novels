import { z } from "zod";

// Checkout schema (payment-first flow)
export const checkoutSchema = z.object({
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
  plan: z.enum(["monthly", "sixMonth"]),
  agreeToTerms: z.boolean().refine(val => val === true, "You must accept the terms"),
});

// Login schema (for existing premium users)
export const loginSchema = z.object({
  email: z.string()
    .email("Invalid email address")
    .min(1, "Email is required"),
  password: z.string()
    .min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

// Subscription plan schema
export const subscriptionSchema = z.object({
  plan: z.enum(["monthly", "sixMonth"]),
});

// Payment confirmation schema
export const paymentConfirmSchema = z.object({
  sessionId: z.string(),
  plan: z.enum(["monthly", "sixMonth"]),
});

// Type exports
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type SubscriptionInput = z.infer<typeof subscriptionSchema>;
export type PaymentConfirmInput = z.infer<typeof paymentConfirmSchema>;

// User types
export interface PremiumUser {
  id: string;
  email: string;
  name: string;
  image?: string;
  subscriptionTier: "premium";
  subscriptionPlan: "monthly" | "sixMonth";
  subscriptionStartDate: string;
  subscriptionEndDate: string;
  paymentStatus: "completed" | "pending" | "failed" | "refunded";
}

// Session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      subscriptionTier: "premium";
      subscriptionPlan: "monthly" | "sixMonth";
      subscriptionEndDate: string;
      paymentStatus: string;
    };
  }

  interface User {
    id: string;
    subscriptionTier: "premium";
    subscriptionEndDate: string;
  }
}

// declare module "next-auth/jwt" {
// declare module "next-auth/jwt" {
//   interface JWT {
//     id: string;
//     subscriptionTier: "premium";
//     subscriptionEndDate: string;
//     paymentStatus: string;
//   }
// }
