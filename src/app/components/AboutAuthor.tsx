import Image from "next/image";
import Button from "./ui/Button";

/**
 * About the Author — homepage introduction for Huma Qureshi.
 * Biography text is drawn only from the site's genuine About content
 * (src/app/about/page.tsx); nothing personal is invented.
 */
export default function AboutAuthor({ image }: { image: string }) {
  const hasImage = typeof image === "string" && image.length > 0;

  return (
    <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
      {/* Portrait */}
      <div className="relative overflow-hidden rounded-3xl border border-line bg-cream-soft shadow-[0_18px_40px_-24px_rgba(41,40,36,0.55)]">
        <div className="relative aspect-[4/5] w-full">
          {hasImage ? (
            <Image
              src={image}
              alt="Huma Qureshi, Pakistani Urdu writer"
              fill
              sizes="(max-width: 1024px) 90vw, 480px"
              className="object-cover"
            />
          ) : (
            <div className="hero-pattern flex h-full w-full items-center justify-center bg-brand-deep">
              <span className="font-display text-6xl font-extrabold text-gold/70">H</span>
            </div>
          )}
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-deep/70 via-transparent to-transparent"
        />
        <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-gold/30 bg-brand-deep/70 px-4 py-3 backdrop-blur-sm">
          <p className="text-sm font-bold text-cream">Huma Qureshi</p>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
            Pakistani Urdu Writer
          </p>
        </div>
      </div>

      {/* Text */}
      <div className="flex flex-col items-start gap-5">
        <span className="ui-eyebrow text-gold-dark">About the Author</span>

        <h2 className="heading-stylish text-2xl font-bold text-brand lg:text-3xl">
          Huma Qureshi
        </h2>

        <p className="leading-8 font-medium text-muted">
          I am <span className="font-bold text-brand">Huma Qureshi</span>, a Pakistani Urdu writer
          and novelist. Although I occasionally write under my real name, Aiman Qureshi, I publish
          primarily under my pen name, a tribute to my mother, who shaped my love for literature. I
          began writing five years ago and have since authored ten full-length Urdu novels and ten
          short novels and afsanas, along with pieces published on Amazon Kindle, including
          collaborative and ghost-written projects.
        </p>

        <p className="leading-8 font-medium text-muted">
          My stories explore the many shades of human relationships — love, betrayal, sacrifice and
          resilience — with a strong focus on women-centric narratives and realistic, thought-provoking
          themes.
        </p>

        <div className="pt-1">
          <Button href="/about" variant="primary">
            Read More About Me &rarr;
          </Button>
        </div>
      </div>
    </div>
  );
}
