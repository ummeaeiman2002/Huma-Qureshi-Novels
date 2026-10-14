import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: "/studio/" },
      { userAgent: "*", disallow: "/login" },
      { userAgent: "*", disallow: "/login/" },
      { userAgent: "*", disallow: "/checkout" },
      { userAgent: "*", disallow: "/checkout/" },
      { userAgent: "*", disallow: "/dashboard" },
      { userAgent: "*", disallow: "/dashboard/" },
      { userAgent: "*", disallow: "/premium" },
      { userAgent: "*", disallow: "/premium/" },
      { userAgent: "*", disallow: "/api/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
