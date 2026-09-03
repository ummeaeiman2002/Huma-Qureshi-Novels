import { defineField, defineType } from "sanity";

export const testimonial = defineType({
  name: "testimonial",
  type: "document",
  title: "Testimonial",
  fields: [
    defineField({
      name: "name",
      type: "string",
      title: "Reader Name",
    }),
    defineField({
      name: "quote",
      type: "text",
      title: "Review / Quote",
      validation: (Rule) => Rule.required().min(20),
    }),
    defineField({
      name: "timestamp",
      type: "datetime",
      title: "Published Date",
    }),
  ],
});
