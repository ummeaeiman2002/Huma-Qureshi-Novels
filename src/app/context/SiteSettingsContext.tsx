"use client";

import { createContext, useContext, type ReactNode } from "react";
import { DEFAULT_SITE_IMAGES, type SiteImages } from "@/lib/siteDefaults";

const SiteSettingsContext = createContext<SiteImages>(DEFAULT_SITE_IMAGES);

export function SiteSettingsProvider({
  value,
  children,
}: {
  value: SiteImages;
  children: ReactNode;
}) {
  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>;
}

export function useSiteSettings(): SiteImages {
  return useContext(SiteSettingsContext);
}
