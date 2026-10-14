"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSiteSettings } from "@/app/context/SiteSettingsContext";
// import { icons } from "../../assets"; 

export default function Up() {
  const { backToTopIcon } = useSiteSettings();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-4 right-4 lg:right-6 z-50 opacity-70 active:opacity-100 bg-secondary rounded-full ${
        visible ? "block" : "hidden"
      }`}
    >
      <Image
        src={backToTopIcon}
        alt="Back to top"
        width={100}
        height={100}
        className="w-6 h-6 m-4"
      />
    </button>
  );
}
