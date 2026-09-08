import { defineField, defineType } from "sanity";

export const premiumEpisode = defineType({
  name: "premiumEpisode",
  type: "document",
  title: "Premium Episode",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "name",
      type: "string",
      title: "Episode Number/Name",
      validation: (Rule) => Rule.required(),
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
      name: "premiumNovel",
      type: "reference",
      title: "Premium Novel",
      to: [{ type: "premiumNovel" }],
    }),
    defineField({
      name: "episodereleasedate",
      title: "Episode Release Date",
      type: "datetime",
      options: {
        dateFormat: "YYYY-MM-DD",
        timeFormat: "HH:mm",
        timeStep: 15,
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
      name: "youtubeurl",
      type: "string",
      title: "YouTube URL",
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
      of: [{ type: "string" }],
      validation: (Rule) => Rule.max(5),
    }),
    defineField({
      name: "isPremium",
      type: "boolean",
      title: "Is Premium",
      initialValue: true,
      hidden: true,
      readOnly: true,
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
  //     title: "name",
  //     media: "premiumNovel.title",
  //   },
  // },
});
