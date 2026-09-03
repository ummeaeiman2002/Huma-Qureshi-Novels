import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Huma Qureshi Novels. Learn how we collect, use, and protect your information. Covers Google AdSense, cookies, analytics, and data breach liability.",
  alternates: { canonical: "https://humaqureshinovels.com/privacypolicy" },
};

export default function page() {
  return (
    <div className="flex flex-col gap-6 py-5 overflow-hidden">
      {/* Hero Banner */}
      <section className="relative mx-4 lg:mx-0 rounded-3xl overflow-hidden bg-[#1E5D50] shadow-2xl">
        <div aria-hidden="true" className="absolute inset-0 -z-0">
          <div className="absolute top-0 right-0 w-[400px] h-[300px] rounded-full bg-[#2F7565]/40 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[300px] h-[200px] rounded-full bg-[#C9A96E]/15 blur-3xl"></div>
        </div>
        <div className="relative text-center px-6 py-12 lg:py-16 flex flex-col items-center gap-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-white/60">Last updated: 16 August 2026</p>
        </div>
      </section>

      {/* Content */}
        <div className="flex flex-col gap-5 max-w-4xl mx-auto px-3 sm:px-4">
        <div className="bg-[#FFFDF9] rounded-2xl border-2 border-[#DCCFC2] p-3 sm:p-5 lg:p-8 flex flex-col gap-4 break-words">
          <p className="leading-8 text-sm sm:text-base">
            At Huma Qureshi Novels, your privacy is extremely important to us. This Privacy Policy explains how we collect, use, and protect your information when you visit our website.
          </p>
        </div>

        <div className="bg-[#FFFDF9] rounded-2xl border-2 border-[#DCCFC2] p-3 sm:p-5 lg:p-8 flex flex-col gap-4 break-words">
          <h2 className="text-xl font-extrabold text-[#1E5D50]">Information We Collect</h2>
          <p className="leading-8">
            We may collect the following information when you use our website: Name and Email Address (if submitted via contact form or newsletter). Basic technical data such as IP address, browser type, and device information (collected automatically through cookies and analytics).
          </p>
        </div>

        <div className="bg-[#FFFDF9] rounded-2xl border-2 border-[#DCCFC2] p-3 sm:p-5 lg:p-8 flex flex-col gap-4 break-words">
          <h2 className="text-xl font-extrabold text-[#1E5D50]">How We Use Your Information</h2>
          <p className="leading-8">
            We use your information to: respond to your messages or inquiries, send updates if you opt-in to newsletters, improve user experience and website performance. We do not sell, rent, or trade your information to third parties.
          </p>
        </div>

        <div className="bg-[#FFFDF9] rounded-2xl border-2 border-[#DCCFC2] p-3 sm:p-5 lg:p-8 flex flex-col gap-4 break-words">
          <h2 className="text-xl font-extrabold text-[#1E5D50]">Cookies and Web Beacons</h2>
          <p className="leading-8">
            Like most websites, we use cookies to improve your experience and gather anonymous usage data. Cookies are small files stored on your device that help us remember your preferences and understand how visitors use our site. You can disable cookies through your browser settings, but some features may not work properly without them.
          </p>
        </div>

        <div className="bg-[#FFFDF9] rounded-2xl border-2 border-[#DCCFC2] p-3 sm:p-5 lg:p-8 flex flex-col gap-4 break-words">
          <h2 className="text-xl font-extrabold text-[#1E5D50]">Google AdSense and Third-Party Advertising</h2>
          <p className="leading-8">
            We use third-party advertising companies, including Google AdSense, to serve ads when you visit our website. These companies may use information (not including your name, address, email address, or telephone number) about your visits to this and other websites in order to provide advertisements about goods and services of interest to you. This information is collected through cookies and other similar technologies placed by third-party ad servers or ad networks.
          </p>
          <p className="leading-8">
            Third-party vendors, including Google, use first-party cookies (such as the Google Analytics cookie) and third-party cookies (such as the Google DoubleClick cookie) to inform, optimize, and serve ads based on your past visits to this website and other websites across the internet. This allows them to deliver more relevant advertisements.
          </p>
          <p className="leading-8">
            Google, as a third-party vendor, uses cookies (such as the DART cookie on the Google network) to serve ads to our visitors based on their visits to this and other websites. You may opt out of the use of the DART cookie by visiting the Google ad and content network privacy policy at{" "}
            <a href="https://policies.google.com/technologies/ads" className="font-bold text-[#1E5D50] underline underline-offset-4 hover:text-[#C9A96E] transition" target="_blank" rel="noopener noreferrer">
              policies.google.com/technologies/ads
            </a>.
          </p>
          <p className="leading-8">
            You can opt out of personalized advertising from Google by visiting the{" "}
            <a href="https://www.google.com/settings/ads" className="font-bold text-[#1E5D50] underline underline-offset-4 hover:text-[#C9A96E] transition" target="_blank" rel="noopener noreferrer">
              Google Ads Settings
            </a>. You can also opt out of some third-party vendors&apos; use of cookies for personalized advertising by visiting{" "}
            <a href="https://www.aboutads.info/choices" className="font-bold text-[#1E5D50] underline underline-offset-4 hover:text-[#C9A96E] transition" target="_blank" rel="noopener noreferrer">
              aboutads.info/choices
            </a>{" "}
            or{" "}
            <a href="https://www.networkadvertising.org/choices/" className="font-bold text-[#1E5D50] underline underline-offset-4 hover:text-[#C9A96E] transition" target="_blank" rel="noopener noreferrer">
              networkadvertising.org/choices
            </a>.
          </p>
          <p className="leading-8">
            Please note that disabling or opting out of cookies through your browser settings will not stop ads from being shown, but it will mean the ads you see will not be personalised to you. By using this website you acknowledge and agree to the collection of data by Google and other third-party advertising partners as described above.
          </p>
        </div>

        <div className="bg-[#FFFDF9] rounded-2xl border-2 border-[#DCCFC2] p-3 sm:p-5 lg:p-8 flex flex-col gap-4 break-words">
          <h2 className="text-xl font-extrabold text-[#1E5D50]">Google Analytics</h2>
          <p className="leading-8">
            We use Google Analytics to understand how visitors use our website. Google Analytics collects information such as how often users visit, what pages they visit, and which other sites were used prior to coming to our site. We use this information to improve our content and user experience. Google Analytics may set its own cookies on your device. To learn more about how Google uses data, please visit{" "}
            <a href="https://policies.google.com/privacy" className="font-bold text-[#1E5D50] underline underline-offset-4 hover:text-[#C9A96E] transition" target="_blank" rel="noopener noreferrer">
              policies.google.com/privacy
            </a>.
          </p>
        </div>

        <div className="bg-[#FFFDF9] rounded-2xl border-2 border-[#DCCFC2] p-3 sm:p-5 lg:p-8 flex flex-col gap-4 break-words">
          <h2 className="text-xl font-extrabold text-[#1E5D50]">Data Security</h2>
          <p className="leading-8">
            We take reasonable measures to protect your personal information and ensure it is not lost, misused, or accessed without permission. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </p>
        </div>

        <div className="bg-[#FFFDF9] rounded-2xl border-2 border-[#DCCFC2] p-3 sm:p-5 lg:p-8 flex flex-col gap-4 break-words">
          <h2 className="text-xl font-extrabold text-[#1E5D50]">Data Breach &amp; Limitation of Liability</h2>
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

        <div className="bg-[#FFFDF9] rounded-2xl border-2 border-[#DCCFC2] p-3 sm:p-5 lg:p-8 flex flex-col gap-4 break-words">
          <h2 className="text-xl font-extrabold text-[#1E5D50]">Third-Party Links</h2>
          <p className="leading-8">
            Our website may include links to third-party websites (e.g., Facebook, Instagram, YouTube). We are not responsible for their privacy practices. Please review their privacy policies individually.
          </p>
        </div>

        <div className="bg-[#FFFDF9] rounded-2xl border-2 border-[#DCCFC2] p-3 sm:p-5 lg:p-8 flex flex-col gap-4 break-words">
          <h2 className="text-xl font-extrabold text-[#1E5D50]">Children&apos;s Privacy</h2>
          <p className="leading-8">
            This website is not intended for children under 13. We do not knowingly collect personal information from children.
          </p>
        </div>

        <div className="bg-[#FFFDF9] rounded-2xl border-2 border-[#DCCFC2] p-3 sm:p-5 lg:p-8 flex flex-col gap-4 break-words">
          <h2 className="text-xl font-extrabold text-[#1E5D50]">Contact Us</h2>
          <p className="leading-8">
            If you have any questions about this Privacy Policy, please contact us through our{" "}
            <a href="/contact" className="font-bold text-[#1E5D50] underline underline-offset-4 hover:text-[#C9A96E] transition">
              Contact
            </a>{" "}
            page.
          </p>
        </div>

        <div className="bg-[#FFFDF9] rounded-2xl border-2 border-[#DCCFC2] p-3 sm:p-5 lg:p-8 flex flex-col gap-4 break-words">
          <h2 className="text-xl font-extrabold text-[#1E5D50]">Changes to this Policy</h2>
          <p className="leading-8">
            We may update this Privacy Policy occasionally. Any changes will be posted on this page, and the updated policy will apply from the date of posting.
          </p>
        </div>
      </div>
    </div>
  );
}
