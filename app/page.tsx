import Link from "next/link";
import { getFeaturedProducts, getNews, getHomepageContent } from "@/lib/api";
import ProductGrid from "@/components/ProductGrid";
import Button from "@/components/Button";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { Metadata } from "next";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getHomepageContent();

  if (!page) {
    return {
      title: `Page introuvable | ${process.env.SEO_SITE_NAME}`,
      description: process.env.SEO_LEGAL_GENERIC_DESCRIPTION,
      keywords: process.env.SEO_LEGAL_GENERIC_KEYWORDS,
    };
  }

  return {
    title: page.seoTitle || `${page.heroTitle} – ${process.env.SEO_SITE_NAME}`,
    description: page.seoDescription || process.env.SEO_LEGAL_DESCRIPTION,
    keywords: page.seoKeywords || process.env.SEO_LEGAL_KEYWORDS,
  };
}

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
  welcomeText: homepageContent?.welcomeText || "e-kom est une plateforme e-commerce en marque blanche, conçue pour s'adapter à votre business. Simple, rapide et efficace.",
    featuredSectionTitle: homepageContent?.featuredSectionTitle || "Produits phares",
    newsSectionTitle: homepageContent?.newsSectionTitle || "Dernières actualités",
  };

  return (
    <div className="space-y-16">
      {/* Bannière Hero */}
      <section className="bg-primary text-background-light border border-accent/20 p-16 text-center">
  <h1 className="text-4xl md:text-5xl font-title font-semibold mb-5 tracking-wide">
          {content.heroTitle}
        </h1>
  <p className="text-xl font-paragraph mb-10 text-background max-w-2xl mx-auto leading-relaxed">
          {content.heroSubtitle}
        </p>
        <Link href="/produits">
          <Button variant="secondary">
            {content.heroButtonText}
          </Button>
        </Link>
      </section>

      {/* Présentation */}
      <section className="text-left max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-title font-semibold text-primary mb-6 tracking-wide">
          {content.welcomeTitle}
        </h2>
        <div className="text-text-secondary text-lg leading-relaxed prose prose-lg prose-headings:font-title prose-headings:text-primary prose-p:font-paragraph">
          <ReactMarkdown>{typeof content.welcomeText === 'string' ? content.welcomeText : ''}</ReactMarkdown>
        </div>
      </section>

      {/* Produits phares */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-semibold text-primary tracking-wide">
            {content.featuredSectionTitle}
          </h2>
          <Link href="/produits" className="text-accent hover:text-accent-dark transition-colors font-medium text-sm uppercase tracking-wide">
            Voir tout →
          </Link>
        </div>
        <ProductGrid products={featuredProducts} />
      </section>

      {/* Actualités */}
      {latestNews.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-semibold text-primary tracking-wide">
              {content.newsSectionTitle}
            </h2>
            <Link href="/actualites" className="text-accent hover:text-accent-dark transition-colors font-medium text-sm uppercase tracking-wide">
              Voir toutes les actualités →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestNews.map((article) => {
              const imageUrl = article.image?.url
                ? `${STRAPI_URL}${article.image.url}`
                : "/placeholder.jpg";

              return (
                <Link
                  key={article.id}
                  href={`/actualites/${article.slug}`}
                  className="group block bg-background-card border border-accent/10 overflow-hidden hover:border-accent/30 transition-all duration-300"
                >
                  <div className="relative h-56 w-full bg-background overflow-hidden">
                    {article.image ? (
                      <Image
                        src={imageUrl}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-beige/60">
                        <svg width="48" height="48" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="8" y="16" width="48" height="32" rx="6" fill="#C7B299" stroke="#8B6F4E" strokeWidth="2"/>
                          <path d="M16 40L24 32L32 40L40 28L48 40" stroke="#8B6F4E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="20" cy="24" r="3" fill="#8B6F4E"/>
                        </svg>
                        <span className="mt-2 text-brown text-xs font-medium">Aucune image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <time className="text-xs text-text-muted uppercase tracking-wide font-medium">
                      {new Date(article.publishedDate).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                    <h3 className="text-xl font-medium text-primary group-hover:text-accent transition-colors mt-3 mb-3 leading-tight">
                      {article.title}
                    </h3>
                    <p className="text-text-secondary text-sm line-clamp-2 leading-relaxed">
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
      <section className="bg-accent/5 border border-accent/20 p-12 text-center">
        <h2 className="text-2xl font-semibold text-primary mb-4 tracking-wide">
          Des questions ? Contactez-nous
        </h2>
        <p className="text-text-secondary mb-8 max-w-xl mx-auto leading-relaxed">
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
