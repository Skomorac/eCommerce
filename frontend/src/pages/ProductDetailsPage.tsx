// src/pages/ProductDetailsPage.tsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_PRODUCT } from "../graphql/queries";
import ProductGallery from "../components/ProductGallery";
import ProductAttributes from "../components/ProductAttributes";
import AddToCartButton from "../components/AddToCartButton";
import { parseHtml } from "../utils/htmlParser";

interface ProductDetails {
  id: string;
  name: string;
  inStock: boolean;
  gallery: string[];
  description: string;
  category: string;
  prices: {
    amount: string;
    currency: {
      label: string;
      symbol: string;
    };
  }[];
  attributes: {
    id: string;
    name: string;
    type: string;
    items: {
      displayValue: string;
      value: string;
      id: string;
    }[];
  }[];
}

const ProductDetailsPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { data, loading, error } = useQuery(GET_PRODUCT, {
    variables: { id: productId },
  });
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const product: ProductDetails = data.product;

  const handleAttributeSelect = (attributeId: string, itemId: string) => {
    setSelectedAttributes((prev) => ({ ...prev, [attributeId]: itemId }));
  };

  const isAllAttributesSelected = product.attributes.every(
    (attr) => selectedAttributes[attr.id]
  );

  const formatPrice = (amount: string, symbol: string) => {
    return `${symbol}${parseFloat(amount).toFixed(2)}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-2/3">
          <ProductGallery gallery={product.gallery} />
        </div>
        <div className="md:w-1/3 md:pl-8">
          <h1 className="text-3xl font-semibold mb-4">{product.name}</h1>

          <ProductAttributes
            attributes={product.attributes}
            selectedAttributes={selectedAttributes}
            onSelect={handleAttributeSelect}
          />

          <p className="text-2xl font-bold my-6">
            PRICE:
            <br />
            {formatPrice(
              product.prices[0].amount,
              product.prices[0].currency.symbol
            )}
          </p>

          <AddToCartButton
            disabled={!isAllAttributesSelected}
            onClick={() => {
              /* Add to cart logic */
            }}
          />

          <div className="mt-8" data-testid="product-description">
            {parseHtml(product.description)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
