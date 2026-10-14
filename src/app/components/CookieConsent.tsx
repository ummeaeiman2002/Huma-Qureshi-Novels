"use client";

import { useEffect, useState } from "react";

const CONSENT_KEY = "cookie_consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-4 pb-4">
      <div className="w-full max-w-3xl bg-brand text-white rounded-2xl shadow-2xl border border-brand-soft p-5 flex flex-col sm:flex-row items-center gap-4">
        <p className="text-sm leading-6 flex-1">
          We use cookies to improve your experience. By continuing to use this site, you agree to our use of cookies. Read our{" "}
          <a href="/privacypolicy" className="font-bold underline underline-offset-2 hover:text-gold transition">
            Privacy Policy
          </a>.
        </p>
        <button
          onClick={accept}
          className="bg-gold text-brand font-bold px-6 py-2.5 rounded-full hover:bg-gold/80 active:scale-95 transition text-sm whitespace-nowrap"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
