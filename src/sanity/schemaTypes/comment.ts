import { defineField, defineType } from "sanity";

export const comment = defineType({
  name: "comment",
  type: "document",
  title: "Comment",
  fields: [
    defineField({
      name: "name",
      type: "string",
      title: "Name",
    }),
    defineField({
      name: "comment",
      type: "text",
      title: "Comment",
      validation: (rule) => rule.required(),
    }),
    // defineField({
    //   name: "createdAt",
    //   type: "datetime",
    //   title: "Created At",
    //   initialValue: () => new Date().toISOString(),
    // }),
  ],
});
