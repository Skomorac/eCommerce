import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import ProductDetails from "./pages/ProductDetails";
import "./App.css";

class App extends Component {
  render() {
    return (
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
    );
  }
}

export default App;
