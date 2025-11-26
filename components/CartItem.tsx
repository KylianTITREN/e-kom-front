"use client";

import Image from "next/image";
import { CartItem as CartItemType } from "@/types";
import Button from "./Button";

interface CartItemProps {
  item: CartItemType;
  onRemove: (id: string) => void;
}

export default function CartItem({ item, onRemove }: CartItemProps) {
  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-md">
      {/* Image */}
      <div className="relative h-24 w-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          sizes="96px"
        />
      </div>

      {/* Info */}
      <div className="flex-grow">
        <h3 className="font-semibold text-gray-800 mb-1">{item.name}</h3>
        <p className="text-primary font-bold">{item.price.toFixed(2)} €</p>
        <p className="text-sm text-gray-500 mt-1">Quantité : {item.quantity}</p>
      </div>

      {/* Prix & Supprimer */}
      <div className="flex flex-col items-end gap-2">
        <p className="font-bold text-lg text-gray-800">
          {item.price.toFixed(2)} €
        </p>
        <Button
          variant="danger"
          onClick={() => onRemove(item.id)}
          className="text-sm px-3 py-1"
        >
          Supprimer
        </Button>
      </div>
    </div>
  );
}
