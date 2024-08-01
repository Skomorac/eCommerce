// src/components/Header.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_CATEGORIES } from "../graphql/queries";
import cartIcon from "../assets/images/cart.svg";
import logoIcon from "../assets/images/logo.svg";

const Header: React.FC = () => {
  const { data, loading, error } = useQuery(GET_CATEGORIES);
  const location = useLocation();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading categories</div>;

  // Ensure 'all' is included and categories are unique
  const categories = [
    "all",
    ...(data?.categories?.map((cat) => cat.name) || []),
  ];
  const uniqueCategories = Array.from(new Set(categories));

  // Determine the active category
  const activeCategory =
    location.pathname === "/" ? "all" : location.pathname.slice(1);

  return (
    <header className="flex justify-between items-center p-4">
      <nav>
        {uniqueCategories.map((category) => (
          <Link
            key={category}
            to={`/${category}`}
            data-testid={
              category === activeCategory
                ? "active-category-link"
                : "category-link"
            }
            className="mr-4"
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Link>
        ))}
      </nav>
      <Link to="/">
        <img src={logoIcon} alt="Logo" className="w-8 h-8" />
      </Link>
      <button data-testid="cart-btn" className="relative">
        <img src={cartIcon} alt="Cart" className="w-6 h-6" />
      </button>
    </header>
  );
};

export default Header;
