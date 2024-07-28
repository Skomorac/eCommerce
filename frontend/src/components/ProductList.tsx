// src/components/ProductList.tsx

import React from "react";
import { useQuery } from "@apollo/client";
import { GET_PRODUCTS } from "../graphql/queries";
import Cart from "./svg_components/Cart";

const ProductList: React.FC = () => {
  const { loading, error, data } = useQuery(GET_PRODUCTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {data.products.map(
        (product: {
          id: string;
          name: string;
          gallery: string[];
          prices: { amount: number; currency: { symbol: string } }[];
        }) => (
          <div
            key={product.id}
            className="border rounded-lg shadow-lg relative p-4"
            data-testid={`product-${product.name
              .replace(/\s+/g, "-")
              .toLowerCase()}`}
          >
            <img
              src={product.gallery[0]}
              alt={product.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h2 className="font-raleway text-[18px] font-light leading-[28.8px] text-left mb-2">
              {product.name}
            </h2>
            <p className="font-raleway text-[18px] font-normal leading-[28.8px] text-left mb-4">
              {product.prices[0].currency.symbol}
              {product.prices[0].amount.toFixed(2)}
            </p>
            <div className="absolute bottom-28 right-12 transform translate-x-1/2 translate-y-1/2">
              <div
                className="bg-primary rounded-full p-2 shadow-md"
                style={{ boxShadow: "0px 4px 11px 0px #1D1F221A" }}
              >
                <Cart className="w-8 h-7 p-1" />
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default ProductList;
