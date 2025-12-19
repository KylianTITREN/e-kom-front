"use client";

import { useRef, useState, useEffect, ReactNode } from "react";

interface HorizontalScrollProps {
  children: ReactNode;
  itemWidth?: string;
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

export default function HorizontalScroll({ children, itemWidth = "85vw" }: HorizontalScrollProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      return () => container.removeEventListener("scroll", checkScroll);
    }
  }, []);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Calculer la largeur d'un item + gap
    const itemWidthValue = parseFloat(itemWidth);
    const isVw = itemWidth.includes('vw');
    const actualItemWidth = isVw 
      ? (window.innerWidth * itemWidthValue) / 100 
      : itemWidthValue;
    
    // Gap de 16px (gap-4 = 1rem = 16px)
    const gap = 16;
    const scrollAmount = actualItemWidth + gap;

    const targetScroll =
      direction === "left"
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      {/* Flèche gauche */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-background-light/95 hover:bg-background-light border border-accent/20 p-3 shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Défiler vers la gauche"
        >
          <ChevronLeft />
        </button>
      )}

      {/* Flèche droite */}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-background-light/95 hover:bg-background-light border border-accent/20 p-3 shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Défiler vers la droite"
        >
          <ChevronRight />
        </button>
      )}

      {/* Container de scroll */}
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto -mx-4 px-4 scrollbar-hide"
      >
        <div className="flex gap-4 pb-4">
          {Array.isArray(children) ? (
            children.map((child, index) => (
              <div
                key={index}
                className="flex-shrink-0"
                style={{ width: itemWidth }}
              >
                {child}
              </div>
            ))
          ) : (
            <div className="flex-shrink-0" style={{ width: itemWidth }}>
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
