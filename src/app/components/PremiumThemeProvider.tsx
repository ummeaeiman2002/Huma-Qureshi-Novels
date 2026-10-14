"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type PremiumTheme = "dark" | "light";

interface PremiumThemeContextType {
  theme: PremiumTheme;
  toggleTheme: () => void;
  setTheme: (theme: PremiumTheme) => void;
}

const PremiumThemeContext = createContext<PremiumThemeContextType | undefined>(undefined);

export function PremiumThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<PremiumTheme>("dark");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("premiumTheme") as PremiumTheme | null;
    if (savedTheme && (savedTheme === "dark" || savedTheme === "light")) {
      setThemeState(savedTheme);
    }
    setIsLoaded(true);
  }, []);

  // Update data attribute and localStorage when theme changes
  useEffect(() => {
    if (!isLoaded) return;

    // Set data attribute on document body for premium routes
    document.body.setAttribute("data-premium-theme", theme);
    localStorage.setItem("premiumTheme", theme);
  }, [theme, isLoaded]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const setTheme = (newTheme: PremiumTheme) => {
    setThemeState(newTheme);
  };

  return (
    <PremiumThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </PremiumThemeContext.Provider>
  );
}

export function usePremiumTheme() {
  const context = useContext(PremiumThemeContext);
  if (context === undefined) {
    throw new Error("usePremiumTheme must be used within a PremiumThemeProvider");
  }
  return context;
}
