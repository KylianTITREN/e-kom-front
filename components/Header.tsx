"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { Settings } from "@/types";
import Image from "next/image";

type HeaderProps = {
  settings: Settings | null;
};

export default function Header({ settings }: HeaderProps) {
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background-light border-b border-accent/20">
      <nav className="container mx-auto px-4 py-5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="text-2xl font-title font-semibold text-primary tracking-wide hover:text-accent transition-colors flex items-center gap-2"
          >
            {settings?.logo?.url && (
              <Image src={settings.logo.url} alt={settings.siteName} className="h-8 w-auto" />
            )}
            {settings?.siteName || "e-kom"}
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center space-x-8">
            <li>
              <Link
                href="/"
                className="text-text-secondary font-sans hover:text-primary transition-colors text-sm font-medium tracking-wide uppercase"
              >
                Accueil
              </Link>
            </li>
            <li>
              <Link
                href="/produits"
                className="text-text-secondary font-sans hover:text-primary transition-colors text-sm font-medium tracking-wide uppercase"
              >
                Boutique
              </Link>
            </li>
            <li>
              <Link
                href="/actualites"
                className="text-text-secondary font-sans hover:text-primary transition-colors text-sm font-medium tracking-wide uppercase"
              >
                Actualités
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-text-secondary hover:text-primary transition-colors text-sm font-medium tracking-wide uppercase"
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                href="/panier"
                className="relative flex items-center gap-2 text-text-secondary hover:text-primary transition-colors"
              >
                {/* Icône panier élégante */}
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth={1.5} 
                  stroke="currentColor" 
                  className="w-6 h-6"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" 
                  />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            </li>
          </ul>

          {/* Mobile Menu Button & Cart */}
          <div className="flex md:hidden items-center gap-4">
            <Link href="/panier" className="relative">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor" 
                className="w-6 h-6 text-text-secondary"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" 
                />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Burger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-text-secondary hover:text-primary transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-6 pb-4 border-t border-accent/20 pt-4">
            <ul className="flex flex-col space-y-4">
              <li>
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-text-secondary hover:text-primary transition-colors text-sm font-medium tracking-wide uppercase"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  href="/produits"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-text-secondary hover:text-primary transition-colors text-sm font-medium tracking-wide uppercase"
                >
                  Boutique
                </Link>
              </li>
              <li>
                <Link
                  href="/actualites"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-text-secondary font-sans hover:text-primary transition-colors text-sm font-medium tracking-wide uppercase"
                >
                  Actualités
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-text-secondary hover:text-primary transition-colors text-sm font-medium tracking-wide uppercase"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
