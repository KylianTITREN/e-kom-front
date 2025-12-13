"use client";

import { useState, useEffect } from "react";

export default function FreeShippingBanner() {
  const [freeShippingThreshold, setFreeShippingThreshold] = useState<number | null>(null);

  useEffect(() => {
    async function fetchShippingRates() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/shipping/rates`);
        if (response.ok) {
          const data = await response.json();

          // Trouver le seuil de livraison gratuite le plus bas
          const thresholds = data.rates
            .map((rate: any) => rate.freeShippingThreshold)
            .filter((threshold: number | null) => threshold !== null);

          if (thresholds.length > 0) {
            setFreeShippingThreshold(Math.min(...thresholds));
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des tarifs de livraison:", error);
      }
    }
    fetchShippingRates();
  }, []);

  // Ne rien afficher si pas de seuil configuré
  if (!freeShippingThreshold) {
    return null;
  }

  return (
    <div className="bg-accent text-white py-2 px-4 text-center text-sm font-medium">
      🚚 Livraison offerte dès {freeShippingThreshold.toFixed(2)} €
    </div>
  );
}
