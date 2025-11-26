import { getNews } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export default async function ActualitesPage() {
  const news = await getNews();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Actualités</h1>

      {news.length === 0 ? (
        <p className="text-gray-600">Aucune actualité pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((article) => {
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
                <div className="p-6">
                  <time className="text-sm text-gray-500">
                    {new Date(article.publishedDate).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <h2 className="text-2xl font-semibold mt-2 mb-3">
                    {article.title}
                  </h2>
                  <p className="text-gray-600 line-clamp-3">{article.excerpt}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
