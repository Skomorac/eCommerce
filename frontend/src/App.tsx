import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import ProductDetailsPage from "./pages/ProductDetailsPage";

const App: React.FC = () => {
  return (
    <CartProvider>
      <Router>
        <div className="App">
          <Header />
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
        </div>
      </Router>
    </CartProvider>
  );
};

export default App;
