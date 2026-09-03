import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Nastaliq_Urdu, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Footer from "./components/headerComponents/Footer";
import MobileHeader from "./components/headerComponents/MobileHeader";
import DesktopHeader from "./components/headerComponents/DesktopHeader";
import Up from "./components/headerComponents/Up";
import Script from "next/script";
import AuthProvider from "./components/AuthProvider";
import CookieConsent from "./components/CookieConsent";
import { PremiumThemeProvider } from "./components/PremiumThemeProvider";
import { UserIdProvider } from "./context/UserIdContext";
import NewUploadAlert from "./components/NewUploadAlert";
import { SITE_URL, SITE_NAME } from "@/lib/seo";

const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || "";

const inter = Inter({ subsets: ["latin"], variable: "--font-english" });
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const nastaliq = Noto_Nastaliq_Urdu({ subsets: ["arabic"], weight: ["400", "700"], variable: "--font-urdu" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-heading" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Read Urdu Novels Online Free | Huma Qureshi Novels", template: `%s | ${SITE_NAME}` },
  description: "Read Urdu novels online free — original Urdu novels, episodic stories and complete PDF books by Huma Qureshi. Download and read offline.",
  applicationName: SITE_NAME,
  alternates: { canonical: SITE_URL },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  openGraph: { type: "website", siteName: SITE_NAME, url: SITE_URL, title: "Read Urdu Novels Online Free | Huma Qureshi Novels", description: "Original Urdu novels, episodic stories and complete PDF books by Huma Qureshi." },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className="overflow-x-hidden"><body className={`bg-primary my-3 overflow-x-hidden ${nastaliq.variable} ${playfair.variable} ${geistMono.variable} ${geistSans.variable} ${inter.variable}`}>
    <AuthProvider><PremiumThemeProvider><UserIdProvider><MobileHeader /><DesktopHeader /><div className="px-5 lg:px-20 overflow-x-hidden">{children}</div><Footer /></UserIdProvider>
      <Up />
      <CookieConsent />
      <NewUploadAlert />
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-X7F51SY5RZ" strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-X7F51SY5RZ');`}</Script>
      {ADSENSE_ID && <Script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`} strategy="afterInteractive" crossOrigin="anonymous" />}
    </PremiumThemeProvider></AuthProvider>
  </body></html>;
}
