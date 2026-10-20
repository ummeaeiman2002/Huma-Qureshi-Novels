import React from "react";
import type { Metadata } from "next";
import PageHero from "../components/PageHero";
import LegalToc from "../components/LegalToc";
import LegalSection, {
  LegalP,
  LegalList,
  LegalStrong,
  LegalLink,
  LegalMeta,
} from "../components/LegalSection";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for Huma Qureshi Novels. Learn how we collect, use, and protect your information when you visit our website. Covers Google AdSense, cookies, analytics, reader comments, and data breach liability.",
  alternates: { canonical: "https://humaqureshinovels.com/privacypolicy" },
};

const EMAIL = "humaqureshiofficial73@gmail.com";
const EFFECTIVE_DATE = "20 October 2026";

const SECTIONS = [
  { id: "who-we-are", label: "Who We Are" },
  { id: "information-we-collect", label: "Information We Collect" },
  { id: "how-we-use", label: "How We Use Information" },
  { id: "cookies", label: "Cookies and Web Beacons" },
  { id: "google-analytics", label: "Google Analytics" },
  { id: "google-adsense", label: "Google AdSense and Ads" },
  { id: "data-security", label: "Data Security" },
  { id: "data-breach", label: "Data Breach and Liability" },
  { id: "third-party-links", label: "Third-Party Links" },
  { id: "children", label: "Children's Privacy" },
  { id: "your-choices", label: "Your Choices and Rights" },
  { id: "changes", label: "Changes to This Policy" },
  { id: "contact", label: "Contact Us" },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col gap-6 py-5 overflow-hidden">
      {/* Hero Banner */}
      <PageHero
        badge="Legal"
        title="Privacy Policy"
        description="What we collect, why we collect it, and the choices you have — including Google Analytics, Google AdSense and cookie usage."
      >
        <p className="text-sm text-cream/60">Last updated: {EFFECTIVE_DATE}</p>
      </PageHero>

      {/* TOC + Document */}
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[230px_minmax(0,1fr)]">
        <LegalToc items={SECTIONS} />

        <div className="flex min-w-0 flex-col gap-5">
          <LegalMeta
            effectiveDate={EFFECTIVE_DATE}
            contactEmail={EMAIL}
            summary={
              <>
                <LegalP>
                  This Privacy Policy explains how <LegalStrong>Huma Qureshi Novels</LegalStrong>{" "}
                  (humaqureshinovels.com) collects, uses, and protects information when you visit
                  this website. By using this site you agree to the practices described here. If
                  you do not agree, please do not use the website.
                </LegalP>
                <LegalP>
                  Reading our novels does not require an account, and we do not ask you to
                  register or pay to read content on this site.
                </LegalP>
              </>
            }
          />

          <LegalSection id="who-we-are" number={1} title="Who We Are">
            <LegalP>
              This website is a personal publishing platform dedicated to the original Urdu novels,
              episodic stories and PDF books of Huma Qureshi. In this policy, &ldquo;we&rdquo;,
              &ldquo;our&rdquo; and &ldquo;us&rdquo; refer to the operator of this website.
            </LegalP>
            <LegalP>
              If you have any question about this policy you can reach us through our{" "}
              <LegalLink href="/contact">Contact page</LegalLink> or by email at{" "}
              <LegalLink href={`mailto:${EMAIL}`}>{EMAIL}</LegalLink>.
            </LegalP>
          </LegalSection>

          <LegalSection id="information-we-collect" number={2} title="Information We Collect">
            <LegalP>We collect only the following categories of information:</LegalP>
            <LegalList
              items={[
                <>
                  <LegalStrong>Information you choose to provide.</LegalStrong> When you post a
                  comment on a novel, PDF or episode we store the display name you type and the
                  text of your comment. When you use the Contact page, your email application opens
                  with your message pre-filled — we receive it only if you decide to send it.
                </>,
                <>
                  <LegalStrong>Information collected automatically.</LegalStrong> Like most
                  websites, we record technical data such as your IP address, browser type and
                  version, device type, operating system, referring page, pages viewed, and the
                  date and time of your visit. This is used for security, troubleshooting and
                  aggregate statistics.
                </>,
                <>
                  <LegalStrong>Aggregate counters.</LegalStrong> We keep simple view and download
                  counters for our novels and episodes. These counts are totals only and are not
                  linked to you personally.
                </>,
                <>
                  <LegalStrong>Your cookie preference.</LegalStrong> Your choice on our cookie
                  banner is stored in your browser&rsquo;s local storage so we can remember it.
                </>,
              ]}
            />
            <LegalP>
              We do not require account registration, and we do not ask for passwords, payment
              card details or national identifiers through this website.
            </LegalP>
          </LegalSection>

          <LegalSection id="how-we-use" number={3} title="How We Use Your Information">
            <LegalP>We use the information described above to:</LegalP>
            <LegalList
              items={[
                "Display reader comments alongside the content they refer to.",
                "Respond to messages and enquiries you send to us.",
                "Understand which novels and episodes are read, so we can improve the content and the site.",
                "Keep the website secure, prevent abuse, and diagnose technical problems.",
                "Meet legal obligations and enforce our copyright.",
              ]}
            />
            <LegalP>
              <LegalStrong>We do not sell, rent, or trade your personal information to third
              parties.</LegalStrong>
            </LegalP>
          </LegalSection>

          <LegalSection id="cookies" number={4} title="Cookies and Web Beacons">
            <LegalP>
              Cookies are small files stored on your device that help websites remember your
              preferences and understand how visitors use them. We use cookies and similar
              technologies for three purposes: to remember your cookie-banner choice, to measure
              site usage with Google Analytics, and to serve advertising through Google AdSense.
            </LegalP>
            <LegalP>
              On your first visit we ask for your choice: <LegalStrong>Accept all</LegalStrong>,{" "}
              <LegalStrong>Reject non-essential</LegalStrong>, or{" "}
              <LegalStrong>Customize</LegalStrong> — where you can switch Analytics and
              Advertising cookies on or off individually (strictly necessary cookies are always on).
              Your decision is stored in your browser and sent to Google via Consent Mode, so ads
              and analytics behave according to what you allowed.
            </LegalP>
            <LegalP>
              You can change your mind at any time from the{" "}
              <LegalStrong>Cookie Preferences</LegalStrong> link in the website footer, or by
              disabling or deleting cookies in your browser settings. If you do, the site will
              still be readable, but some features (such as remembering your preference) may no
              longer work as expected.
            </LegalP>
          </LegalSection>

          <LegalSection id="google-analytics" number={5} title="Google Analytics">
            <LegalP>
              We use Google Analytics to understand how visitors use our website. Google Analytics
              collects information such as how often users visit, what pages they visit, and which
              other sites were used prior to coming to our site. We use this information to
              improve our content and user experience. Google Analytics may set its own cookies on
              your device. To learn more about how Google uses data, please visit{" "}
              <LegalLink href="https://policies.google.com/privacy" external>
                policies.google.com/privacy
              </LegalLink>
              .
            </LegalP>
          </LegalSection>

          <LegalSection id="google-adsense" number={6} title="Google AdSense and Advertising">
            <LegalP>
              This website displays advertising served by Google AdSense. Advertising keeps our
              novels free to read for everyone.
            </LegalP>
            <LegalP>
              Google and third-party vendors, including Google AdSense, use cookies — including the
              DoubleClick DART cookie — to serve ads based on your prior visits to this or other
              websites. Google&rsquo;s use of advertising cookies enables it and its partners to
              serve ads to you based on your visit to our site and/or other sites on the internet.
            </LegalP>
            <LegalList
              items={[
                <>
                  You may opt out of personalised advertising by visiting{" "}
                  <LegalLink href="https://adssettings.google.com" external>
                    Google Ads Settings
                  </LegalLink>
                  .
                </>,
                <>
                  You may opt out of third-party cookies more broadly at{" "}
                  <LegalLink href="https://www.aboutads.info/choices/" external>
                    aboutads.info/choices
                  </LegalLink>{" "}
                  or{" "}
                  <LegalLink href="https://optout.networkadvertising.org/" external>
                    optout.networkadvertising.org
                  </LegalLink>
                  .
                </>,
                "You can also opt out of personalised ads by disabling personalised ads in your Google account, or by using the cookie controls shown in our cookie banner.",
              ]}
            />
            <LegalP>
              Third-party ad networks and advertisers may themselves use cookies over which we have
              no control. Please refer to the privacy policies of those third parties for details.
              Google&rsquo;s advertising policies are available at{" "}
              <LegalLink href="https://policies.google.com/technologies/ads" external>
                policies.google.com/technologies/ads
              </LegalLink>
              .
            </LegalP>
          </LegalSection>

          <LegalSection id="data-security" number={7} title="Data Security">
            <LegalP>
              We take reasonable measures to protect your personal information and ensure it is not
              lost, misused, or accessed without permission. However, no method of transmission
              over the Internet or electronic storage is 100% secure, and we cannot guarantee
              absolute security.
            </LegalP>
          </LegalSection>

          <LegalSection id="data-breach" number={8} title="Data Breach and Limitation of Liability">
            <LegalP>
              While we take reasonable precautions to safeguard your personal data, we shall not be
              held liable for any unauthorized access, data breach, hacking, server failure, or data
              loss caused by events beyond our reasonable control, including but not limited to
              cyberattacks, third-party service failures, natural disasters, or technical
              malfunctions.
            </LegalP>
            <LegalP>
              In the event of a data breach, we will make reasonable efforts to notify affected
              users in a timely manner. However, the website owner, its operators, and affiliates
              shall not be held responsible for any direct, indirect, incidental, or consequential
              damages arising from such breach.
            </LegalP>
            <LegalP>
              Users are advised to maintain their own backups of any data submitted through this
              website and to use strong, unique passwords.
            </LegalP>
          </LegalSection>

          <LegalSection id="third-party-links" number={9} title="Third-Party Links">
            <LegalP>
              Our website may include links to third-party websites (for example Facebook,
              Instagram, YouTube, or file hosting services). We are not responsible for their
              privacy practices or content. Please review their privacy policies individually
              before providing them with any information.
            </LegalP>
          </LegalSection>

          <LegalSection id="children" number={10} title="Children's Privacy">
            <LegalP>
              This website is not intended for children under 13. We do not knowingly collect
              personal information from children. If you are a parent or guardian and believe your
              child has provided us with personal information, please contact us and we will remove
              it.
            </LegalP>
          </LegalSection>

          <LegalSection id="your-choices" number={11} title="Your Choices and Rights">
            <LegalP>You are entitled to:</LegalP>
            <LegalList
              items={[
                "Control cookies through the Cookie Preferences link in our footer, or through your browser settings.",
                "Withdraw or change your consent for analytics and advertising at any time — the choice applies from the moment you save it.",
                "Opt out of personalised advertising as described in section 6.",
                "Ask us to delete a comment you have posted, or to provide a copy of information you have sent us.",
                "Ask us to correct or remove any personal data we hold about you that you believe is inaccurate.",
              ]}
            />
            <LegalP>
              If you are located in the European Union, the United Kingdom or another region with
              comparable data protection laws, you may additionally have the right to lodge a
              complaint with your local supervisory authority. To exercise any of these rights,
              contact us at{" "}
              <LegalLink href={`mailto:${EMAIL}`}>{EMAIL}</LegalLink>.
            </LegalP>
          </LegalSection>

          <LegalSection id="changes" number={12} title="Changes to This Policy">
            <LegalP>
              We may update this Privacy Policy occasionally. Any changes will be posted on this
              page with a revised &ldquo;Last updated&rdquo; date, and the updated policy will
              apply from the date of posting. Continued use of the website after changes have been
              posted constitutes acceptance of those changes.
            </LegalP>
          </LegalSection>

          <LegalSection id="contact" number={13} title="Contact Us">
            <LegalP>
              If you have any questions about this Privacy Policy or how your data is handled,
              contact us through our <LegalLink href="/contact">Contact page</LegalLink> or email{" "}
              <LegalLink href={`mailto:${EMAIL}`}>{EMAIL}</LegalLink>.
            </LegalP>
            <LegalP>
              See also our <LegalLink href="/terms">Terms &amp; Conditions</LegalLink> for the rules
              governing use of this website and its content.
            </LegalP>
          </LegalSection>
        </div>
      </div>
    </div>
  );
}
