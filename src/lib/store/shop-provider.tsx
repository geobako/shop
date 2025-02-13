"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  createCart,
  fetchCoupons,
  fetchProducts,
  placeOrder,
} from "../api/shop";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { bankersRound } from "../utils";

export type CouponType = "FLAT" | "PERCENTAGE" | "BOGO";

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

export interface CartItem extends Product {
  cartQuantity: number;
}

export interface Coupon {
  code: string;
  type: CouponType;
  amount?: number;
}

interface ShopContextType {
  products: Product[];
  cart: CartItem[];
  coupons: Coupon[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  updateCartItemQuantity: (id: number, quantity: number) => void;
  updateProductQuantity: (id: number, quantityChange: number) => void;
  totalItems: number;
  subtotal: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => void;
  removeCoupon: () => void;
  total: number;
  isLoading: boolean;
  makeOrder: () => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
};

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadCoupons = useCallback(async () => {
    const fetchedCoupons = await fetchCoupons();
    setCoupons(fetchedCoupons);
  }, []);

  const loadProducts = useCallback(
    async (
      currentCart: CartItem[],
      initialMap: {
        [key in string]: CartItem;
      }
    ) => {
      const tempMap = { ...initialMap };
      try {
        const fetchedProducts = await fetchProducts();

        const productsWithAdjustedQuantity = fetchedProducts.map(
          (p: Product) => {
            const cartQuantity = tempMap[p.id]?.cartQuantity || 0;

            if (cartQuantity > p.stock) {
              tempMap[p.id] = {
                ...tempMap[p.id],
                cartQuantity: p.stock,
              };
            }

            return {
              ...p,
              stock: Math.max(0, p.stock - cartQuantity),
            };
          }
        );

        const updatedcart = currentCart.map((c: CartItem) => ({
          ...c,
          cartQuantity: tempMap[c.id].cartQuantity,
        }));
        setCart(updatedcart);

        setProducts(productsWithAdjustedQuantity);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    const cartMapById: {
      [key in string]: CartItem;
    } = {};

    let parsedCart: CartItem[] = [];

    if (savedCart) {
      parsedCart = JSON.parse(savedCart);
      setTotalItems(
        parsedCart.reduce((total: number, item: CartItem) => {
          cartMapById[item.id] = item;
          return total + item.cartQuantity;
        }, 0)
      );
    }
    loadProducts(parsedCart, cartMapById);
    loadCoupons();
  }, [loadProducts, loadCoupons]);

  useEffect(() => {
    setTotalItems(cart.reduce((total, item) => total + item.cartQuantity, 0));
    const handleBeforeUnload = () => {
      if (cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [cart]);

  const addToCart = (product: Product, quantity: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, cartQuantity: item.cartQuantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, cartQuantity: quantity }];
    });
    updateProductQuantity(product.id, -quantity);
  };

  const removeFromCart = (id: number) => {
    const removedItem = cart.find((item) => item.id === id);
    if (removedItem) {
      updateProductQuantity(id, removedItem.cartQuantity);
    }
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const clearCart = (updateProducts?: boolean) => {
    if (updateProducts) {
      cart.forEach((item) => {
        updateProductQuantity(item.id, item.cartQuantity);
      });
    }

    setCart([]);
  };

  const updateCartItemQuantity = (id: number, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === id) {
          const quantityDiff = quantity - item.cartQuantity;
          updateProductQuantity(id, -quantityDiff);
          return { ...item, cartQuantity: quantity };
        }
        return item;
      })
    );
  };

  const updateProductQuantity = (id: number, quantityChange: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id
          ? {
              ...product,
              stock: Math.max(0, product.stock + quantityChange),
            }
          : product
      )
    );
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + bankersRound(item.price * item.cartQuantity, 2),
    0
  );

  const applyCoupon = (code: string) => {
    const coupon = coupons.find((c) => c.code === code);
    if (coupon) {
      setAppliedCoupon(coupon);
    } else {
      toast({
        title: "Code doesn'e exist",
        description: `Please provide a code that exists`,
        variant: "destructive",
      });
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const getCouponDiscount = () => {
    if (appliedCoupon) {
      if (appliedCoupon.type === "FLAT") {
        return appliedCoupon.amount || 0;
      } else if (appliedCoupon.type === "PERCENTAGE") {
        return (subtotal * (appliedCoupon.amount || 0)) / 100;
      } else if (appliedCoupon.type === "BOGO") {
        return subtotal / 2;
      }
    }
    return 0;
  };

  const makeOrder = async () => {
    const cartId = await createCart(cart);
    await placeOrder(cartId, appliedCoupon?.code);
    clearCart();
    navigate("/success");
  };

  const total = appliedCoupon
    ? subtotal - bankersRound(getCouponDiscount(), 2)
    : subtotal;

  return (
    <ShopContext.Provider
      value={{
        products,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        updateCartItemQuantity,
        updateProductQuantity,
        totalItems,
        subtotal,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        total,
        isLoading,
        coupons,
        makeOrder,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
