import { Coupon, CouponType, useShop } from "@/lib/store/shop-provider";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function AvailableCoupons() {
  const { coupons, applyCoupon, appliedCoupon } = useShop();

  const handleApplyCoupon = (coupon: Coupon) => {
    applyCoupon(coupon.code);
  };
  const getText = (code: CouponType, amount?: number) => {
    if (code === "PERCENTAGE") {
      return `${amount}% off`;
    } else if (code === "FLAT") {
      return `$${amount} off`;
    } else {
      return "Buy One Get One Free";
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Coupons</CardTitle>
      </CardHeader>
      <CardContent>
        {coupons.map((coupon) => (
          <div
            key={coupon.code}
            className="flex justify-between items-center mb-2"
          >
            <div>
              <p className="font-semibold">{coupon.code}</p>
              <p className="text-sm text-gray-500">
                {getText(coupon.type, coupon.amount)}
              </p>
            </div>
            <Button
              onClick={() => handleApplyCoupon(coupon)}
              disabled={appliedCoupon?.code === coupon.code}
            >
              {appliedCoupon?.code === coupon.code ? "Applied" : "Apply"}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
