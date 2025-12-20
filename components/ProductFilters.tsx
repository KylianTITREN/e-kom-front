"use client";

import { Category, SubCategory, Brand, Product } from "@/types";
import { useState, useEffect } from "react";

interface ProductFiltersProps {
  products: Product[]; // Ajouter les produits pour calculer les relations
  categories: Category[];
  subCategories: SubCategory[];
  brands: Brand[];
  selectedCategory: string | null;
  selectedSubCategory: string | null;
  selectedBrands: string[];
  onCategoryChange: (categorySlug: string | null) => void;
  onSubCategoryChange: (subCategorySlug: string | null) => void;
  onBrandToggle: (brandSlug: string) => void;
  onClearFilters: () => void;
}

export default function ProductFilters({
  products,
  categories,
  subCategories,
  brands,
  selectedCategory,
  selectedSubCategory,
  selectedBrands,
  onCategoryChange,
  onSubCategoryChange,
  onBrandToggle,
  onClearFilters,
}: ProductFiltersProps) {
  const [filteredSubCategories, setFilteredSubCategories] = useState<SubCategory[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // États temporaires pour les filtres (draft)
  const [draftCategory, setDraftCategory] = useState<string | null>(selectedCategory);
  const [draftSubCategory, setDraftSubCategory] = useState<string | null>(selectedSubCategory);
  const [draftBrands, setDraftBrands] = useState<string[]>(selectedBrands);

  // Synchroniser les états draft avec les props quand le panneau s'ouvre
  useEffect(() => {
    if (isPanelOpen) {
      setDraftCategory(selectedCategory);
      setDraftSubCategory(selectedSubCategory);
      setDraftBrands(selectedBrands);
    }
  }, [isPanelOpen, selectedCategory, selectedSubCategory, selectedBrands]);

  // Filtrer les sous-catégories basé sur les produits qui ont la catégorie sélectionnée
  useEffect(() => {
    if (draftCategory) {
      // Trouver tous les produits de cette catégorie
      const productsInCategory = products.filter((product) => {
        const cat = product.category as Category | undefined;
        return cat && cat.slug === draftCategory;
      });

      // Extraire les sous-catégories uniques de ces produits
      const subCatMap = new Map<string, SubCategory>();
      productsInCategory.forEach((product) => {
        if (product.subCategory) {
          const subCat = product.subCategory as SubCategory;
          if (!subCatMap.has(subCat.documentId)) {
            subCatMap.set(subCat.documentId, subCat);
          }
        }
      });

      setFilteredSubCategories(Array.from(subCatMap.values()));
    } else {
      setFilteredSubCategories([]);
    }
  }, [draftCategory, products]);

  // Filtrer les marques basé sur les produits qui ont la catégorie/sous-catégorie sélectionnée
  useEffect(() => {
    let relevantProducts = products;

    // Si une sous-catégorie est sélectionnée, filtrer par sous-catégorie
    if (draftSubCategory) {
      relevantProducts = products.filter((product) => {
        const subCat = product.subCategory as SubCategory | undefined;
        return subCat && subCat.slug === draftSubCategory;
      });
    }
    // Sinon, si une catégorie est sélectionnée, filtrer par catégorie
    else if (draftCategory) {
      relevantProducts = products.filter((product) => {
        const cat = product.category as Category | undefined;
        return cat && cat.slug === draftCategory;
      });
    } else {
      // Aucun filtre : ne pas afficher de marques
      setFilteredBrands([]);
      return;
    }

    // Extraire les marques uniques de ces produits
    const brandMap = new Map<string, Brand>();
    relevantProducts.forEach((product) => {
      if (product.brand) {
        const brand = product.brand as Brand;
        if (!brandMap.has(brand.documentId)) {
          brandMap.set(brand.documentId, brand);
        }
      }
    });

    setFilteredBrands(Array.from(brandMap.values()));
  }, [draftCategory, draftSubCategory, products]);

  // Handlers pour les changements draft
  const handleDraftCategoryChange = (categorySlug: string | null) => {
    setDraftCategory(categorySlug);
    setDraftSubCategory(null); // Réinitialiser la sous-catégorie
    setDraftBrands([]); // Réinitialiser les marques
  };

  const handleDraftSubCategoryChange = (subCategorySlug: string | null) => {
    setDraftSubCategory(subCategorySlug);
    setDraftBrands([]); // Réinitialiser les marques
  };

  const handleDraftBrandToggle = (brandSlug: string) => {
    setDraftBrands((prev) =>
      prev.includes(brandSlug)
        ? prev.filter((slug) => slug !== brandSlug)
        : [...prev, brandSlug]
    );
  };

  // Appliquer les filtres
  const applyFilters = () => {
    if (draftCategory !== selectedCategory) {
      onCategoryChange(draftCategory);
    }
    if (draftSubCategory !== selectedSubCategory) {
      onSubCategoryChange(draftSubCategory);
    }
    // Appliquer les marques
    const brandsToAdd = draftBrands.filter(slug => !selectedBrands.includes(slug));
    const brandsToRemove = selectedBrands.filter(slug => !draftBrands.includes(slug));

    brandsToRemove.forEach(slug => onBrandToggle(slug));
    brandsToAdd.forEach(slug => onBrandToggle(slug));

    setIsPanelOpen(false);
  };

  // Réinitialiser les filtres
  const clearDraftFilters = () => {
    setDraftCategory(null);
    setDraftSubCategory(null);
    setDraftBrands([]);
    onClearFilters();
    setIsPanelOpen(false);
  };

  const hasActiveFilters = selectedCategory || selectedSubCategory || selectedBrands.length > 0;

  return (
    <>
      {/* Bouton Filtrer */}
      <button
        onClick={() => setIsPanelOpen(true)}
        className="flex items-center gap-2 px-6 py-3 bg-white border border-accent/20 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
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
            d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
          />
        </svg>
        <span className="font-medium">Filtrer</span>
        {hasActiveFilters && (
          <span className="bg-accent text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
            {(selectedCategory ? 1 : 0) + (selectedSubCategory ? 1 : 0) + selectedBrands.length}
          </span>
        )}
      </button>

      {/* Panneau de filtres (Modal) */}
      {isPanelOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsPanelOpen(false)}
          />

          {/* Panneau */}
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-accent/20">
                <h2 className="text-2xl font-title font-semibold text-primary">Filtres</h2>
                <button
                  onClick={() => setIsPanelOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Fermer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Filtres */}
              <div className="space-y-6">
                {/* Catégories */}
                <div>
                  <h3 className="text-sm font-semibold text-text uppercase tracking-wide mb-3">
                    Catégories
                  </h3>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={!draftCategory}
                        onChange={() => handleDraftCategoryChange(null)}
                        className="w-4 h-4 text-accent focus:ring-accent"
                      />
                      <span className="text-text-secondary hover:text-primary">Toutes</span>
                    </label>
                    {categories.map((category) => (
                      <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          checked={draftCategory === category.slug}
                          onChange={() => handleDraftCategoryChange(category.slug)}
                          className="w-4 h-4 text-accent focus:ring-accent"
                        />
                        <span className="text-text-secondary hover:text-primary">{category.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Sous-catégories */}
                {draftCategory && filteredSubCategories.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-text uppercase tracking-wide mb-3">
                      Sous-catégories
                    </h3>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="subcategory"
                          checked={!draftSubCategory}
                          onChange={() => handleDraftSubCategoryChange(null)}
                          className="w-4 h-4 text-accent focus:ring-accent"
                        />
                        <span className="text-text-secondary hover:text-primary">Toutes</span>
                      </label>
                      {filteredSubCategories.map((subCategory) => (
                        <label key={subCategory.id} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="subcategory"
                            checked={draftSubCategory === subCategory.slug}
                            onChange={() => handleDraftSubCategoryChange(subCategory.slug)}
                            className="w-4 h-4 text-accent focus:ring-accent"
                          />
                          <span className="text-text-secondary hover:text-primary">
                            {subCategory.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Marques - Affichées si une catégorie est sélectionnée */}
                {draftCategory && filteredBrands.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-text uppercase tracking-wide mb-3">
                      Marques
                      {draftSubCategory && (
                        <span className="text-xs font-normal text-text-muted ml-2">
                          (pour cette sous-catégorie)
                        </span>
                      )}
                      {!draftSubCategory && filteredSubCategories.length > 0 && (
                        <span className="text-xs font-normal text-text-muted ml-2">
                          (pour cette catégorie)
                        </span>
                      )}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {filteredBrands.map((brand) => (
                        <button
                          key={brand.id}
                          onClick={() => handleDraftBrandToggle(brand.slug)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            draftBrands.includes(brand.slug)
                              ? "bg-accent text-white"
                              : "bg-gray-100 text-text-secondary hover:bg-gray-200"
                          }`}
                        >
                          {brand.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-8 pt-6 border-t border-accent/20 space-y-3">
                {(draftCategory || draftSubCategory || draftBrands.length > 0) && (
                  <button
                    onClick={clearDraftFilters}
                    className="w-full px-4 py-3 bg-gray-100 text-text-secondary rounded-md hover:bg-gray-200 transition-colors font-medium"
                  >
                    Réinitialiser les filtres
                  </button>
                )}
                <button
                  onClick={applyFilters}
                  className="w-full px-4 py-3 bg-accent text-white rounded-md hover:bg-accent-dark transition-colors font-medium"
                >
                  Appliquer les filtres
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
