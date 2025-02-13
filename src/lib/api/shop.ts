import { toast } from "@/hooks/use-toast";
import { API_BASE_URL, APIError } from "./base";
import { CartItem } from "../store/shop-provider";

const handleError = (error: unknown) => {
  if (error instanceof APIError) {
    toast({
      variant: "destructive",
      title: "Uh oh! Something went wrong.",
      description: error?.message,
    });
  } else {
    toast({
      variant: "destructive",
      title: "Uh oh! Something went wrong.",
      description: "Please try again later",
    });
  }
  return [];
};

export async function fetchProducts() {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) {
      throw new APIError("Failed to fetch products");
    }

    const products = await response.json();

    return products;
  } catch (error: unknown) {
    return handleError(error);
  }
}

export async function fetchCoupons() {
  try {
    const response = await fetch(`${API_BASE_URL}/discounts`);
    if (!response.ok) {
      throw new APIError("Failed to fetch coupons");
    }

    const coupons = await response.json();

    return coupons;
  } catch (error: unknown) {
    return handleError(error);
  }
}

export async function createCart(cartItems: CartItem[]) {
  try {
    const createCartResponse = await fetch(
      `http://localhost:3001/proxy/carts`,
      {
        method: "POST",
      }
    );

    const { cartId } = await createCartResponse.json();

    const body = cartItems.map((c) => ({
      product_id: c.id,
      quantity: c.cartQuantity,
    }));

    await fetch(`${API_BASE_URL}/carts/${cartId}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });

    return cartId;
  } catch (error: unknown) {
    return handleError(error);
  }
}

export async function placeOrder(
  cartId: string,
  discountCode?: string
): Promise<boolean> {
  try {
    const body = {
      cart_id: cartId,
      discount_code: discountCode,
    };
    await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      body: JSON.stringify(body),
    });
    return true;
  } catch (error: unknown) {
    handleError(error);
    return false;
  }
}
