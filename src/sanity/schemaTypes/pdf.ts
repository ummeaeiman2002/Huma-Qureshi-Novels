import { defineArrayMember, defineField, defineType } from "sanity";

export const pdf = defineType({
  name: "pdf",
  type: "document",
  title: "PDF",
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
      name: "pdfreleasedate",
      title: "PDF Release Date",
      type: "datetime",
      options: {
        dateFormat: "YYYY-MM-DD",
        timeFormat: "HH:mm",
        timeStep: 15,
        // calendarTodayLabel: 'Today',
      },
    }),
    defineField({
      name: "pdfdescription",
      title: "PDF Description",
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
      readOnly: true,
      initialValue: { _ref: "e261df38-9273-4bdf-bed2-6db903573be8" },
      to: {
        type: "writer",
      },
      options: {
        filter: 'writername == "Huma Qureshi"',
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
      name: "trending",
      type: "boolean",
      title: "Trending",
      initialValue: false,
    }),
    defineField({
      name: "latest",
      type: "boolean",
      title: "Latest",
      initialValue: false,
    }),
    defineField({
      name: "popular",
      type: "boolean",
      title: "Popular",
      initialValue: false,
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
      name: "views",
      title: "Views",
      type: "number",
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: "monthlyViews",
      title: "Monthly Views",
      type: "number",
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: "downloadCount",
      title: "Download Count",
      type: "number",
      initialValue: 0,
      readOnly: true,
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
