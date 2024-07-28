// src/components/HomePage.tsx

import React from "react";
import Title from "./Title";

interface HomePageProps {
  activeCategory: string;
}

const HomePage: React.FC<HomePageProps> = ({ activeCategory }) => {
  return (
    <div className="homepage">
      <Title text={activeCategory} />
      {/* Add more content here */}
    </div>
  );
};

export default HomePage;
