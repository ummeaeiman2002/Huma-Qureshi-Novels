import { defineArrayMember, defineField, defineType } from "sanity";

export const writer = defineType({
  name: "writer",
  type: "document",
  title: "Writer",
  fields: [
    defineField({
      name: "writername",
      type: "string",
      title: "WriterName",
    }),
    defineField({
      name: "writerslug",
      type: "slug",
      title: "Writer Slug",
      options: {
        source: "writername", // title se auto-generate hoga
        maxLength: 96, // SEO friendly
      },
    }),
    defineField({
      name: "writercardimageurl",
      type: "string",
      title: "WriterCardImageUrl",
    }),
    defineField({
      name: "writerimage",
      type: "image",
      title: "Profile Image",
      description: "Author profile image used on novel pages and the author page.",
      options: { hotspot: true },
    }),
    defineField({
      name: "writerbio",
      type: "text",
      title: "Short Biography",
      description: "A short biography shown in author cards and on the novel page.",
    }),
    defineField({
      name: "writerbiofull",
      type: "text",
      title: "Detailed Biography",
      description: "Optional longer biography shown on the author page.",
    }),
    defineField({
      name: "sociallinks",
      type: "array",
      title: "Social / Official Links",
      of: [
        defineArrayMember({
          type: "object",
          name: "sociallink",
          title: "Link",
          fields: [
            defineField({
              name: "label",
              type: "string",
              title: "Label",
              description: "e.g. Facebook, Instagram, Official Website",
            }),
            defineField({
              name: "url",
              type: "url",
              title: "URL",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "url" },
          },
        }),
      ],
    }),
  ],
});
