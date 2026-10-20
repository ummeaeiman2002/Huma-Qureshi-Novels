"use client";

import { useEffect, useState } from "react";

const CONSENT_KEY = "cookie_consent";

type Consent = {
  necessary: true;
  analytics: boolean;
  advertising: boolean;
  ts: number;
};

function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    if (raw === "accepted" || raw === "granted")
      return { necessary: true, analytics: true, advertising: true, ts: Date.now() };
    if (raw === "rejected" || raw === "denied")
      return { necessary: true, analytics: false, advertising: false, ts: Date.now() };
    const parsed = JSON.parse(raw);
    if (typeof parsed?.analytics === "boolean" && typeof parsed?.advertising === "boolean") {
      return {
        necessary: true,
        analytics: parsed.analytics,
        advertising: parsed.advertising,
        ts: Number(parsed.ts) || Date.now(),
      };
    }
  } catch {
    /* corrupted value -> treat as no choice */
  }
  return null;
}

function applyConsent(consent: Consent) {
  localStorage.setItem(
    CONSENT_KEY,
    JSON.stringify({
      necessary: true,
      analytics: consent.analytics,
      advertising: consent.advertising,
      ts: consent.ts,
    })
  );

  const w = window as unknown as {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  };

  const payload = {
    ad_storage: consent.advertising ? "granted" : "denied",
    ad_user_data: consent.advertising ? "granted" : "denied",
    ad_personalization: consent.advertising ? "granted" : "denied",
    analytics_storage: consent.analytics ? "granted" : "denied",
  };

  if (typeof w.gtag === "function") {
    w.gtag("consent", "update", payload);
  } else {
    w.dataLayer = w.dataLayer || [];
    const queue = w.dataLayer;
    const gtag = function (_cmd?: unknown, ..._rest: unknown[]) {
      queue.push(arguments as unknown as unknown[]);
    };
    w.gtag = gtag;
    gtag("consent", "update", payload);
  }
}

function Switch({
  checked,
  onChange,
  disabled = false,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full border transition-colors duration-200 ${
        checked ? "border-gold bg-gold/80" : "border-cream/25 bg-white/10"
      } ${disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
    >
      <span
        aria-hidden="true"
        className={`absolute top-0.5 h-4.5 w-4.5 rounded-full bg-brand-deep transition-transform duration-200 ${
          checked ? "translate-x-5.5 bg-brand-deep" : "translate-x-0.5 bg-cream"
        }`}
        style={{ height: "18px", width: "18px" }}
      />
    </button>
  );
}

function Row({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-t border-cream/10 pt-3">
      <div className="flex min-w-0 flex-col gap-0.5">
        <p className="text-sm font-bold text-cream">{title}</p>
        <p className="text-xs leading-5 text-cream/60">{description}</p>
      </div>
      {children}
    </div>
  );
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [advertising, setAdvertising] = useState(true);

  useEffect(() => {
    const stored = readConsent();
    if (stored) {
      applyConsent(stored);
    } else {
      setVisible(true);
    }

    const reopen = () => {
      const current = readConsent();
      setAnalytics(current ? current.analytics : true);
      setAdvertising(current ? current.advertising : true);
      setCustomizing(Boolean(current));
      setVisible(true);
    };
    window.addEventListener("hq:consent-open", reopen);
    return () => window.removeEventListener("hq:consent-open", reopen);
  }, []);

  if (!visible) return null;

  function save(next: { analytics: boolean; advertising: boolean }) {
    applyConsent({ necessary: true, ...next, ts: Date.now() });
    setVisible(false);
    setCustomizing(false);
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-4 pb-4">
      <div className="w-full max-w-3xl rounded-2xl border border-gold/30 bg-brand-deep/95 p-5 text-cream shadow-2xl backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-3">
          <span className="ui-eyebrow text-gold">Cookie Preferences</span>
          <span aria-hidden="true" className="h-1 w-8 rounded-full bg-gradient-to-r from-gold to-transparent" />
        </div>

        <p className="mt-3 text-sm leading-6 text-cream/75">
          We use cookies for site essentials (remembering this choice), Google Analytics to see how
          the library is used, and Google AdSense to show ads. You choose what to allow. Details are
          in our{" "}
          <a
            href="/privacypolicy"
            className="font-bold text-gold underline underline-offset-4 hover:text-cream"
          >
            Privacy Policy
          </a>
          .
        </p>

        {customizing ? (
          <div className="mt-4 flex flex-col gap-3">
            <Row
              title="Strictly necessary"
              description="Required for the website to function. Always on."
            >
              <Switch checked disabled onChange={() => {}} label="Strictly necessary cookies" />
            </Row>
            <Row
              title="Analytics"
              description="Google Analytics — anonymous statistics about which novels are read."
            >
              <Switch checked={analytics} onChange={setAnalytics} label="Analytics cookies" />
            </Row>
            <Row
              title="Advertising"
              description="Google AdSense — personalised ads based on your visit."
            >
              <Switch checked={advertising} onChange={setAdvertising} label="Advertising cookies" />
            </Row>

            <div className="mt-1 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => save({ analytics, advertising })}
                className="rounded-full bg-gold px-6 py-2.5 text-sm font-bold text-brand-deep transition hover:bg-gold/85 active:scale-95"
              >
                Save preferences
              </button>
              <button
                type="button"
                onClick={() => save({ analytics: true, advertising: true })}
                className="rounded-full border border-cream/25 px-6 py-2.5 text-sm font-bold text-cream transition hover:border-gold hover:text-gold active:scale-95"
              >
                Accept all
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => save({ analytics: true, advertising: true })}
              className="rounded-full bg-gold px-6 py-2.5 text-sm font-bold text-brand-deep transition hover:bg-gold/85 active:scale-95"
            >
              Accept all
            </button>
            <button
              type="button"
              onClick={() => save({ analytics: false, advertising: false })}
              className="rounded-full border border-cream/25 px-6 py-2.5 text-sm font-bold text-cream transition hover:border-gold hover:text-gold active:scale-95"
            >
              Reject non-essential
            </button>
            <button
              type="button"
              onClick={() => setCustomizing(true)}
              className="rounded-full px-4 py-2.5 text-sm font-bold text-cream/70 underline underline-offset-4 transition hover:text-gold"
            >
              Customize
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
