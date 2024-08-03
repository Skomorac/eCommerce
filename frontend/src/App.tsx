import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CartOverlay from "./components/CartOverlay";

const App: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen]);

  return (
    <CartProvider>
      <Router>
        <div
          className={`App flex flex-col min-h-screen ${
            isCartOpen ? "overflow-hidden" : ""
          }`}
        >
          <Header toggleCart={toggleCart} />
          <div className="flex-grow relative">
            <main className="container mx-auto px-4">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/:category" element={<HomePage />} />
                <Route
                  path="/product/:productId"
                  element={<ProductDetailsPage />}
                />
              </Routes>
            </main>
            {isCartOpen && (
              <>
                <div
                  className="fixed inset-0 bg-black bg-opacity-50 z-40"
                  onClick={toggleCart}
                  style={{ top: "var(--header-height, 0px)" }}
                />
                <CartOverlay onClose={toggleCart} />
              </>
            )}
          </div>
        </div>
      </Router>
    </CartProvider>
  );
};

export default App;
