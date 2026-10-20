import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import PageHero from "../components/PageHero";
import ContactForm from "./ContactForm";
import { getSiteSettings } from "@/lib/sanity/siteSettings";
import { SITE_NAME } from "@/lib/seo";

const EMAIL = "humaqureshiofficial73@gmail.com";

const TITLE = "Contact Huma Qureshi";
const DESCRIPTION =
  "Get in touch with Huma Qureshi for collaborations, ghostwriting, story development, rights inquiries, or general messages. Based in Karachi, available for global projects remotely.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://humaqureshinovels.com/contact" },
  openGraph: {
    type: "website",
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: "https://humaqureshinovels.com/contact",
    siteName: SITE_NAME,
  },
};

export default async function Page() {
  const settings = await getSiteSettings();

  const socials = [
    { href: `mailto:${EMAIL}`, alt: "Email", icon: settings.socialEmailIcon, external: false },
    { href: "https://youtube.com/@writerhumaqureshinovells?si=UzQ_r6YKbTz-dI2z", alt: "YouTube", icon: settings.socialYoutubeIcon, external: true },
    { href: "https://www.facebook.com/share/1FmEpe6h1p/", alt: "Facebook", icon: settings.socialFacebookIcon, external: true },
    { href: "https://www.instagram.com/humaqureshiwriter007?igsh=amp6Y3B5OXJvb3lh", alt: "Instagram", icon: settings.socialInstagramIcon, external: true },
  ];

  return (
    <div className="flex flex-col gap-10 py-5">
      {/* Hero */}
      <PageHero
        badge="Get in Touch"
        title="Contact Me"
        description="Have a project, a story idea, or a collaboration in mind? I personally read every message and reply as soon as I can."
        accent="For ghostwriting, rights inquiries, interviews, or just to say hello — you're in the right place."
        highlights={[
          { value: "24–48h", label: "Typical Reply" },
          { value: "Global", label: "Remote Projects" },
          { value: "Free", label: "First Consult" },
        ]}
      />

      {/* Form + details */}
      <section aria-label="Contact form and details" className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[1.35fr_1fr]">
        {/* Form */}
        <div className="flex flex-col gap-5 rounded-3xl border border-line bg-surface p-6 shadow-sm lg:p-8">
          <div className="flex flex-col gap-2">
            <span className="ui-eyebrow">Send a Message</span>
            <h2 className="text-2xl font-extrabold text-brand lg:text-3xl">Let&apos;s Work Together</h2>
            <p className="leading-8 font-medium text-muted">
              Fill in the form below and your email app will open with everything pre-filled, ready to
              send straight to me.
            </p>
          </div>
          <ContactForm email={EMAIL} />
        </div>

        {/* Details column */}
        <div className="flex flex-col gap-6">
          {/* Contact details */}
          <div className="flex flex-col gap-5 rounded-3xl border border-line bg-surface p-6 shadow-sm lg:p-8">
            <h2 className="text-2xl font-extrabold text-brand">Contact Details</h2>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand/10">
                <Image src={settings.socialEmailIcon} alt="" width={24} height={24} className="h-6 w-6 object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-wide text-muted">Email</span>
                <Link
                  href={`mailto:${EMAIL}`}
                  className="break-all font-bold text-brand underline-offset-4 transition hover:text-gold-dark hover:underline"
                >
                  {EMAIL}
                </Link>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand/10">
                <Image src={settings.locationIcon} alt="" width={24} height={24} className="h-6 w-6 object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-wide text-muted">Location</span>
                <span className="font-medium text-tertiary">
                  Karachi, Pakistan — available for global projects remotely
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-cream-soft px-4 py-3">
              <p className="text-sm font-medium text-muted">
                Prefer email? Reach me directly at the address above — it lands in the same inbox.
              </p>
            </div>
          </div>

          {/* Collaboration */}
          <div className="flex flex-col gap-4 rounded-3xl bg-brand-deep p-6 text-cream shadow-lg ring-1 ring-inset ring-gold/20 lg:p-8">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold">
              Looking for Collaboration?
            </span>
            <h2 className="text-2xl font-extrabold text-cream">I&apos;m Open To</h2>
            <ul className="flex flex-col gap-2.5">
              {[
                "Freelance writing",
                "Story development & ghostwriting",
                "Content creation",
                "Screenplay or novel consultation",
                "Guest posts or interviews",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 leading-7 font-medium text-cream/90">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/20 text-xs font-bold text-gold"
                  >
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Social band */}
      <section aria-label="Social links" className="mx-auto w-full max-w-5xl">
        <div className="flex flex-col items-center gap-5 rounded-3xl border border-line bg-cream-soft p-6 text-center lg:p-8">
          <span className="ui-eyebrow">Follow Along</span>
          <h2 className="text-2xl font-extrabold text-brand lg:text-3xl">Connect on Social</h2>
          <p className="max-w-2xl leading-8 font-medium text-muted">
            Follow my work, updates, and new releases on social media — or drop me a message directly.
          </p>
          <div className="flex items-center gap-4">
            {socials.map((s) => (
              <a
                key={s.alt}
                href={s.href}
                aria-label={s.alt}
                {...(s.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="flex h-14 w-14 items-center justify-center rounded-full border border-line bg-surface shadow-sm transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md"
              >
                <Image src={s.icon} alt={s.alt} width={28} height={28} className="h-7 w-7 object-contain" />
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
