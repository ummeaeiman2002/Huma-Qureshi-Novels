"use client";

export default function CookiePreferencesButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("hq:consent-open"))}
      className={className}
    >
      Cookie Preferences
    </button>
  );
}
