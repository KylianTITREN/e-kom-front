import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/api";
import ProductDetail from "@/components/ProductDetail";
import { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: `Produit introuvable | ${process.env.SEO_SITE_NAME}`,
      description: process.env.SEO_PRODUCT_DESCRIPTION,
      keywords: process.env.SEO_PRODUCT_KEYWORDS,
    };
  }

  const baseTitle = process.env.SEO_SITE_NAME;

  const title = `${product.name} – ${baseTitle}`;

  const keywords = [
    product.name,
    product.category?.name,
    product.brand?.name,
  ]
    .filter(Boolean)
    .join(", ") + ", " + process.env.SEO_PRODUCT_KEYWORDS;

  return {
    title,
    description: process.env.SEO_PRODUCT_DESCRIPTION,
    keywords,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />
}
