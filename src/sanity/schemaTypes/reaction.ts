import { defineField, defineType } from "sanity";

export const reaction = defineType({
  name: "reaction",
  type: "document",
  title: "Reaction Counts",
  fields: [
    defineField({
      name: "slugkey",
      type: "string",
      title: "Page key",
      description:
        "Unique key for the page these counts belong to — episode pages use `novel-slug/episode-slug`, the novel page uses `novel-slug`.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "like",
      type: "number",
      title: "Like",
      validation: (Rule) => Rule.min(0).integer(),
    }),
    defineField({
      name: "love",
      type: "number",
      title: "Love",
      validation: (Rule) => Rule.min(0).integer(),
    }),
    defineField({
      name: "wow",
      type: "number",
      title: "Wow",
      validation: (Rule) => Rule.min(0).integer(),
    }),
    defineField({
      name: "sad",
      type: "number",
      title: "Sad",
      validation: (Rule) => Rule.min(0).integer(),
    }),
    defineField({
      name: "fire",
      type: "number",
      title: "Fire",
      validation: (Rule) => Rule.min(0).integer(),
    }),
  ],
  preview: {
    select: { title: "slugkey", subtitle: "like" },
  },
});
