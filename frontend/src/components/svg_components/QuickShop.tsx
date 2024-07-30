import React, { useContext } from "react";
import cartIcon from "../../assets/images/cart.svg";
import { CartContext } from "../../context/CartContext";

interface QuickShopProps {
  className?: string;
  product: {
    id: string;
    name: string;
    prices: { amount: string; currency: { symbol: string } }[];
    gallery: string[];
  };
}

const QuickShop: React.FC<QuickShopProps> = ({ className = "", product }) => {
  const { addToCart } = useContext(CartContext);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const cartItem = {
      id: product.id,
      name: product.name,
      quantity: 1,
      price: parseFloat(product.prices[0].amount),
      currency: product.prices[0].currency.symbol,
      attributes: {}, // Default attributes, update if necessary
      image: product.gallery[0],
    };

    addToCart(cartItem);
  };

  return (
    <button
      data-testid="quick-shop-btn"
      className={`${className} flex items-center justify-center`}
      onClick={handleClick}
    >
      <img src={cartIcon} alt="Quick Shop" className="w-6 h-6" />
    </button>
  );
};

export default QuickShop;
