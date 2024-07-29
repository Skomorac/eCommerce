import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_PRODUCTS } from "../graphql/queries";
import Cart from "./svg_components/Cart";
import { Link } from "react-router-dom";

interface ProductListProps {
  category: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  gallery: string[];
  prices: { amount: number; currency: { symbol: string } }[];
  inStock: boolean;
}

const ProductList: React.FC<ProductListProps> = ({ category }) => {
  const { loading, error, data } = useQuery(GET_PRODUCTS);
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const filteredProducts =
    category === "all"
      ? data.products
      : data.products.filter(
          (product: Product) => product.category === category
        );

  const addToCart = (product: Product) => {
    setMessage(`${product.name} added to cart`);
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {message && (
        <div className="fixed top-4 right-4 bg-green-500 text-white p-2 rounded">
          {message}
        </div>
      )}
      {filteredProducts.map((product: Product) => (
        <Link
          to={`/product/${product.id}`}
          key={product.id}
          className="border rounded-lg shadow-lg relative p-4 transition-transform duration-200 transform hover:scale-105 hover:shadow-2xl"
          data-testid={`product-${product.name
            .replace(/\s+/g, "-")
            .toLowerCase()}`}
          onMouseEnter={() => setHoveredProductId(product.id)}
          onMouseLeave={() => setHoveredProductId(null)}
        >
          <div className="relative">
            <img
              src={product.gallery[0]}
              alt={product.name}
              className={`w-full h-48 object-cover rounded-lg mb-4 ${
                !product.inStock && "filter grayscale"
              }`}
            />
            {!product.inStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
                Out of Stock
              </div>
            )}
          </div>
          <h2 className="font-raleway text-[18px] font-light leading-[28.8px] text-left mb-2">
            {product.name}
          </h2>
          <p className="font-raleway text-[18px] font-normal leading-[28.8px] text-left mb-4">
            {product.prices[0].currency.symbol}
            {product.prices[0].amount.toFixed(2)}
          </p>
          {hoveredProductId === product.id && product.inStock && (
            <div
              className="absolute bottom-28 right-12 transform translate-x-1/2 translate-y-1/2"
              onClick={(e) => {
                e.preventDefault();
                addToCart(product);
              }}
            >
              <Cart className="bg-primary text-white rounded-full p-2 shadow-md transition-transform duration-200 transform hover:scale-110 hover:bg-accent cursor-pointer" />
            </div>
          )}
        </Link>
      ))}
    </div>
  );
};

export default ProductList;
