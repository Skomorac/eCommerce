// src/components/HomePage.tsx

import React from "react";
import Title from "./Title";
import ProductList from "./ProductList";

interface HomePageProps {
  activeCategory: string;
}

const HomePage: React.FC<HomePageProps> = ({ activeCategory }) => {
  return (
    <div className="homepage">
      <Title text={activeCategory} />
      <ProductList />
    </div>
  );
};

export default HomePage;
