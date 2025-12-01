import { getNews } from "@/lib/api";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: process.env.SEO_NEWS_LIST_TITLE,
  description: process.env.SEO_NEWS_LIST_DESCRIPTION,
  keywords: process.env.SEO_NEWS_LIST_KEYWORDS
};

export default async function ActualitesPage() {
  const news = await getNews();

  return (
    <div>
      <div className="mb-12 text-center">
  <h1 className="text-4xl font-title font-semibold text-primary mb-4 tracking-wide">
          Actualités
        </h1>
  <p className="text-text-secondary font-paragraph text-lg max-w-2xl mx-auto leading-relaxed">
          Découvrez nos dernières actualités et nouveautés
        </p>
      </div>

      {news.length === 0 ? (
        <p className="text-text-secondary text-center">Aucune actualité pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((article) => {
            const imageUrl = article.image?.url
              ? `${article.image.url}`
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
                  <h2 className="text-xl font-medium text-primary group-hover:text-accent transition-colors mt-3 mb-3 leading-tight">
                    {article.title}
                  </h2>
                  <p className="text-text-secondary text-sm line-clamp-3 leading-relaxed">{article.excerpt}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
