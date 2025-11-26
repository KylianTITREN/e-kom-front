import { getNewsBySlug } from "@/lib/api";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

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
          <div className="mt-6 prose prose-lg max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1 className="text-3xl font-bold mb-6 mt-8">{children}</h1>,
                h2: ({ children }) => <h2 className="text-2xl font-bold mb-4 mt-6">{children}</h2>,
                h3: ({ children }) => <h3 className="text-xl font-bold mb-3 mt-5">{children}</h3>,
                p: ({ children }) => <p className="mb-4 text-gray-800 leading-relaxed">{children}</p>,
                ul: ({ children }) => <ul className="list-disc list-inside mb-4 ml-4">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside mb-4 ml-4">{children}</ol>,
                li: ({ children }) => <li className="mb-2">{children}</li>,
                strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                em: ({ children }) => <em className="italic">{children}</em>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-gray-700">
                    {children}
                  </blockquote>
                ),
                code: ({ children }) => (
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm">{children}</code>
                ),
                pre: ({ children }) => (
                  <pre className="bg-gray-100 p-4 rounded-lg mb-4 overflow-x-auto">{children}</pre>
                ),
              }}
            >
              {typeof article.content === 'string' ? article.content : ''}
            </ReactMarkdown>
          </div>
        </div>
      </article>
    </div>
  );
}
