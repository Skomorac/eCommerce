// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="container mx-auto px-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/:category" element={<HomePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
