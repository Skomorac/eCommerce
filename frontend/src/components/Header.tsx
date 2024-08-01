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

  const categories = [
    "all",
    ...(data?.categories?.map((cat) => cat.name) || []),
  ];
  const uniqueCategories = Array.from(new Set(categories));

  const activeCategory =
    location.pathname === "/" ? "all" : location.pathname.slice(1);

  return (
    <header className="flex justify-between items-center p-4 font-raleway text-text">
      <nav className="flex items-center">
        {uniqueCategories.map((category) => (
          <Link
            key={category}
            to={`/${category}`}
            data-testid={
              category === activeCategory
                ? "active-category-link"
                : "category-link"
            }
            className={`mr-6 uppercase text-base font-semibold leading-[19.2px] text-center ${
              category === activeCategory
                ? "text-primary border-b-2 border-primary"
                : "text-text"
            }`}
          >
            {category}
          </Link>
        ))}
      </nav>
      <Link to="/" className="absolute left-1/2 transform -translate-x-1/2">
        <img src={logoIcon} alt="Logo" className="w-8 h-8" />
      </Link>
      <button data-testid="cart-btn" className="relative">
        <img src={cartIcon} alt="Cart" className="w-6 h-6" />
      </button>
    </header>
  );
};

export default Header;
