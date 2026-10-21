// import { rule } from "postcss";
import { defineArrayMember, defineField, defineType } from "sanity";

export const novelparent = defineType({
  name: "novelparent",
  type: "document",
  title: "Novel Main Details",
  groups: [
    { name: "basic", title: "Basic Information", default: true },
    { name: "description", title: "Description & Summary" },
    { name: "characters", title: "Characters" },
    { name: "highlights", title: "Reader Highlights" },
    { name: "author", title: "Author & Notes" },
    { name: "details", title: "Novel Details" },
    { name: "sneaks", title: "Sneak Peeks" },
    { name: "download", title: "PDF & Download" },
    { name: "reading", title: "Online Reading" },
    { name: "related", title: "Related Content" },
    { name: "seo", title: "SEO & Publishing" },
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
      description: "Optional English title or transliteration of the novel name.",
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
      name: "tagline",
      type: "string",
      title: "Short Tagline",
      description: "A one-line tagline shown near the title.",
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
      title: "Banner Image (Upload)",
      group: "basic",
      options: { hotspot: true },
      description:
        "Upload the cover directly. Portrait, recommended 2500 x 3000 (5:6). If both this and Banner URL are set, this upload is used first.",
    }),
    defineField({
      name: "banner",
      type: "string",
      title: "Banner URL (External)",
      group: "basic",
      description: "Optional external image URL. Used only when no Banner Image is uploaded.",
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
      name: "additionalgenres",
      type: "array",
      title: "Additional Genres / Categories",
      description: "Optional extra genres for this novel in addition to the primary Genre.",
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
      description: "Turn ON if this novel is a short story / afsana to show it on the Stories page.",
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
      name: "shortdescription",
      type: "text",
      title: "Short Description (for cards & listings)",
      description: "A brief description used on cards and listing pages.",
      group: "description",
    }),
    defineField({
      name: "noveldescription",
      title: "Full Novel Summary",
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
      name: "aboutnovel",
      title: "About This Novel",
      description: "Additional information about this novel.",
      group: "description",
      type: "array",
      of: [
        {
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
        },
      ],
    }),
    defineField({
      name: "storyintro",
      type: "text",
      title: "Story Introduction",
      group: "description",
    }),
    defineField({
      name: "readingtime",
      type: "string",
      title: "Estimated Reading Time",
      description: "e.g. 10 minutes.",
      group: "description",
    }),
    defineField({
      name: "storycontent",
      title: "Full Story Content",
      description: "For short stories: write the complete story here (supports paragraphs).",
      group: "description",
      type: "array",
      of: [
        {
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
      description: "Add short highlight cards (title + description) shown near the top of the page.",
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
      name: "authornote",
      type: "text",
      title: "Author Note",
      group: "author",
    }),
    defineField({
      name: "authornotelang",
      type: "boolean",
      title: "on this if authornote is in urdu",
      group: "author",
      initialValue: false,
    }),
    defineField({
      name: "contentwarning",
      type: "text",
      title: "Content Warning",
      description: "Optional content warning shown to readers.",
      group: "author",
    }),
    defineField({
      name: "importantnote",
      type: "text",
      title: "Important Note for Readers",
      description: "Optional important notice, copyright information, or instruction for readers.",
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
      name: "fileformat",
      type: "string",
      title: "File Format",
      group: "details",
    }),
    defineField({
      name: "filesize",
      type: "string",
      title: "File Size",
      group: "details",
    }),
    defineField({
      name: "readingavailability",
      type: "string",
      title: "Reading Availability",
      group: "details",
      options: {
        list: [
          { title: "Online", value: "Online" },
          { title: "PDF Download", value: "PDF Download" },
          { title: "Both", value: "Both" },
        ],
      },
    }),
    defineField({
      name: "featured",
      type: "boolean",
      title: "Featured Novel",
      group: "details",
      initialValue: false,
    }),
    defineField({
      name: "trending",
      type: "boolean",
      title: "Trending Novel",
      group: "details",
      initialValue: false,
    }),

    defineField({
      name: "sneakPeeks",
      type: "array",
      title: "Sneak Peeks",
      description: "Add preview images shown in a gallery on the novel page. You can add, remove, and reorder them.",
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
      title: "PDF Url",
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
      title: "Download File Format",
      group: "download",
    }),
    defineField({
      name: "downloadsize",
      type: "string",
      title: "Download File Size",
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
      name: "enableonlinereading",
      type: "boolean",
      title: "Enable Online Reading",
      description: "Turn OFF to hide the episode/chapter reading interface.",
      group: "reading",
      initialValue: true,
    }),
    defineField({
      name: "onlinereadingintro",
      type: "text",
      title: "Online Reading Introduction",
      group: "reading",
    }),
    defineField({
      name: "youtubeurl",
      type: "string",
      title: "Youtube Url",
      group: "reading",
    }),

    defineField({
      name: "relatednovels",
      type: "array",
      title: "Related Novels",
      description: "Manually selected related novels.",
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
      description: "Manually selected related short stories.",
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
