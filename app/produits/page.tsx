import { getProducts } from "@/lib/api";
import ProductGrid from "@/components/ProductGrid";

export default async function ProduitsPage() {
  const products = await getProducts();

  return (
    <div>
      <div className="mb-12 text-center">
  <h1 className="text-4xl font-title font-semibold text-primary mb-4 tracking-wide">
          Notre Boutique
        </h1>
  <p className="text-text-secondary font-paragraph text-lg max-w-2xl mx-auto leading-relaxed">
          Découvrez tous nos produits d&apos;exception
        </p>
      </div>
      
      <ProductGrid products={products} />
    </div>
  );
}
