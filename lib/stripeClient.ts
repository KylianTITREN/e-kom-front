import { loadStripe, Stripe } from "@stripe/stripe-js";

// Mémoïsation de la promesse Stripe pour éviter les réinitialisations multiples
let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
    );
  }
  return stripePromise;
};
