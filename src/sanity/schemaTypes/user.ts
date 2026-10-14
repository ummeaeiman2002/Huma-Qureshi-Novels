import { defineField, defineType } from "sanity";

export const user = defineType({
  name: "user",
  type: "document",
  title: "Premium User",
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
          { title: "Premium", value: "premium" },
        ],
      },
      initialValue: "premium",
      readOnly: true,
    }),
    defineField({
      name: "subscriptionPlan",
      type: "string",
      title: "Subscription Plan",
      options: {
        list: [
          { title: "Monthly", value: "monthly" },
          { title: "6 Month", value: "sixMonth" },
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
      name: "paymentStatus",
      type: "string",
      title: "Payment Status",
      options: {
        list: [
          { title: "Completed", value: "completed" },
          { title: "Pending", value: "pending" },
          { title: "Failed", value: "failed" },
          { title: "Refunded", value: "refunded" },
        ],
      },
      initialValue: "pending",
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
  // previews: {
  //   select: {
  //     title: "email",
  //     subtitle: "subscriptionPlan",
  //   },
  // },
});
