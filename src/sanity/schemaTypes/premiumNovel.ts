import { defineField, defineType } from "sanity";

export const premiumNovel = defineType({
  name: "premiumNovel",
  type: "document",
  title: "Premium Novel",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      title: "Slug",
      options: {
        source: "title",
        maxLength: 96,
      },
    }),
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
      title: "Description is in Urdu",
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
      title: "Author Note is in Urdu",
      initialValue: false,
    }),
    defineField({
      name: "banner",
      type: "string",
      title: "Banner URL",
    }),
    defineField({
      name: "writer",
      type: "reference",
      title: "Writer",
      readOnly: true,
      initialValue: { _ref: "e261df38-9273-4bdf-bed2-6db903573be8" },
      to: [{ type: "writer" }],
      options: {
        filter: 'writername == "Huma Qureshi"',
      },
    }),
    defineField({
      name: "genre",
      type: "reference",
      title: "Genre",
      to: [{ type: "genre" }],
    }),
    defineField({
      name: "tags",
      type: "array",
      title: "Tags",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.max(5),
    }),
    // defineField({
    //   name: "isPremium",
    //   type: "boolean",
    //   title: "Is Premium",
    //   initialValue: true,
    //   hidden: true,
    //   readOnly: true,
    // }),
    defineField({
      name: "novelreleasedate",
      title: "Release Date",
      type: "datetime",
      options: {
        dateFormat: "YYYY-MM-DD",
        timeFormat: "HH:mm",
        timeStep: 15,
      },
    }),
    defineField({
      name: "youtubeurl",
      type: "string",
      title: "YouTube URL",
    }),
    defineField({
      name: "createdAt",
      type: "datetime",
      title: "Created At",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  // previews: {
  //   select: {
  //     title: "title",
  //     subtitle: "writer.writername",
  //   },
  // },
});
