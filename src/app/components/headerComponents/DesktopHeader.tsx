"use client";
import React, { useState } from "react";
import Logo from "../Logo";
import Link from "next/link";
import Search from "./Search";

export default function DesktopHeader() {
  const [menu, setMenu] = useState(false);

  return (
    <>
      {menu && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-opacity-30 z-40"
          onClick={() => setMenu(false)}
        />
      )}

      <header className="hidden lg:flex flex-col justify-center items-center gap-2 sticky top-0 z-50 bg-primary/85 backdrop-blur-md border-b border-secondary/15 shadow-[0_2px_8px_rgba(0,0,0,0.06)] px-5 lg:px-20 pt-3 pb-4">
        {/* Logo and searchbar */}
        <div className="flex justify-between items-center w-full">
          <Logo />

          <div className="flex items-center gap-4 lg:gap-6">
            <Search />
          </div>
        </div>
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#1E5D50]/30 to-transparent" />
        <nav className="flex justify-center items-center w-full gap-1.5 py-3 text-tertiary flex-wrap">
          <Link
            href={`/`}
            className="px-5 py-1.5 rounded-full border border-transparent text-[#111111] font-bold hover:text-secondary hover:bg-secondary/10 hover:border-secondary/40 transition"
          >
            <button onClick={() => setMenu(false)}>Home</button>
          </Link>
          <Link
            href={`/novel`}
            className="px-5 py-1.5 rounded-full border border-transparent text-[#111111] font-bold hover:text-secondary hover:bg-secondary/10 hover:border-secondary/40 transition"
          >
            <button onClick={() => setMenu(false)}>All Novels</button>
          </Link>
          <Link
            href={`/pdf`}
            className="px-5 py-1.5 rounded-full border border-transparent text-[#111111] font-bold hover:text-secondary hover:bg-secondary/10 hover:border-secondary/40 transition"
          >
            <button onClick={() => setMenu(false)}>PDF Library</button>
          </Link>
          <Link
            href={`/about`}
            className="px-5 py-1.5 rounded-full border border-transparent text-[#111111] font-bold hover:text-secondary hover:bg-secondary/10 hover:border-secondary/40 transition"
          >
            <button onClick={() => setMenu(false)}>About Us</button>
          </Link>
          <Link
            href={`/contact`}
            className="px-5 py-1.5 rounded-full border border-transparent text-[#111111] font-bold hover:text-secondary hover:bg-secondary/10 hover:border-secondary/40 transition"
          >
            <button onClick={() => setMenu(false)}>Contact us</button>
          </Link>
          <Link
            href={`/privacypolicy`}
            className="px-5 py-1.5 rounded-full border border-transparent text-[#111111] font-bold hover:text-secondary hover:bg-secondary/10 hover:border-secondary/40 transition"
          >
            <button onClick={() => setMenu(false)}>Privacy Policy</button>
          </Link>
          <Link
            href={`/terms`}
            className="px-5 py-1.5 rounded-full border border-transparent text-[#111111] font-bold hover:text-secondary hover:bg-secondary/10 hover:border-secondary/40 transition"
          >
            <button onClick={() => setMenu(false)}>Terms & Conditions</button>
          </Link>
          <Link
            href={`/getyourwebsite`}
            className="px-5 py-1.5 rounded-full border border-secondary/50 text-secondary hover:bg-secondary hover:text-primary transition"
          >
            <button onClick={() => setMenu(false)}>For Writers</button>
          </Link>
        </nav>
      </header>
    </>
  );
}
