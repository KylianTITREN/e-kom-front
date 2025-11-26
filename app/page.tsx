import Link from "next/link";
import { getFeaturedProducts, getNews, getHomepageContent, richTextToString } from "@/lib/api";
import ProductGrid from "@/components/ProductGrid";
import Button from "@/components/Button";
import Image from "next/image";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();
  const latestNews = await getNews(3); // Récupérer les 3 dernières actualités
  const homepageContent = await getHomepageContent();

  // Valeurs par défaut si pas de contenu
  const content = {
    heroTitle: homepageContent?.heroTitle || "Bienvenue sur e-kom",
    heroSubtitle: homepageContent?.heroSubtitle || "Votre boutique en ligne personnalisable pour tous vos besoins",
    heroButtonText: homepageContent?.heroButtonText || "Découvrir la boutique",
    welcomeTitle: homepageContent?.welcomeTitle || "Une solution e-commerce clé en main",
    welcomeText: homepageContent?.welcomeText 
      ? richTextToString(homepageContent.welcomeText)
      : "e-kom est une plateforme e-commerce en marque blanche, conçue pour s'adapter à votre business. Simple, rapide et efficace.",
    featuredSectionTitle: homepageContent?.featuredSectionTitle || "Produits phares",
    newsSectionTitle: homepageContent?.newsSectionTitle || "Dernières actualités",
  };

  return (
    <div className="space-y-12">
      {/* Bannière Hero */}
      <section className="bg-primary text-white rounded-xl p-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {content.heroTitle}
        </h1>
        <p className="text-xl mb-8 text-gray-200">
          {content.heroSubtitle}
        </p>
        <Link href="/produits">
          <Button variant="secondary">
            {content.heroButtonText}
          </Button>
        </Link>
      </section>

      {/* Présentation */}
      <section className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          {content.welcomeTitle}
        </h2>
        <p className="text-gray-600 text-lg whitespace-pre-line">
          {content.welcomeText}
        </p>
      </section>

      {/* Produits phares */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            {content.featuredSectionTitle}
          </h2>
          <Link href="/produits" className="text-primary hover:underline font-medium">
            Voir tout →
          </Link>
        </div>
        <ProductGrid products={featuredProducts} />
      </section>

      {/* Actualités */}
      {latestNews.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-800">
              {content.newsSectionTitle}
            </h2>
            <Link href="/actualites" className="text-primary hover:underline font-medium">
              Voir toutes les actualités →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestNews.map((article) => {
              const imageUrl = article.image?.url
                ? `${STRAPI_URL}${article.image.url}`
                : "/placeholder.jpg";

              return (
                <Link
                  key={article.id}
                  href={`/actualites/${article.slug}`}
                  className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={imageUrl}
                      alt={article.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <time className="text-sm text-gray-500">
                      {new Date(article.publishedDate).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                    <h3 className="text-xl font-semibold mt-2 mb-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {article.excerpt}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="bg-gray-100 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Des questions ? Contactez-nous
        </h2>
        <p className="text-gray-600 mb-6">
          Notre équipe est là pour vous aider à trouver ce dont vous avez besoin
        </p>
        <Link href="/contact">
          <Button>
            Nous contacter
          </Button>
        </Link>
      </section>
    </div>
  );
}
