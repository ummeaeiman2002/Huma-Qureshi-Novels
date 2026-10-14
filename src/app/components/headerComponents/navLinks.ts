import type { Route } from "next";

export type NavLink = {
  href: Route;
  label: string;
};

export const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/novel", label: "Novels" },
  { href: "/pdf", label: "PDF" },
  { href: "/short-stories", label: "Short Stories" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const BOOKMARKS_LINK: NavLink = { href: "/bookmarks", label: "Bookmarks" };
