import { getNewsBySlug } from "@/lib/api";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { Metadata } from "next";

export async function generateMetadata({ params }: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);

  if (!article) {
    return {
      title: `Article introuvable | ${process.env.SEO_SITE_NAME}`,
      description: process.env.SEO_NEWS_DESCRIPTION,
      keywords: process.env.SEO_NEWS_KEYWORDS,
    };
  }

  const baseTitle = process.env.SEO_SITE_NAME;

  const title = `${article.title} – ${baseTitle}`;

  // Description dynamique basée sur l'extrait ou le contenu
  const description = article.excerpt
    ? article.excerpt.slice(0, 160)
    : (typeof article.content === 'string'
        ? article.content.slice(0, 160)
        : process.env.SEO_NEWS_DESCRIPTION);

  const keywords = [
    article.title
  ]
    .filter(Boolean)
    .join(", ") + ", " + process.env.SEO_NEWS_KEYWORDS;

  // Image pour Open Graph
  const imageUrl = article.image?.url
    ? `${article.image.url}`
    : undefined;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: article.startDate,
      images: imageUrl ? [{ url: imageUrl, alt: article.title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);

  if (!article) {
    notFound();
  }

  const imageUrl = article.image?.url
    ? `${article.image.url}`
    : "/placeholder.jpg";

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/actualites"
        className="text-accent hover:text-accent-dark transition-colors mb-8 inline-block text-sm uppercase tracking-wide"
      >
        ← Retour aux actualités
      </Link>

      <article>
  <h1 className="text-4xl font-title font-semibold text-primary mb-4 tracking-wide">{article.title}</h1>
        
        {article.startDate && (
          <time className="text-text-muted text-sm uppercase tracking-wide mb-8 block">
            {new Date(article.startDate).toLocaleDateString("fr-FR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        )}

        {article.image && (
          <div className="relative h-96 w-full mb-10 overflow-hidden border border-accent/10">
            <Image
              src={imageUrl}
              alt={article.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="prose max-w-none">
          {article.excerpt && (
            <div className="text-xl text-text-secondary mb-8 leading-relaxed font-light">
              {article.excerpt}
            </div>
          )}
          {article.content && (
            <div className="mt-8">
              <ReactMarkdown>
                {typeof article.content === 'string' ? article.content : ''}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
