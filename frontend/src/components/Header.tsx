// src/components/Header.tsx

import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import Logo from "./svg_components/Logo";
import Cart from "./svg_components/Cart";
import Navigation from "./Navigation";
import HomePage from "./HomePage";
import { GET_CATEGORIES } from "../graphql/queries";

const Header: React.FC = () => {
  const { loading, error, data } = useQuery(GET_CATEGORIES);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    if (data && data.categories.length > 0) {
      setActiveCategory("all");
    }
  }, [data]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  const handleLogoClick = () => {
    setActiveCategory("all");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const categories = data.categories.map((cat: { name: string }) => cat.name);
  if (!categories.includes("all")) {
    categories.unshift("all");
  }

  return (
    <>
      <header className="flex items-center justify-between px-4 py-4 bg-white relative">
        <div className="flex-1">
          <Navigation
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>
        <Logo
          className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12"
          onClick={handleLogoClick}
        />
        <div className="flex-1 flex justify-end">
          <Cart className="w-6 h-6 text-text hover:text-primary" />
        </div>
      </header>
      <HomePage activeCategory={activeCategory} />
    </>
  );
};

export default Header;
