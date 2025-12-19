"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import { Settings, Category } from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getCategories } from "@/lib/api";

type HeaderProps = {
  settings: Settings | null;
};

export default function Header({ settings }: HeaderProps) {
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [shopMenuOpen, setShopMenuOpen] = useState(false);
  const [mobileShopMenuOpen, setMobileShopMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  // Charger les catégories
  useEffect(() => {
    async function fetchCategories() {
      const data = await getCategories();
      setCategories(data);
    }
    fetchCategories();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/produits?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

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
              <Image
                src={`${settings.logo.url}`}
                alt={settings.siteName}
                width={settings.logo.width || 32}
                height={settings.logo.height || 32}
                className="h-8 w-auto"
              />
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
            <li
              className="relative group"
              onMouseEnter={() => setShopMenuOpen(true)}
              onMouseLeave={() => setShopMenuOpen(false)}
            >
              <Link
                href="/produits"
                className="text-text-secondary font-sans hover:text-primary transition-colors text-sm font-medium tracking-wide uppercase flex items-center gap-1"
              >
                Boutique
                {categories.length > 0 && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={`w-4 h-4 transition-transform ${shopMenuOpen ? 'rotate-180' : ''}`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                )}
              </Link>

              {/* Menu déroulant - Afficher uniquement s'il y a des catégories */}
              {shopMenuOpen && categories.length > 0 && (
                <div className="absolute top-full left-0 pt-2 z-50">
                  <div className="bg-white border border-accent/20 shadow-lg rounded-md py-2 min-w-[200px]">
                    <Link
                      href="/produits"
                      className="block px-4 py-2 text-sm text-primary font-semibold hover:bg-gray-50 transition-colors border-b border-accent/10"
                    >
                      Voir tout
                    </Link>
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/produits?category=${category.slug}`}
                        className="block px-4 py-2 text-sm text-text-secondary hover:bg-gray-50 hover:text-primary transition-colors"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
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
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-text-secondary hover:text-primary transition-colors"
                aria-label="Rechercher"
              >
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
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </button>
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
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-text-secondary hover:text-primary transition-colors"
              aria-label="Rechercher"
            >
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
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </button>
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

        {/* Search Bar */}
        {searchOpen && (
          <div className="mt-6 pb-4 border-t border-accent/20 pt-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un produit..."
                className="w-full px-4 py-3 pr-12 border border-accent/20 rounded-md focus:outline-none focus:ring-2 focus:ring-accent/50 bg-white text-text"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary transition-colors"
                aria-label="Lancer la recherche"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </button>
            </form>
          </div>
        )}

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
                <div>
                  <button
                    onClick={() => setMobileShopMenuOpen(!mobileShopMenuOpen)}
                    className="w-full flex items-center justify-between text-text-secondary hover:text-primary transition-colors text-sm font-medium tracking-wide uppercase"
                  >
                    <span>Boutique</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className={`w-4 h-4 transition-transform ${mobileShopMenuOpen ? 'rotate-180' : ''}`}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>

                  {mobileShopMenuOpen && (
                    <div className="mt-2 ml-4 space-y-2">
                      <Link
                        href="/produits"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setMobileShopMenuOpen(false);
                        }}
                        className="block text-text-secondary hover:text-primary transition-colors text-sm py-1"
                      >
                        Voir tout
                      </Link>
                      {categories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/produits?category=${category.slug}`}
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setMobileShopMenuOpen(false);
                          }}
                          className="block text-text-secondary hover:text-primary transition-colors text-sm py-1"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
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
