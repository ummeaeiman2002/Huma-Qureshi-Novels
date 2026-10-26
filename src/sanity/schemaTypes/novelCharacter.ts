import { defineField, defineType } from "sanity";

export const novelCharacter = defineType({
  name: "novelCharacter",
  title: "Character",
  type: "object",
  fields: [
    defineField({
      name: "nameUr",
      title: "Name (Urdu)",
      type: "string",
    }),
    defineField({
      name: "nameEn",
      title: "Name (English)",
      type: "string",
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      options: {
        list: [
          { title: "Protagonist", value: "Protagonist" },
          { title: "Antagonist", value: "Antagonist" },
          { title: "Supporting", value: "Supporting" },
          { title: "Other", value: "Other" },
        ],
      },
    }),
    defineField({
      name: "introductionUr",
      title: "Introduction (Urdu)",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "introductionEn",
      title: "Introduction (English)",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "image",
      title: "Character Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "characterImageAlt",
      title: "Image Description (alt text)",
      type: "string",
      description: "Optional accessible description of the character image.",
    }),
  ],
  preview: {
    select: {
      ur: "nameUr",
      en: "nameEn",
      role: "role",
      media: "image",
    },
    prepare({ ur, en, role, media }) {
      return {
        title: en || ur || "Unnamed character",
        subtitle: [ur && en ? "Urdu + English" : ur ? "Urdu only" : "English only", role]
          .filter(Boolean)
          .join(" · "),
        media,
      };
    },
  },
});
