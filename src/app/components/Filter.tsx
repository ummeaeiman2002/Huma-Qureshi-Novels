"use client";

type DropdownProps = {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

type CheckboxProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

type ToggleProps = {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
};

interface FilterProps {
  dropdowns?: DropdownProps[];
  checkboxes?: CheckboxProps[];
  toggle?: ToggleProps | null;
  // onclick?: (...args: any) => void
  onclick?: (...args: any[]) => void | Promise<void>;
  /** Optional card heading shown above the controls. */
  title?: string;
  /** Optional helper line shown under the heading. */
  description?: string;
  /** Label for the checkbox group (defaults to "Genres"). */
  checkboxesLabel?: string;
}

const labelClass = "ui-eyebrow";

const selectClass =
  "w-full appearance-none rounded-xl border border-line bg-surface px-4 py-2.5 pr-10 text-sm font-semibold text-tertiary shadow-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15";

export default function Filter({
  dropdowns = [],
  checkboxes = [],
  toggle = null,
  onclick,
  title,
  description,
  checkboxesLabel = "Genres",
}: FilterProps) {
  return (
    <section
      aria-label={title || "Filters"}
      className="w-full rounded-3xl border border-line bg-surface p-5 shadow-sm lg:p-7"
    >
      {(title || description) && (
        <div className="mb-6 flex flex-col gap-1.5">
          {title && (
            <h3 className="font-display text-xl font-extrabold text-brand lg:text-2xl">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm font-medium leading-6 text-muted">{description}</p>
          )}
          <span
            aria-hidden="true"
            className="mt-1 h-1 w-16 rounded-full bg-gradient-to-r from-gold to-transparent"
          />
        </div>
      )}

      <div className="flex flex-col gap-6">
        {/* Dropdowns */}
        {dropdowns.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dropdowns.map((dropdown, i) => (
              <div key={i} className="flex flex-col gap-2">
                <label htmlFor={`filter-dd-${i}`} className={labelClass}>
                  {dropdown.label}
                </label>
                <div className="relative">
                  <select
                    id={`filter-dd-${i}`}
                    value={dropdown.value}
                    onChange={(e) => dropdown.onChange(e.target.value)}
                    className={selectClass}
                  >
                    <option value="">All {dropdown.label}</option>
                    {dropdown.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted"
                  >
                    ▼
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Checkbox chips (genres) */}
        {checkboxes.length > 0 && (
          <div className="flex flex-col gap-2.5">
            <span className={labelClass}>{checkboxesLabel}</span>
            <div className="flex flex-wrap gap-2">
              {checkboxes.map((cb, i) => (
                <label
                  key={i}
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold shadow-sm transition-all duration-200 active:scale-95 ${
                    cb.checked
                      ? "border-gold bg-gold/15 text-brand"
                      : "border-line bg-surface text-muted hover:border-brand/40 hover:text-brand"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={cb.checked}
                    onChange={(e) => cb.onChange(e.target.checked)}
                    className="sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className={`flex h-4 w-4 items-center justify-center rounded-full border text-[10px] font-bold transition-colors ${
                      cb.checked
                        ? "border-gold bg-gold text-brand-deep"
                        : "border-line text-transparent"
                    }`}
                  >
                    ✓
                  </span>
                  {cb.label}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Toggle */}
        {toggle && (
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-cream-soft px-4 py-3">
            <span className="text-sm font-bold text-brand">{toggle.label}</span>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={toggle.value}
                onChange={(e) => toggle.onChange(e.target.checked)}
                className="peer sr-only"
              />
              <span className="h-6 w-11 rounded-full bg-line transition-colors peer-checked:bg-gold" />
              <span className="absolute left-[2px] top-[2px] h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
            </label>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-stretch sm:justify-end">
        <button
          type="button"
          onClick={onclick}
          className="w-full rounded-full bg-gold px-8 py-2.5 text-sm font-bold text-brand-deep shadow-md transition-all duration-300 hover:bg-gold-dark hover:text-cream hover:shadow-[0_0_18px_rgba(164,135,80,0.4)] active:scale-95 sm:w-fit"
        >
          Apply Filters
        </button>
      </div>
    </section>
  );
}
