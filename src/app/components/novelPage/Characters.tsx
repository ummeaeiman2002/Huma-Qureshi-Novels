import Image from "next/image";
import Heading from "@/app/components/Heading";

type Character = {
  _key?: string;
  name?: string;
  role?: string;
  description?: string;
  imageUrl?: string;
};

export default function Characters({
  intro,
  characters,
}: {
  intro?: string;
  characters?: Character[];
}) {
  const valid = (characters || []).filter((c) => c && c.name);
  if (valid.length === 0) return null;

  return (
    <section aria-labelledby="characters-heading" className="py-2">
      <Heading name="Characters" />
      {intro && (
        <p className="mx-auto max-w-4xl px-5 pb-6 text-center leading-8 text-tertiary font-medium">
          {intro}
        </p>
      )}
      <div className="grid grid-cols-1 gap-5 px-2 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-20">
        {valid.map((character, index) => (
          <article
            key={character._key || `${character.name}-${index}`}
            className="group flex flex-col gap-4 rounded-2xl border border-line bg-surface p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-brand hover:shadow-xl"
          >
            <div className="flex items-center gap-4">
              {character.imageUrl ? (
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-gold/40">
                  <Image
                    src={character.imageUrl}
                    alt={character.name || "Character"}
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
                  {(character.name || "?").trim().charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex min-w-0 flex-col gap-1">
                <h3 className="truncate text-lg font-extrabold text-brand">
                  {character.name}
                </h3>
                {character.role && (
                  <span className="w-fit rounded-full border border-line bg-cream-soft px-3 py-0.5 text-[11px] font-bold uppercase tracking-wide text-gold-dark">
                    {character.role}
                  </span>
                )}
              </div>
            </div>
            {character.description && (
              <p className="leading-7 text-tertiary font-medium">
                {character.description}
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
