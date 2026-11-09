import { notFound } from "next/navigation";
import { getProductBySlug, richTextToString } from "@/lib/api";
import ProductDetail from "@/components/ProductDetail";
import { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  // Vrai statut HTTP 404 (sinon Google classe la page en "soft 404").
  // Ne pas remettre de loading.tsx au-dessus de cette route : le streaming forcerait un 200.
  if (!product) notFound();

  // Le template du layout ajoute déjà " | <nom du site>"
  const title = product.name;
  const canonical = `/produit/${product.slug || product.documentId}`;

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
    ? `${product.images[0].url}`
    : undefined;

  return {
    title,
    description,
    keywords,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      type: "website",
      url: canonical,
      siteName: process.env.SEO_SITE_NAME,
      locale: "fr_FR",
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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const url = `${siteUrl}/produit/${product.slug || product.documentId}`;

  // Données structurées : prix / dispo / marque dans Google (résultats enrichis + Google Shopping gratuit)
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images?.map((img) => img.url) ?? [],
    description: richTextToString(product.description).slice(0, 5000),
    sku: product.documentId,
    ...(product.brand && { brand: { "@type": "Brand", name: product.brand.name } }),
    ...(product.category && { category: product.category.name }),
    offers: {
      "@type": "Offer",
      url,
      price: product.price.toFixed(2),
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: process.env.SEO_SITE_NAME },
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: siteUrl || "/" },
      { "@type": "ListItem", position: 2, name: "Boutique", item: `${siteUrl}/produits` },
      { "@type": "ListItem", position: 3, name: product.name, item: url },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([productSchema, breadcrumbSchema]).replace(/</g, "\\u003c") }}
      />
      <ProductDetail product={product} />
    </>
  );
}
