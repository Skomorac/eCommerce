import React from "react";
import { useCart } from "../context/CartContext";

interface AttributeValue {
  value: string;
  displayValue: string;
}

interface Attribute {
  id: string;
  attribute_id: string;
  value: string;
  displayValue: string;
}

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    gallery: string[];
  };
  selectedAttributes: Record<string, AttributeValue>;
  allAttributes: Attribute[]; // Add this line
  inStock: boolean;
  allAttributesSelected: boolean;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  selectedAttributes,
  allAttributes, // Add this line
  inStock,
  allAttributesSelected,
}) => {
  const { addToCart } = useCart();

  const isDisabled = !inStock || !allAttributesSelected;
  const buttonText = inStock ? "ADD TO CART" : "OUT OF STOCK";

  const handleAddToCart = () => {
    if (!isDisabled) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        attributes: selectedAttributes,
        allAttributes: allAttributes, // Add this line
        image: product.gallery[0],
      });
    }
  };

  return (
    <button
      data-testid="add-to-cart"
      className={`px-4 py-2 text-white font-medium transition-colors duration-200 ${
        isDisabled
          ? "bg-gray-300 cursor-not-allowed"
          : "bg-primary hover:bg-accent cursor-pointer"
      }`}
      disabled={isDisabled}
      onClick={handleAddToCart}
    >
      {buttonText}
    </button>
  );
};

export default AddToCartButton;
