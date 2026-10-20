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
  // previews: {
  //   select: {
  //     title: "user.email",
  //     subtitle: "status",
  //   },
  // },
});
