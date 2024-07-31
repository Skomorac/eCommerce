import React, { useState, useContext } from "react";
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import Logo from "./svg_components/Logo";
import Cart from "./svg_components/Cart";
import Navigation from "./Navigation";
import { GET_CATEGORIES } from "../graphql/queries";
import { CartContext } from "../context/CartContext";
import CartModal from "./CartModal";

const Header: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [isCartModalOpen, setCartModalOpen] = useState<boolean>(false);
  const { loading, error, data } = useQuery(GET_CATEGORIES);
  const navigate = useNavigate();
  const { cartItemsCount } = useContext(CartContext);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const categories = data.categories.map((cat: { name: string }) => cat.name);
  if (!categories.includes("all")) {
    categories.unshift("all");
  }

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    navigate(`/?category=${category}`);
  };

  const handleLogoClick = () => {
    setActiveCategory("all");
    navigate("/");
  };

  const toggleCartModal = () => {
    setCartModalOpen(!isCartModalOpen);
  };

  return (
    <header className="flex items-center justify-between px-4 py-4 bg-white relative">
      <div className="flex-1">
        <Navigation
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />
      </div>
      <Logo
        className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 cursor-pointer"
        onClick={handleLogoClick}
        aria-label="Go to homepage"
      />
      <div className="flex-1 flex justify-end">
        <Cart
          className="w-6 h-6 text-text hover:text-primary cursor-pointer"
          itemsCount={cartItemsCount}
          onClick={toggleCartModal}
          aria-label="View cart"
        />
      </div>
      {isCartModalOpen && <CartModal onClose={toggleCartModal} />}
    </header>
  );
};

export default Header;
