import { Product, StrapiResponse, RichTextBlock, News, LegalPage, HomepageContent, Settings, Category, SubCategory, Brand } from "@/types";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

// Configuration du cache : désactivé en dev, activé en prod
const isDev = process.env.NODE_ENV === 'development';
const cacheConfig = isDev ? { cache: 'no-store' as const } : { next: { revalidate: 60 } };

// Helper pour construire les URLs avec support du mode draft (Server Components only)
async function buildStrapiUrl(path: string, params: Record<string, string> = {}): Promise<string> {
  const url = new URL(path, STRAPI_URL);

  // Ajouter les paramètres de base
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  // En mode preview, ajouter le paramètre status=draft
  // Utilisation dynamique pour éviter les erreurs dans les Client Components
  if (typeof window === 'undefined') {
    try {
      const { draftMode } = await import("next/headers");
      const { isEnabled } = await draftMode();
      if (isEnabled) {
        url.searchParams.set('status', 'draft');
        url.searchParams.set('publicationState', 'preview');
      }
    } catch {
      // Ignorer les erreurs si draftMode n'est pas disponible
    }
  }

  return url.toString();
}

// Helper pour construire les paramètres populate de manière structurée
function buildPopulateParams(relations: string[]): Record<string, string> {
  return relations.reduce((acc, rel) => {
    acc[`populate[${rel}]`] = 'true';
    return acc;
  }, {} as Record<string, string>);
}

// Convertir le RichText en string simple
export function richTextToString(richText: RichTextBlock[] | string): string {
  if (typeof richText === "string") return richText;
  
  return richText
    .map((block) => block.children.map((child) => child.text).join(""))
    .join("\n");
}

// Récupérer tous les produits
export async function getProducts(): Promise<Product[]> {
  try {
    const url = await buildStrapiUrl('/api/products', {
      ...buildPopulateParams([
        'images',
        'category',
        'subCategory',
        'brand',
        'engravings'
      ])
    });

    const res = await fetch(url, cacheConfig);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ Erreur Strapi:", errorText);
      throw new Error(`Erreur ${res.status}: ${res.statusText}`);
    }

    const data: StrapiResponse<Product[]> = await res.json();
    return data.data;
  } catch (error) {
    console.error("❌ Erreur getProducts:", error);
    return [];
  }
}

