"use client";

import { useCart } from "@/context/CartContext";
import CartItem from "@/components/CartItem";
import Button from "@/components/Button";
import Link from "next/link";
import { getStripe } from "@/lib/stripeClient";
import { createCheckoutSession } from "@/lib/stripe";
import { useState, useEffect } from "react";
import { ShippingRate } from "@/types";

export default function CartPageClient() {
  const { items, removeItem, totalPrice, clearCart, hasAgeRestrictedItems } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState<number | null>(null);

  useEffect(() => {
    async function fetchShippingRates() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/shipping/rates`);
        if (response.ok) {
          const data = await response.json();

          // Trouver le seuil de livraison gratuite le plus bas
          const thresholds = data.rates
            .map((rate: ShippingRate) => rate.freeShippingThreshold)
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

  const handleCheckout = async () => {
    setIsLoading(true);

    try {
      const result = await createCheckoutSession(items);

      // Si le panier est obsolète, vider le panier et afficher les détails
      if (result.error?.code === "cart_outdated") {
        const detailsMessage = result.error.details?.length
          ? "\n\nDétails:\n" + result.error.details.join("\n")
          : "";

        alert(result.error.message + detailsMessage);
        clearCart(); // Vider le panier automatiquement
        setIsLoading(false);
        return;
      }

      // Autres erreurs
      if (!result.sessionId || result.error) {
        alert(result.error?.message || "Erreur lors de la création de la session de paiement");
        setIsLoading(false);
        return;
      }

      const stripe = await getStripe();
      if (!stripe) {
        alert("Erreur de chargement de Stripe");
        setIsLoading(false);
        return;
      }

      const { error } = await stripe.redirectToCheckout({ sessionId: result.sessionId });

      if (error) {
        console.error("Erreur Stripe:", error);
        alert("Erreur lors de la redirection vers le paiement");
      }
    } catch (error) {
      console.error("Erreur checkout:", error);
      alert("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-16 max-w-2xl mx-auto">
        <h1 className="text-3xl font-semibold text-primary mb-5 tracking-wide">
          Votre panier est vide
        </h1>
        <p className="text-text-secondary mb-10 leading-relaxed">
          Ajoutez des produits pour commencer vos achats
        </p>
        <Link href="/produits">
          <Button>
            Découvrir nos produits
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-semibold text-primary mb-10 tracking-wide">
        Votre Panier
      </h1>

      <div className="space-y-4 mb-10">
        {items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onRemove={removeItem}
          />
        ))}
      </div>

      <div className="bg-background-card border border-accent/20 p-8">
        <div className="flex justify-between items-center mb-4 pb-6 border-b border-accent/20">
          <span className="text-lg font-medium text-text uppercase tracking-wide">Sous-total</span>
          <span className="text-3xl font-semibold text-accent">
            {totalPrice.toFixed(2)} €
          </span>
        </div>

        {/* Message livraison */}
        <div className="mb-6 space-y-3">
          {freeShippingThreshold && totalPrice >= freeShippingThreshold ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-700 font-medium text-center">
                🎉 Vous bénéficiez de la livraison gratuite !
              </p>
            </div>
          ) : (
            <>
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  📦 Frais de livraison calculés à l&apos;étape suivante
                </p>
              </div>
              {freeShippingThreshold && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-blue-700 text-center">
                    Plus que <span className="font-semibold">{(freeShippingThreshold - totalPrice).toFixed(2)} €</span> pour bénéficier de la livraison gratuite
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Vérification d'âge si produits restreints */}
        {hasAgeRestrictedItems && (
          <div className="mb-6 p-4 bg-orange-50 border border-orange-200">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="age-confirmation"
                checked={ageConfirmed}
                onChange={(e) => setAgeConfirmed(e.target.checked)}
                className="mt-1 h-5 w-5 text-primary focus:ring-primary border-gray-300"
              />
              <label htmlFor="age-confirmation" className="text-sm text-gray-700 leading-relaxed">
                <span className="font-semibold">⚠️ Produit(s) interdit(s) aux mineurs</span>
                <br />
                Je certifie avoir plus de 18 ans et être en droit d&apos;acheter ces produits.
              </label>
            </div>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            onClick={clearCart}
            fullWidth
          >
            Vider le panier
          </Button>
          <Button
            onClick={handleCheckout}
            disabled={isLoading || (hasAgeRestrictedItems && !ageConfirmed)}
            fullWidth
          >
            {isLoading ? "Chargement..." : "Payer"}
          </Button>
        </div>

        {hasAgeRestrictedItems && !ageConfirmed && (
          <p className="text-sm text-orange-600 mt-4 text-center">
            Veuillez confirmer que vous avez plus de 18 ans pour continuer.
          </p>
        )}
      </div>
    </div>
  );
}
