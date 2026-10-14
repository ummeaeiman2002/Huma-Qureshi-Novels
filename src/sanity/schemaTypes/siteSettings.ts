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
