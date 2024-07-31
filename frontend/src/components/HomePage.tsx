import React from "react";
import { useLocation } from "react-router-dom";
import Title from "./Title";
import ProductList from "./ProductList";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const HomePage: React.FC = () => {
  const query = useQuery();
  const activeCategory = query.get("category") || "all";

  return (
    <div className="homepage">
      <Title
        text={activeCategory === "all" ? "All Products" : activeCategory}
      />
      <ProductList category={activeCategory} />
    </div>
  );
};

export default HomePage;
