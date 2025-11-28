import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSettings } from "@/lib/api";
import { CartProvider } from "@/context/CartContext";

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
  title: "e-kom - Boutique en ligne",
  description: "Votre boutique e-commerce en marque blanche",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();
  return (
    <html lang="fr" className={`${cormorant.variable} ${montserrat.variable}`}> 
      <body className="font-sans flex flex-col min-h-screen bg-white text-text">
        <CartProvider>
          <Header settings={settings} />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <Footer settings={settings} />
        </CartProvider>
      </body>
    </html>
  );
}
