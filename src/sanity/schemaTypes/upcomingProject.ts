import { defineField, defineType } from "sanity";

export const upcomingProject = defineType({
  name: "upcomingProject",
  type: "document",
  title: "Upcoming Project",
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
      name: "coverImage",
      type: "image",
      title: "Cover Image",
      options: { hotspot: true },
      description: "Portrait cover, recommended 2500 x 3000 (5:6).",
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alt Text",
        }),
      ],
    }),
    defineField({
      name: "genre",
      type: "reference",
      title: "Genre",
      to: [{ type: "genre" }],
    }),
    defineField({
      name: "teaser",
      type: "text",
      title: "Teaser",
      rows: 3,
      description: "Short original description (English).",
    }),
    defineField({
      name: "teaserUrdu",
      type: "text",
      title: "Teaser (Urdu)",
      rows: 3,
      description: "Optional Urdu teaser.",
    }),
    defineField({
      name: "releaseNote",
      type: "string",
      title: "Release Note",
      description: "Optional, e.g. Winter 2026.",
    }),
    defineField({
      name: "order",
      type: "number",
      title: "Order",
      initialValue: 0,
    }),
    defineField({
      name: "featured",
      type: "boolean",
      title: "Featured",
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: "Manual Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "releaseNote",
      media: "coverImage",
    },
  },
});
