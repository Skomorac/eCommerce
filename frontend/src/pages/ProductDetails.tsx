import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_PRODUCT } from "../graphql/queries";
import parse from "html-react-parser";

const formatPrice = (amount: string): string => {
  const parsedAmount = parseFloat(amount);
  return isNaN(parsedAmount) ? amount : parsedAmount.toFixed(2);
};

const isColorAttribute = (attributeId: string) =>
  attributeId.toLowerCase() === "color";

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
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

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
        <div className="flex mb-4">
          <div className="w-1/5 mr-4">
            {product.gallery.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${product.name} ${index + 1}`}
                className="w-full object-cover mb-2 cursor-pointer"
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
          <div className="w-4/5 relative">
            <img
              src={product.gallery[currentImageIndex]}
              alt={product.name}
              className="w-full object-contain"
            />
            {product.gallery.length > 1 && (
              <>
                <button
                  className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full"
                  onClick={() =>
                    setCurrentImageIndex((prev) =>
                      prev > 0 ? prev - 1 : product.gallery.length - 1
                    )
                  }
                >
                  &#9664;
                </button>
                <button
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full"
                  onClick={() =>
                    setCurrentImageIndex((prev) =>
                      prev < product.gallery.length - 1 ? prev + 1 : 0
                    )
                  }
                >
                  &#9654;
                </button>
              </>
            )}
          </div>
        </div>
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
                <div key={attr.id} className="relative mr-2 mb-2 group">
                  <button
                    onClick={() =>
                      handleAttributeChange(attr.attribute_id, attr.value)
                    }
                    className={`
                      border rounded transition-all duration-200
                      ${
                        isColorAttribute(attributeId)
                          ? "w-10 h-10"
                          : "px-3 py-2 text-sm"
                      }
                      ${
                        selectedAttributes[attr.attribute_id] === attr.value
                          ? isColorAttribute(attributeId)
                            ? "ring-2 ring-black ring-offset-2"
                            : "bg-black text-white border-black"
                          : "border-gray-300 bg-white text-black"
                      }
                    `}
                    style={
                      isColorAttribute(attributeId)
                        ? { backgroundColor: attr.value }
                        : {}
                    }
                  >
                    {!isColorAttribute(attributeId) && attr.displayValue}
                  </button>
                  {isColorAttribute(attributeId) && (
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {attr.displayValue}
                    </span>
                  )}
                </div>
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
