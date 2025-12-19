"use client";

import Image from "next/image";
import Link from "next/link";
import { CartItem as CartItemType } from "@/types";

interface CartItemProps {
  item: CartItemType;
  onRemove: (id: string) => void;
}

export default function CartItem({ item, onRemove }: CartItemProps) {
  return (
    <div className="flex items-center gap-6 bg-background-card border border-accent/10 p-6">
      {/* Image cliquable */}
      <Link href={`/produit/${item.slug}`} className="relative h-28 w-28 flex-shrink-0 bg-background overflow-hidden hover:opacity-80 transition-opacity">
        {item.image && !item.image.includes('placeholder.jpg') ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            sizes="112px"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-beige/60">
            <svg width="40" height="40" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="8" y="16" width="48" height="32" rx="6" fill="#C7B299" stroke="#8B6F4E" strokeWidth="2"/>
              <path d="M16 40L24 32L32 40L40 28L48 40" stroke="#8B6F4E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="20" cy="24" r="3" fill="#8B6F4E"/>
            </svg>
            <span className="mt-2 text-primary text-xs font-medium">Aucune image</span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex-grow">
        <Link href={`/produit/${item.slug}`} className="hover:text-accent transition-colors">
          <h3 className="font-medium text-primary mb-2 text-lg">{item.name}</h3>
        </Link>
        <p className="text-accent font-semibold text-lg">{item.price.toFixed(2)} €</p>

        {/* Informations de gravure */}
        {item.engraving && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm">
            <p className="font-semibold text-primary mb-1">✍️ Gravure: {item.engraving.label}</p>
            {item.engraving.text && (
              <p className="text-gray-700">Texte: {item.engraving.text}</p>
            )}
            {item.engraving.logoUrl && (
              <div className="mt-2">
                <p className="text-gray-700 mb-1">Logo:</p>
                <Image
                  src={item.engraving.logoUrl}
                  alt="Logo de gravure"
                  width={64}
                  height={64}
                  className="object-contain border border-gray-300 rounded"
                  unoptimized
                />
              </div>
            )}
            <p className="text-accent font-semibold mt-1">+{item.engraving.price.toFixed(2)} €</p>
          </div>
        )}
      </div>

      {/* Prix & Supprimer */}
      <div className="flex flex-col items-end gap-3">
        <p className="font-semibold text-xl text-accent">
          {((item.price + (item.engraving?.price || 0)) * item.quantity).toFixed(2)} €
        </p>
        <button
          onClick={() => onRemove(item.id)}
          className="text-sm text-text-secondary hover:text-red-600 transition-colors uppercase tracking-wide underline"
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}
