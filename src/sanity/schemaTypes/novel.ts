// import { rule } from "postcss";
import { defineArrayMember, defineField, defineType } from "sanity";

export const novel = defineType({
  name: "novel",
  type: "document",
  title: "Novel Episode",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "name",
      type: "string",
      title: "Episode Number/Name",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "episodeslug",
      type: "slug",
      title: "Episode Slug",
      options: {
        source: "name",
        maxLength: 96,
        isUnique: () => true,
      },
    }),
    defineField({
      name: "novelparent",
      type: "reference",
      title: "Novel ",
      to: {
        type: "novelparent",
      },
    }),
    defineField({
      name: "episodereleasedate",
      title: "Episode Release Date",
      type: "datetime",
      options: {
        dateFormat: "YYYY-MM-DD",
        timeFormat: "HH:mm",
        timeStep: 15,
        // calendarTodayLabel: 'Today',
      },
    }),

    defineField({
      name: "episodeteaser",
      type: "text",
      title: "Episode Teaser",
    }),
    defineField({
      name: "body",
      type: "text",
      title: "Body",
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
      name: "youtubeurl",
      type: "string",
      title: "Youtube Url",
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
