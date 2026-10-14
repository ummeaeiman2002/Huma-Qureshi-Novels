import React from "react";
import type { Metadata } from "next";
import PageHero from "../components/PageHero";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Huma Qureshi Novels. Learn how we collect, use, and protect your information when you visit our website. Covers Google AdSense, cookies, analytics, and data breach liability.",
  alternates: { canonical: "https://humaqureshinovels.com/privacypolicy" },
};

export default function page() {
  return (
    <div className="flex flex-col gap-6 py-5 overflow-hidden">
      {/* Hero Banner */}
      <PageHero
        title="Privacy Policy"
      >
        <p className="text-sm text-cream/60">Last updated: 16 August 2026</p>
      </PageHero>

      {/* Content */}
        <div className="flex flex-col gap-5 max-w-4xl mx-auto">
        <div className="bg-surface rounded-2xl border border-line p-3 sm:p-5 lg:p-8 flex flex-col gap-4 break-words">
          <p className="leading-8 text-sm sm:text-base">
            At Huma Qureshi Novels, your privacy is extremely important to us. This Privacy Policy explains how we collect, use, and protect your information when you visit our website.
          </p>
        </div>

        <div className="bg-surface rounded-2xl border border-line p-3 sm:p-5 lg:p-8 flex flex-col gap-4 break-words">
          <h2 className="text-xl font-extrabold text-brand">Information We Collect</h2>
          <p className="leading-8">
            We may collect the following information when you use our website: Name and Email Address (if submitted via contact form or newsletter). Basic technical data such as IP address, browser type, and device information (collected automatically through cookies and analytics).
          </p>
        </div>

        <div className="bg-surface rounded-2xl border border-line p-3 sm:p-5 lg:p-8 flex flex-col gap-4 break-words">
          <h2 className="text-xl font-extrabold text-brand">How We Use Your Information</h2>
          <p className="leading-8">
            We use your information to: respond to your messages or inquiries, send updates if you opt-in to newsletters, improve user experience and website performance. We do not sell, rent, or trade your information to third parties.
          </p>
        </div>

        <div className="bg-surface rounded-2xl border border-line p-3 sm:p-5 lg:p-8 flex flex-col gap-4 break-words">
          <h2 className="text-xl font-extrabold text-brand">Cookies and Web Beacons</h2>
          <p className="leading-8">
            Like most websites, we use cookies to improve your experience and gather anonymous usage data. Cookies are small files stored on your device that help us remember your preferences and understand how visitors use our site. You can disable cookies through your browser settings, but some features may not work properly without them.
          </p>
        </div>

        <div className="bg-surface rounded-2xl border border-line p-3 sm:p-5 lg:p-8 flex flex-col gap-4 break-words">
          <h2 className="text-xl font-extrabold text-brand">Google Analytics</h2>
          <p className="leading-8">
            We use Google Analytics to understand how visitors use our website. Google Analytics collects information such as how often users visit, what pages they visit, and which other sites were used prior to coming to our site. We use this information to improve our content and user experience. Google Analytics may set its own cookies on your device. To learn more about how Google uses data, please visit{" "}
            <a href="https://policies.google.com/privacy" className="font-bold text-brand underline underline-offset-4 hover:text-gold transition" target="_blank" rel="noopener noreferrer">
              policies.google.com/privacy
            </a>.
          </p>
        </div>

        <div className="bg-surface rounded-2xl border border-line p-3 sm:p-5 lg:p-8 flex flex-col gap-4 break-words">
          <h2 className="text-xl font-extrabold text-brand">Data Security</h2>
          <p className="leading-8">
            We take reasonable measures to protect your personal information and ensure it is not lost, misused, or accessed without permission. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </p>
        </div>

        <div className="bg-surface rounded-2xl border border-line p-3 sm:p-5 lg:p-8 flex flex-col gap-4 break-words">
          <h2 className="text-xl font-extrabold text-brand">Data Breach &amp; Limitation of Liability</h2>
          <p className="leading-8">
            While we take reasonable precautions to safeguard your personal data, we shall not be held liable for any unauthorized access, data breach, hacking, server failure, or data loss caused by events beyond our reasonable control, including but not limited to cyberattacks, third-party service failures, natural disasters, or technical malfunctions.
          </p>
          <p className="leading-8">
            In the event of a data breach, we will make reasonable efforts to notify affected users in a timely manner. However, the website owner, its operators, and affiliates shall not be held responsible for any direct, indirect, incidental, or consequential damages arising from such breach.
          </p>
          <p className="leading-8">
            Users are advised to maintain their own backups of any data submitted through this website and to use strong, unique passwords.
          </p>
        </div>

        <div className="bg-surface rounded-2xl border border-line p-3 sm:p-5 lg:p-8 flex flex-col gap-4 break-words">
          <h2 className="text-xl font-extrabold text-brand">Third-Party Links</h2>
          <p className="leading-8">
            Our website may include links to third-party websites (e.g., Facebook, Instagram, YouTube). We are not responsible for their privacy practices. Please review their privacy policies individually.
          </p>
        </div>

        <div className="bg-surface rounded-2xl border border-line p-3 sm:p-5 lg:p-8 flex flex-col gap-4 break-words">
          <h2 className="text-xl font-extrabold text-brand">Children&apos;s Privacy</h2>
          <p className="leading-8">
            This website is not intended for children under 13. We do not knowingly collect personal information from children.
          </p>
        </div>

        <div className="bg-surface rounded-2xl border border-line p-3 sm:p-5 lg:p-8 flex flex-col gap-4 break-words">
          <h2 className="text-xl font-extrabold text-brand">Contact Us</h2>
          <p className="leading-8">
            If you have any questions about this Privacy Policy, please contact us through our{" "}
            <a href="/contact" className="font-bold text-brand underline underline-offset-4 hover:text-gold transition">
              Contact
            </a>{" "}
            page.
          </p>
        </div>

        <div className="bg-surface rounded-2xl border border-line p-3 sm:p-5 lg:p-8 flex flex-col gap-4 break-words">
          <h2 className="text-xl font-extrabold text-brand">Changes to this Policy</h2>
          <p className="leading-8">
            We may update this Privacy Policy occasionally. Any changes will be posted on this page, and the updated policy will apply from the date of posting.
          </p>
        </div>
      </div>
    </div>
  );
}
