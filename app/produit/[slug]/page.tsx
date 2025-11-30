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
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

  const title = `${product.name} – ${baseTitle}`;

  // Description dynamique basée sur le produit
  const description = product.description
    ? (typeof product.description === 'string'
        ? product.description.slice(0, 160)
        : product.description.map(block => block.children.map(child => child.text).join("")).join(" ").slice(0, 160))
    : process.env.SEO_PRODUCT_DESCRIPTION;

  const keywords = [
    product.name,
    product.category?.name,
    product.brand?.name,
  ]
    .filter(Boolean)
    .join(", ") + ", " + process.env.SEO_PRODUCT_KEYWORDS;

  // Image pour Open Graph
  const imageUrl = product.images?.[0]?.url
    ? `${STRAPI_URL}${product.images[0].url}`
    : undefined;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: "website",
      images: imageUrl ? [{ url: imageUrl, alt: product.name }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
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
