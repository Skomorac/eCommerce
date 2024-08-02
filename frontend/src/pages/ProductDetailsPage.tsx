// src/pages/ProductDetailsPage.tsx
import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_PRODUCT } from "../graphql/queries";
import ProductGallery from "../components/ProductGallery";
import ProductAttributes from "../components/ProductAttributes";
import AddToCartButton from "../components/AddToCartButton";
import { parseHtml } from "../utils/htmlParser";

interface Currency {
  label: string;
  symbol: string;
}

interface Price {
  amount: string;
  currency: Currency;
}

interface Attribute {
  id: string;
  attribute_id: string;
  value: string;
  displayValue: string;
}

interface ProductDetails {
  id: string;
  name: string;
  inStock: boolean;
  gallery: string[];
  description: string;
  category: string;
  prices: Price[];
  attributes: Attribute[];
}

interface ProductData {
  product: ProductDetails;
}
const ProductDetailsPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { data, loading, error } = useQuery<ProductData>(GET_PRODUCT, {
    variables: { id: productId },
  });

  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    if (data?.product) {
      const initialAttributes: Record<string, string> = {};
      data.product.attributes.forEach((attr) => {
        initialAttributes[attr.attribute_id] = "";
      });
      setSelectedAttributes(initialAttributes);
    }
  }, [data]);

  const isAllAttributesSelected = useMemo(() => {
    if (!data?.product) return false;
    return data.product.attributes.every(
      (attr) => selectedAttributes[attr.attribute_id] !== ""
    );
  }, [data, selectedAttributes]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No product data available</div>;

  const product = data.product;

  const handleAttributeSelect = (attributeId: string, value: string) => {
    setSelectedAttributes((prev) => ({ ...prev, [attributeId]: value }));
  };

  const formatPrice = (amount: string, symbol: string) => {
    return `${symbol}${parseFloat(amount).toFixed(2)}`;
  };

  const handleAddToCart = () => {
    if (isAllAttributesSelected && product.inStock) {
      console.log("Adding to cart:", product.id, selectedAttributes);
      // Implement your add to cart logic here
    }
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
            inStock={product.inStock}
            allAttributesSelected={isAllAttributesSelected}
            onClick={handleAddToCart}
          />

          {product.inStock && !isAllAttributesSelected && (
            <p className="text-muted mt-2">
              Please select all attributes before adding to cart.
            </p>
          )}

          {!product.inStock && (
            <p className="text-muted mt-2">
              This product is currently out of stock.
            </p>
          )}

          <div className="mt-8" data-testid="product-description">
            {parseHtml(product.description)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
