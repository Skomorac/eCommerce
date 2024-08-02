// src/components/ProductCard.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  inStock: boolean;
  gallery: string[];
  prices: {
    amount: string;
    currency: {
      symbol: string;
    };
  }[];
}

interface ProductCardProps {
  product: Product;
  onQuickShop: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickShop }) => {
  const [isHovered, setIsHovered] = useState(false);

  const mainImage = product.gallery[0] || "";
  const price = product.prices[0];

  const formatPrice = (amount: string, symbol: string) => {
    const numericAmount = parseFloat(amount);
    return isNaN(numericAmount)
      ? "N/A"
      : `${symbol}${numericAmount.toFixed(2)}`;
  };

  return (
    <div
      className={`relative transition-all duration-300 ease-in-out 
                  ${isHovered ? "transform scale-105" : ""}
                  rounded-lg overflow-hidden shadow-md hover:shadow-xl`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid={`product-${product.name.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <Link to={`/product/${product.id}`}>
        <div className={`relative ${!product.inStock ? "opacity-50" : ""}`}>
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-auto object-cover"
          />
          {!product.inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70">
              <span className="text-lg font-medium text-gray-600">
                OUT OF STOCK
              </span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="mt-2 font-raleway text-lg font-medium">
            {product.name}
          </h3>
          <p className="font-raleway text-lg font-bold text-primary">
            {price && price.currency
              ? formatPrice(price.amount, price.currency.symbol)
              : "Price not available"}
          </p>
        </div>
      </Link>
      {product.inStock && isHovered && (
        <button
          className="absolute bottom-4 right-4 bg-primary text-white p-2 rounded-full 
                     shadow-lg hover:bg-primary-dark transition-colors duration-200"
          onClick={(e) => {
            e.preventDefault();
            onQuickShop(product.id);
          }}
        >
          Quick Shop
        </button>
      )}
    </div>
  );
};

export default ProductCard;
