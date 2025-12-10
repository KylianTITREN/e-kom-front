"use client";

import { Settings } from "@/types";

interface FreeShippingBannerProps {
  settings: Settings | null;
}

export default function FreeShippingBanner({ settings }: FreeShippingBannerProps) {
  // Ne rien afficher si pas de seuil configuré
  if (!settings?.freeShippingThreshold) {
    return null;
  }

  return (
    <div className="bg-accent text-white py-2 px-4 text-center text-sm font-medium">
      🚚 Livraison offerte dès {settings.freeShippingThreshold.toFixed(2)} €
    </div>
  );
}
