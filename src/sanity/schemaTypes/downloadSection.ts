import { defineArrayMember, defineField, defineType } from "sanity";

export const downloadSection = defineType({
  name: "downloadSection",
  type: "document",
  title: "Download Page Section",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Section Title",
      description: "Heading shown on the download page (Urdu or English).",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Content",
      description: "Write anything about downloading the novel — in Urdu or English.",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading 2", value: "h2" },
            { title: "Heading 3", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
          },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "isUrdu",
      type: "boolean",
      title: "Is this content in Urdu?",
      description: "Turn ON if the content is in Urdu so it is styled as right-to-left Urdu text.",
      initialValue: false,
    }),
    defineField({
      name: "enabled",
      type: "boolean",
      title: "Show this section on the download page",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "enabled",
    },
  },
});