import { Suspense } from "react";
import { getProducts, getCategories, getSubCategories, getBrands, getPromoProducts } from "@/lib/api";
import ProduitsPageClient from "./ProduitsPageClient";

export default async function ProduitsPage() {
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
