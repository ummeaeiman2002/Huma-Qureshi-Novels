import { defineArrayMember, defineField, defineType } from "sanity";

export const pdf = defineType({
  name: "pdf",
  type: "document",
  title: "PDF",
  groups: [
    { name: "basic", title: "Basic Information", default: true },
    { name: "description", title: "Description & Summary" },
    { name: "characters", title: "Characters" },
    { name: "highlights", title: "Reader Highlights" },
    { name: "sneaks", title: "Sneak Peeks" },
    { name: "download", title: "PDF & Download" },
    { name: "publishing", title: "Publishing" },
    { name: "related", title: "Related Content" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Novel Title",
      group: "basic",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "englishtitle",
      type: "string",
      title: "English Title / Transliteration",
      group: "basic",
    }),
    defineField({
      name: "slug",
      type: "slug",
      title: "Slug",
      group: "basic",
      options: {
        source: "title", // title se auto-generate hoga
        maxLength: 96, // SEO friendly
      },
    }),
    defineField({
      name: "pdfreleasedate",
      title: "PDF Release Date",
      group: "basic",
      type: "datetime",
      options: {
        dateFormat: "YYYY-MM-DD",
        timeFormat: "HH:mm",
        timeStep: 15,
      },
    }),
    defineField({
      name: "language",
      type: "string",
      title: "Language",
      group: "basic",
      initialValue: "Urdu",
      options: {
        list: [
          { title: "Urdu", value: "Urdu" },
          { title: "English", value: "English" },
        ],
      },
    }),
    defineField({
      name: "writer",
      type: "reference",
      title: "Writer",
      group: "basic",
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
      group: "basic",
      to: {
        type: "genre",
      },
    }),
    defineField({
      name: "category",
      type: "reference",
      title: "Category",
      description: "Category is separate from Genre. Pick the category this novel belongs to.",
      group: "basic",
      to: {
        type: "category",
      },
    }),
    defineField({
      name: "banner",
      type: "string",
      title: "BannerUrl",
      group: "basic",
    }),
    defineField({
      name: "tags",
      type: "array",
      title: "Tags",
      group: "basic",
      of: [
        defineArrayMember({
          type: "string",
        }),
      ],
      validation: (Rule) => Rule.max(5),
    }),
    defineField({
      name: "themes",
      type: "array",
      title: "Themes & Tropes",
      description: "Short keywords e.g. Second Chance, Strong Heroine, Family Drama — shown as pills.",
      group: "basic",
      of: [
        defineArrayMember({
          type: "string",
        }),
      ],
      validation: (Rule) => Rule.max(10),
    }),

    defineField({
      name: "pdfshortdescription",
      type: "text",
      title: "Short Description (for cards & listings)",
      group: "description",
    }),
    defineField({
      name: "pdfdescription",
      title: "Full PDF Description / Summary",
      group: "description",
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
      group: "description",
      initialValue: false,
    }),
    defineField({
      name: "authornote",
      type: "text",
      title: "Author Note",
      group: "description",
    }),
    defineField({
      name: "authornotelang",
      type: "boolean",
      title: "on this if authornote is in urdu",
      group: "description",
      initialValue: false,
    }),

    defineField({
      name: "characterintro",
      type: "text",
      title: "Characters Introduction",
      description: "A short line introducing the cast of this novel.",
      group: "characters",
    }),
    defineField({
      name: "characters",
      title: "Main Characters",
      description: "Add the main characters of this novel with a short description each.",
      group: "characters",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "character",
          title: "Character",
          fields: [
            defineField({
              name: "name",
              type: "string",
              title: "Character Name",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "role",
              type: "string",
              title: "Role",
              description: "e.g. Protagonist, Antagonist, Supporting",
            }),
            defineField({
              name: "description",
              type: "text",
              title: "Description",
            }),
            defineField({
              name: "image",
              type: "image",
              title: "Character Image",
              options: { hotspot: true },
            }),
          ],
          preview: {
            select: { title: "name", subtitle: "role", media: "image" },
          },
        }),
      ],
    }),

    defineField({
      name: "readerhighlightintro",
      type: "text",
      title: "Reader Highlights Introduction",
      description: "A short line introducing why readers will love this novel.",
      group: "highlights",
    }),
    defineField({
      name: "readerhighlights",
      title: "What Readers Will Love",
      description: "Add short highlight cards (title + description) shown on the page.",
      group: "highlights",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "readerHighlight",
          title: "Reader Highlight",
          fields: [
            defineField({
              name: "title",
              type: "string",
              title: "Title",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "description",
              type: "text",
              title: "Description",
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "description" },
          },
        }),
      ],
      validation: (Rule) => Rule.max(6),
    }),

    defineField({
      name: "sneakPeeks",
      type: "array",
      title: "Sneak Peeks",
      description: "Add preview images shown in a gallery on the PDF page. You can add, remove, and reorder them.",
      group: "sneaks",
      of: [
        defineArrayMember({
          type: "object",
          name: "sneakPeek",
          title: "Sneak Peek",
          fields: [
            defineField({
              name: "image",
              type: "image",
              title: "Preview Image",
              description: "Optional. A preview image, or leave empty for a text-only scene.",
              options: { hotspot: true },
            }),
            defineField({
              name: "scene",
              type: "text",
              title: "Scene / Excerpt",
              description: "A short scene description or excerpt from the story shown with this preview.",
            }),
            defineField({
              name: "sceneIsUrdu",
              type: "boolean",
              title: "Scene is in Urdu (RTL + Urdu font)",
              description:
                "Turn ON if the scene/excerpt above is written in Urdu. It will display right-to-left and use the Urdu Nastaliq font.",
              initialValue: false,
            }),
            defineField({
              name: "caption",
              type: "string",
              title: "Caption",
            }),
            defineField({
              name: "chapterReference",
              type: "string",
              title: "Chapter / Page Reference",
            }),
            defineField({
              name: "order",
              type: "number",
              title: "Display Order",
            }),
          ],
          preview: {
            select: { title: "caption", subtitle: "chapterReference", media: "image" },
          },
        }),
      ],
    }),

    defineField({
      name: "pdfurl",
      type: "string",
      title: "PDF Url (legacy / external)",
      group: "download",
    }),
    defineField({
      name: "downloadfile",
      type: "file",
      title: "Downloadable PDF File",
      description: "Upload the PDF file. The download button only shows when a file or external URL exists.",
      group: "download",
      options: { accept: "application/pdf" },
    }),
    defineField({
      name: "downloadtitle",
      type: "string",
      title: "Download Display Title",
      group: "download",
    }),
    defineField({
      name: "downloaddescription",
      type: "text",
      title: "Download Description / Instructions",
      group: "download",
    }),
    defineField({
      name: "downloadformat",
      type: "string",
      title: "File Format",
      group: "download",
      initialValue: "PDF",
    }),
    defineField({
      name: "downloadsize",
      type: "string",
      title: "File Size",
      group: "download",
    }),
    defineField({
      name: "pdfnumberofpages",
      type: "number",
      title: "Number of Pages",
      group: "download",
    }),
    defineField({
      name: "externaldownloadurl",
      type: "url",
      title: "External Download URL",
      group: "download",
    }),
    defineField({
      name: "downloadbuttonlabel",
      type: "string",
      title: "Download Button Label",
      group: "download",
    }),

    defineField({
      name: "trending",
      type: "boolean",
      title: "Trending",
      group: "publishing",
      initialValue: false,
    }),
    defineField({
      name: "latest",
      type: "boolean",
      title: "Latest",
      group: "publishing",
      initialValue: false,
    }),
    defineField({
      name: "popular",
      type: "boolean",
      title: "Popular",
      group: "publishing",
      initialValue: false,
    }),
    defineField({
      name: "youtubeurl",
      type: "string",
      title: "Youtube Url",
      group: "publishing",
    }),
    defineField({
      name: "views",
      title: "Views",
      type: "number",
      group: "publishing",
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: "monthlyViews",
      title: "Monthly Views",
      type: "number",
      group: "publishing",
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: "downloadCount",
      title: "Download Count",
      type: "number",
      group: "publishing",
      initialValue: 0,
      readOnly: true,
    }),

    defineField({
      name: "comment",
      type: "array",
      title: "Comment",
      group: "related",
      of: [
        {
          type: "reference",
          to: [{ type: "comment" }],
        },
      ],
    }),

    defineField({
      name: "seotitle",
      type: "string",
      title: "SEO Title",
      group: "seo",
    }),
    defineField({
      name: "seodescription",
      type: "text",
      title: "SEO Description",
      group: "seo",
    }),
  ],
});
