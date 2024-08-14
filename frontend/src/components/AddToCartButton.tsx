import React from "react";
import { CartContext, CartContextType } from "../context/CartContext";
import Swal from "sweetalert2";

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
  allAttributes: Attribute[];
  inStock: boolean;
  allAttributesSelected: boolean;
}

class AddToCartButton extends React.Component<AddToCartButtonProps> {
  static contextType = CartContext;
  declare context: React.ContextType<typeof CartContext>;

  handleAddToCart = () => {
    const { product, selectedAttributes, allAttributes } = this.props;
    const { addToCart } = this.context as CartContextType;

    if (!this.isDisabled()) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        attributes: selectedAttributes,
        allAttributes: allAttributes,
        image: product.gallery[0],
      });

      // Show SweetAlert2 notification
      Swal.fire({
        icon: "success",
        title: "Added to Cart!",
        text: `${product.name} has been added to your cart.`,
        showConfirmButton: false,
        timer: 1500,
        position: "top-end",
        toast: true,
      });
    }
  };

  isDisabled = () => {
    const { inStock, allAttributesSelected } = this.props;
    return !inStock || !allAttributesSelected;
  };

  getButtonText = () => {
    return this.props.inStock ? "ADD TO CART" : "OUT OF STOCK";
  };

  render() {
    const isDisabled = this.isDisabled();
    const buttonText = this.getButtonText();

    return (
      <button
        data-testid="add-to-cart"
        className={`px-4 py-2 text-white font-medium transition-colors duration-200 ${
          isDisabled
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-primary hover:bg-accent cursor-pointer"
        }`}
        disabled={isDisabled}
        onClick={this.handleAddToCart}
      >
        {buttonText}
      </button>
    );
  }
}

export default AddToCartButton;
