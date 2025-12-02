"use client";

import Link from "next/link";
import Button from "@/components/Button";
import { useEffect, Suspense } from "react";
import { useCart } from "@/context/CartContext";
import { useSearchParams } from "next/navigation";

function SuccessContent() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Vider le panier après un paiement réussi
    if (sessionId) {
      clearCart();
    }
  }, [clearCart, sessionId]);

  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Paiement réussi !
          </h1>
          <p className="text-gray-600">
            Merci pour votre commande. Vous recevrez bientôt un email de confirmation.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <Link href="/produits" className="w-full">
            <Button fullWidth>
              Continuer mes achats
            </Button>
          </Link>
          <Link href="/" className="w-full">
            <Button variant="secondary" fullWidth>
              Retour à l&apos;accueil
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
