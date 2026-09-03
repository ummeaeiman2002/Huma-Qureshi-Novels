// import { rule } from "postcss";
import { defineArrayMember, defineField, defineType } from "sanity";

export const novelparent = defineType({
  name: "novelparent",
  type: "document",
  title: "Novel Main Details",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Novel Title",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      title: "Slug",
      options: {
        source: "title", // title se auto-generate hoga
        maxLength: 96, // SEO friendly
      },
    }),
    defineField({
      name: "novelreleasedate",
      title: "Novel Release Date",
      type: "datetime",
      options: {
        dateFormat: "YYYY-MM-DD",
        timeFormat: "HH:mm",
        timeStep: 15,
        // calendarTodayLabel: 'Today',
      },
    }),
    // defineField({
    //   name: "noveldescription",
    //   type: "text",
    //   title: "Novel Description",
    // }),
    defineField({
      name: "noveldescription",
      title: "Novel Description",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading 2", value: "h2" },
            { title: "Heading 3", value: "h3" },
            { title: "Heading 4", value: "h4" },
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
        },
      ],
    }),
    defineField({
      name: "descriptionlanguage",
      type: "boolean",
      title: "on this if Description is in urdu",
      initialValue: false,
    }),
    defineField({
      name: "authornote",
      type: "text",
      title: "Author Note",
    }),
    defineField({
      name: "authornotelang",
      type: "boolean",
      title: "on this if authornote is in urdu",
      initialValue: false,
    }),
    defineField({
      name: "writer",
      type: "reference",
      title: "Writer",
      to: {
        type: "writer",
      },
    }),
    defineField({
      name: "genre",
      type: "reference",
      title: "Genre",
      to: {
        type: "genre",
      },
    }),

    defineField({
      name: "pdfurl",
      type: "string",
      title: "PDF Url",
    }),
    defineField({
      name: "youtubeurl",
      type: "string",
      title: "Youtube Url",
    }),
    defineField({
      name: "banner",
      type: "string",
      title: "BannerUrl",
    }),
    defineField({
      name: "tags",
      type: "array",
      title: "Tags",
      of: [
        defineArrayMember({
          type: "string",
        }),
      ],
      validation: (Rule) => Rule.max(5),
    }),

    defineField({
      name: "isShortStory",
      type: "boolean",
      title: "Is this a Short Story?",
      description: "Turn ON if this novel is a short story / afsana to show it on the Short Stories page.",
      initialValue: false,
    }),

    defineField({
      name: "comment",
      type: "array",
      title: "Comment",
      of: [
        {
          type: "reference",
          to: [{ type: "comment" }],
        },
      ],
    }),
  ],
});
