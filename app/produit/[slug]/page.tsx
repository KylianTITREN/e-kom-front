import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/api";
import ProductDetail from "@/components/ProductDetail";

interface ProductPageProps {
  params: { slug: string };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Récupère tous les produits pour filtrer les similaires
  const allProducts = await getProducts();
  const similarProducts = allProducts.filter(p =>
    p.id !== product.id && (
      (product.brand && p.brand && p.brand.id === product.brand.id) ||
      (product.category && p.category && p.category.id === product.category.id)
    )
  ).slice(0, 6);

  return (
    <>
  <ProductDetail product={product} />
  {/* Section Produits similaires supprimée, gérée dans layout.tsx */}
    </>
  );
}
