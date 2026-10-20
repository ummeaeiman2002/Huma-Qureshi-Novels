"use client";

import { useState } from "react";

const SUBJECTS = [
  "General Inquiry",
  "Collaboration",
  "Ghostwriting",
  "Rights / Permissions",
  "Interview / Guest Post",
];

const fieldClass =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-tertiary placeholder:text-muted/70 shadow-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15";

const labelClass = "text-xs font-bold uppercase tracking-wide text-muted";

export default function ContactForm({ email }: { email: string }) {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const from = String(data.get("email") ?? "").trim();
    const subject = String(data.get("subject") ?? SUBJECTS[0]);
    const message = String(data.get("message") ?? "").trim();

    const subjectLine = `[${subject}]${name ? ` — ${name}` : ""}`;
    const body = `Name: ${name}\nEmail: ${from}\n\n${message}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(
      subjectLine
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className={labelClass}>
            Your Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="e.g. Ayesha Khan"
            className={fieldClass}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className={labelClass}>
            Your Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className={fieldClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="subject" className={labelClass}>
          Subject
        </label>
        <select id="subject" name="subject" defaultValue={SUBJECTS[0]} className={fieldClass}>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className={labelClass}>
          Your Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="Tell me about your project, story idea, or question…"
          className={`${fieldClass} resize-y`}
        />
      </div>

      <button
        type="submit"
        className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-bold text-brand-deep shadow-md transition hover:bg-gold-dark hover:text-cream active:scale-95"
      >
        Send Message
        <span aria-hidden="true">&rarr;</span>
      </button>

      <p
        role="status"
        aria-live="polite"
        className={`text-sm font-medium ${sent ? "text-gold-dark" : "text-muted"}`}
      >
        {sent
          ? "Your email app should open with your message ready to send. If not, email me directly instead."
          : "Submitting opens your email app with the message pre-filled — nothing is sent without your confirmation."}
      </p>
    </form>
  );
}