// Récupérer un produit par slug ou documentId (avec support preview)
export async function getProductBySlug(slugOrId: string): Promise<Product | null> {
  try {
    // Construire l'URL avec support du mode draft
    const urlBySlug = await buildStrapiUrl('/api/products', {
      'filters[slug][$eq]': slugOrId,
      ...buildPopulateParams([
        'images',
        'category',
        'subCategory',
        'brand',
        'engravings'
      ]),
    });

    let res = await fetch(urlBySlug, { cache: 'no-store' }); // Pas de cache en preview

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ Erreur API produit:", res.status, errorText);
      throw new Error(`Erreur ${res.status}: ${res.statusText}`);
    }

    let data: StrapiResponse<Product[]> = await res.json();

    // Si pas trouvé par slug, essayer par documentId
    if (!data.data || data.data.length === 0) {
      const urlByDocId = await buildStrapiUrl('/api/products', {
        'filters[documentId][$eq]': slugOrId,
        ...buildPopulateParams([
          'images',
          'category',
          'subCategory',
          'brand',
          'engravings'
        ]),
      });

      res = await fetch(urlByDocId, { cache: 'no-store' });

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
  try {
    const url = await buildStrapiUrl('/api/products', {
      ...buildPopulateParams([
        'images',
        'category',
        'subCategory',
        'brand',
        'engravings'
      ]),
      'pagination[limit]': '6',
      'sort': 'createdAt:desc'
    });

    const res = await fetch(url, cacheConfig);

    if (!res.ok) throw new Error("Erreur lors de la récupération des produits phares");

    const data: StrapiResponse<Product[]> = await res.json();
    return data.data;
  } catch (error) {
    console.error("Erreur getFeaturedProducts:", error);
    return [];
  }
}

// Récupérer toutes les actualités actives ou à venir (pas terminées)
export async function getNews(limit?: number): Promise<News[]> {
  try {
    const params: Record<string, string> = { 'populate': '*' };
    if (limit) {
      params['pagination[limit]'] = limit.toString();
    }
    
    const url = await buildStrapiUrl('/api/news-articles', params);

    const res = await fetch(url, cacheConfig);
    if (!res.ok) throw new Error("Erreur lors de la récupération des actualités");

    const data: StrapiResponse<News[]> = await res.json();

    // Filtrer les actualités côté client (garder celles qui ne sont pas terminées)
    const now = new Date();
    const activeNews = data.data.filter((news) => {
      // Si pas de date de fin, l'actualité est toujours active
      if (!news.endDate) return true;

      // Sinon, vérifier que la date de fin n'est pas dépassée
      const endDate = new Date(news.endDate);
      return endDate >= now;
    });

    // Trier par date de début (startDate) - les actualités en cours/passées d'abord, puis les futures
    activeNews.sort((a, b) => {
      const dateA = new Date(a.startDate);
      const dateB = new Date(b.startDate);
      return dateA.getTime() - dateB.getTime(); // ordre croissant (du plus vieux au plus récent)
    });

    return activeNews;
  } catch (error) {
    console.error("Erreur getNews:", error);
    return [];
  }
}

// Récupérer une actualité par slug
export async function getNewsBySlug(slug: string): Promise<News | null> {
  try {
    const url = await buildStrapiUrl('/api/news-articles', {
      'filters[slug][$eq]': slug,
      'populate': '*'
    });
    
    const res = await fetch(url, cacheConfig);
    
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
  try {
    const url = await buildStrapiUrl('/api/legal-pages', {
      'sort': 'order:asc'
    });
    
    const res = await fetch(url, cacheConfig);
    
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
  try {
    const url = await buildStrapiUrl('/api/legal-pages', {
      'filters[slug][$eq]': slug
    });
    
    const res = await fetch(url, cacheConfig);
    
    if (!res.ok) {
      console.error("Erreur API legal page:", res.status, res.statusText);
      throw new Error("Erreur lors de la récupération de la page légale");
    }

    const data: StrapiResponse<LegalPage[]> = await res.json();
    return data.data[0] || null;
  } catch (error) {
    console.error("Erreur getLegalPageBySlug:", error);
    return null;
  }
}

// Récupérer le contenu de la page d'accueil
export async function getHomepageContent(): Promise<HomepageContent | null> {
  try {
    const url = await buildStrapiUrl('/api/homepage-content', {
      'populate': '*'
    });
    
    const res = await fetch(url, cacheConfig);
    
    if (!res.ok) {
      console.error("Erreur API homepage-content:", res.status, res.statusText);
      return null;
    }

    const json = await res.json();
    // Single Type retourne { data: { ...attributes } }
    return json.data || null;
  } catch (error) {
    console.error("Erreur getHomepageContent:", error);
    return null;
  }
}

// Récupérer les paramètres du site
export async function getSettings(): Promise<Settings | null> {
  try {
    const url = await buildStrapiUrl('/api/setting', {
      'populate': '*'
    });
    
    const res = await fetch(url, cacheConfig);

    if (!res.ok) {
      console.error("Erreur API settings:", res.status, res.statusText);
      return null;
    }

    const json = await res.json();

    // Single Type retourne { data: { ...attributes } }
    return json.data || null;
  } catch (error) {
    console.error("Erreur getSettings:", error);
    return null;
  }
}

// Récupérer toutes les catégories
export async function getCategories(): Promise<Category[]> {
  try {
    const url = await buildStrapiUrl('/api/categories', {
      'populate[brands]': 'true',
      'populate[subCategories]': 'true'
    });
    
    const res = await fetch(url, cacheConfig);

    if (!res.ok) throw new Error("Erreur lors de la récupération des catégories");

    const data: StrapiResponse<Category[]> = await res.json();
    return data.data;
  } catch (error) {
    console.error("Erreur getCategories:", error);
    return [];
  }
}

// Récupérer toutes les sous-catégories avec leur catégorie parente
export async function getSubCategories(): Promise<SubCategory[]> {
  try {
    const url = await buildStrapiUrl('/api/subcategories', {
      'populate[brands]': 'true',
      'populate[category]': 'true'
    });

    const res = await fetch(url, cacheConfig);

    if (!res.ok) throw new Error("Erreur lors de la récupération des sous-catégories");

    const data: StrapiResponse<SubCategory[]> = await res.json();
    return data.data;
  } catch (error) {
    console.error("Erreur getSubCategories:", error);
    return [];
  }
}

// Récupérer toutes les marques avec leurs catégories et sous-catégories
export async function getBrands(): Promise<Brand[]> {
  try {
    const url = await buildStrapiUrl('/api/brands', {
      'populate[categories]': 'true',
      'populate[subCategories]': 'true'
    });

    const res = await fetch(url, cacheConfig);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ Erreur getBrands:", res.status, errorText);
      throw new Error("Erreur lors de la récupération des marques");
    }

    const data: StrapiResponse<Brand[]> = await res.json();
    return data.data;
  } catch (error) {
    console.error("Erreur getBrands:", error);
    return [];
  }
}

// Récupérer les produits en promotion
export async function getPromoProducts(): Promise<Product[]> {
  try {
    const url = await buildStrapiUrl('/api/products', {
      'filters[isPromo][$eq]': 'true',
      ...buildPopulateParams([
        'images',
        'category',
        'subCategory',
        'brand',
        'engravings'
      ])
    });
    
    const res = await fetch(url, cacheConfig);

    if (!res.ok) throw new Error("Erreur lors de la récupération des produits en promotion");

    const data: StrapiResponse<Product[]> = await res.json();
    return data.data;
  } catch (error) {
    console.error("Erreur getPromoProducts:", error);
    return [];
  }
}
