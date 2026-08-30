import type { Metadata, Viewport } from "next";
import { ppEditorialNew, suisseIntl } from "./fonts";
import { CartProvider } from "@/components/cart/CartProvider";
import CartDrawer from "@/components/cart/CartDrawer";
import "./globals.css";

export const metadata: Metadata = {
  title: "ARTISUN — A New Language of Suncare",
  description: "ARTISUN — premium suncare redefined. A new language of sun protection crafted for those who move through the world with intention.",
  // The App Router already picks up app/icon.svg, app/favicon.ico and
  // app/apple-icon.png by filename convention. They are declared explicitly as
  // well so the order is deterministic: SVG first for crisp scaling on modern
  // browsers, .ico as the fallback for older ones that ignore SVG favicons.
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "48x48" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#C93B1A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ppEditorialNew.variable} ${suisseIntl.variable}`}>
      <body suppressHydrationWarning>
        {/* CartProvider wraps everything so both HomeHeader and GlobalHeader can
            read the cart. CartDrawer is a sibling of the page so it overlays
            every route without each page having to mount it. */}
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
