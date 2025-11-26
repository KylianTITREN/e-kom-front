import { getLegalPageBySlug, richTextToString } from "@/lib/api";
import { notFound } from "next/navigation";

export default async function LegalPage({
  params,
}: {
  params: { slug: string };
}) {
  const page = await getLegalPageBySlug(params.slug);

  if (!page) {
    notFound();
  }

  const content = richTextToString(page.content);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">{page.title}</h1>
      <div className="prose prose-lg max-w-none">
        <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
          {content}
        </div>
      </div>
    </div>
  );
}
