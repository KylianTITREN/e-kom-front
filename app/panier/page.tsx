"use client";

import { useCart } from "@/context/CartContext";
import CartItem from "@/components/CartItem";
import Button from "@/components/Button";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import { createCheckoutSession } from "@/lib/stripe";
import { useState } from "react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

export default function PanierPage() {
  const { items, removeItem, totalPrice, clearCart, hasAgeRestrictedItems } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [ageConfirmed, setAgeConfirmed] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);
    
    try {
      const sessionId = await createCheckoutSession(items);
      
      if (!sessionId) {
        alert("Erreur lors de la création de la session de paiement");
        setIsLoading(false);
        return;
      }

      const stripe = await stripePromise;
      if (!stripe) {
        alert("Erreur de chargement de Stripe");
        setIsLoading(false);
        return;
      }

      const { error } = await stripe.redirectToCheckout({ sessionId });
      
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
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Votre panier est vide
        </h1>
        <p className="text-gray-600 mb-8">
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
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        Votre Panier
      </h1>

      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onRemove={removeItem}
          />
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-semibold text-gray-800">Total :</span>
          <span className="text-3xl font-bold text-primary">
            {totalPrice.toFixed(2)} €
          </span>
        </div>

        {/* Vérification d'âge si produits restreints */}
        {hasAgeRestrictedItems && (
          <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="age-confirmation"
                checked={ageConfirmed}
                onChange={(e) => setAgeConfirmed(e.target.checked)}
                className="mt-1 h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="age-confirmation" className="text-sm text-gray-700">
                <span className="font-semibold">⚠️ Produit(s) interdit(s) aux mineurs</span>
                <br />
                Je certifie avoir plus de 18 ans et être en droit d&apos;acheter ces produits.
              </label>
            </div>
          </div>
        )}
        
        <div className="flex gap-4">
          <Button
            variant="secondary"
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
            {isLoading ? "Chargement..." : "Payer avec Stripe"}
          </Button>
        </div>

        {hasAgeRestrictedItems && !ageConfirmed && (
          <p className="text-sm text-orange-600 mt-2 text-center">
            Veuillez confirmer que vous avez plus de 18 ans pour continuer.
          </p>
        )}
      </div>
    </div>
  );
}
