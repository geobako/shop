import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Badge } from "./ui/badge";
import { useShop } from "@/lib/store/shop-provider";

export function Header() {
  const { totalItems } = useShop();

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gray-800">
          Simpler Shop
        </Link>
        <Link to="/cart" className="text-gray-600 hover:text-gray-800 relative">
          <ShoppingCart className="h-6 w-6" />
          {totalItems > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-2"
            >
              {totalItems}
            </Badge>
          )}
        </Link>
      </div>
    </header>
  );
}
