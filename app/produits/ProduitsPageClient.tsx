"use client";

import { useState, useEffect } from "react";
import { Product, Category, SubCategory, Brand } from "@/types";
import { richTextToString } from "@/lib/api";
import ProductFilters from "@/components/ProductFilters";
import ProductGrid from "@/components/ProductGrid";
import { useSearchParams, useRouter } from "next/navigation";

interface ProduitsPageClientProps {
  initialProducts: Product[];
  categories: Category[];
  subCategories: SubCategory[];
  brands: Brand[];
  promoProducts: Product[];
}

export default function ProduitsPageClient({
  initialProducts,
  categories,
  subCategories,
  brands,
  promoProducts,
}: ProduitsPageClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryFromUrl = searchParams.get("category");
  const searchQuery = searchParams.get("search");

  // États des filtres
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryFromUrl);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [showPromotionsOnly, setShowPromotionsOnly] = useState(false);
  const [showLimitedEditionOnly, setShowLimitedEditionOnly] = useState(false);
  const [showEndOfSeriesOnly, setShowEndOfSeriesOnly] = useState(false);
  const [specialFiltersOpen, setSpecialFiltersOpen] = useState(false);
  
  // État local pour la recherche
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery || "");

  // États pour le tri et la pagination
  const [sortBy, setSortBy] = useState<"name-asc" | "name-desc" | "price-asc" | "price-desc">("name-asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts);
  const itemsPerPage = 25;

  // Mettre à jour la catégorie sélectionnée si l'URL change
  useEffect(() => {
    setSelectedCategory(categoryFromUrl);
    setSelectedSubCategory(null);
    setSelectedBrands([]);
    setShowPromotionsOnly(false);
    setShowLimitedEditionOnly(false);
    setShowEndOfSeriesOnly(false);
    setCurrentPage(1);
  }, [categoryFromUrl]);

  // Appliquer les filtres
  useEffect(() => {
    let filtered = [...initialProducts];

    // Filtrer par recherche
    if (searchQuery) {
      const keywords = searchQuery.toLowerCase().split(" ").filter(k => k.length > 0);
      filtered = filtered.filter((product) => {
        const searchableText = [
          product.name || "",
          product.category?.name || "",
          product.subCategory?.name || "",
          product.brand?.name || "",
          typeof product.description === "string"
            ? product.description
            : richTextToString(product.description)
        ].join(" ").toLowerCase();

        return keywords.every(keyword => searchableText.includes(keyword));
      });
    }

    // Filtrer par catégorie
    if (selectedCategory) {
      filtered = filtered.filter((product) => product.category?.slug === selectedCategory);
    }

    // Filtrer par sous-catégorie
    if (selectedSubCategory) {
      filtered = filtered.filter((product) => product.subCategory?.slug === selectedSubCategory);
    }

    // Filtrer par marques (si au moins une marque est sélectionnée)
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((product) =>
        product.brand && selectedBrands.includes(product.brand.slug)
      );
    }

    // Filtrer par promotions
    if (showPromotionsOnly) {
      filtered = filtered.filter((product) => product.isPromo === true);
    }

    // Filtrer par édition limitée
    if (showLimitedEditionOnly) {
      filtered = filtered.filter((product) => product.limitedEdition === true);
    }

    // Filtrer par fin de série
    if (showEndOfSeriesOnly) {
      filtered = filtered.filter((product) => product.endOfSeries === true);
    }

    // Trier les produits
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name, "fr");
        case "name-desc":
          return b.name.localeCompare(a.name, "fr");
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [searchQuery, initialProducts, selectedCategory, selectedSubCategory, selectedBrands, showPromotionsOnly, showLimitedEditionOnly, showEndOfSeriesOnly, sortBy]);

  // Handlers pour les filtres
  const handleCategoryChange = (categorySlug: string | null) => {
    setSelectedCategory(categorySlug);
    setSelectedSubCategory(null);
    setSelectedBrands([]);
  };

  const handleSubCategoryChange = (subCategorySlug: string | null) => {
    setSelectedSubCategory(subCategorySlug);
    setSelectedBrands([]);
  };

  const handleBrandToggle = (brandSlug: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brandSlug)
        ? prev.filter((slug) => slug !== brandSlug)
        : [...prev, brandSlug]
    );
  };

  const handleClearFilters = () => {
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setSelectedBrands([]);
    setShowPromotionsOnly(false);
  };

  // Fonction pour gérer la recherche
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = localSearchQuery.trim();
    if (trimmedQuery) {
      router.push(`/produits?search=${encodeURIComponent(trimmedQuery)}`);
    } else {
      router.push('/produits');
    }
  };

  const handleClearSearch = () => {
    setLocalSearchQuery("");
    router.push('/produits');
  };

  // Fonction pour changer de page avec scroll vers le haut
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculer la pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <div>
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-title font-semibold text-primary mb-4 tracking-wide">
          Notre Boutique
        </h1>
        <p className="text-text-secondary font-paragraph text-lg max-w-2xl mx-auto leading-relaxed">
          Découvrez tous nos produits d&apos;exception
        </p>

        {searchQuery && (
          <p className="mt-4 text-text-secondary">
            <span className="font-medium">{filteredProducts.length}</span> résultat{filteredProducts.length > 1 ? "s" : ""} pour &quot;{searchQuery}&quot;
          </p>
        )}
      </div>

      {/* Section Tous les produits avec filtres */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-title font-semibold text-primary">
              {selectedCategory || selectedSubCategory || selectedBrands.length > 0 || showPromotionsOnly || showLimitedEditionOnly || showEndOfSeriesOnly || searchQuery
                ? "Produits filtrés"
                : "Tous nos produits"}
            </h2>
            {searchQuery && (
              <span className="px-3 py-1 bg-accent/10 text-accent text-sm rounded-full border border-accent/20">
                Recherche : &ldquo;{searchQuery}&rdquo;
              </span>
            )}
          </div>

          {/* Sélecteur de tri */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm text-text-secondary font-medium">
              Trier par :
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-4 py-2 border border-accent/20 rounded-lg bg-white text-text focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
            >
              <option value="name-asc">Nom (A-Z)</option>
              <option value="name-desc">Nom (Z-A)</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 mb-4">
          {/* Champ de recherche */}
          <form onSubmit={handleSearch} className="flex-1 md:flex-initial">
            <div className="relative">
              <input
                type="text"
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                placeholder="Rechercher un produit..."
                className="w-full md:w-80 px-4 py-3 pr-24 border border-accent/20 rounded-lg bg-white text-text focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
              />
              {localSearchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-14 top-1/2 -translate-y-1/2 text-text-secondary hover:text-accent transition-colors"
                  aria-label="Effacer la recherche"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-accent hover:text-accent-dark transition-colors"
                aria-label="Rechercher"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </button>
            </div>
          </form>

          <ProductFilters
            products={initialProducts}
            categories={categories}
            subCategories={subCategories}
            brands={brands}
            selectedCategory={selectedCategory}
            selectedSubCategory={selectedSubCategory}
            selectedBrands={selectedBrands}
            onCategoryChange={handleCategoryChange}
            onSubCategoryChange={handleSubCategoryChange}
            onBrandToggle={handleBrandToggle}
            onClearFilters={handleClearFilters}
          />

          {/* Desktop: Boutons séparés */}
          <div className="hidden md:flex items-center gap-4">
            {promoProducts.length > 0 && (
              <button
                onClick={() => setShowPromotionsOnly(!showPromotionsOnly)}
                className={`flex items-center gap-2 px-6 py-3 border rounded-lg transition-colors shadow-sm ${
                  showPromotionsOnly
                    ? "bg-accent text-white border-accent"
                    : "bg-white text-text-secondary border-accent/20 hover:bg-gray-50"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 6h.008v.008H6V6Z"
                  />
                </svg>
                <span className="font-medium">Promotions</span>
              </button>
            )}

            {initialProducts.some(p => p.limitedEdition) && (
              <button
                onClick={() => setShowLimitedEditionOnly(!showLimitedEditionOnly)}
                className={`flex items-center gap-2 px-6 py-3 border rounded-lg transition-colors shadow-sm ${
                  showLimitedEditionOnly
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-text-secondary border-accent/20 hover:bg-gray-50"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                  />
                </svg>
                <span className="font-medium">Édition Limitée</span>
              </button>
            )}

            {initialProducts.some(p => p.endOfSeries) && (
              <button
                onClick={() => setShowEndOfSeriesOnly(!showEndOfSeriesOnly)}
                className={`flex items-center gap-2 px-6 py-3 border rounded-lg transition-colors shadow-sm ${
                  showEndOfSeriesOnly
                    ? "bg-accent text-white border-accent"
                    : "bg-white text-text-secondary border-accent/20 hover:bg-gray-50"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                <span className="font-medium">Fin de Série</span>
              </button>
            )}
          </div>

          {/* Mobile: Menu déroulant */}
          {(promoProducts.length > 0 || initialProducts.some(p => p.limitedEdition) || initialProducts.some(p => p.endOfSeries)) && (
            <div className="relative md:hidden">
              <button
                onClick={() => setSpecialFiltersOpen(!specialFiltersOpen)}
                className={`w-full flex items-center justify-between gap-2 px-6 py-3 border rounded-lg transition-colors shadow-sm ${
                  showPromotionsOnly || showLimitedEditionOnly || showEndOfSeriesOnly
                    ? "bg-accent text-white border-accent"
                    : "bg-white text-text-secondary border-accent/20"
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 6h.008v.008H6V6Z"
                    />
                  </svg>
                  <span className="font-medium">Filtres spéciaux</span>
                  {(showPromotionsOnly || showLimitedEditionOnly || showEndOfSeriesOnly) && (
                    <span className="bg-white text-accent text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                      {(showPromotionsOnly ? 1 : 0) + (showLimitedEditionOnly ? 1 : 0) + (showEndOfSeriesOnly ? 1 : 0)}
                    </span>
                  )}
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className={`w-5 h-5 transition-transform ${specialFiltersOpen ? 'rotate-180' : ''}`}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              {specialFiltersOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-accent/20 rounded-lg shadow-lg z-50 overflow-hidden">
                  {promoProducts.length > 0 && (
                    <button
                      onClick={() => {
                        setShowPromotionsOnly(!showPromotionsOnly);
                        setSpecialFiltersOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                        showPromotionsOnly
                          ? "bg-accent text-white"
                          : "text-text-secondary hover:bg-gray-50"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 6h.008v.008H6V6Z"
                        />
                      </svg>
                      <span className="font-medium">Promotions</span>
                    </button>
                  )}

                  {initialProducts.some(p => p.limitedEdition) && (
                    <button
                      onClick={() => {
                        setShowLimitedEditionOnly(!showLimitedEditionOnly);
                        setSpecialFiltersOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                        showLimitedEditionOnly
                          ? "bg-primary text-white"
                          : "text-text-secondary hover:bg-gray-50"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                        />
                      </svg>
                      <span className="font-medium">Édition Limitée</span>
                    </button>
                  )}

                  {initialProducts.some(p => p.endOfSeries) && (
                    <button
                      onClick={() => {
                        setShowEndOfSeriesOnly(!showEndOfSeriesOnly);
                        setSpecialFiltersOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                        showEndOfSeriesOnly
                          ? "bg-accent text-white"
                          : "text-text-secondary hover:bg-gray-50"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg>
                      <span className="font-medium">Fin de Série</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <ProductGrid products={paginatedProducts} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-2">
          <button
            onClick={() => {
              const newPage = Math.max(currentPage - 1, 1);
              if (newPage !== currentPage) handlePageChange(newPage);
            }}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-accent/20 rounded-lg bg-white text-text hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Précédent
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === page
                    ? "bg-accent text-white"
                    : "bg-white border border-accent/20 text-text hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              const newPage = Math.min(currentPage + 1, totalPages);
              if (newPage !== currentPage) handlePageChange(newPage);
            }}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-accent/20 rounded-lg bg-white text-text hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Suivant
          </button>
        </div>
      )}

      {/* Informations sur la pagination */}
      <div className="mt-4 text-center text-sm text-text-secondary">
        Affichage de {startIndex + 1} à {Math.min(endIndex, filteredProducts.length)} sur {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}
      </div>
    </div>
  );
}
