import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_PRODUCT } from "../graphql/queries";
import parse from "html-react-parser";

const formatPrice = (amount: string): string => {
  const parsedAmount = parseFloat(amount);
  return isNaN(parsedAmount) ? amount : parsedAmount.toFixed(2);
};

interface Attribute {
  id: string;
  attribute_id: string;
  value: string;
  displayValue: string;
}

interface Product {
  id: string;
  name: string;
  brand: string;
  gallery: string[];
  prices: { amount: string; currency: { symbol: string; label: string } }[];
  inStock: boolean;
  description: string;
  attributes: Attribute[];
  category: string;
}

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { loading, error, data } = useQuery(GET_PRODUCT, {
    variables: { id },
  });
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const product: Product = data.product;

  const handleAttributeChange = (attributeId: string, value: string) => {
    setSelectedAttributes((prev) => ({ ...prev, [attributeId]: value }));
  };

  const isProductConfigured = product.attributes.every(
    (attr) => selectedAttributes[attr.attribute_id]
  );

  const addToCart = () => {
    console.log("Added to cart:", { ...product, selectedAttributes });
  };

  // Group attributes by attribute_id
  const groupedAttributes = product.attributes.reduce((acc, attr) => {
    if (!acc[attr.attribute_id]) {
      acc[attr.attribute_id] = [];
    }
    acc[attr.attribute_id].push(attr);
    return acc;
  }, {} as Record<string, Attribute[]>);

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row">
      <div className="w-full md:w-2/3 pr-8" data-testid="product-gallery">
        {/* Gallery code remains the same */}
      </div>
      <div className="w-full md:w-1/3">
        <h1 className="text-3xl font-semibold mb-2">{product.name}</h1>
        <p className="text-xl mb-4">{product.brand}</p>

        {Object.entries(groupedAttributes).map(([attributeId, attributes]) => (
          <div
            key={attributeId}
            className="mb-4"
            data-testid={`product-attribute-${attributeId
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
          >
            <h2 className="text-lg font-semibold mb-2">{attributeId}:</h2>
            <div className="flex flex-wrap">
              {attributes.map((attr) => (
                <button
                  key={attr.id}
                  onClick={() =>
                    handleAttributeChange(attr.attribute_id, attr.value)
                  }
                  className={`mr-2 mb-2 px-4 py-2 border ${
                    selectedAttributes[attr.attribute_id] === attr.value
                      ? "border-black"
                      : "border-gray-300"
                  }`}
                >
                  {attr.displayValue}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">PRICE:</h2>
          <p className="text-2xl font-bold">
            {product.prices[0].currency.symbol}
            {formatPrice(product.prices[0].amount)}
          </p>
        </div>

        <button
          className={`text-white px-6 py-2 w-full text-lg font-semibold mb-6 ${
            isProductConfigured && product.inStock
              ? "bg-green-500"
              : "bg-gray-400"
          }`}
          disabled={!isProductConfigured || !product.inStock}
          onClick={addToCart}
          data-testid="add-to-cart"
        >
          {product.inStock ? "ADD TO CART" : "OUT OF STOCK"}
        </button>

        <div className="mt-4" data-testid="product-description">
          {parse(product.description)}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
