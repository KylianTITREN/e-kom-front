import { getLegalPageBySlug } from "@/lib/api";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default async function LegalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getLegalPageBySlug(slug);

  if (!page) {
    notFound();
  }

  const content = typeof page.content === "string" 
    ? page.content 
    : JSON.stringify(page.content);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">{page.title}</h1>
      <article className="text-gray-700 leading-relaxed space-y-4">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            h2: ({...props}) => <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4" {...props} />,
            h3: ({...props}) => <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3" {...props} />,
            p: ({...props}) => <p className="mb-4 text-gray-700 leading-7" {...props} />,
            a: ({...props}) => <a className="text-primary underline hover:text-primary/80" {...props} />,
            strong: ({...props}) => <strong className="font-semibold text-gray-900" {...props} />,
            ul: ({...props}) => <ul className="list-disc list-inside space-y-2 mb-4 ml-4" {...props} />,
            ol: ({...props}) => <ol className="list-decimal list-inside space-y-2 mb-4 ml-4" {...props} />,
            li: ({...props}) => <li className="text-gray-700" {...props} />,
          }}
        >
          {content}
        </ReactMarkdown>
      </article>
    </div>
  );
}
