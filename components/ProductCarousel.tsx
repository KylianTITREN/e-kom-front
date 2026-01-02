"use client";

import { useRef, useState, useEffect } from "react";
import { Product } from "@/types";
import ProductCard from "./ProductCard";

interface ProductCarouselProps {
  products: Product[];
  itemsPerPage?: number;
}

const ChevronLeft = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const ChevronRight = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

export default function ProductCarousel({ products, itemsPerPage = 3 }: ProductCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 10);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );

    // Calculer la page actuelle basée sur la position du scroll
    const scrollPercentage = container.scrollLeft / (container.scrollWidth - container.clientWidth);
    const calculatedPage = Math.round(scrollPercentage * (totalPages - 1));
    setCurrentPage(calculatedPage);
  };

  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      return () => container.removeEventListener("scroll", checkScroll);
    }
  }, [totalPages]);

  const scrollToPage = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const containerWidth = container.clientWidth;
    const scrollAmount = containerWidth;

    const targetScroll =
      direction === "left"
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });
  };

  // Créer les pages de 3 produits
  const pages = [];
  for (let i = 0; i < products.length; i += itemsPerPage) {
    pages.push(products.slice(i, i + itemsPerPage));
  }

  return (
    <div className="relative">
      {/* Indicateur de page en haut à droite */}
      <div className="absolute -top-12 right-0 text-sm text-text-secondary font-medium">
        {currentPage + 1}/{totalPages}
      </div>

      <div className="relative">
        {/* Flèche gauche */}
        {canScrollLeft && (
          <button
            onClick={() => scrollToPage("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-background-light/95 hover:bg-background-light border border-accent/20 p-3 shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Page précédente"
          >
            <ChevronLeft />
          </button>
        )}

        {/* Flèche droite */}
        {canScrollRight && (
          <button
            onClick={() => scrollToPage("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-background-light/95 hover:bg-background-light border border-accent/20 p-3 shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Page suivante"
          >
            <ChevronRight />
          </button>
        )}

        {/* Container de scroll horizontal */}
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide snap-x snap-mandatory"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          <div className="flex gap-6">
            {pages.map((page, pageIndex) => (
              <div
                key={pageIndex}
                className="grid grid-cols-3 gap-6 flex-shrink-0 snap-start"
                style={{ width: '100%' }}
              >
                {page.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
