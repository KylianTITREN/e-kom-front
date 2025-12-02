import { MetadataRoute } from "next";
import { getProducts, getNews, getLegalPages } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Pages statiques
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/produits`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/actualites`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Récupérer les produits
  const products = await getProducts();
  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/produit/${product.slug}`,
    lastModified: new Date(product.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Récupérer les actualités
  const news = await getNews();
  const newsPages: MetadataRoute.Sitemap = news.map((article) => ({
    url: `${baseUrl}/actualites/${article.slug}`,
    lastModified: new Date(article.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Récupérer les pages légales
  const legalPages = await getLegalPages();
  const legalPagesMap: MetadataRoute.Sitemap = legalPages.map((page) => ({
    url: `${baseUrl}/legal/${page.slug}`,
    lastModified: new Date(page.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...productPages, ...newsPages, ...legalPagesMap];
}
