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
  // previews: {
  //   select: {
  //     title: "user.email",
  //     subtitle: "plan",
  //   },
  // },
});
