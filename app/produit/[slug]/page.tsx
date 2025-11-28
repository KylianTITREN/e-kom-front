export const dynamic = 'force-dynamic';
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/api";
import ProductDetail from "@/components/ProductDetail";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />
}
