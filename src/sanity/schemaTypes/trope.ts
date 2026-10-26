import { defineField, defineType } from "sanity";

export const trope = defineType({
  name: "trope",
  title: "Trope / Theme",
  type: "document",
  fields: [
    defineField({
      name: "labelUr",
      title: "Urdu Label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "labelEn",
      title: "English Label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Internal Description",
      type: "text",
      description: "Optional internal note. Not shown on the website.",
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: "Display order",
      name: "displayOrder",
      by: [
        { field: "order", direction: "asc" },
        { field: "labelEn", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: { ur: "labelUr", en: "labelEn" },
    prepare({ ur, en }: { ur?: string; en?: string }) {
      return {
        title: en || ur || "Untitled trope",
        subtitle: ur && en ? `${ur} · ${en}` : ur ? "Urdu only" : "English only",
      };
    },
  },
});
