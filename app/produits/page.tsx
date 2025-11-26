import { getProducts } from "@/lib/api";
import ProductGrid from "@/components/ProductGrid";

export default async function ProduitsPage() {
  const products = await getProducts();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Notre Boutique
        </h1>
        <p className="text-gray-600 text-lg">
          Découvrez tous nos produits
        </p>
      </div>
      
      <ProductGrid products={products} />
    </div>
  );
}
