import { getNewsBySlug } from "@/lib/api";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { Metadata } from "next";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

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

  const keywords = [
    article.title
  ]
    .filter(Boolean)
    .join(", ") + ", " + process.env.SEO_NEWS_KEYWORDS;

  return {
    title,
    description: process.env.SEO_NEWS_DESCRIPTION,
    keywords,
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
    ? `${STRAPI_URL}${article.image.url}`
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
        
        <time className="text-text-muted text-sm uppercase tracking-wide mb-8 block">
          {new Date(article.publishedDate).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>

        <div className="relative h-96 w-full mb-10 overflow-hidden border border-accent/10">
          {article.image ? (
            <Image
              src={imageUrl}
              alt={article.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-beige/60">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="8" y="16" width="48" height="32" rx="6" fill="#C7B299" stroke="#8B6F4E" strokeWidth="2"/>
                <path d="M16 40L24 32L32 40L40 28L48 40" stroke="#8B6F4E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="20" cy="24" r="3" fill="#8B6F4E"/>
              </svg>
              <span className="mt-2 text-brown text-xs font-medium">Aucune image</span>
            </div>
          )}
        </div>

        <div className="prose max-w-none">
          <div className="text-xl text-text-secondary mb-8 leading-relaxed font-light">
            {article.excerpt}
          </div>
          <div className="mt-8">
            <ReactMarkdown>
              {typeof article.content === 'string' ? article.content : ''}
            </ReactMarkdown>
          </div>
        </div>
      </article>
    </div>
  );
}
