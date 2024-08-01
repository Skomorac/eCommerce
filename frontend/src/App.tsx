// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import client from "./graphql/client";
import Header from "./components/Header";

const CategoryPage: React.FC = () => {
  return <div>Category Page Placeholder</div>;
};

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<CategoryPage />} />
            <Route path="/:category" element={<CategoryPage />} />
          </Routes>
        </div>
      </Router>
    </ApolloProvider>
  );
};

export default App;
