// src/pages/HomePage.tsx
import React from "react";
import { useParams, useLocation } from "react-router-dom";

const HomePage: React.FC = () => {
  const { category } = useParams<{ category?: string }>();
  const location = useLocation();

  const activeCategory = category || (location.pathname === "/" ? "all" : "");
  const title =
    activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1);

  return (
    <>
      <h1
        className="
        font-raleway
        text-[42px]
        font-normal
        leading-[67.2px]
        text-left
        text-text
        mt-8
        mb-6
      "
      >
        {title}
      </h1>
      {/* Product cards and quick shop button will be added here later */}
    </>
  );
};

export default HomePage;
