// src/components/HomePage.tsx

import React from "react";

interface HomePageProps {
  activeCategory: string;
}

const HomePage: React.FC<HomePageProps> = ({ activeCategory }) => {
  return (
    <div className="homepage">
      <h1>
        {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}
      </h1>
      {/* Add more content here */}
    </div>
  );
};

export default HomePage;
