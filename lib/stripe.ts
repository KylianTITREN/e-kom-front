import { CartItem } from "@/types";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export interface CheckoutSessionResult {
  sessionId: string | null;
  error?: {
    code: string;
    message: string;
    details?: string[];
  };
}

export async function createCheckoutSession(items: CartItem[]): Promise<CheckoutSessionResult> {
  try {
    const response = await fetch(`${STRAPI_URL}/api/order/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items,
      }),
    });

    const data = await response.json();

    // Si erreur 409 (Conflict) - panier obsolète
    if (response.status === 409 && data.error === "cart_outdated") {
      return {
        sessionId: null,
        error: {
          code: "cart_outdated",
          message: data.message || "Votre panier n'est plus à jour",
          details: data.details || [],
        },
      };
    }

    // Autres erreurs
    if (!response.ok) {
      return {
        sessionId: null,
        error: {
          code: "unknown",
          message: data.message || "Erreur lors de la création de la session de paiement",
        },
      };
    }

    return {
      sessionId: data.id,
    };
  } catch (error) {
    console.error("Erreur createCheckoutSession:", error);
    return {
      sessionId: null,
      error: {
        code: "network",
        message: "Erreur de connexion au serveur",
      },
    };
  }
}
