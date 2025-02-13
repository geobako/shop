"use client";

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
import { Trash2 } from "lucide-react";
import { useShop } from "@/lib/store/shop-provider";
import { AvailableCoupons } from "./available-coupons";

export function Cart() {
  const {
    cart,
    removeFromCart,
    makeOrder,
    updateCartItemQuantity,
    appliedCoupon,
    total,
    applyCoupon,
    subtotal,
  } = useShop();
  const [couponCode, setCouponCode] = useState("");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cart Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {cart.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <>
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center mb-4"
                >
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      ${item.price.toFixed(2)} each
                    </p>
                  </div>
                  <div className="flex items-center">
                    <Input
                      type="number"
                      min="1"
                      max={item.stock}
                      value={item.cartQuantity}
                      onChange={(e) =>
                        updateCartItemQuantity(
                          item.id,
                          Number.parseInt(e.target.value)
                        )
                      }
                      className="w-16 mr-2"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <div className="flex items-center mt-4">
                <Input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  className="mr-2"
                />
                <Button
                  onClick={() => {
                    applyCoupon(couponCode);
                    setCouponCode("");
                  }}
                >
                  Apply Coupon
                </Button>
              </div>
              {appliedCoupon && (
                <p className="mt-2 text-green-600">
                  Coupon applied: {appliedCoupon.code}
                </p>
              )}
              <div className="mt-4 text-right">
                <p>Subtotal: ${subtotal.toFixed(2)}</p>
                <p>Discount: ${(total - subtotal).toFixed(2)}</p>
                <p className="text-xl font-bold">Total: ${total.toFixed(2)}</p>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={makeOrder}
            className="w-full"
            disabled={cart.length === 0}
          >
            Place Order
          </Button>
        </CardFooter>
      </Card>
      <AvailableCoupons />
    </div>
  );
}
