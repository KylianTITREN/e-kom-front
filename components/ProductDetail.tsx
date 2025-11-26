"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import Button from "@/components/Button";
import ImageGallery from "@/components/ImageGallery";
import { Product } from "@/types";
import { richTextToString } from "@/lib/api";
import { useState } from "react";

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const { name, description, price, images, ageRestricted, brand, category, subCategory } = product;

  // Convertir la description RichText en string
  const descriptionText = richTextToString(description);

  // Image pour le panier (première image)
  const firstImage = images && images.length > 0 ? images[0] : null;
  const cartImageUrl = firstImage
    ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${firstImage.formats?.small?.url || firstImage.url}`
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
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-gray-600">
        <Link href="/" className="hover:text-primary">
          Accueil
        </Link>
        {" > "}
        <Link href="/produits" className="hover:text-primary">
          Boutique
        </Link>
        {" > "}
        <span className="text-gray-800">{name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-lg shadow-md">
        {/* Galerie d'images */}
        <ImageGallery images={images || []} productName={name} />

        {/* Informations */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-4xl font-bold text-gray-800">{name}</h1>
              {ageRestricted && (
                <span className="bg-orange-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  18+
                </span>
              )}
            </div>

            {/* Informations produit : Marque, Catégorie, Sous-catégorie */}
            {(brand || category || subCategory) && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 gap-2 text-sm">
                  {brand && (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-700 w-32">Marque :</span>
                      <span className="text-gray-900 font-medium">{brand}</span>
                    </div>
                  )}
                  {category && (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-700 w-32">Catégorie :</span>
                      <span className="text-gray-900">{category}</span>
                    </div>
                  )}
                  {subCategory && (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-700 w-32">Sous-catégorie :</span>
                      <span className="text-gray-900">{subCategory}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <p className="text-3xl font-bold text-primary mb-6">
              {price.toFixed(2)} €
            </p>
            {ageRestricted && (
              <div className="mb-4 p-4 bg-orange-50 border-l-4 border-orange-500 text-orange-800">
                <p className="font-semibold">⚠️ Produit interdit aux mineurs</p>
                <p className="text-sm mt-1">
                  Vous devez avoir plus de 18 ans pour acheter ce produit.
                </p>
              </div>
            )}
            <div className="prose prose-gray mb-8">
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {descriptionText}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {isAdded && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg text-center">
                ✓ Produit ajouté au panier
              </div>
            )}
            <Button onClick={handleAddToCart} fullWidth>
              Ajouter au panier
            </Button>
            <Link href="/produits">
              <Button variant="secondary" fullWidth>
                ← Retour à la boutique
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
