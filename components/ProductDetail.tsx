"use client";

import Link from "next/link";
import NextImage from "next/image";
import ImageGallery from "@/components/ImageGallery";
import EngravingOptions from "@/components/EngravingOptions";
import { Product } from "@/types";
import { richTextToString } from "@/lib/api";
import { useEngraving } from "@/context/EngravingContext";

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const { name, description, price, images, ageRestricted, brand, category, subCategory, engravings } = product;
  const { setSelectedEngraving } = useEngraving();

  // Convertir la description RichText en string
  const descriptionText = richTextToString(description);

        return (
          <div className="max-w-6xl mx-auto">
            {/* Breadcrumb */}
            <div className="mb-6 text-sm text-gray-600 md:pt-6" style={{ paddingTop: undefined }}>
              <Link href="/" className="hover:text-primary">Accueil</Link>
              {" > "}
              <Link href="/produits" className="hover:text-primary">Boutique</Link>
              {" > "}
              <span className="text-gray-800">{name}</span>
            </div>
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start">
              {/* Flag 18+ en haut à droite, style carte produit */}
              {ageRestricted && (
            <div className="absolute top-3 right-3 bg-primary text-background-light text-xs font-semibold px-3 py-1.5 tracking-wide">
              18+
            </div>
              )}
              {/* Galerie d'images */}
              <ImageGallery images={images || []} productName={name} />
              {/* Informations */}
              <div className="flex flex-col justify-between px-0 md:px-8">
                <div>
                  <h1 className="text-5xl font-title font-bold text-brown mb-4 text-left tracking-tight">{name}</h1>
                  <p className="text-4xl font-bold text-copper mb-8 text-left">{price.toFixed(2)} €</p>
                  <div className="flex flex-row flex-wrap gap-4 mb-10 items-center justify-center">
                    {brand && (
                      <span className="flex items-center gap-2 bg-beige/80 border border-brown/20 text-brown font-sans px-4 py-1 rounded-xl text-sm font-medium">
                        <span className="uppercase font-semibold">Marque</span>
                        {brand.logo && (
                          <span className="relative w-5 h-5">
                            <NextImage src={`${brand.logo.url}`} alt={brand.name} fill className="object-contain rounded-full" />
                          </span>
                        )}
                        {brand.name}
                      </span>
                    )}
                    {category && (
                      <span className="bg-beige/80 border border-brown/20 text-brown font-sans px-4 py-1 rounded-xl text-sm font-medium">
                        <span className="uppercase font-semibold">Catégorie</span> {category.name}
                      </span>
                    )}
                    {subCategory && (
                      <span className="bg-beige/60 border border-brown/10 text-brown font-sans px-4 py-1 rounded-xl text-sm font-medium">
                        <span className="uppercase font-semibold">Sous-catégorie</span> {subCategory.name}
                      </span>
                    )}
                  </div>
                  <div className="prose prose-gray mb-8 font-paragraph text-lg">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{descriptionText}</p>
                  </div>

                  {/* Options de gravure */}
                  {engravings && engravings.length > 0 && (
                    <EngravingOptions
                      options={engravings}
                      onEngravingChange={setSelectedEngraving}
                    />
                  )}
                </div>
              </div>
            </div>
</div>
  )
}
