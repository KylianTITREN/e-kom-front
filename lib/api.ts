import { Product, StrapiResponse, RichTextBlock, News, LegalPage } from "@/types";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

// Convertir le RichText en string simple
export function richTextToString(richText: RichTextBlock[] | string): string {
  if (typeof richText === "string") return richText;
  
  return richText
    .map((block) => block.children.map((child) => child.text).join(""))
    .join("\n");
}

// Récupérer tous les produits
export async function getProducts(): Promise<Product[]> {
  const merchantId = process.env.NEXT_PUBLIC_MERCHANT_ID;

  try {
    // On récupère tous les produits avec images et merchant
    // Le filtre Strapi sur merchant ne fonctionne pas, donc on filtre côté client
    const url = `${STRAPI_URL}/api/products?filters[merchant][id][$eq]=${merchantId}&populate=*`;

    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ Erreur Strapi:", errorText);
      throw new Error(`Erreur ${res.status}: ${res.statusText}`);
    }

    const data: StrapiResponse<Product[]> = await res.json();
    
    // Filtrer par merchant côté client si merchantId est défini
    if (merchantId) {
      const filtered = data.data.filter((product: any) => {
        return product.merchant?.id?.toString() === merchantId;
      });
      console.log(`🔍 Produits filtrés pour merchant ${merchantId}:`, filtered.length);
      return filtered;
    }
    
    return data.data;
  } catch (error) {
    console.error("❌ Erreur getProducts:", error);
    return [];
  }
}

// Récupérer un produit par slug ou documentId
export async function getProductBySlug(slugOrId: string): Promise<Product | null> {
  const merchantId = process.env.NEXT_PUBLIC_MERCHANT_ID;
  
  try {
    // Filtrage par slug + merchant
    const merchantFilter = merchantId ? `&filters[merchant][id][$eq]=${merchantId}` : '';
    let res = await fetch(
      `${STRAPI_URL}/api/products?filters[slug][$eq]=${slugOrId}${merchantFilter}&populate=*`,
      { cache: "no-store" }
    );

    if (!res.ok) throw new Error("Erreur lors de la récupération du produit");

    let data: StrapiResponse<Product[]> = await res.json();

    // Si pas trouvé, essaie par documentId (rare)
    if (!data.data || data.data.length === 0) {
      res = await fetch(
        `${STRAPI_URL}/api/products?filters[documentId][$eq]=${slugOrId}${merchantFilter}&populate=*`,
        { cache: "no-store" }
      );
      data = await res.json();
    }

    return data.data[0] || null;
  } catch (error) {
    console.error("Erreur getProductBySlug:", error);
    return null;
  }
}

// Récupérer les produits phares (limité à 6)
export async function getFeaturedProducts(): Promise<Product[]> {
  const merchantId = process.env.NEXT_PUBLIC_MERCHANT_ID;
  try {
    const merchantFilter = merchantId ? `filters[merchant][id][$eq]=${merchantId}&` : '';
    const url = `${STRAPI_URL}/api/products?${merchantFilter}populate=*&pagination[limit]=6`;
    
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) throw new Error("Erreur lors de la récupération des produits phares");

    const data: StrapiResponse<Product[]> = await res.json();
    return data.data;
  } catch (error) {
    console.error("Erreur getFeaturedProducts:", error);
    return [];
  }
}

// Récupérer toutes les actualités
export async function getNews(limit?: number): Promise<News[]> {
  const merchantId = process.env.NEXT_PUBLIC_MERCHANT_ID;
  try {
    const merchantFilter = merchantId ? `filters[merchant][id][$eq]=${merchantId}&` : '';
    const limitParam = limit ? `&pagination[limit]=${limit}` : '';
    const url = `${STRAPI_URL}/api/news-articles?${merchantFilter}populate=*&sort=publishedDate:desc${limitParam}`;
    
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Erreur lors de la récupération des actualités");

    const data: StrapiResponse<News[]> = await res.json();
    return data.data;
  } catch (error) {
    console.error("Erreur getNews:", error);
    return [];
  }
}

// Récupérer une actualité par slug
export async function getNewsBySlug(slug: string): Promise<News | null> {
  try {
    const url = `${STRAPI_URL}/api/news-articles?filters[slug][$eq]=${slug}&populate=*`;
    const res = await fetch(url, { cache: "no-store" });
    
    if (!res.ok) throw new Error("Erreur lors de la récupération de l'actualité");

    const data: StrapiResponse<News[]> = await res.json();
    return data.data[0] || null;
  } catch (error) {
    console.error("Erreur getNewsBySlug:", error);
    return null;
  }
}

// Récupérer toutes les pages légales
export async function getLegalPages(): Promise<LegalPage[]> {
  const merchantId = process.env.NEXT_PUBLIC_MERCHANT_ID;
  try {
    const merchantFilter = merchantId ? `filters[merchant][id][$eq]=${merchantId}&` : '';
    const url = `${STRAPI_URL}/api/legal-pages?${merchantFilter}sort=order:asc`;
    const res = await fetch(url, { cache: "no-store" });
    
    if (!res.ok) throw new Error("Erreur lors de la récupération des pages légales");

    const data: StrapiResponse<LegalPage[]> = await res.json();
    return data.data;
  } catch (error) {
    console.error("Erreur getLegalPages:", error);
    return [];
  }
}

// Récupérer une page légale par slug
export async function getLegalPageBySlug(slug: string): Promise<LegalPage | null> {
  const merchantId = process.env.NEXT_PUBLIC_MERCHANT_ID;
  try {
    const merchantFilter = merchantId ? `&filters[merchant][id][$eq]=${merchantId}` : '';
    const url = `${STRAPI_URL}/api/legal-pages?filters[slug][$eq]=${slug}${merchantFilter}`;
    const res = await fetch(url, { cache: "no-store" });
    
    if (!res.ok) throw new Error("Erreur lors de la récupération de la page légale");

    const data: StrapiResponse<LegalPage[]> = await res.json();
    return data.data[0] || null;
  } catch (error) {
    console.error("Erreur getLegalPageBySlug:", error);
    return null;
  }
}
