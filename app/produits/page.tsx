"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getProducts } from "@/lib/api";
import ProductGrid from "@/components/ProductGrid";
import { Product } from "@/types";
import { richTextToString } from "@/lib/api";

export default function ProduitsPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      const data = await getProducts();
      setProducts(data);
      setIsLoading(false);
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredProducts(products);
      return;
    }

    const keywords = searchQuery.toLowerCase().split(" ").filter(k => k.length > 0);

    const filtered = products.filter((product) => {
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

    setFilteredProducts(filtered);
  }, [searchQuery, products]);

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

      {isLoading ? (
        <div className="text-center py-16">
          <p className="text-text-secondary">Chargement des produits...</p>
        </div>
      ) : (
        <ProductGrid products={filteredProducts} />
      )}
    </div>
  );
}
