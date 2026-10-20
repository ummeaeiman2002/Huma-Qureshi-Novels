"use client";

export type ActiveFilterItem = {
  key: string;
  label: string;
  value: string;
  onRemove: () => void;
};

export default function ActiveFilters({
  items,
  onClearAll,
  className = "",
}: {
  items: ActiveFilterItem[];
  onClearAll?: () => void;
  className?: string;
}) {
  if (!items || items.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="ui-eyebrow">Active</span>
      {items.map((it) => (
        <span
          key={it.key}
          className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 py-1 pl-3 pr-1.5 text-xs font-bold text-brand"
        >
          <span className="text-muted">{it.label}:</span>
          <span>{it.value}</span>
          <button
            type="button"
            onClick={it.onRemove}
            aria-label={`Remove ${it.label} filter: ${it.value}`}
            className="flex h-5 w-5 items-center justify-center rounded-full bg-brand/80 text-[10px] font-bold leading-none text-white transition hover:bg-brand active:scale-90"
          >
            ✕
          </button>
        </span>
      ))}
      {onClearAll && items.length > 1 && (
        <button
          type="button"
          onClick={onClearAll}
          className="ml-1 text-xs font-bold text-gold-dark underline underline-offset-4 transition hover:text-brand"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
