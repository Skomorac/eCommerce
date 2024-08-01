// src/components/ProductCard.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  inStock: boolean;
  gallery: string[];
  brand: string;
  prices: {
    amount: string; // Change this to string
    currency: {
      label: string;
      symbol: string;
    };
  }[];
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);

  const mainImage = product.gallery[0] || "";
  const price = product.prices[0]; // Assuming the first price is the default

  const formatPrice = (amount: string, symbol: string) => {
    const numericAmount = parseFloat(amount);
    return isNaN(numericAmount)
      ? "N/A"
      : `${symbol}${numericAmount.toFixed(2)}`;
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid={`product-${product.name.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <Link to={`/product/${product.id}`}>
        <div className={`relative ${!product.inStock && "opacity-50"}`}>
          <img src={mainImage} alt={product.name} className="w-full h-auto" />
          {!product.inStock && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-medium text-gray-600">
                OUT OF STOCK
              </span>
            </div>
          )}
        </div>
        <h3 className="mt-2 font-raleway text-lg">
          {product.brand} {product.name}
        </h3>
        <p className="font-raleway text-lg font-medium">
          {price && price.currency
            ? formatPrice(price.amount, price.currency.symbol)
            : "Price not available"}
        </p>
      </Link>
      {product.inStock && isHovered && (
        <button
          className="absolute bottom-16 right-4 bg-primary text-white p-2 rounded-full"
          onClick={(e) => {
            e.preventDefault();
            // Add to cart logic here
          }}
        >
          Quick Shop
        </button>
      )}
    </div>
  );
};

export default ProductCard;
