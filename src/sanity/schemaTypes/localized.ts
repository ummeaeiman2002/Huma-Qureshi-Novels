import { defineArrayMember, defineField, defineType } from "sanity";
import LocalizedInput from "../components/LocalizedInput";

const preview = {
  select: { ur: "ur", en: "en" },
  prepare({ ur, en }: { ur?: string; en?: string }) {
    const hasUr = Boolean(ur?.trim());
    const hasEn = Boolean(en?.trim());
    return {
      title: en?.trim() || ur?.trim() || "Untitled",
      subtitle: hasUr && hasEn ? "Urdu + English" : hasUr ? "Urdu only" : hasEn ? "English only" : "Empty",
    };
  },
};

function richTextMembers() {
  return [
    defineArrayMember({
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
        annotations: [],
      },
    }),
  ];
}

export const localizedString = defineType({
  name: "localizedString",
  title: "Localized Text (single line)",
  type: "object",
  components: { input: LocalizedInput },
  fields: [
    defineField({ name: "ur", title: "Urdu", type: "string" }),
    defineField({ name: "en", title: "English", type: "string" }),
  ],
  preview,
});

export const localizedText = defineType({
  name: "localizedText",
  title: "Localized Text (multi-line)",
  type: "object",
  components: { input: LocalizedInput },
  fields: [
    defineField({
      name: "ur",
      title: "Urdu",
      type: "text",
      rows: 5,
      description: "Urdu content is shown right-to-left on the website.",
    }),
    defineField({
      name: "en",
      title: "English",
      type: "text",
      rows: 5,
    }),
  ],
  preview,
});

export const localizedBlockContent = defineType({
  name: "localizedBlockContent",
  title: "Localized Rich Text",
  type: "object",
  components: { input: LocalizedInput },
  fields: [
    defineField({
      name: "ur",
      title: "Urdu",
      type: "array",
      of: richTextMembers(),
      description: "Urdu rich text is shown right-to-left with the Urdu Nastaliq font.",
    }),
    defineField({
      name: "en",
      title: "English",
      type: "array",
      of: richTextMembers(),
    }),
  ],
  preview: {
    select: { ur: "ur", en: "en" },
    prepare({ ur, en }: { ur?: unknown[]; en?: unknown[] }) {
      const hasUr = Array.isArray(ur) && ur.length > 0;
      const hasEn = Array.isArray(en) && en.length > 0;
      return {
        title: hasEn ? "English rich text" : hasUr ? "Urdu rich text" : "Empty rich text",
        subtitle: hasUr && hasEn ? "Urdu + English" : hasUr ? "Urdu only" : hasEn ? "English only" : "Empty",
      };
    },
  },
});
