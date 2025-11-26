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
    ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${firstImage.formats?.medium?.url || firstImage.url}`
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Link href={`/produit/${productUrl}`}>
        <div className="relative h-64 w-full bg-gray-100">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {ageRestricted && (
            <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              18+
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        {/* Marque et Catégorie */}
        {(brand || category) && (
          <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
            {brand && (
              <span className="bg-gray-100 px-2 py-1 rounded-md font-medium">
                {brand}
              </span>
            )}
            {category && (
              <span className="text-gray-400">•</span>
            )}
            {category && (
              <span>{category}</span>
            )}
          </div>
        )}
        
        <Link href={`/produit/${productUrl}`}>
          <h3 className="text-lg font-semibold text-gray-800 hover:text-primary transition-colors mb-2">
            {name}
          </h3>
        </Link>
        <p className="text-xl font-bold text-primary mb-4">{price.toFixed(2)} €</p>
        <Button onClick={handleAddToCart} fullWidth>
          Ajouter au panier
        </Button>
      </div>
    </div>
  );
}
