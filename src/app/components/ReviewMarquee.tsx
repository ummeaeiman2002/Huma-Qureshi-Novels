import Image from "next/image";
import Heading from "@/app/components/Heading";
import PlatformIcon, { platformLabel } from "@/app/components/PlatformIcon";

export type Review = {
  _id: string;
  name?: string;
  quote?: string;
  platform?: string;
  rating?: number;
  link?: string;
  imageUrl?: string;
  imageAlt?: string;
};

const STAGGER = ["translate-y-0", "-translate-y-5", "translate-y-5"];

function Stars({ rating }: { rating: number }) {
  const value = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <span className="flex shrink-0 items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
          <path
            d="M12 2.5l2.95 6.02 6.55.95-4.74 4.62 1.12 6.53L12 17.98 6.12 20.62l1.12-6.53-4.74-4.62 6.55-.95z"
            fill={i < value ? "#A48750" : "#DED4C5"}
          />
        </svg>
      ))}
    </span>
  );
}

function ReviewCard({ review, index }: { review: Review; index: number }) {
  const offset = STAGGER[index % STAGGER.length];
  const label = platformLabel(review.platform);

  return (
    <article className={`w-[220px] shrink-0 sm:w-[260px] lg:w-[300px] ${offset}`}>
      <div className="relative aspect-[9/16] overflow-hidden rounded-2xl border-2 border-line bg-surface shadow-xl">
        <Image
          src={review.imageUrl as string}
          alt={review.imageAlt || `${review.name || label} review`}
          fill
          sizes="(max-width: 640px) 220px, (max-width: 1024px) 260px, 300px"
          className="object-cover"
        />
      </div>
      <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface px-4 py-2.5 shadow-md">
        <div className="flex min-w-0 items-center gap-2">
          <PlatformIcon platform={review.platform} className="h-4 w-4 shrink-0" />
          <span className="truncate text-sm font-bold text-brand">
            {review.name || label}
          </span>
        </div>
        {typeof review.rating === "number" && <Stars rating={review.rating} />}
      </div>
    </article>
  );
}

export default function ReviewMarquee({
  reviews,
  heading = "What Our Readers Say",
}: {
  reviews?: Review[];
  heading?: string;
}) {
  const list = (reviews || []).filter((r) => r?.imageUrl);

  if (list.length === 0) return null;

  const useMarquee = list.length > 3;

  return (
    <section aria-label={heading} className="py-4">
      <Heading name={heading} />

      {useMarquee ? (
        <div className="marquee-group marquee-fade mt-6 overflow-hidden py-6">
          <div className="marquee-track">
            {list.map((r, i) => (
              <ReviewCard key={r._id} review={r} index={i} />
            ))}
            {list.map((r, i) => (
              <ReviewCard key={`${r._id}-dup`} review={r} index={i} />
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 py-6">
          {list.map((r, i) => (
            <ReviewCard key={r._id} review={r} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}
