"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createPortal } from "react-dom";

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debouncedQuery = useDebounce(query, 350);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });

  const isOpen = focused && debouncedQuery.trim().length >= 1;
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchResults = async () => {
      const q = debouncedQuery.trim();
      if (q.length < 1) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        if (data.results) setResults(data.results);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [debouncedQuery]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [debouncedQuery]);

  const handleSelect = useCallback(
    (item: any) => {
      if (!item?.slug) return;
      if (item._type === "novelparent") router.push(`/novel/${item.slug}`);
      else if (item._type === "pdf") router.push(`/pdf/${item.slug}`);
      setQuery("");
      setResults([]);
      inputRef.current?.blur();
    },
    [router]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;
    const list = results;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % list.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? list.length - 1 : i - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(list[activeIndex]);
    } else if (e.key === "Escape") {
      inputRef.current?.blur();
    }
  };

  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const item = listRef.current.children[activeIndex] as HTMLElement;
      item?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        wrapperRef.current && !wrapperRef.current.contains(target) &&
        dropdownRef.current && !dropdownRef.current.contains(target)
      ) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      setDropdownPos({ top: rect.bottom + 8, left: rect.left, width: Math.min(320, window.innerWidth - 32) });
    }
  }, [isOpen]);

  return (
    <div ref={wrapperRef} className="w-full lg:w-fit flex justify-center relative">
      <div
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={`flex items-center gap-2 w-full lg:w-[260px] rounded-full border-2 px-4 py-2.5 bg-surface transition-all duration-300 ${
          focused
            ? "border-brand shadow-[0_0_16px_rgba(30,93,80,0.25)]"
            : "border-line hover:border-brand/50 shadow-sm"
        }`}
      >
        {/* Search icon */}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke={focused ? "#1E5D50" : "#71817B"}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0 transition-colors duration-300"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>

        <input
          ref={inputRef}
          type="text"
          placeholder="Search novels, PDFs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={handleKeyDown}
          aria-label="Search novels and PDFs"
          aria-autocomplete="list"
          aria-controls="search-listbox"
          className="flex-1 text-sm text-ink bg-transparent focus:outline-none placeholder:text-[#71817B] font-medium"
        />

        {/* Clear button */}
        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setQuery("");
              setResults([]);
              inputRef.current?.focus();
            }}
            className="shrink-0 w-5 h-5 rounded-full bg-line flex items-center justify-center hover:bg-brand hover:text-white text-[#71817B] transition-all duration-200"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown - rendered via portal to escape header overflow */}
      {isOpen && typeof window !== "undefined" && createPortal(
        <div
          ref={dropdownRef}
          id="search-listbox"
          role="listbox"
          aria-label="Search results"
          style={{ position: "fixed", top: dropdownPos.top, left: dropdownPos.left, width: dropdownPos.width }}
          className="rounded-2xl max-h-80 overflow-y-auto z-[9999] border-2 border-line bg-surface shadow-[0_8px_32px_rgba(30,93,80,0.15)]"
        >
          {loading && (
            <div className="flex items-center gap-3 p-4">
              <div className="w-4 h-4 border-2 border-brand border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-[#71817B] font-medium">Searching...</span>
            </div>
          )}

          {!loading && results.length === 0 && (
            <div className="flex flex-col items-center gap-2 p-6">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#DCCFC2" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <p className="text-sm text-[#71817B] font-medium">No results found</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <ul>
              {results.map((item, idx) => (
                <li
                  key={`${item._type}-${item._id}-${idx}`}
                  role="option"
                  aria-selected={idx === activeIndex}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-line/50 last:border-b-0 transition-all duration-150 ${
                    idx === activeIndex ? "bg-brand/10" : "hover:bg-brand/5"
                  }`}
                >
                  {/* Thumbnail */}
                  {item.banner ? (
                    <Image
                      src={item.banner}
                      alt=""
                      width={44}
                      height={44}
                      className="w-11 h-11 rounded-lg object-cover shrink-0 border border-line"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-lg bg-brand/10 flex items-center justify-center shrink-0">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E5D50" strokeWidth="2" strokeLinecap="round">
                        <path d="M4 19.5v-15A2.5 2.5 0 016.5 2H20v20H6.5a2.5 2.5 0 010-5H20" />
                      </svg>
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-ink truncate">{item.title}</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.genre?.genrename && (
                        <span className="text-[10px] font-bold text-brand bg-brand/10 px-2 py-0.5 rounded-full">
                          {item.genre.genrename}
                        </span>
                      )}
                      {item._type === "novelparent" && item.episodeCount !== undefined && (
                        <span className="text-[10px] font-bold text-gold-dark bg-gold-dark/10 px-2 py-0.5 rounded-full">
                          {item.episodeCount} episodes
                        </span>
                      )}
                      {item._type === "pdf" && (
                        <span className="text-[10px] font-bold text-gold bg-gold/10 px-2 py-0.5 rounded-full">
                          PDF
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Arrow */}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={idx === activeIndex ? "#1E5D50" : "#DCCFC2"} strokeWidth="2" strokeLinecap="round" className="shrink-0 transition-colors">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </li>
              ))}
            </ul>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}
