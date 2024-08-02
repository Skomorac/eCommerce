// src/components/AddToCartButton.tsx
import React from "react";

interface AddToCartButtonProps {
  inStock: boolean;
  allAttributesSelected: boolean;
  onClick: () => void;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  inStock,
  allAttributesSelected,
  onClick,
}) => {
  const isDisabled = !inStock || !allAttributesSelected;
  const buttonText = inStock ? "ADD TO CART" : "OUT OF STOCK";

  return (
    <button
      data-testid="add-to-cart"
      className={`px-4 py-2 text-white font-medium transition-colors duration-200 ${
        isDisabled
          ? "bg-gray-300 cursor-not-allowed"
          : "bg-primary hover:bg-accent cursor-pointer"
      }`}
      disabled={isDisabled}
      onClick={onClick}
    >
      {buttonText}
    </button>
  );
};

export default AddToCartButton;
