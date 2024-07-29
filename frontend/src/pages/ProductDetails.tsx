import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_PRODUCT } from "../graphql/queries";

const formatPrice = (amount: string): string => {
  const parsedAmount = parseFloat(amount);
  return isNaN(parsedAmount) ? amount : parsedAmount.toFixed(2);
};

interface Product {
  name: string;
  brand: string;
  gallery: string[];
  prices: { amount: string; currency: { symbol: string } }[];
  inStock: boolean;
  description: string;
}

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { loading, error, data } = useQuery(GET_PRODUCT, {
    variables: { id },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const product: Product = data.product;

  return (
    <div className="container mx-auto px-4 py-8 flex">
      <div className="w-2/3 pr-8">
        <div className="mb-4">
          <img
            src={product.gallery[0]}
            alt={product.name}
            className="w-full object-contain"
          />
        </div>
        <div className="flex space-x-2">
          {product.gallery.slice(1).map((img: string, index: number) => (
            <img
              key={index}
              src={img}
              alt={`${product.name} ${index + 1}`}
              className="w-1/5 object-cover"
            />
          ))}
        </div>
      </div>
      <div className="w-1/3">
        <h1 className="text-3xl font-semibold mb-2">{product.name}</h1>
        <p className="text-xl mb-4">{product.brand}</p>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">PRICE:</h2>
          <p className="text-2xl font-bold">
            {product.prices[0].currency.symbol}
            {formatPrice(product.prices[0].amount)}
          </p>
        </div>

        <button
          className="bg-green-500 text-white px-6 py-2 w-full text-lg font-semibold mb-6"
          disabled={!product.inStock}
        >
          ADD TO CART
        </button>

        <p className="mt-4">{product.description}</p>
      </div>
    </div>
  );
};

export default ProductDetails;
