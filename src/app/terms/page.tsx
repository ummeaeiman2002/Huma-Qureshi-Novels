import React from "react";
import Link from "next/link";
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
  title: "Terms & Conditions",
  description:
    "Terms and conditions for Huma Qureshi Novels. Content ownership, permitted use, reader comments, copyright protection, DMCA policy, and limitation of liability.",
  alternates: { canonical: "https://humaqureshinovels.com/terms" },
};

const EMAIL = "humaqureshiofficial73@gmail.com";
const EFFECTIVE_DATE = "20 October 2026";

const SECTIONS = [
  { id: "acceptance", label: "Acceptance of Terms" },
  { id: "permitted-use", label: "Permitted Use" },
  { id: "content-ownership", label: "Content Ownership" },
  { id: "fiction", label: "Fictional Disclaimer" },
  { id: "plagiarism", label: "No Plagiarism Allowed" },
  { id: "comments", label: "Reader Comments" },
  { id: "collaborations", label: "Collaborations and Permissions" },
  { id: "privacy", label: "Privacy and Data Use" },
  { id: "liability", label: "Disclaimer of Liability" },
  { id: "external-links", label: "External Links" },
  { id: "downloads", label: "Download Responsibility" },
  { id: "dmca", label: "Copyright and DMCA" },
  { id: "removal-requests", label: "Content Removal Requests" },
  { id: "changes", label: "Changes to These Terms" },
  { id: "contact", label: "Contact" },
];

