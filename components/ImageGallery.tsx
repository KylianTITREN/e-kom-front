"use client";

import { useState } from "react";
import Image from "next/image";
import { StrapiImage } from "@/types";

interface ImageGalleryProps {
  images: StrapiImage[];
  productName: string;
}

export default function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

  if (!images || images.length === 0) {
    return (
      <div className="relative h-96 md:h-[500px] bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
        <span className="text-gray-400 text-lg">Aucune image disponible</span>
      </div>
    );
  }

  const currentImage = images[selectedImage];
  const mainImageUrl = `${STRAPI_URL}${currentImage.url}`;

  return (
    <>
      {/* Image principale */}
      <div className="space-y-4">
        <div
          className="relative h-96 md:h-[500px] bg-gray-100 rounded-lg overflow-hidden cursor-zoom-in"
          onClick={() => setIsLightboxOpen(true)}
        >
          <Image
            src={mainImageUrl}
            alt={currentImage.alternativeText || productName}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2YzZjRmNiIvPjwvc3ZnPg=="
          />
        </div>

        {/* Miniatures */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((img, index) => {
              const thumbUrl = img.formats?.thumbnail?.url
                ? `${STRAPI_URL}${img.formats.thumbnail.url}`
                : `${STRAPI_URL}${img.url}`;

              return (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(index)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? "border-primary ring-2 ring-primary ring-offset-2"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <Image
                    src={thumbUrl}
                    alt={img.alternativeText || `${productName} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors z-10"
            aria-label="Fermer"
          >
            ×
          </button>

          {/* Navigation précédent */}
          {images.length > 1 && selectedImage > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(selectedImage - 1);
              }}
              className="absolute left-4 text-white text-4xl hover:text-gray-300 transition-colors"
              aria-label="Image précédente"
            >
              ‹
            </button>
          )}

          {/* Image en grand */}
          <div className="relative max-w-7xl max-h-[90vh] w-full h-full">
            <Image
              src={mainImageUrl}
              alt={currentImage.alternativeText || productName}
              fill
              className="object-contain"
              sizes="100vw"
              quality={90}
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2YzZjRmNiIvPjwvc3ZnPg=="
            />
          </div>

          {/* Navigation suivant */}
          {images.length > 1 && selectedImage < images.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(selectedImage + 1);
              }}
              className="absolute right-4 text-white text-4xl hover:text-gray-300 transition-colors"
              aria-label="Image suivante"
            >
              ›
            </button>
          )}

          {/* Indicateur */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded-full">
              {selectedImage + 1} / {images.length}
            </div>
          )}
        </div>
      )}
    </>
  );
}
