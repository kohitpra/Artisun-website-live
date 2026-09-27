import type { Metadata, Viewport } from "next";
import { ppEditorialNew, suisseIntl } from "./fonts";
import { CartProvider } from "@/components/cart/CartProvider";
import CartDrawer from "@/components/cart/CartDrawer";
import RouteAnalytics from "@/components/analytics/RouteAnalytics";
import SignupPopup from "@/components/SignupPopup";
import { CLARITY_ID, GA4_MEASUREMENT_ID, GTM_ID, META_PIXEL_ID } from "@/lib/tracking-config";
import JsonLd from "@/components/seo/JsonLd";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://artisunskin.com"),
  title: "Artisun — Climate-Smart Sunscreen for Indian Cities & Weather",
  description: "Sun care built for your weather, not just your skin type. Lightweight, broad-spectrum SPF that's skincare and protection in one. Meet Origin & Aura.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "48x48" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Artisun — Climate-Smart Sunscreen for Indian Cities & Weather",
    description: "Sun care built for your weather, not just your skin type. Lightweight, broad-spectrum SPF that's skincare and protection in one. Meet Origin & Aura.",
    url: "https://artisunskin.com",
    siteName: "Artisun",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://artisunskin.com/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "Artisun Aura pearl sunscreen SPF 40 PA++++",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://artisunskin.com/og-home.jpg"],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
    other: {
      'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || '',
      /* ── NEW: Facebook domain verification ── */
      'facebook-domain-verification': '9hsr7ci8mhibzgzub0yxajw0jnjf9n',
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#C93B1A",
  width: "device-width",
  initialScale: 1,
  // No maximumScale / userScalable: pinch-zoom must stay available (WCAG 1.4.4).
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Artisun",
  url: "https://artisunskin.com",
  logo: "https://artisunskin.com/logo.png",
  sameAs: [
    // Official brand profiles only. WhatsApp is a contact channel (see
    // contactPoint), not a profile. Add Facebook/YouTube/LinkedIn here as
    // they go live.
    "https://www.instagram.com/artisunskinwear",
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+91-7982605517",
      contactType: "customer service",
      availableLanguage: ["English", "Hindi"],
    },
  ],
};

/* ─────────────────────────────────────────────────────────────────────────────
 * Tracking snippets, hardcoded into <head> exactly as supplied by the client.
 * They are plain inline scripts (not next/script) so they are in the initial
 * HTML of every page, run before any page code, and cannot be skipped by a
 * missing environment variable. IDs live in lib/tracking-config.ts.
 * No consent gating: the consent banner was removed at the client's request.
 * ──────────────────────────────────────────────────────────────────────────── */
const GTM_SNIPPET = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`;

const GA4_SNIPPET = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA4_MEASUREMENT_ID}');`;

const META_PIXEL_SNIPPET = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${META_PIXEL_ID}');
fbq('track','PageView');`;

const CLARITY_SNIPPET = `(function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${CLARITY_ID}");`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ppEditorialNew.variable} ${suisseIntl.variable}`}>
      <head>
        {/* Google Tag Manager — as high in <head> as possible */}
        <script id="gtm" dangerouslySetInnerHTML={{ __html: GTM_SNIPPET }} />
        {/* Google tag (gtag.js) — GA4 */}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`} />
        <script id="ga4" dangerouslySetInnerHTML={{ __html: GA4_SNIPPET }} />
        {/* Meta Pixel — Artisun Skinwear */}
        <script id="meta-pixel" dangerouslySetInnerHTML={{ __html: META_PIXEL_SNIPPET }} />
        {/* Microsoft Clarity */}
        <script id="clarity" dangerouslySetInnerHTML={{ __html: CLARITY_SNIPPET }} />
      </head>
      <body suppressHydrationWarning>
        {/* Google Tag Manager (noscript) — immediately after opening <body> */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        {/* Meta Pixel (noscript) */}
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            alt=""
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          />
        </noscript>

        <JsonLd schema={organizationSchema} />
        <RouteAnalytics />
        <CartProvider>
          {children}
          <CartDrawer />
          <SignupPopup />
        </CartProvider>
      </body>
    </html>
  );
}