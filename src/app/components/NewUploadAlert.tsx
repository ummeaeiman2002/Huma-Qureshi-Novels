"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const DISMISS_KEY_PREFIX = "new_upload_dismissed_";

interface UploadAlert {
  title: string;
  message: string;
  href: string;
  date: string;
}

export default function NewUploadAlert() {
  const [alert, setAlert] = useState<UploadAlert | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/latest-upload", { cache: "no-store" });
        const data = await res.json();

        if (!data.alert || !data.alert.title) return;

        const dismissKey = DISMISS_KEY_PREFIX + data.alert.title + (data.alert.date || "");
        const dismissed = localStorage.getItem(dismissKey);

        if (!dismissed) {
          setTimeout(() => {
            setAlert(data.alert);
            setVisible(true);
          }, 1500);
        }
      } catch (err) {
        console.error("Failed to fetch new upload alert:", err);
      }
    })();
  }, []);

  if (!visible || !alert) return null;

  const dismiss = () => {
    const dismissKey = DISMISS_KEY_PREFIX + alert.title + (alert.date || "");
    localStorage.setItem(dismissKey, "1");
    setVisible(false);
  };

  return (
    <div className="fixed inset-x-0 top-4 z-[60] flex justify-center px-4 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-lg bg-[#1E5D50] text-white rounded-2xl shadow-2xl border border-[#2F7565] overflow-hidden animate-[slideDown_0.5s_ease]">
        <div className="flex items-start gap-3 p-5">
          <div className="shrink-0 w-10 h-10 rounded-full bg-[#C9A96E] text-white flex items-center justify-center text-xl font-bold animate-pulse">
            !
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[#C9A96E] font-bold text-sm uppercase tracking-wider">
              {alert.message}
            </p>
            <p className="text-white font-extrabold text-lg mt-1 leading-snug line-clamp-2">
              {alert.title}
            </p>
            <div className="mt-3 flex items-center gap-3">
              <Link
                href={alert.href}
                className="bg-[#C9A96E] text-[#1E5D50] font-bold px-4 py-2 rounded-full hover:bg-[#d4b57a] active:scale-95 transition text-sm whitespace-nowrap"
              >
                Read Now
              </Link>
              <button
                onClick={dismiss}
                className="bg-white/10 text-white font-semibold px-4 py-2 rounded-full hover:bg-white/20 active:scale-95 transition text-sm"
              >
                Dismiss
              </button>
            </div>
          </div>
          <button
            onClick={dismiss}
            aria-label="Close alert"
            className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition text-white"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
