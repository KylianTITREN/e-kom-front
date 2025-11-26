import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* À propos */}
          <div>
            <h3 className="font-bold text-lg mb-4">e-kom</h3>
            <p className="text-sm text-gray-200">
              Votre boutique en ligne de confiance
            </p>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="font-bold text-lg mb-4">Liens rapides</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/produits" className="hover:underline text-gray-200">
                  Nos produits
                </Link>
              </li>
              <li>
                <Link href="/actualites" className="hover:underline text-gray-200">
                  Actualités
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline text-gray-200">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Informations légales */}
          <div>
            <h3 className="font-bold text-lg mb-4">Informations légales</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/legal/cgv" className="hover:underline text-gray-200">
                  Conditions générales de vente
                </Link>
              </li>
              <li>
                <Link href="/legal/mentions-legales" className="hover:underline text-gray-200">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link href="/legal/politique-confidentialite" className="hover:underline text-gray-200">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="/legal/cookies" className="hover:underline text-gray-200">
                  Politique des cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-6 text-center">
          <p className="text-sm text-gray-200">
            &copy; {currentYear} e-kom. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
