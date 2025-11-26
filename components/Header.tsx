"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
            e-kom
          </Link>

          {/* Navigation Links */}
          <ul className="flex items-center space-x-6">
            <li>
              <Link
                href="/"
                className="text-gray-700 hover:text-primary transition-colors font-medium"
              >
                Accueil
              </Link>
            </li>
            <li>
              <Link
                href="/produits"
                className="text-gray-700 hover:text-primary transition-colors font-medium"
              >
                Boutique
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-primary transition-colors font-medium"
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                href="/panier"
                className="relative text-gray-700 hover:text-primary transition-colors font-medium"
              >
                Panier
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
