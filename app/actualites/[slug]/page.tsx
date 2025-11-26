import { getNewsBySlug, richTextToString } from "@/lib/api";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export default async function NewsDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const article = await getNewsBySlug(params.slug);

  if (!article) {
    notFound();
  }

  const imageUrl = article.image?.url
    ? `${STRAPI_URL}${article.image.url}`
    : "/placeholder.jpg";

  const content = richTextToString(article.content);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link
        href="/actualites"
        className="text-primary hover:underline mb-4 inline-block"
      >
        ← Retour aux actualités
      </Link>

      <article>
        <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
        
        <time className="text-gray-500 mb-6 block">
          {new Date(article.publishedDate).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>

        {article.image && (
          <div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden">
            <Image
              src={imageUrl}
              alt={article.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="prose prose-lg max-w-none">
          <div className="text-xl text-gray-700 mb-6 font-medium">
            {article.excerpt}
          </div>
          <div className="whitespace-pre-wrap text-gray-800">{content}</div>
        </div>
      </article>
    </div>
  );
}
