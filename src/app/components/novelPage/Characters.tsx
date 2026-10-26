"use client";

import { useState } from "react";
import Image from "next/image";
import Heading from "@/app/components/Heading";
import { LanguageSwitch, type Language } from "@/app/components/localized/LocalizedContent";

type Character = {
  _key?: string;
  name?: string;
  nameUr?: string;
  nameEn?: string;
  role?: string;
  description?: string;
  introductionUr?: string;
  introductionEn?: string;
  imageUrl?: string;
  characterImageAlt?: string;
};

function text(value?: string) {
  return typeof value === "string" ? value.trim() : "";
}

export default function Characters({
  intro,
  characters,
  heading = "Characters",
}: {
  intro?: string;
  characters?: Character[];
  heading?: string;
}) {
  const valid = (characters || []).filter(
    (c) => c && (text(c.nameUr) || text(c.nameEn) || text(c.name)),
  );

  const hasUrdu = valid.some(
    (c) => text(c.nameUr) || text(c.introductionUr) || (!text(c.nameEn) && (text(c.name) || text(c.description))),
  );
  const hasEnglish = valid.some((c) => text(c.nameEn) || text(c.introductionEn));
  const [language, setLanguage] = useState<Language>(hasUrdu ? "ur" : "en");

  if (valid.length === 0) return null;

  const active: Language =
    language === "ur" && hasUrdu ? "ur" : language === "en" && hasEnglish ? "en" : hasUrdu ? "ur" : "en";

  return (
    <section aria-labelledby="characters-heading" className="py-2">
      <div className="px-4 sm:px-10">
        <Heading name={heading} />
      </div>
      <div className="mb-4 mt-3 flex justify-center px-4 sm:justify-end sm:px-10">
        <LanguageSwitch
          language={language}
          onChange={setLanguage}
          hasUr={hasUrdu}
          hasEn={hasEnglish}
          label={heading}
        />
      </div>
      {intro && (
        <p className="mx-auto max-w-4xl px-5 pb-6 text-center font-medium leading-8 text-tertiary">
          {intro}
        </p>
      )}
      <div className="grid grid-cols-1 gap-5 px-2 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-20">
        {valid.map((character, index) => {
          const name =
            active === "ur"
              ? text(character.nameUr) || text(character.name) || text(character.nameEn)
              : text(character.nameEn) || text(character.name) || text(character.nameUr);
          const introduction =
            active === "ur"
              ? text(character.introductionUr) || text(character.description) || text(character.introductionEn)
              : text(character.introductionEn) || text(character.description) || text(character.introductionUr);
          const isUrdu = active === "ur";
          const displayName = name || "?";

          return (
            <article
              key={character._key || `${displayName}-${index}`}
              className="group flex flex-col gap-4 rounded-2xl border border-line bg-surface p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-brand hover:shadow-xl"
            >
              <div className="flex items-center gap-4">
                {character.imageUrl ? (
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-gold/40">
                    <Image
                      src={character.imageUrl}
                      alt={character.characterImageAlt || displayName}
                      width={96}
                      height={96}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div
                    aria-hidden="true"
                    className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-gold/40 bg-brand/10 text-2xl font-extrabold text-brand"
                  >
                    {displayName.trim().charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex min-w-0 flex-col gap-1">
                  <h3
                    dir={isUrdu ? "rtl" : "ltr"}
                    lang={isUrdu ? "ur" : "en"}
                    className={`truncate text-lg font-extrabold text-brand ${isUrdu ? "font-urdu text-right" : ""}`}
                  >
                    {displayName}
                  </h3>
                  {character.role && (
                    <span className="w-fit rounded-full border border-line bg-cream-soft px-3 py-0.5 text-[11px] font-bold uppercase tracking-wide text-gold-dark">
                      {character.role}
                    </span>
                  )}
                </div>
              </div>
              {introduction && (
                <p
                  dir={isUrdu ? "rtl" : "ltr"}
                  lang={isUrdu ? "ur" : "en"}
                  className={`font-medium leading-7 text-tertiary ${isUrdu ? "font-urdu text-right" : ""}`}
                >
                  {introduction}
                </p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
