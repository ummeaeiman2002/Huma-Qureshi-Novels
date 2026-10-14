import { defineField, defineType } from "sanity";

export const announcement = defineType({
  name: "announcement",
  type: "document",
  title: "News / Announcement",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "body",
      type: "text",
      title: "Body Text",
      validation: (Rule) => Rule.required().min(20),
    }),
    defineField({
      name: "announcementdate",
      type: "datetime",
      title: "Publish Date",
    }),
  ],
});
