import { defineField, defineType } from "sanity";

export const testimonial = defineType({
  name: "testimonial",
  type: "document",
  title: "Reader Review",
  fields: [
    defineField({
      name: "image",
      type: "image",
      title: "Review Screenshot",
      description:
        "Upload a screenshot of the reader's review (Facebook, Instagram, Google, WhatsApp, etc.). Landscape images work best.",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alt text",
          description: "Short description of the review image (for accessibility).",
        }),
      ],
    }),
    defineField({
      name: "name",
      type: "string",
      title: "Reader Name",
      description: "Name shown on the review card.",
    }),
    defineField({
      name: "platform",
      type: "string",
      title: "Platform",
      description: "Where the review came from. Its logo shows on the card.",
      options: {
        list: [
          { title: "Facebook", value: "facebook" },
          { title: "Instagram", value: "instagram" },
          { title: "Google", value: "google" },
          { title: "WhatsApp", value: "whatsapp" },
          { title: "Other", value: "other" },
        ],
        layout: "radio",
      },
      initialValue: "facebook",
    }),
    defineField({
      name: "rating",
      type: "number",
      title: "Rating (1-5)",
      description: "Optional star rating for the review.",
      validation: (Rule) => Rule.min(1).max(5).integer(),
    }),
    defineField({
      name: "link",
      type: "url",
      title: "Source Link",
      description: "Optional link to the original review post.",
    }),
    defineField({
      name: "quote",
      type: "text",
      title: "Review Text (optional)",
      description: "Only needed if you are not uploading a screenshot.",
      validation: (Rule) => Rule.min(20),
    }),
    defineField({
      name: "order",
      type: "number",
      title: "Order",
      description: "Lower numbers appear first in the review marquee.",
    }),
    defineField({
      name: "active",
      type: "boolean",
      title: "Show on site",
      initialValue: true,
      description: "Turn off to hide this review without deleting it.",
    }),
    defineField({
      name: "timestamp",
      type: "datetime",
      title: "Published Date",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "platform", media: "image" },
  },
});
