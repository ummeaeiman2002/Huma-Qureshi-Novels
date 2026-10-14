import { defineField, defineType } from "sanity";

export const category = defineType({
  name: "category",
  type: "document",
  title: "Category",
  fields: [
    defineField({
      name: "categoryname",
      type: "string",
      title: "Category Name",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "categoryslug",
      type: "slug",
      title: "Category Slug",
      options: {
        source: "categoryname",
        maxLength: 96,
      },
    }),
    defineField({
      name: "categoryimageurl",
      type: "string",
      title: "Category Image Url",
      description: "Optional image for this category.",
    }),
  ],
  preview: {
    select: { title: "categoryname", subtitle: "categoryslug.current" },
  },
});
