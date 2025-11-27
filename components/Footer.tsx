import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-background-light mt-auto border-t border-accent/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* À propos */}
          <div>
            <h3 className="font-title font-semibold text-lg mb-5 tracking-wide">e-kom</h3>
            <p className="font-paragraph text-sm text-background leading-relaxed">
              Votre boutique en ligne de confiance pour des produits d'exception
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-sans font-semibold text-sm mb-5 tracking-wide uppercase text-accent">Navigation</h3>
            <ul className="space-y-3 text-sm font-sans">
              <li>
                <Link href="/" className="hover:text-accent transition-colors text-background">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/produits" className="hover:text-accent transition-colors text-background">
                  Nos produits
                </Link>
              </li>
              <li>
                <Link href="/actualites" className="hover:text-accent transition-colors text-background">
                  Actualités
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-accent transition-colors text-background">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Service client */}
          <div>
            <h3 className="font-semibold text-sm mb-5 tracking-wide uppercase text-accent">Service client</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/legal/conditions-generales-de-vente" className="hover:text-accent transition-colors text-background">
                  CGV
                </Link>
              </li>
              <li>
                <Link href="/legal/mentions-legales" className="hover:text-accent transition-colors text-background">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link href="/legal/politique-de-confidentialites" className="hover:text-accent transition-colors text-background">
                  Confidentialité
                </Link>
              </li>
              <li>
                <Link href="/legal/politique-des-cookies" className="hover:text-accent transition-colors text-background">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-sm mb-5 tracking-wide uppercase text-accent">Contact</h3>
            <div className="space-y-3 text-sm text-background">
              <p>Email : contact@e-kom.fr</p>
              <p>Tél : +33 1 23 45 67 89</p>
            </div>
          </div>
        </div>

        <div className="border-t border-accent/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-background">
              &copy; {currentYear} e-kom. Tous droits réservés.
            </p>
            <div className="flex gap-6">
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
