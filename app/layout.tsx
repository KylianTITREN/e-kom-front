import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PreviewBanner from "@/components/PreviewBanner";
import FreeShippingBanner from "@/components/FreeShippingBanner";
import { getSettings } from "@/lib/api";
import { CartProvider } from "@/context/CartContext";
import { Analytics } from "@vercel/analytics/next";
import { draftMode } from "next/headers";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-cormorant",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: process.env.SEO_HOME_TITLE,
  description: process.env.SEO_HOME_DESCRIPTION,
  icons: process.env.SEO_HOME_ICON,
  keywords: process.env.SEO_HOME_KEYWORDS,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();
  const { isEnabled } = await draftMode();

  return (
    <html lang="fr" className={`${cormorant.variable} ${montserrat.variable}`}>
      <body className="font-sans flex flex-col min-h-screen bg-white text-text">
        {isEnabled && <PreviewBanner />}
        <FreeShippingBanner settings={settings} />
        <CartProvider>
          <Header settings={settings} />
          <main className={`flex-grow container mx-auto px-4 py-8 ${isEnabled ? 'mt-10' : ''}`}>
            {children}
          </main>
          <Footer settings={settings} />
        </CartProvider>
        <Analytics/>
      </body>
    </html>
  );
}