export default function TermsPage() {
  return (
    <div className="flex flex-col gap-6 py-5 overflow-hidden">
      {/* Hero Banner */}
      <PageHero
        badge="Legal"
        title="Terms & Conditions"
        description="Please read these terms carefully before using this website. They govern your use of our novels, PDF downloads and reader comments."
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
                  These Terms &amp; Conditions (&ldquo;Terms&rdquo;) govern your access to and use
                  of humaqureshinovels.com and all content published on it. By accessing or using
                  this website you agree to be bound by these Terms and by our{" "}
                  <LegalLink href="/privacypolicy">Privacy Policy</LegalLink>.
                </LegalP>
                <LegalP>
                  If you do not agree with any part of these Terms, please refrain from using the
                  website.
                </LegalP>
              </>
            }
          />

          <LegalSection id="acceptance" number={1} title="Acceptance of Terms">
            <LegalP>
              By accessing and using this website, you agree to the following terms and
              conditions. If you do not agree with any part of these terms, please refrain from
              using the website.
            </LegalP>
            <LegalP>
              These Terms apply to all visitors, readers, and anyone else who accesses the website
              from any device.
            </LegalP>
          </LegalSection>

          <LegalSection id="permitted-use" number={2} title="Permitted Use of the Website">
            <LegalP>
              Our novels and PDF books are published to be read online, free of charge. Subject to
              these Terms, we grant you a personal, non-exclusive, non-transferable, revocable
              licence to:
            </LegalP>
            <LegalList
              items={[
                "Read episodes and novels published on this website for your own personal enjoyment.",
                "Download PDF files provided for download, solely for your own personal, offline reading.",
                "Share a link to a page on this website so others may read it here.",
              ]}
            />
            <LegalP>
              You must not use the website for any unlawful purpose, and you must not attempt to
              disrupt, overload, scrape, or gain unauthorized access to the website or its
              underlying systems.
            </LegalP>
          </LegalSection>

          <LegalSection id="content-ownership" number={3} title="Content Ownership">
            <LegalP>
              This website is dedicated exclusively to the works of Huma Qureshi. It features her
              original Urdu novels, PDF books, episodic stories, and afsanas. All content published
              on this website belongs to Huma Qureshi and is protected under copyright law.
            </LegalP>
            <LegalP>
              Unauthorized copying, reproduction, translation, republishing, hosting, or
              distribution of any content from this website is strictly prohibited. All rights are
              reserved by the author, Huma Qureshi.
            </LegalP>
          </LegalSection>

          <LegalSection id="fiction" number={4} title="Fictional Disclaimer">
            <LegalP>
              All stories, characters, events, and places mentioned on this website are works of
              fiction unless clearly stated as real. Any resemblance to actual persons (living or
              dead), places, or incidents is purely coincidental.
            </LegalP>
          </LegalSection>

          <LegalSection id="plagiarism" number={5} title="No Plagiarism Allowed">
            <LegalP>Visitors and readers are not allowed to:</LegalP>
            <LegalList
              items={[
                "Copy or steal written material from this website.",
                "Use our content under their own name, or for commercial purposes.",
                "Share full stories or PDF files without credit or written permission.",
              ]}
            />
            <LegalP>
              <LegalStrong>
                Legal action may be taken in case of violation of content rights.
              </LegalStrong>
            </LegalP>
          </LegalSection>

          <LegalSection id="comments" number={6} title="Reader Comments">
            <LegalP>
              Readers may post comments on novels, episodes and PDF pages. When you comment, only
              your chosen display name and your comment text are stored and displayed publicly on
              that page.
            </LegalP>
            <LegalP>You agree not to post comments that are:</LegalP>
            <LegalList
              items={[
                "Abusive, hateful, harassing, or defamatory towards any person.",
                "Spam, advertising, or unsolicited promotional material.",
                "Infringing of someone else\u2019s copyright or privacy.",
                "Unlawful, or containing personal information about other people.",
              ]}
            />
            <LegalP>
              We may edit or remove any comment at our sole discretion and without notice. Comments
              are public, so please do not post anything you would not want made available to
              everyone.
            </LegalP>
          </LegalSection>

          <LegalSection id="collaborations" number={7} title="Collaborations and Permissions">
            <LegalP>
              For sharing, quoting, or collaborating professionally, please contact us directly
              through the <LegalLink href="/contact">Contact page</LegalLink> or email at{" "}
              <LegalLink href={`mailto:${EMAIL}`}>{EMAIL}</LegalLink>.
            </LegalP>
          </LegalSection>

          <LegalSection id="privacy" number={8} title="Privacy and Data Use">
            <LegalP>
              Any personal data submitted through contact forms (such as name or email) will be
              kept confidential and never shared with third parties without consent.
            </LegalP>
            <LegalP>
              For full details on the information we collect — including cookies, Google Analytics
              and Google AdSense — please read our{" "}
              <LegalLink href="/privacypolicy">Privacy Policy</LegalLink>.
            </LegalP>
          </LegalSection>

          <LegalSection id="liability" number={9} title="Disclaimer of Liability">
            <LegalP>
              While we try to keep all information accurate and updated, this website makes no
              guarantees about the completeness, reliability, or accuracy of the content.
            </LegalP>
            <LegalP>
              The website owner is not liable for any misinterpretation, emotional impact, or
              external use of the content.
            </LegalP>
            <LegalP>
              Use of any content on this website is entirely at the reader&rsquo;s own risk. The
              website owner is not responsible for any loss or damage arising from the use of this
              website or its content.
            </LegalP>
            <LegalP>
              The website owner shall not be held liable for any data breach, unauthorized access,
              hacking, server failure, or loss of data caused by events beyond reasonable control.
              Users submit their information voluntarily and at their own risk.
            </LegalP>
          </LegalSection>

          <LegalSection id="external-links" number={10} title="External Links Disclaimer">
            <LegalP>
              This website may contain links to external websites (for example YouTube, Facebook,
              Instagram, or PDF hosting services). We do not control the content or policies of
              these external websites and are not responsible for their content, privacy practices,
              or availability.
            </LegalP>
          </LegalSection>

          <LegalSection id="downloads" number={11} title="Download Responsibility">
            <LegalP>
              PDFs and files available for download on this website are provided for the
              reader&rsquo;s personal use. We are not responsible for how downloaded files are
              used, distributed, or stored by the user, or for any damage caused to devices during
              download.
            </LegalP>
          </LegalSection>

          <LegalSection id="dmca" number={12} title="Copyright Protection and DMCA Policy">
            <LegalP>
              All novels, PDF books, stories, afsanas, and creative content published on this
              website are the original works of Huma Qureshi and are protected by copyright law.
            </LegalP>
            <LegalP>
              <LegalStrong>
                If any website, platform, individual, or entity is found copying, reproducing,
                hosting, or distributing our content without written permission from Huma Qureshi,
                we will take immediate DMCA takedown action and legal proceedings against them.
              </LegalStrong>
            </LegalP>
            <LegalP>
              We actively monitor the internet for unauthorized use of our content. If you find our
              work being used elsewhere without permission, please report it to us at{" "}
              <LegalLink href={`mailto:${EMAIL}`}>{EMAIL}</LegalLink>.
            </LegalP>
            <LegalP>
              We will file DMCA takedown requests with hosting providers, search engines, and
              platforms to have infringing content removed. Repeat infringers may face legal action
              for copyright damages and intellectual property theft.
            </LegalP>
          </LegalSection>

          <LegalSection id="removal-requests" number={13} title="Content Removal Requests">
            <LegalP>
              All content on this website is the original work of Huma Qureshi and is protected by
              copyright. If you believe any content on this website infringes your copyright or has
              been published without proper authorization, please contact us at{" "}
              <LegalLink href={`mailto:${EMAIL}`}>{EMAIL}</LegalLink> with the details, and we will
              review and address your request promptly.
            </LegalP>
          </LegalSection>

          <LegalSection id="changes" number={14} title="Changes to These Terms">
            <LegalP>
              We may revise these Terms at any time. The revised version will be posted on this
              page with an updated effective date, and will take effect from that date. Your
              continued use of the website after changes are posted means you accept the revised
              Terms.
            </LegalP>
          </LegalSection>

          <LegalSection id="contact" number={15} title="Contact">
            <LegalP>
              Questions about these Terms? Reach us through the <LegalLink href="/contact">Contact page</LegalLink>{" "}
              or email <LegalLink href={`mailto:${EMAIL}`}>{EMAIL}</LegalLink>.
            </LegalP>
            <LegalP>
              See also our <LegalLink href="/privacypolicy">Privacy Policy</LegalLink> for details
              on how we handle information.
            </LegalP>
          </LegalSection>
        </div>
      </div>
    </div>
  );
}
