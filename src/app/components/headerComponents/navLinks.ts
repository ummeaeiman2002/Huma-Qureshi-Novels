import type { Route } from "next";

export type NavLink = {
  href: Route;
  label: string;
};

export const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/novel", label: "All Novels" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];
