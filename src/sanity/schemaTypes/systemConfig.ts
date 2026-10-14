import { defineField, defineType } from "sanity";

export const systemConfig = defineType({
  name: "systemConfig",
  type: "document",
  title: "System Configuration",
  fields: [
    defineField({
      name: "configId",
      type: "string",
      title: "Configuration ID",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "lastReset",
      type: "datetime",
      title: "Last Monthly Reset Date",
    }),
  ],
  preview: {
    select: {
      title: "configId",
      subtitle: "lastReset",
    },
  },
});