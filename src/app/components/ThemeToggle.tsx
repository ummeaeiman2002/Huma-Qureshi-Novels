"use client";

import React from "react";
import { usePremiumTheme } from "./PremiumThemeProvider";
import { useSiteSettings } from "@/app/context/SiteSettingsContext";
import Image from "next/image";

export default function ThemeToggle() {
  const { theme, toggleTheme } = usePremiumTheme();
  const { searchIcon } = useSiteSettings();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-7 rounded-full border border-tertiary flex items-center px-1 transition-colors duration-300 hover:border-secondary"
      aria-label="Toggle theme"
    >
      {/* Track */}
      <div
        className={`absolute w-full h-full rounded-full transition-colors duration-300 ${
          theme === "dark"
            ? "bg-gradient-to-r from-gray-800 to-gray-900"
            : "bg-gradient-to-r from-yellow-400 to-orange-300"
        }`}
      />

      {/* Icons */}
      {theme === "dark" ? (
        /* Moon icon for dark theme */
        <Image
          src={searchIcon}
          alt="Dark theme"
          width={12}
          height={12}
          className="absolute left-2 z-10 opacity-75"
          style={{ filter: "invert(1)" }}
        />
      ) : (
        /* Sun icon for light theme */
        <Image
          src={searchIcon}
          alt="Light theme"
          width={12}
          height={12}
          className="absolute right-2 z-10 opacity-75"
        />
      )}

      {/* Knob */}
      <div
        className={`relative w-5 h-5 rounded-full bg-tertiary shadow-md transition-transform duration-300 ${
          theme === "dark" ? "translate-x-0" : "translate-x-7"
        }`}
      />
    </button>
  );
}
