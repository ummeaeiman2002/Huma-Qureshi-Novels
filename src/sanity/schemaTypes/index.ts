import { type SchemaTypeDefinition } from "sanity";
import { novel } from "./novel";
import { writer } from "./writer";
import { genre } from "./genre";
import { category } from "./category";
import { comment } from "./comment";
import { novelparent } from "./novelparent";
import { pdf } from "./pdf";
import { systemConfig } from "./systemConfig";
import { testimonial } from "./testimonial";
import { announcement } from "./announcement";
import { downloadSection } from "./downloadSection";
import { siteSettings } from "./siteSettings";

// Premium/Auth schemas
import { user } from "./user";
import { premiumNovel } from "./premiumNovel";
import { premiumEpisode } from "./premiumEpisode";
import { subscription } from "./subscription";
import { payment } from "./payment";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    novel,
    writer,
    genre,
    category,
    comment,
    novelparent,
    pdf,
    systemConfig,
    testimonial,
    announcement,
    downloadSection,
    siteSettings,
    // Premium/Auth schemas
    user,
    premiumNovel,
    premiumEpisode,
    subscription,
    payment,
  ],
};
