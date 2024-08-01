// src/components/AddToCartButton.tsx
import React from "react";

interface AddToCartButtonProps {
  disabled: boolean;
  onClick: () => void;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  disabled,
  onClick,
}) => {
  return (
    <button
      data-testid="add-to-cart"
      className={`px-4 py-2 text-white ${
        disabled
          ? "bg-gray-300 cursor-not-allowed"
          : "bg-primary hover:bg-accent"
      }`}
      disabled={disabled}
      onClick={onClick}
    >
      Add to Cart
    </button>
  );
};

export default AddToCartButton;
