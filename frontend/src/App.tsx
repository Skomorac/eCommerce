import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CartOverlay from "./components/CartOverlay";

interface AppState {
  isCartOpen: boolean;
}

class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      isCartOpen: false,
    };
  }

  componentDidUpdate(prevProps: {}, prevState: AppState) {
    if (prevState.isCartOpen !== this.state.isCartOpen) {
      if (this.state.isCartOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "unset";
      }
    }
  }

  componentWillUnmount() {
    document.body.style.overflow = "unset";
  }

  toggleCart = () => {
    this.setState((prevState) => ({ isCartOpen: !prevState.isCartOpen }));
  };

  render() {
    const { isCartOpen } = this.state;

    return (
      <CartProvider>
        <Router>
          <div
            className={`App flex flex-col min-h-screen ${
              isCartOpen ? "overflow-hidden" : ""
            }`}
          >
            <Header toggleCart={this.toggleCart} />
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
                    onClick={this.toggleCart}
                    style={{ top: "var(--header-height, 0px)" }}
                  />
                  <CartOverlay onClose={this.toggleCart} />
                </>
              )}
            </div>
          </div>
        </Router>
      </CartProvider>
    );
  }
}

export default App;
