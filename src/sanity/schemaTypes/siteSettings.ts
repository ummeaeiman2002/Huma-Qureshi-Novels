import { defineField, defineType } from "sanity";

const contentImage = (name: string, title: string, description: string) =>
  defineField({ name, type: "image", title, description, options: { hotspot: true } });

const iconImage = (name: string, title: string, description: string) =>
  defineField({ name, type: "image", title, description, options: { hotspot: false } });

export const siteSettings = defineType({
  name: "siteSettings",
  type: "document",
  title: "Site Settings",
  fields: [
    contentImage("logo", "Site Logo", "Logo shown in the header and footer."),
    contentImage("heroImage", "Home Hero Image", "Large image in the homepage hero section. Recommended ~1200x800."),
    contentImage("authorImage", "Author Image", "Author / about-section image on the homepage and sidebar."),
    contentImage("defaultBanner", "Default Banner", "Fallback cover image used when a novel or PDF has no banner of its own."),

    // Homepage "Website Summary" section
    defineField({
      name: "summaryEyebrow",
      type: "string",
      title: "Summary — Small Label",
      description: "Small label above the homepage 'Website Summary' section, e.g. \"Website Summary\".",
    }),
    defineField({
      name: "summaryTitle",
      type: "string",
      title: "Summary — Title (English)",
      description: "Heading for the homepage 'Website Summary' section.",
    }),
    defineField({
      name: "summaryText",
      type: "text",
      rows: 5,
      title: "Summary — Text (English)",
      description: "Short introductory summary of the website shown on the homepage.",
    }),
    defineField({
      name: "summaryTitleUrdu",
      type: "string",
      title: "Summary — Title (Urdu)",
      description: "Optional Urdu heading. Rendered right-to-left with Nastaliq typography.",
    }),
    defineField({
      name: "summaryTextUrdu",
      type: "text",
      rows: 5,
      title: "Summary — Text (Urdu)",
      description: "Optional Urdu summary text. Rendered right-to-left with Nastaliq typography.",
    }),
    defineField({
      name: "summaryImages",
      type: "array",
      title: "Summary — Portrait Images",
      description:
        "Portrait images for the homepage summary section. Recommended 2500 x 3000 px (5:6). Up to 3 are shown.",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              type: "string",
              title: "Alt Text",
              description: "Short description of the image for accessibility.",
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.max(3),
    }),

    iconImage("socialFacebookIcon", "Facebook Icon", "Icon for Facebook links (header, footer, contact)."),
    iconImage("socialYoutubeIcon", "YouTube Icon", "Icon for YouTube links."),
    iconImage("socialInstagramIcon", "Instagram Icon", "Icon for Instagram links."),
    iconImage("socialEmailIcon", "Email Icon", "Icon for email / mail links."),
    iconImage("locationIcon", "Location Icon", "Location pin icon on the contact page."),
    iconImage("searchIcon", "Search / Theme Icon", "Icon used in the search box and theme toggle."),
    iconImage("backToTopIcon", "Back To Top Icon", "Icon on the floating back-to-top button."),
    iconImage("downloadIcon", "Download Icon", "Icon shown on download buttons."),
    iconImage("youtubePlayIcon", "YouTube Play Icon", "Icon on the 'Watch on YouTube' button."),
  ],
  preview: {
    prepare: () => ({ title: "Site Settings", subtitle: "Logos, hero and icon images" }),
  },
});
