// src/pages/ProductDetailsPage.tsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_PRODUCT } from "../graphql/queries";
import ProductGallery from "../components/ProductGallery";
import ProductAttributes from "../components/ProductAttributes";
import AddToCartButton from "../components/AddToCartButton";
import { parseHtml } from "../utils/htmlParser";

// ... (interfaces remain the same)

const ProductDetailsPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { data, loading, error } = useQuery(GET_PRODUCT, {
    variables: { id: productId },
  });
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    if (data?.product) {
      const initialAttributes: Record<string, string> = {};
      const uniqueAttributeIds = new Set(
        data.product.attributes.map((attr: Attribute) => attr.attribute_id)
      );
      uniqueAttributeIds.forEach((id) => {
        initialAttributes[id] = "";
      });
      setSelectedAttributes(initialAttributes);
    }
  }, [data]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const product: ProductDetails = data.product;

  const handleAttributeSelect = (attributeId: string, value: string) => {
    setSelectedAttributes((prev) => ({ ...prev, [attributeId]: value }));
  };

  const isAllAttributesSelected = Object.values(selectedAttributes).every(
    (value) => value !== ""
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
