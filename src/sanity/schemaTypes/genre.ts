import { defineField, defineType } from "sanity";

export const genre = defineType({
  name: "genre",
  type: "document",
  title: "Genre",
  fields: [
    defineField({
      name: "genrename",
      type: "string",
      title: "GenreName",
    }),
    defineField({
      name: "genreslug",
      type: "slug",
      title: "Genre Slug",
      options: {
        source: "genrename", // title se auto-generate hoga
        maxLength: 96, // SEO friendly
      },
    }),
    defineField({
      name: "genrecardimageurl",
      type: "string",
      title: "GenreCardImageUrl",
    }),
  ],
});
