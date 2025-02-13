import { ProductList } from "@/components/product-list";
import { useShop } from "@/lib/store/shop-provider";

export default function Home() {
  const { products } = useShop();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>
      <ProductList products={products} />
    </div>
  );
}
