// import { rule } from "postcss";
import { defineArrayMember, defineField, defineType } from "sanity";

export const novelparent = defineType({
  name: "novelparent",
  type: "document",
  title: "Novel Main Details",
  groups: [
    { name: "basic", title: "Basic Information", default: true },
    { name: "description", title: "Summary & Introduction" },
    { name: "story", title: "Story Content" },
    { name: "characters", title: "Characters" },
    { name: "tropes", title: "Tropes & Themes" },
    { name: "highlights", title: "Reader Highlights" },
    { name: "author", title: "Author's Note & Sneak Peek" },
    { name: "details", title: "Novel Details" },
    { name: "sneaks", title: "Sneak Peek Gallery" },
    { name: "download", title: "PDF & Downloads" },
    { name: "reading", title: "Episodes & Online Reading" },
    { name: "related", title: "Related Content" },
    { name: "seo", title: "SEO & Publishing" },
  ],
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Novel Title (canonical)",
      description: "Used for the slug, listings and SEO fallback.",
      group: "basic",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "titleLocalized",
      title: "Novel Title (Urdu / English)",
      type: "localizedString",
      group: "basic",
      description: "Each language is independent.",
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
        source: "title",
        maxLength: 96,
      },
      validation: (rule) =>
        rule.required().custom((value) => {
          const current = value?.current;
          if (!current) return "A URL slug is required.";
          if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(current)) {
            return "Use lowercase letters, numbers and hyphens only.";
          }
          return true;
        }),
    }),
    defineField({
      name: "tagline",
      type: "string",
      title: "Short Tagline",
      group: "basic",
    }),
    defineField({
      name: "novelreleasedate",
      title: "Publication Date",
      group: "basic",
      type: "datetime",
      options: {
        dateFormat: "YYYY-MM-DD",
        timeFormat: "HH:mm",
        timeStep: 15,
      },
    }),
    defineField({
      name: "lastupdated",
      title: "Last Updated Date",
      group: "basic",
      type: "date",
    }),
    defineField({
      name: "bannerImage",
      type: "image",
      title: "Banner/Cover Image",
      group: "basic",
      options: { hotspot: true },
      description: "Portrait recommended 2500 x 3000 (5:6).",
    }),
    defineField({
      name: "banner",
      type: "string",
      title: "Banner URL (External)",
      group: "basic",
    }),
    defineField({
      name: "coverImageAlt",
      title: "Cover Image Alt Text",
      type: "string",
      group: "basic",
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
      group: "basic",
      to: {
        type: "category",
      },
    }),
    defineField({
      name: "additionalgenres",
      type: "array",
      title: "Additional Genres",
      group: "basic",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "genre" }],
        }),
      ],
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
      name: "novelstatus",
      type: "string",
      title: "Novel Status",
      group: "basic",
      options: {
        list: [
          { title: "Coming Soon", value: "Coming Soon" },
          { title: "Completed", value: "Completed" },
          { title: "Ongoing", value: "Ongoing" },
          { title: "Discontinued", value: "Discontinued" },
        ],
      },
    }),
    defineField({
      name: "isShortStory",
      type: "boolean",
      title: "Is this a Short Story?",
      group: "basic",
      initialValue: false,
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
      name: "tropesAndThemes",
      title: "Tropes & Themes",
      type: "array",
      group: "tropes",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "trope" }],
        }),
      ],
    }),

    defineField({
      name: "summary",
      title: "Summary (Urdu / English)",
      type: "localizedText",
      group: "description",
    }),
    defineField({
      name: "storyIntroduction",
      title: "Story Introduction (Urdu / English)",
      type: "localizedText",
      group: "description",
    }),
    defineField({
      name: "readingtime",
      type: "string",
      title: "Estimated Reading Time",
      group: "description",
    }),

    defineField({
      name: "contentFormat",
      title: "Content Format",
      type: "string",
      group: "story",
      options: {
        layout: "radio",
        list: [
          { title: "Complete Novel", value: "complete" },
          { title: "Episodic Novel", value: "episodic" },
        ],
      },
    }),
    defineField({
      name: "fullStoryContent",
      title: "Full Story Content",
      type: "array",
      group: "story",
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
      hidden: ({ parent }) => parent?.contentFormat === "episodic",
    }),
    defineField({
      name: "episodes",
      title: "Episodes",
      type: "array",
      group: "story",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "novel" }],
        }),
      ],
      hidden: ({ parent }) => parent?.contentFormat === "complete",
    }),
    defineField({
      name: "readingOrder",
      title: "Reading Order",
      type: "number",
      group: "story",
      hidden: ({ parent }) => parent?.contentFormat === "complete",
    }),

    defineField({
      name: "mainCharacters",
      title: "Main Characters",
      type: "array",
      group: "characters",
      of: [defineArrayMember({ type: "novelCharacter" })],
    }),
    defineField({
      name: "sideCharacters",
      title: "Side Characters",
      type: "array",
      group: "characters",
      of: [defineArrayMember({ type: "novelCharacter" })],
    }),

    defineField({
      name: "readerHighlightsLocalized",
      title: "Reader Highlights (Urdu / English)",
      type: "localizedText",
      group: "highlights",
    }),

    defineField({
      name: "writer",
      type: "reference",
      title: "Writer",
      group: "author",
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
      name: "authorNote",
      title: "Author's Note (Urdu / English)",
      type: "localizedBlockContent",
      group: "author",
    }),
    defineField({
      name: "sneakPeek",
      title: "Sneak Peek (Urdu / English)",
      type: "localizedBlockContent",
      group: "author",
    }),
    defineField({
      name: "contentwarning",
      type: "text",
      title: "Content Warning",
      group: "author",
    }),
    defineField({
      name: "importantNote",
      title: "Important Note for Readers (Urdu / English)",
      type: "localizedText",
      group: "author",
    }),

    defineField({
      name: "numberofpages",
      type: "number",
      title: "Number of Pages",
      group: "details",
    }),
    defineField({
      name: "numberofchapters",
      type: "number",
      title: "Number of Chapters",
      group: "details",
    }),

    defineField({
      name: "sneakPeeks",
      type: "array",
      title: "Sneak Peeks Gallery",
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
              options: { hotspot: true },
            }),
            defineField({
              name: "scene",
              type: "text",
              title: "Scene / Excerpt",
            }),
            defineField({
              name: "sceneIsUrdu",
              type: "boolean",
              title: "Scene is in Urdu (RTL)",
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
      name: "pdfAvailability",
      title: "PDF Availability",
      type: "string",
      group: "download",
      options: {
        layout: "radio",
        list: [
          { title: "Free", value: "free" },
          { title: "Paid", value: "paid" },
          { title: "Unavailable", value: "unavailable" },
        ],
      },
    }),
    defineField({
      name: "edition",
      title: "Edition / Version",
      type: "string",
      group: "download",
    }),
    defineField({
      name: "downloadInstructions",
      title: "Download Instructions (Urdu / English)",
      type: "localizedText",
      group: "download",
    }),
    defineField({
      name: "downloadfile",
      type: "file",
      title: "PDF File",
      group: "download",
      options: { accept: "application/pdf" },
    }),
    defineField({
      name: "downloadtitle",
      type: "string",
      title: "Download Title",
      group: "download",
    }),
    defineField({
      name: "externaldownloadurl",
      type: "url",
      title: "External Download URL",
      group: "download",
    }),

    defineField({
      name: "enableonlinereading",
      type: "boolean",
      title: "Enable Online Reading",
      group: "reading",
      initialValue: true,
    }),
    defineField({
      name: "youtubeurl",
      type: "string",
      title: "YouTube URL",
      group: "reading",
    }),

    defineField({
      name: "relatednovels",
      type: "array",
      title: "Related Novels",
      group: "related",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "novelparent" }],
        }),
      ],
    }),
    defineField({
      name: "relatedstories",
      type: "array",
      title: "Related Stories",
      group: "related",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "novelparent" }],
        }),
      ],
    }),
    defineField({
      name: "comment",
      type: "array",
      title: "Comments",
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
    defineField({
      name: "noIndex",
      title: "Hide from search engines",
      type: "boolean",
      group: "seo",
      initialValue: false,
    }),
  ],
});
