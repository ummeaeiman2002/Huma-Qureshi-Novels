export default function ViewsBadge({ views }: { views?: number }) {
  return (
    <span className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-secondary text-secondary text-base font-medium bg-secondary/10">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
      {(views || 0).toLocaleString()} Views
    </span>
  );
}
