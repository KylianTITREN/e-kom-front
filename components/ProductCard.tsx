"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import Button from "./Button";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { name, slug, documentId, price, images, ageRestricted, brand, category } = product;

  // Utiliser la première image ou un placeholder
  const firstImage = images && images.length > 0 ? images[0] : null;
  const imageUrl = firstImage
    ? `${firstImage.formats?.medium?.url || firstImage.url}`
    : "/placeholder.jpg";

  // Utiliser le slug s'il existe, sinon le documentId
  const productUrl = slug || documentId;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id.toString(),
      name: name,
      price,
      image: imageUrl,
      ageRestricted,
    });
  };

  return (
    <div className="group bg-background-card border border-accent/10 overflow-hidden hover:border-accent/30 transition-all duration-300">
      <Link href={`/produit/${productUrl}`}>
        <div className="relative h-80 w-full bg-background overflow-hidden">
          {firstImage ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-beige/60">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="8" y="16" width="48" height="32" rx="6" fill="#C7B299" stroke="#8B6F4E" strokeWidth="2"/>
                <path d="M16 40L24 32L32 40L40 28L48 40" stroke="#8B6F4E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="20" cy="24" r="3" fill="#8B6F4E"/>
              </svg>
              <span className="mt-2 text-brown text-xs font-medium">Aucune image</span>
            </div>
          )}
          {ageRestricted && (
            <div className="absolute top-3 right-3 bg-primary text-background-light text-xs font-semibold px-3 py-1.5 tracking-wide">
              18+
            </div>
          )}
        </div>
      </Link>
      <div className="p-6">
        {/* Marque et Catégorie */}
        {(brand || category) && (
          <div className="flex items-center gap-2 mb-3 text-xs text-text-muted tracking-wide">
            {brand && (
              <span className="font-medium uppercase">
                {brand.name}
              </span>
            )}
            {brand && category && (
              <span className="text-accent">•</span>
            )}
            {category && (
              <span className="uppercase">{category.name}</span>
            )}
          </div>
        )}
        
        <Link href={`/produit/${productUrl}`}>
          <h3 className="text-lg font-medium text-primary group-hover:text-accent transition-colors mb-3 leading-tight">
            {name}
          </h3>
        </Link>
        <p className="text-xl font-semibold text-accent mb-5">{price.toFixed(2)} €</p>
        <Button onClick={handleAddToCart} variant="outline" fullWidth>
          Ajouter au panier
        </Button>
      </div>
    </div>
  );
}
