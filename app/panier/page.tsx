import CartPageClient from "@/components/CartPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: process.env.SEO_CART_TITLE,
  description: process.env.SEO_CART_DESCRIPTION,
  keywords: process.env.SEO_CART_KEYWORDS,
};

export default function CartPage() {
  const stripePublishableKey =
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

  return <CartPageClient stripePublishableKey={stripePublishableKey} />;
}