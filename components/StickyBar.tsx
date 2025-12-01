"use client";
import { useCart } from "@/context/CartContext";
import Button from "@/components/Button";
import { Product } from "@/types";
import { useState } from "react";

interface StickyBarProps {
  product: Product;
}

export default function StickyBar({ product }: StickyBarProps) {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const { name, price, images, ageRestricted } = product;

  // Image pour le panier (première image)
  const firstImage = images && images.length > 0 ? images[0] : null;
  const cartImageUrl = firstImage
    ? `${firstImage.formats?.small?.url || firstImage.url}`
    : "/placeholder.jpg";

  const handleAddToCart = () => {
    addItem({
      id: product.id.toString(),
      name: name,
      price,
      image: cartImageUrl,
      ageRestricted,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
  <div className="fixed md:sticky bottom-0 md:top-[73px] left-0 right-0 z-30 w-full bg-white border-t border-copper border-t-[2px] md:border-t-0 border-b border-beige shadow-sm flex flex-col md:flex-row items-center justify-between px-0 py-2 md:p-4 gap-2 md:gap-0 md:mt-[-32px]">
      <span className="hidden md:inline text-xl md:text-3xl font-bold text-copper font-title tracking-tight w-full md:w-auto text-center md:text-left">{price.toFixed(2)} €</span>
      <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 w-full md:w-auto">
        {isAdded && (
          <span className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded-lg text-sm">✓ Ajouté</span>
        )}
        <div className="w-full md:w-auto px-3 md:px-0">
          <Button
            onClick={handleAddToCart}
            variant="primary"
            className="w-full md:w-auto min-w-[160px] px-6 py-4 md:px-8 md:py-3"
          >
            Ajouter au panier
          </Button>
        </div>
      </div>
    </div>
  );
}
