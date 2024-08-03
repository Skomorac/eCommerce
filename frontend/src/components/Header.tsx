// src/components/Header.tsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_CATEGORIES } from "../graphql/queries";
import { useCart } from "../context/CartContext";
import CartOverlay from "./CartOverlay";
import cartIcon from "../assets/images/cart.svg";
import logoIcon from "../assets/images/logo.svg";

// Define the shape of a category
interface Category {
  id: string;
  name: string;
}

// Define the shape of the query result
interface CategoriesData {
  categories: Category[];
}

const Header: React.FC = () => {
  const { data, loading, error } = useQuery<CategoriesData>(GET_CATEGORIES);
  const location = useLocation();
  const { getTotalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading categories</div>;

  const categories = [
    "all",
    ...(data?.categories.map((cat) => cat.name) || []),
  ];
  const uniqueCategories = Array.from(new Set(categories));

  const activeCategory =
    location.pathname === "/" ? "all" : location.pathname.slice(1);

  return (
    <header className="w-full border-b border-[#E5E5E5]">
      <div className="container mx-auto px-4 flex justify-between items-center py-4 font-raleway text-text">
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
        <button
          data-testid="cart-btn"
          className="relative"
          onClick={() => setIsCartOpen(true)}
        >
          <img src={cartIcon} alt="Cart" className="w-6 h-6" />
          {getTotalItems() > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {getTotalItems()}
            </span>
          )}
        </button>
      </div>
      {isCartOpen && <CartOverlay onClose={() => setIsCartOpen(false)} />}
    </header>
  );
};

export default Header;
