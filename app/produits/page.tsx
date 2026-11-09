import { Suspense } from "react";
import type { Metadata } from "next";
import { getProducts, getCategories, getSubCategories, getBrands, getPromoProducts } from "@/lib/api";
import ProduitsPageClient from "./ProduitsPageClient";

export const metadata: Metadata = {
  title: { absolute: process.env.SEO_SHOP_TITLE || "Boutique" },
  description: process.env.SEO_SHOP_DESCRIPTION,
  keywords: process.env.SEO_SHOP_KEYWORDS,
  // Les variantes filtrées (?category=, ?search=) pointent vers la page boutique principale
  alternates: { canonical: "/produits" },
};

interface ProduitsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ProduitsPage({ searchParams }: ProduitsPageProps) {
  // Lire searchParams rend la page dynamique : useSearchParams() côté client
  // est alors rendu sur le serveur, et la grille produits est dans le HTML
  // (sinon Google ne voit que le fallback "Chargement..."). Les fetchs Strapi restent en cache 60 s.
  await searchParams;

  // Fetch toutes les données côté serveur
  // Les catégories/sous-catégories/marques sont filtrées par Strapi pour ne retourner
  // que celles qui ont au moins un produit associé
  const [products, categories, subCategories, brands, promoProducts] = await Promise.all([
    getProducts(),
    getCategories(),
    getSubCategories(),
    getBrands(),
    getPromoProducts(),
  ]);

  return (
    <Suspense fallback={<div className="text-center py-16"><p className="text-text-secondary">Chargement...</p></div>}>
      <ProduitsPageClient
        initialProducts={products}
        categories={categories}
        subCategories={subCategories}
        brands={brands}
        promoProducts={promoProducts}
      />
    </Suspense>
  );
}
