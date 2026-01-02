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
import { SpeedInsights } from "@vercel/speed-insights/next";

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: process.env.SEO_HOME_TITLE || 'E-Kom',
    template: `%s | ${process.env.SEO_SITE_NAME || 'E-Kom'}`
  },
  description: process.env.SEO_HOME_DESCRIPTION,
  keywords: process.env.SEO_HOME_KEYWORDS,
  icons: {
    icon: process.env.SEO_HOME_ICON,
    apple: process.env.SEO_HOME_ICON,
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: process.env.SEO_SITE_NAME || 'E-Kom',
    title: process.env.SEO_HOME_TITLE,
    description: process.env.SEO_HOME_DESCRIPTION,
    images: [
      {
        url: process.env.SEO_HOME_ICON || '',
        width: 1200,
        height: 630,
        alt: `${process.env.SEO_SITE_NAME || 'E-Kom'} - Logo`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: process.env.SEO_HOME_TITLE,
    description: process.env.SEO_HOME_DESCRIPTION,
    images: [process.env.SEO_HOME_ICON || ''],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();
  const { isEnabled } = await draftMode();

  // Données structurées JSON-LD pour Google
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: process.env.SEO_SITE_NAME || 'E-Kom',
    alternateName: process.env.SEO_SITE_NAME || 'E-Kom',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: process.env.SEO_HOME_ICON,
      width: '512',
      height: '512'
    },
    description: process.env.SEO_HOME_DESCRIPTION,
    sameAs: []
  };

  // WebSite schema pour le nom du site dans Google
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: process.env.SEO_SITE_NAME || 'E-Kom',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    publisher: {
      '@type': 'Organization',
      name: process.env.SEO_SITE_NAME || 'E-Kom',
      logo: {
        '@type': 'ImageObject',
        url: process.env.SEO_HOME_ICON
      }
    }
  };

  return (
    <html lang="fr" className={`${cormorant.variable} ${montserrat.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="font-sans flex flex-col min-h-screen bg-white text-text">
        {isEnabled && <PreviewBanner />}
        <FreeShippingBanner />
        <CartProvider>
          <Header settings={settings} />
          <main className={`flex-grow container mx-auto px-4 py-8 ${isEnabled ? 'mt-10' : ''}`}>
            {children}
          </main>
          <Footer settings={settings} />
        </CartProvider>
        <Analytics/>
        <SpeedInsights />
      </body>
    </html>
  );
}
