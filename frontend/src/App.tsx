import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import ProductDetails from "./pages/ProductDetails";
import { CartProvider } from "./context/CartContext";
import "./App.css";

interface AppState {
  cartItemsCount: number;
}

class App extends Component<{}, AppState> {
  state: AppState = {
    cartItemsCount: 0,
  };

  incrementCartCount = () => {
    this.setState((prevState) => ({
      cartItemsCount: prevState.cartItemsCount + 1,
    }));
  };

  render() {
    return (
      <CartProvider>
        <Router>
          <div className="App p-4 md:p-8">
            <Header />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              {/* Additional routes can be added here */}
            </Routes>
          </div>
        </Router>
      </CartProvider>
    );
  }
}

export default App;
