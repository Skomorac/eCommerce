// src/pages/HomePage.tsx
import React from "react";
import { useParams, useLocation } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_PRODUCTS } from "../graphql/queries";
import ProductCard from "../components/ProductCard";

interface Product {
  id: string;
  name: string;
  inStock: boolean;
  gallery: string[];
  description: string;
  category: string;
  brand: string;
  prices: {
    amount: number;
    currency: {
      label: string;
      symbol: string;
    };
  }[];
  attributes: {
    id: string;
    attribute_id: string;
    value: string;
    displayValue: string;
  }[];
}

interface ProductsData {
  products: Product[];
}

const HomePage: React.FC = () => {
  const { category } = useParams<{ category?: string }>();
  const location = useLocation();
  const activeCategory = category || (location.pathname === "/" ? "all" : "");

  const { data, loading, error } = useQuery<ProductsData>(GET_PRODUCTS, {
    variables: { category: activeCategory === "all" ? null : activeCategory },
  });

  const title =
    activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1);

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error loading products: {error.message}</div>;

  const handleQuickShop = (productId: string) => {
    // Implement quick shop logic here
    console.log(`Quick shop for product ${productId}`);
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="font-raleway text-[42px] font-normal leading-[67.2px] text-left text-text mt-8 mb-6">
        {title}
      </h1>
      <div className="grid grid-cols-auto-fill-350 gap-8">
        {data?.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
