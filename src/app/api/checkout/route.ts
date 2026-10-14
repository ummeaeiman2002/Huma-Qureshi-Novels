import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import bcrypt from "bcryptjs";
import { checkoutSchema } from "@/types/auth";

// Pricing configuration
const PRICING = {
  monthly: {
    price: 250,
    durationMonths: 1,
  },
  sixMonth: {
    price: 1350,
    durationMonths: 6,
  },
};

/**
 * POST /api/checkout
 * 
 * Payment-first authentication flow:
 * 1. Validate checkout input
 * 2. Process mock payment
 * 3. On success: Create user with premium tier + auto-login
 * 4. Return session token
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Validate input
    const validated = checkoutSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          // error: validated.error.errors[0]?.message || "Invalid input",
        },
        { status: 400 }
      );
    }

    const { email, password, name, plan, agreeToTerms } = validated.data;

    if (!agreeToTerms) {
      return NextResponse.json(
        { success: false, error: "You must accept the terms and conditions" },
        { status: 400 }
      );
    }

    // 2. Check if user already exists
    const existingUser = await client.fetch(
      `*[_type == "user" && email == $email][0]`,
      { email }
    );

    if (existingUser) {
      // User exists - check if they already have an active subscription
      if (
        existingUser.paymentStatus === "completed" &&
        new Date(existingUser.subscriptionEndDate) > new Date()
      ) {
        return NextResponse.json(
          {
            success: false,
            error: "This email already has an active subscription. Please login instead.",
          },
          { status: 400 }
        );
      }

      // Update existing user's subscription
      const now = new Date();
      const endDate = new Date(
        now.setMonth(now.getMonth() + PRICING[plan].durationMonths)
      );

      await client
        .patch(existingUser._id)
        .set({
          subscriptionPlan: plan,
          subscriptionStartDate: new Date().toISOString(),
          subscriptionEndDate: endDate.toISOString(),
          paymentStatus: "completed",
          updatedAt: new Date().toISOString(),
        })
        .commit();

      // Log payment transaction
      await client.create({
        _type: "payment",
        user: { _type: "reference", _ref: existingUser._id },
        amount: PRICING[plan].price,
        currency: "PKR",
        status: "completed",
        plan: plan,
        createdAt: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        message: "Subscription renewed successfully",
        userId: existingUser._id,
        redirect: `/${existingUser._id}/dashboard`,
      });
    }

    // 3. New user - Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // 4. Calculate subscription dates
    const now = new Date();
    const endDate = new Date(
      now.setMonth(now.getMonth() + PRICING[plan].durationMonths)
    );

    // 5. Create user with premium tier (auto-registration on payment success)
    const newUser = await client.create({
      _type: "user",
      email,
      passwordHash,
      name,
      emailVerified: true, // Auto-verified since payment completed
      subscriptionTier: "premium",
      subscriptionPlan: plan,
      subscriptionStartDate: new Date().toISOString(),
      subscriptionEndDate: endDate.toISOString(),
      paymentStatus: "completed",
      readingHistory: [],
      bookmarks: [],
      favorites: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // 6. Log payment transaction
    await client.create({
      _type: "payment",
      user: { _type: "reference", _ref: newUser._id },
      amount: PRICING[plan].price,
      currency: "PKR",
      status: "completed",
      plan: plan,
      createdAt: new Date().toISOString(),
    });

    // 7. Return success (client will handle auto-login via NextAuth)
    return NextResponse.json({
      success: true,
      message: "Payment successful! Account created and you're now premium.",
      userId: newUser._id,
      email: newUser.email,
      redirect: `/${newUser._id}/dashboard`,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Payment processing failed. Please try again.",
      },
      { status: 500 }
    );
  }
}
