import { ImageResponse } from "next/og";
import { getSiteSettings } from "@/lib/sanity/siteSettings";
import { SITE_NAME } from "@/lib/seo";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default async function Icon() {
  const { logo } = await getSiteSettings();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#292824",
        }}
      >
        {logo ? (
          <img src={logo} alt={SITE_NAME} width={420} height={420} style={{ objectFit: "contain" }} />
        ) : (
          <div style={{ display: "flex", color: "#a48750", fontSize: 240, fontWeight: 800 }}>HQ</div>
        )}
      </div>
    ),
    { ...size }
  );
}
