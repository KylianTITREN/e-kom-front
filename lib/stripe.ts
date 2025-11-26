import { CartItem } from "@/types";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const MERCHANT_ID = process.env.NEXT_PUBLIC_MERCHANT_ID;

export async function createCheckoutSession(items: CartItem[]): Promise<string | null> {
  try {
    const response = await fetch(`${STRAPI_URL}/api/order/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        merchantId: MERCHANT_ID,
        items,
      }),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la création de la session Stripe");
    }

    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error("Erreur createCheckoutSession:", error);
    return null;
  }
}
