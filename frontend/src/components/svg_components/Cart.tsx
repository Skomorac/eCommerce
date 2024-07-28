// src/components/svg_components/Cart.tsx

import React from "react";
import cartIcon from "../../assets/images/cart.svg";

interface CartProps {
  className?: string;
  buttonClassName?: string;
  imgClassName?: string;
}

class Cart extends React.Component<CartProps> {
  render() {
    const {
      className = "",
      buttonClassName = "",
      imgClassName = "",
    } = this.props;

    return (
      <button
        data-testid="cart-btn"
        className={`${className} ${buttonClassName}`}
      >
        <img
          src={cartIcon}
          alt="Shopping Cart"
          className={`w-6 h-6 ${imgClassName}`} // Adjust size as needed
        />
      </button>
    );
  }
}

export default Cart;
