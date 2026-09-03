"use client";
import React, { useEffect, useState } from "react";
import Logo from "../Logo";
import Link from "next/link";
import Search from "./Search";

export default function MobileHeader() {
  const [menu, setMenu] = useState(false);

  const openMenu = () => {
    setMenu(!menu);
  };

  // to prevent background from scrolling when sidebar is open
  useEffect(() => {
    if (menu) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      if (scrollY) window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [menu]);

  return (
    <>
      {menu && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-opacity-30 z-40"
          onClick={() => setMenu(false)}
        />
      )}

      <header className="lg:hidden flex flex-col gap-3 sticky top-0 z-50 bg-primary/85 backdrop-blur-md border-b border-secondary/15 shadow-[0_2px_8px_rgba(0,0,0,0.06)] px-5 pt-3 pb-4 overflow-hidden">
        {/* logo and hamburger nav menu */}
        <div className="flex justify-between items-center">
          <Logo />

          <div className="flex gap-4 items-center">
            {/* hamburger menu */}
            <button onClick={openMenu} className="w-8 h-8 flex items-center justify-center">
              <div className={`flex flex-col gap-1.5 transition-all duration-300 ease-in-out ${menu ? "rotate-45" : "rotate-0"}`}>
                <span className={`block w-6 h-0.5 bg-[#111111] rounded-full transition-all duration-300 ease-in-out ${menu ? "translate-y-2" : ""}`}></span>
                <span className={`block w-6 h-0.5 bg-[#111111] rounded-full transition-all duration-300 ease-in-out ${menu ? "opacity-0 scale-0" : "opacity-100 scale-100"}`}></span>
                <span className={`block w-6 h-0.5 bg-[#111111] rounded-full transition-all duration-300 ease-in-out ${menu ? "-translate-y-2" : ""}`}></span>
              </div>
            </button>
          </div>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#1E5D50]/30 to-transparent" />

        {/* search bar */}
        <Search />
      </header>

        {/* the open and close section - sidebar */}
        <nav
          className={`fixed top-28 right-0 w-full h-[calc(100vh-7rem)] bg-primary shadow-md z-50 transform transition-all duration-300 ease-in-out 
          ${menu ? "translate-x-0 visible" : "translate-x-full invisible"}
        flex flex-col items-center justify-start gap-4 text-secondary overflow-y-auto`}
        >
          <div className="flex flex-col gap-3 justify-start items-center w-full px-6 sm:px-10 pt-4 pb-8">
            <Link
              href={`/`}
              className="px-6 py-2 rounded-full border border-transparent text-[#111111] font-bold hover:text-secondary hover:bg-secondary/10 hover:border-secondary/40 transition"
            >
              <button onClick={() => setMenu(false)}>Home</button>
            </Link>
            <Link
              href={`/novel`}
              className="px-6 py-2 rounded-full border border-transparent text-[#111111] font-bold hover:text-secondary hover:bg-secondary/10 hover:border-secondary/40 transition"
            >
              <button onClick={() => setMenu(false)}>Novels</button>
            </Link>
            <Link
              href={`/short-stories`}
              className="px-6 py-2 rounded-full border border-transparent text-[#111111] font-bold hover:text-secondary hover:bg-secondary/10 hover:border-secondary/40 transition"
            >
              <button onClick={() => setMenu(false)}>Short Stories</button>
            </Link>
            <Link
              href={`/pdf`}
              className="px-6 py-2 rounded-full border border-transparent text-[#111111] font-bold hover:text-secondary hover:bg-secondary/10 hover:border-secondary/40 transition"
            >
              <button onClick={() => setMenu(false)}>PDF Library</button>
            </Link>

            <Link
              href={`/about`}
              className="px-6 py-2 rounded-full border border-transparent text-[#111111] font-bold hover:text-secondary hover:bg-secondary/10 hover:border-secondary/40 transition"
            >
              <button onClick={() => setMenu(false)}>About Us</button>
            </Link>
            <Link
              href={`/contact`}
              className="px-6 py-2 rounded-full border border-transparent text-[#111111] font-bold hover:text-secondary hover:bg-secondary/10 hover:border-secondary/40 transition"
            >
              <button onClick={() => setMenu(false)}>Contact</button>
            </Link>
            <Link
              href={`/bookmarks`}
              className="px-6 py-2 rounded-full border border-secondary/50 text-secondary hover:bg-secondary hover:text-primary transition"
            >
              <button onClick={() => setMenu(false)}>Bookmarks</button>
            </Link>

          </div>
        </nav>
    </>
  );
}
