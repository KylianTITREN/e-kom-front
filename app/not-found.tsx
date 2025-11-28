import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Page non trouvée
      </h2>
      <p className="text-gray-600 mb-8">
        Désolé, la page que vous recherchez n&apos;existe pas.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-all"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
