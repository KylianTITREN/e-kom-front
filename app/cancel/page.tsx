"use client";

export const dynamic = 'force-dynamic';

import Link from "next/link";
import Button from "@/components/Button";

export default function CancelPage() {
  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Paiement annulé
          </h1>
          <p className="text-gray-600">
            Votre paiement a été annulé. Vous pouvez réessayer quand vous le souhaitez.
          </p>
        </div>
        <div className="space-y-4">
          <Link href="/panier">
            <Button fullWidth>
              Retour au panier
            </Button>
          </Link>
          <Link href="/produits">
            <Button variant="secondary" fullWidth>
              Continuer mes achats
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
