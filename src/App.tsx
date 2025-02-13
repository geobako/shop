import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { Toaster } from "./components/ui/toaster";
import { Header } from "./components/header";
import Home from "./pages/home.page";
import CartPage from "./pages/cart.page";
import SuccessPage from "./pages/success.page";
import { Footer } from "./components/footer";
import { ShopProvider } from "./lib/store/shop-provider";

function App() {
  return (
    <Router>
      <ShopProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/success" element={<SuccessPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </ShopProvider>
      <Toaster />
    </Router>
  );
}

export default App;
