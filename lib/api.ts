import { Product, StrapiResponse, RichTextBlock, News, LegalPage, HomepageContent } from "@/types";

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
    const url = `${STRAPI_URL}/api/products?filters[merchant][id][$eq]=${merchantId}&populate[images]=true&populate[merchant]=true&populate[category]=true&populate[subCategory]=true&populate[brand][populate][logo]=true`;

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
    // Utiliser populate deep level 2 pour récupérer toutes les relations
    let res = await fetch(
      `${STRAPI_URL}/api/products?filters[slug][$eq]=${slugOrId}${merchantFilter}&populate[0]=images&populate[1]=merchant&populate[2]=category&populate[3]=subCategory&populate[4]=brand&populate[5]=brand.logo`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ Erreur API produit:", res.status, errorText);
      throw new Error(`Erreur ${res.status}: ${res.statusText}`);
    }

    let data: StrapiResponse<Product[]> = await res.json();

    // Si pas trouvé, essaie par documentId (rare)
    if (!data.data || data.data.length === 0) {
      res = await fetch(
        `${STRAPI_URL}/api/products?filters[documentId][$eq]=${slugOrId}${merchantFilter}&populate[images]=true&populate[merchant]=true&populate[category]=true&populate[subCategory]=true&populate[brand][populate][logo]=true`,
        { cache: "no-store" }
      );
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ Erreur API produit (documentId):", res.status, errorText);
        return null;
      }
      
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
    // Note: filtre merchant temporairement désactivé car les pages n'ont pas encore de merchant assigné
    const url = `${STRAPI_URL}/api/legal-pages?sort=order:asc`;
    const res = await fetch(url, { cache: "no-store" });
    
    if (!res.ok) throw new Error("Erreur lors de la récupération des pages légales");

    const data: StrapiResponse<LegalPage[]> = await res.json();
    
    // Si merchantId est défini, filtrer côté client
    if (merchantId) {
      return data.data.filter((page: any) => {
        return !page.merchant || page.merchant?.id?.toString() === merchantId;
      });
    }
    
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
    // Note: filtre merchant temporairement désactivé car les pages n'ont pas encore de merchant assigné
    // const merchantFilter = merchantId ? `&filters[merchant][id][$eq]=${merchantId}` : '';
    const url = `${STRAPI_URL}/api/legal-pages?filters[slug][$eq]=${slug}`;
    const res = await fetch(url, { cache: "no-store" });
    
    if (!res.ok) {
      console.error("Erreur API legal page:", res.status, res.statusText);
      throw new Error("Erreur lors de la récupération de la page légale");
    }

    const data: StrapiResponse<LegalPage[]> = await res.json();
    
    // Si merchantId est défini, filtrer côté client
    if (merchantId && data.data.length > 0) {
      const filtered = data.data.filter((page: any) => {
        return !page.merchant || page.merchant?.id?.toString() === merchantId;
      });
      return filtered[0] || null;
    }
    
    return data.data[0] || null;
  } catch (error) {
    console.error("Erreur getLegalPageBySlug:", error);
    return null;
  }
}

// Récupérer le contenu de la page d'accueil
export async function getHomepageContent(): Promise<HomepageContent | null> {
  const merchantId = process.env.NEXT_PUBLIC_MERCHANT_ID;
  try {
    // homepage-content est maintenant un Collection Type avec relation merchant
    const merchantFilter = merchantId ? `filters[merchant][id][$eq]=${merchantId}&` : '';
    const url = `${STRAPI_URL}/api/homepage-content?${merchantFilter}populate=merchant`;
    const res = await fetch(url, { cache: "no-store" });
    
    if (!res.ok) {
      console.error("Erreur API homepage-content:", res.status, res.statusText);
      return null;
    }

    const json = await res.json();
    
    // Collection Type retourne { data: [...] }
    return json.data?.[0] || null;
  } catch (error) {
    console.error("Erreur getHomepageContent:", error);
    return null;
  }
}
