import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

export default function SuccessPage() {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
      <p className="mb-8">Thank you for your purchase.</p>
      <Button asChild>
        <Link to="/">Return to Shop</Link>
      </Button>
    </div>
  );
}
