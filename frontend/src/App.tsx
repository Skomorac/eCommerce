import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import ProductDetails from "./pages/ProductDetails";
import { CartContext } from "./context/CartContext";
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
      <CartContext.Provider
        value={{
          cartItemsCount: this.state.cartItemsCount,
          incrementCartCount: this.incrementCartCount,
        }}
      >
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
      </CartContext.Provider>
    );
  }
}

export default App;
