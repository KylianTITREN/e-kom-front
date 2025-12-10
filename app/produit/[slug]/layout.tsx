import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/api";
import ProductGrid from "@/components/ProductGrid";
import StickyBar from "@/components/StickyBar";
import { EngravingProvider } from "@/context/EngravingContext";

interface ProductLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function ProductLayout({ children, params }: ProductLayoutProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  // Récupère tous les produits pour filtrer les similaires
  const allProducts = await getProducts();
  const similarProducts = allProducts.filter(p =>
    p.id !== product.id && (
      (product.brand && p.brand && p.brand.id === product.brand.id) ||
      (product.category && p.category && p.category.id === product.category.id)
    )
  ).slice(0, 6);

  return (
    <EngravingProvider>
      <StickyBar product={product} />
      {children}
      {similarProducts.length > 0 && (
        <section className="max-w-6xl mx-auto mt-16">
          <h2 className="text-2xl font-title font-bold text-brown mb-8 text-center">Produits similaires</h2>
          <ProductGrid products={similarProducts} />
        </section>
      )}
    </EngravingProvider>
  );
}
