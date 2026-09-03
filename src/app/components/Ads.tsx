"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

type AdFormat = "banner" | "rectangle" | "horizontal" | "auto";

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || "";

const styleMap: Record<AdFormat, React.CSSProperties> = {
  banner: { display: "block", width: "100%", maxWidth: "728px", height: "90px", margin: "0 auto" },
  rectangle: { display: "block", width: "100%", maxWidth: "336px", height: "280px", margin: "0 auto" },
  horizontal: { display: "block", width: "100%", maxWidth: "728px", height: "90px", margin: "0 auto" },
  auto: { display: "block", width: "100%", height: "auto", margin: "0 auto" },
};

export default function Ads({ format = "rectangle" }: { format?: AdFormat }) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current || !ADSENSE_CLIENT) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  if (!ADSENSE_CLIENT) return null;

  return (
    <div className="flex justify-center py-4">
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={styleMap[format]}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot="auto"
        data-ad-format={format === "rectangle" ? "auto" : format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
