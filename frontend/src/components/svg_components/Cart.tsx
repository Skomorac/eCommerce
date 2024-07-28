import React from "react";
import cartIcon from "../../assets/images/cart.svg";

interface CartProps {
  className?: string;
}

class Cart extends React.Component<CartProps> {
  render() {
    const { className = "" } = this.props;

    return (
      <button data-testid="cart-btn" className={`${className}`}>
        <img
          src={cartIcon}
          alt="Shopping Cart"
          className="w-6 h-6" // Adjust size as needed
        />
      </button>
    );
  }
}

export default Cart;
