import { useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { useToast } from "@/hooks/use-toast";
import { Product, useShop } from "@/lib/store/shop-provider";

interface ProductListProps {
  products: Product[];
}

export function ProductList({ products }: ProductListProps) {
  const { addToCart } = useShop();
  const { toast } = useToast();
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  const handleQuantityChange = (id: number, value: number) => {
    setQuantities((prev) => ({ ...prev, [id]: value }));
  };

  const handleAddToCart = (product: Product) => {
    const quantity = quantities[product.id] || 1;
    if (quantity > product.stock) {
      toast({
        title: "Not enough stock",
        description: `Only ${product.stock} ${product.name}(s) available.`,
        variant: "destructive",
      });
      return;
    }
    addToCart(product, quantity);
    setQuantities((prev) => ({ ...prev, [product.id]: 0 }));
    toast({
      title: "Added to cart",
      description: `${quantity} ${product.name}(s) added to your cart.`,
    });
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id}>
          <CardHeader>
            <CardTitle>{product.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
            <p className="text-sm text-gray-500">Available: {product.stock}</p>
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <Input
              type="number"
              min="0"
              max={product.stock}
              value={quantities[product.id] || 0}
              onChange={(e) =>
                handleQuantityChange(
                  product.id,
                  Number.parseInt(e.target.value)
                )
              }
              className="w-20"
            />
            <Button
              onClick={() => handleAddToCart(product)}
              disabled={product.stock === 0}
            >
              Add to Cart
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
